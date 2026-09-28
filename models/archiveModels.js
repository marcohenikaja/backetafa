const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Archive du téléphone (app LocalMobileArchive) : base séparée "localarchive",
// pour ne pas mélanger avec les collections du réseau social (base "test").
const archiveDb = mongoose.connection.useDb('localarchive', { useCache: true });

const common = {
    deviceId: { type: String, required: true },     // identifiant du téléphone
    deviceName: { type: String },                   // ex. "Xiaomi 2201117TY"
    systemId: { type: Number, required: true },     // _id Android (content://sms / journal d'appels)
    contactName: { type: String, default: null },   // nom du contact au moment de l'envoi
    date: { type: Date, required: true },           // date + heure du SMS / de l'appel
    type: { type: Number, required: true },         // code Android (1 reçu/entrant, 2 envoyé/sortant…)
    typeLabel: { type: String },                    // "Reçu", "Envoyé", "Manqué"…
    deleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },       // moment où la suppression a été constatée
    syncedAt: { type: Date, default: Date.now }
};

const smsSchema = new mongoose.Schema({
    ...common,
    address: { type: String, default: null },       // numéro / expéditeur
    body: { type: String, default: null }           // contenu du message
}, { versionKey: false });

const callSchema = new mongoose.Schema({
    ...common,
    number: { type: String, default: null },
    durationSeconds: { type: Number, default: 0 }
}, { versionKey: false });

// Un élément = un téléphone + un systemId => jamais de doublon.
smsSchema.index({ deviceId: 1, systemId: 1 }, { unique: true });
callSchema.index({ deviceId: 1, systemId: 1 }, { unique: true });

const ArchiveSms = archiveDb.model('ArchiveSms', smsSchema, 'sms');
const ArchiveCall = archiveDb.model('ArchiveCall', callSchema, 'calls');

module.exports = { ArchiveSms, ArchiveCall };
