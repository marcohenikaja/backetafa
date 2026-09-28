const express = require("express");
const router = express.Router()
const ctrl = require('../controllers/archiveController')

// Parseur JSON propre à l'archive : les envois de SMS dépassent la limite
// par défaut de 100 ko. Toutes les routes exigent la clé API.
router.use(express.json({ limit: '5mb' }));
router.use(ctrl.requireApiKey);

router.post("/sync", ctrl.sync);
router.get("/status", ctrl.status);

// Lecture (app de consultation) :
router.get("/threads", ctrl.threads);
router.get("/messages", ctrl.messages);
router.get("/calls", ctrl.calls);

module.exports = router;
