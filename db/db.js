const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://marco:Marcogooglem416*@basepersonne.n8uc05z.mongodb.net/")
    .then(() => {
        console.log("connection a la base de donne reussi oa ee");
    }).catch((error) => {
        console.log(error);
    })