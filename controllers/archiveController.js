const crypto = require('crypto');
const { ArchiveSms, ArchiveCall } = require('../models/archiveModels');

const MAX_ITEMS = 1000; // par requête (l'app envoie par paquets de 200)

/**
 * Vérifie l'en-tête "Authorization: Bearer <clé>" contre la variable
 * d'environnement ARCHIVE_API_KEY. Sans variable définie, la route est
 * fermée : on ne laisse jamais l'archive ouverte par erreur.
 */
const requireApiKey = (req, res, next) => {
    const expected = process.env.ARCHIVE_API_KEY;
    if (!expected) {
        return res.status(503).json({ success: false, message: 'ARCHIVE_API_KEY non configurée sur le serveur' });
    }
    const header = req.get('Authorization') || '';
    const given = header.startsWith('Bearer ') ? header.slice(7) : '';
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(401).json({ success: false, message: 'Clé API invalide' });
    }
    next();
};

const toDate = (v) => (v === null || v === undefined ? null : new Date(Number(v)));
const str = (v) => (v === null || v === undefined ? null : String(v));

/** Upsert par (deviceId, systemId) : un renvoi met à jour au lieu de dupliquer. */
const upserts = (deviceId, deviceName, items, mapFields) =>
    items
        .filter((it) => it && Number.isFinite(Number(it.systemId)) && Number.isFinite(Number(it.date)))
        .map((it) => ({
            updateOne: {
                filter: { deviceId, systemId: Number(it.systemId) },
                update: {
                    $set: {
                        deviceName,
                        contactName: str(it.contactName) || null,
                        date: toDate(it.date),
                        type: Number(it.type) || 0,
                        typeLabel: str(it.typeLabel),
                        deleted: it.deletedAt !== null && it.deletedAt !== undefined,
                        deletedAt: toDate(it.deletedAt),
                        syncedAt: new Date(),
                        ...mapFields(it)
                    }
                },
                upsert: true
            }
        }));

// POST /archive/sync  { deviceId, deviceName, sms: [...], calls: [...] }
const sync = async (req, res) => {
    const { deviceId, deviceName } = req.body || {};
    const sms = Array.isArray(req.body?.sms) ? req.body.sms : [];
    const calls = Array.isArray(req.body?.calls) ? req.body.calls : [];

    if (!deviceId || typeof deviceId !== 'string') {
        return res.status(400).json({ success: false, message: 'deviceId manquant' });
    }
    if (sms.length + calls.length > MAX_ITEMS) {
        return res.status(413).json({ success: false, message: `Maximum ${MAX_ITEMS} éléments par envoi` });
    }

    try {
        const smsOps = upserts(deviceId, str(deviceName), sms, (it) => ({
            address: str(it.address),
            body: str(it.body)
        }));
        const callOps = upserts(deviceId, str(deviceName), calls, (it) => ({
            number: str(it.number),
            durationSeconds: Number(it.durationSeconds) || 0
        }));

        const [s, c] = await Promise.all([
            smsOps.length ? ArchiveSms.bulkWrite(smsOps, { ordered: false }) : null,
            callOps.length ? ArchiveCall.bulkWrite(callOps, { ordered: false }) : null
        ]);

        return res.json({
            success: true,
            sms: { received: sms.length, saved: smsOps.length, added: s?.upsertedCount || 0 },
            calls: { received: calls.length, saved: callOps.length, added: c?.upsertedCount || 0 }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement de l'archive" });
    }
};

// GET /archive/status?deviceId=...  -> compteurs (pour vérifier que ça marche)
const status = async (req, res) => {
    try {
        const filter = req.query.deviceId ? { deviceId: String(req.query.deviceId) } : {};
        const [sms, smsDeleted, calls, callsDeleted] = await Promise.all([
            ArchiveSms.countDocuments(filter),
            ArchiveSms.countDocuments({ ...filter, deleted: true }),
            ArchiveCall.countDocuments(filter),
            ArchiveCall.countDocuments({ ...filter, deleted: true })
        ]);
        return res.json({ success: true, sms, smsDeleted, calls, callsDeleted });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Erreur lors de la lecture de l\'archive' });
    }
};

module.exports = { requireApiKey, sync, status };
