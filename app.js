//Require modules and models

var express = require("express");
var models = require("./models/index");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();

//Set view engine

app.set("view engine", "ejs");

//Middleware

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(methodOverride("_method"));

app.get("/", function(req, res) {
    res.redirect(301, "/chirps");
});

//Get all chirps
app.get("/chirps", (req, res) => {
  // Step 1: Retrieve all chirps from the DB
  // Step 2: Generate HTML with chirps inside
  // Step 3: Send back completed HTML to browser
  models.Chirp.findAll().then((chirps) => {
    res.render("index", { chirps });
    // Navigate to http://localhost:3000/chirps
  });
});

//Create new chirp
app.post("/chirps", (req, res) => {
  // Step 1: Retrieve new chirp from the form
  var newChirp = req.body;

  // Step 2: Insert new record into the DB
  models.Chirp.create(newChirp).then(() => {
    // Step 3: Redirect back to GET /chirps
    res.redirect("/chirps");
  });
});

//Get specific chirp
app.get("/chirps/:id/edit", (req, res) => {
  // Step 1: Retrieve existing chirp from DB via its ID
  models.Chirp.findById(req.params.id).then((chirp) => {
    // Step 2: Generate HTML with chirp inside
    // Step 3: Send back completed HTML to the browser
    res.render("edit", { chirp });
  });
});

//Edit a chirp
app.put("/chirps/:id", (req, res) => {
  // Step 1: Retrieve edited chirp from the form
  var editedChirp = req.body;

  // Step 2: Find chirp via its ID
  models.Chirp.findById(req.params.id).then((chirp) => {
    // Step 3: Perform edit to chirp record
    chirp.updateAttributes(editedChirp).then(() => {
      // Step 4: Redirect back to GET /chirps
      res.redirect("/chirps");
    });
  });
});

//Delete a chirp
app.delete("/chirps/:id", (req, res) => {
  // Step 1: Retrieve specific chirp from DB via its ID
  models.Chirp.findById(req.params.id).then((chirp) => {
    // Step 2: Destroy the chirp
    chirp.destroy().then(() => {
      // Step 3: Redirect back to GET /chirps
      res.redirect("/chirps");
    });
  });
});

app.listen(process.env.PORT || 3000);
