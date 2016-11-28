// Set up modules.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
// const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api/data/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//defines which origins and headers are permitted
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});

// Log to console any errors or successful connections.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Connected to db at /api/data/db/');
});

// Grabs seed functions.
const seedHighScores = require('./seeds/highscores');
seedHighScores();

// Encrypting passwords.
// app.post('/encrypt', (req,res) => {
//     let username = req.body.username;
//     let password = req.body.password;

//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(password, salt, (err, hash) => {
//             // Store hash in your password DB. Save hashed password in a file with username as the title.
//             if (!err) {
//             //   fs.writeFile('notpasswords/' + username + '.txt', hash, (err) => {
//                 console.log(username);
//                 console.log(password);
//                 console.log(hash);
//                 res.json('Password Saved');
//             //   })
//             } else {
//               console.log("There was an error with the hashing.");
//               console.log(err);
//               res.json("There was an error hashing yourpassword.");
//             }
//         });
//     });
// });

const HighScore = require('./models/highscores');

// Endpoints for highscores.
app.get('/highscores', (req, res) => {
    HighScore
        .find({})
        .sort({score: -1}) // to get highscores from database in descending order.
        .exec((err, highscores) => { // highscores will be an array
            if (!err) {
                console.log(highscores);
                res.json(highscores);
            } else {
                console.log("There was an error grabbing all highscore objects.");
                res.status(500).send(err); // tells the front end that an error has occurred rather than sending back a string.
            }
        })
})

app.post('/highscores', (req, res) => { // use /highscores instead of /savehighscore so you don't have to remember different endpoints
    const newHighScore = HighScore(req.body);
    console.log(req.body);
    newHighScore.save((err, highscore) => {
        if (!err) {
            console.log("The following highscore object was saved " + highscore);
            res.json(highscore);
        } else {
            console.log("There was an error saving this highscore object.");
            res.status(500).send(err);
        }
    })
})

app.listen(8080, () => {
    console.log('SERVER RUNNING ON 8080');
})