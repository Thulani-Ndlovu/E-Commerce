const express = require('express');
const path = require('path');
const bodyparser =require("body-parser");
const session = require('express-session');

const app = express();

const port = process.env.PORT||3000;

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.set('view engine', 'ejs');

//LOAD STATIC
app.use('/static', express.static(path.join(__dirname, 'public')))

//HOME ROUTE
app.get('/', (req, res) =>{
    res.render('base', {title : "Sign In"});
})

app.listen(port, ()=>{ console.log("Listening to server on http://localhost:3000")});
