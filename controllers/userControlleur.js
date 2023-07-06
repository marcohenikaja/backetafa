const userLogin = require('../models/userModel');
const UserLogin = require('../models/userModel');
const Message = require('../models/messageModels');
const Publication = require('../models/publicationModel')

const toususers = async (req, res) => {
    const userId = req.params.id;

    try {
        const users = await UserLogin.find({ _id: { $ne: userId } });

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
    }
};


const inscrit = async (req, res) => {

    const login = req.body.nom;
    const password = req.body.pass;
    try {
        const insc = await UserLogin.create({ login, password })
        return res.send({ success: true })
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {

        const user = await userLogin.findOne({ login: username });

        if (user) {

            if (user.password === password) {
                const userId = user._id;
                const username = user.login;
                return res.send({ success: true, userId: userId, username: username });
            } else {

                return res.send({ success: false });
            }
        } else {

            return res.send({ success: false });
        }
    } catch (error) {

        console.log(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
    }
};

const message = async (req, res) => {
    const sender_id = req.body.sender_id;
    const recipient_id = req.body.recipient_id;
    const content = req.body.content;

    try {
        const messa = await Message.create({ sender_id, recipient_id, content })
        return res.send({ success: true })
    } catch (error) {
        console.log(error);
    }
}

const makamessage = async (req, res) => {
    const id = req.params.id;
    const ids = req.params.ids;
    try {
        const messa = await Message.find({
            $or: [
                { sender_id: id, recipient_id: ids },
                { sender_id: ids, recipient_id: id }
            ]
        })

        return res.send(messa)
    } catch (error) {

    }
}

const messagemaj = async (req, res) => {
    console.log(req.params);
    const id = req.params.id;
    const ids = req.params.ids;
    try {
        const rec = await Message.find({
            $or: [
                {
                    $and: [
                        { sender_id: id },
                        { recipient_id: ids }
                    ]
                },
                {
                    $and: [
                        { sender_id: ids },
                        { recipient_id: id }
                    ]
                }
            ]
        });
        //  console.log(rec);
        return res.send(rec)

    } catch (error) {

    }
}


const makapub = async (req, res) => {
    try {
        const valiny = await Publication.find();
        return res.send(valiny)
    } catch (error) {
        console.log(error);
    }

}

const publication = async (req, res) => {

    try {
        const text = req.body.pub;
        const sender_id = req.body.sender_id;
        const mampiditra = await Publication.create({ text, sender_id });
        return res.send({ success: true })
    } catch (error) {
        console.log(error);
    }

}




const getAllUser = async (req, res) => {
    try {
        const jiaby = await UserLogin.find();
        return res.send(jiaby)
    } catch (error) {
        console.log(error);
    }
}
const manaocommantera = async (req, res) => {
    const comment = req.body.comment;
    const comment_id = req.body.userId;
    const id = req.params.id;
    // try {
    //     const manova = await Publication.updateOne(
    //         { _id: id },
    //         { $set: { comment: comment, comment_id: comment_id } }
    //     );
    // } catch (error) {
    //     console.log(error);
    // }
}
module.exports = { toususers, inscrit, login, toususers, message, makamessage, messagemaj, publication, makapub, getAllUser, manaocommantera };
