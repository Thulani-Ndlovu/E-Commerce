import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import session from 'express-session';
import nodemailer from "nodemailer";
import 'dotenv/config';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { pool, connectToDatabase } from './userInfo_DB.js';
import bcrypt from 'bcrypt';


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
app.post('/s_base', async (req, res) => {


  try{
    const connection = await connectToDatabase();
    const checkCredentialsQuery = 'SELECT * FROM details WHERE email = ?';
    const [credentialsResults] = await connection.execute(checkCredentialsQuery, [req.body.email]);

    if (credentialsResults.length > 0) {
      const storedHashedPassword = credentialsResults[0].password;
    
      // Compare the user input password with the stored hashed password
      const passwordMatch = await bcrypt.compare(req.body.password, storedHashedPassword);
    
      if (passwordMatch) {
        res.render("login_dashboard");
      } else {
        console.log("Incorrect password");
        res.render('s_base'); // 
      }
    } else {
      console.log("Email not found");
      res.render('s_base'); // 
    }
        // Release the connection back to the pool
        connection.release();
  }catch (error) {
    console.error('Error checking/inserting user credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

app.get('/signup', (req, res) => {
  //res.render('s_base', {title : "Sign In"});
  res.render('signup');
})

app.post('/signup', async(req, res)=> {
  const saltRounds = 10;
  const hashedAdminPass = bcrypt.hashSync(req.body.password, saltRounds);

  try {
    const connection = await connectToDatabase();

    // Check if email is already in the database
    const checkEmailQuery = 'SELECT * FROM details WHERE email = ?';
    const [emailCheckResults] = await connection.execute(checkEmailQuery, [req.body.email]);

    if (emailCheckResults.length > 0) {
      console.log('Email is already in use. Choose another email.');
      res.render("s_base");
    } else {
      // Email is not in use, proceed to insert the new user
      const insertQuery = 'INSERT INTO details (email, password, fullname) VALUES (?, ?, ?)';
      const [insertResults] = await connection.execute(insertQuery, [req.body.email, hashedAdminPass, req.body.fullname]);

      console.log('User credentials added to the database.');
      res.render('s_base');
    }

    // Release the connection back to the pool
    connection.release();

  } catch (error) {
    console.error('Error checking/inserting user credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});