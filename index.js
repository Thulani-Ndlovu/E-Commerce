import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import session from 'express-session';
import nodemailer from "nodemailer";
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

app.get("/Pants", (req, res)=> {
  res.render('pants');
})

app.get("/Shirts", (req, res)=> {
  res.render('shirts');
})

app.get("/Shoes", (req, res)=> {
  res.render('shoes');
})

app.get("/Accessories", (req, res)=> {
  res.render("accessories");
})

app.get("/Jersey", (req, res)=> {
  res.render("Jersey");
})

app.get("/Hats", (req, res)=> {
  res.render("Hats");
})

app.get("/contact", (req, res)=> {
  res.render("contact");
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Sign In Page
app.get('/Sign-Up', (req, res) => {
  res.render('s_base', {title : "Sign In"});
})

// Sign In User
router.post('/dashboard', (req, res) => {
  if(req.body.email == credentials.email && req.body.password == credentials.password) {
    req.session.user = req.body.email;
    res.redirect('dashboard');
    res.end("Sign In complete");
  }else{
    res.end("Incorrect Username")
  }
});

//DASHBOARD ROUTE
router.get('/dashboard', (req, res)=> {
  if(req.session.user) {
      res.render('dashboard', {user : req.session.user})
  }else{
      res.send('Unknown User')
  }
})

//LOGOUT ROUTE
router.get('/logout', (req, res)=> {
  req.session.destroy(function(err){
      if(err){
          console.log(err);
          res.send("Error")
      }else{
          res.render('base', {title: "Express", logout: "Logout Successfully"})
      }
  })
})

app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'thulani.ndlovu.54922@gmail.com',
      pass: 'uxsf lppj ircl bewi',
    },
    timeout: 50000,
  });

    // Create the email options
  const mailOptions = {
    from: `${email}`,
    to: 'fashionthriftsa@gmail.com',
    subject: `${subject}`,
    text: `${message}`,
  };

    // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });

});