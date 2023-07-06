const express = require("express");
const router = express.Router()
const ctrl = require('../controllers/userControlleur')


router.get("/toususers/:id", ctrl.toususers);

router.post("/inscrit", ctrl.inscrit);
router.post("/login", ctrl.login);
router.post("/message", ctrl.message);
router.post("/publication", ctrl.publication);

router.get("/makamessage/:id/:ids", ctrl.makamessage);
router.get("/messagemaj/:id/:ids", ctrl.messagemaj);
router.get("/makapub", ctrl.makapub);
router.get("/getAllUser", ctrl.getAllUser);


router.put("/manaocommantera/:id", ctrl.manaocommantera);

router.delete("/:id", (req, res) => {
    res.send("delete");
});

module.exports = router;