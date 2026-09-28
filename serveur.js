const express = require('express');
const cors = require('cors')

const route = require('./routes/userRoute')
require('./db/db')
const app = express()


app.use(cors())
const archiveRoute = require('./routes/archiveRoute')
app.use("/archive", archiveRoute)
app.use(express.json())
app.get("/",(req,res)=>{
 res.send("api running ee")   
})
app.use("/", route)


app.listen(8000, (req, res) => {
    console.log("serveur demarre avec le port 8000");
}
);



