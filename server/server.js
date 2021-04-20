const express = require('express')
const cors = require('cors')
const app = express()
const apiPort = 3000
const taskRoutes = require("./routers/taskRouter")
const db = require("./database"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get('/', (req, res) => {
    res.json({data:"HELLO WORLD", success:true});
});

taskRoutes(app);

module.exports = app.listen(apiPort,()=>{console.log(`Server is running at port ${apiPort}`)});