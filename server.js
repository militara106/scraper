require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

// MONGOOSE DB
var mongoose = require("mongoose");

// SCRAPER
var axios = require("axios");
var cheerio = require("cheerio");

// MODELS
var db = require("./models");

// PORT
var PORT = process.env.PORT || 8000;
var app = express();

// JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Public Folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGOD_URI = "mongodb://militara:amilitar106@ds339458.mlab.com:39458/heroku_9bqgg6zw" || "mongodb://localhost/hwScraper";
mongoose.connect(MONGOD_URI);

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Routes
var siteOrigin = "https://na.finalfantasyxiv.com";
var siteURL = "https://na.finalfantasyxiv.com/lodestone/news";

// GET Index
app.get("/", (req, res) => {
    res.render("index");
});

// GET all Topics from WEBSITE
app.get("/scrape", function (req, res) {
    axios.get(siteURL).then(function (response) {
        var $ = cheerio.load(response.data);

        $(".news__list--topics").each(function (i, element) {
            var result = {};
            result.title = $(element).children().children(".news__list--title").children("a").text();
            result.summary = $(element).children().children(".mdl-text__xs-m16").text();
            result.link = siteOrigin + $(element).children().children().children("a").attr("href");

            // TEST SCRAPE
            // console.log("-------------------------------\n"+"Title: " + result.title + "\n" +
            //     result.link + "\n" +
            //     result.summary + "\n-------------------------------");

            // Create topic
            db.Topic.create(result)
                .then(function (dbTopic) {
                    console.log(dbTopic);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        // res.send(siteURL + " scraped.");
        res.redirect("/topics");
    });
});

// GET all Topics from the db
app.get("/Topics", function (req, res) {
    db.Topic.find({}).populate("comment").then(function (dbTopic) {
        res.json(dbTopic);
    }).catch(function (err) {
        res.json(err);
    });
});

// GET Topic from ID with comments
app.get("/Topics/:id", function (req, res) {
    db.Topic.findOne({
        "_id": req.params.id
    }).populate("comment").then(function (dbTopic) {
        console.log(dbTopic);
        res.json(dbTopic);
    }).catch(function (err) {
        res.json(err);
    });

});

// SAVE/UPDATE Comments
app.post("/Topics/:id", function (req, res) {
    db.Comment.create(req.body).then(function (dbComment) {
        return db.Topic.findByIdAndUpdate(req.params.id, {
            $push: {
                comment: dbComment._id
            }
        }, {
            new: true
        });
    }).then(function (dbTopic) {
        console.log(dbTopic);
        res.json(dbTopic);
    }).catch(function (err) {
        res.json(err);
    });
});

//PORT Listening
app.listen(PORT, function () {
    console.log("Hosting PORT: " + PORT);
});