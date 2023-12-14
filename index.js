import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import session from 'express-session';
import nodemailer from "nodemailer";
import 'dotenv/config';
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;
const router = express.Router();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //step 2


// step 1: rendering the homepage
app.get("/", (req, res) => {
  res.render("home");
})

// Render the categories pages
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
app.get('/s_base', (req, res) => {
  //res.render('s_base', {title : "Sign In"});
  res.render('s_base');
})

// Sign In User
app.post('/s_base', (req, res) => {
  if(req.body.email === process.env.LOGIN_EMAIL && req.body.password === process.env.LOGIN_PASS) {
    res.render('login_dashboard');
  }else{
    res.render("s_base");
  }
});

//Logout from user account
app.get('/home', (req, res)=> {

  res.render("home");
})

// Contact Page handler
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    timeout: parseInt(process.env.TIMEOUT, 10),
  });

  const mailOptions = {
    from: `${email}`,
    to: process.env.EMAIL_TO,
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