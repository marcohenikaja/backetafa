const express = require('express');
const cors = require('cors')

const route = require('./routes/userRoute')
require('./db/db')
const app = express()


app.use(cors())
app.use(express.json())

app.use("/", route)


app.listen(8000, (req, res) => {
    console.log("serveur demarre avec le port 8000");
}
);



