import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const router = express.Router();

const credentials = {
  email: "adminUser1@gmail.com",
  password: "admin123",
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //step 2


// step 1: rendering the homepage
app.get("/", (req, res) => {
  res.render("home");
})

app.get("/contact", (req, res) => {
    res.render("contact");
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Sign In Page
app.get('/s_base', (req, res) => {
  res.render('s_base', {title : "Sign In"});
})

const user = require('./routes/user');

// Sign In User
app.post('/s_base', (req, res) => {
  if(req.body.email == credentials.email && req.body.password == credentials.password) {
    req.session.user == req.body.email;
    res.redirect('home');
    res.end("Sign In complete");
  }else{
    res.end("Incorrect Username")
  }
});

//DASHBOARD ROUTE
app.get('/dashboard', (req, res)=> {
  if(req.session) {
      res.render('dashboard', req.session.user)
  }else{
      res.send('Unknown User')
  }
})

//LOGOUT ROUTE
app.get('/logout', (req, res)=> {
  req.session.destroy(function(err){
      if(err){
          console.log(err);
          res.send("Error")
      }else{
          res.render('s_base', {title: "Express", logout: "Logout Successfully"})
      }
  })
})



//module.exports = router;