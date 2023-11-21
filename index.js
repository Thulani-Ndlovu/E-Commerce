import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

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
