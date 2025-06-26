const express = require('express');
require('dotenv').config()
const cors = require('cors')
const PORT = process.env.PORT;
const app = express();
app.use(express.json())
app.use(cors())
app.get('/',(req,res)=>{
   res.send('')
});
app.listen(PORT,()=>{
    console.log(`The server is running http://localhost:${PORT}`)
})