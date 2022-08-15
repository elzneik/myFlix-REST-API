// const { User } = require("./models");

const express = require("express"),
bodyParser = require("body-parser"),
uuid = require("uuid"),
mongoose = require("mongoose"),
Models = require("./models.js");

const app = express ();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require ("cors");
app.use(cors());

const { check, validationResult } = require('express-validator');

/* List of allowed domains
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application does not// allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
*/

let auth = require('./auth')(app); // code for authentification
const passport = require('passport');
require('./passport');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true });


// Task1: Get all movies
app.get("/movies", passport.authenticate('jwt', {session: false}), (req, res) => { // passport.authenticate('jwt', { session: false }),
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies)
        })
        .catch((err) => {
            res.status(500).send("Error: " + err);
        });
});

// Task2: Get data about a single movie by title to user
app.get("/movies/:title", passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({Title: req.params.title})
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// Task3: Get data about a genre
app.get("/movies/genre/:genreName", passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find({"Genre.Name": req.params.genreName})
        .then((genre) => {
            res.json(genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// Task4: Get data about a director
app.get("/movies/director/:directorName", passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find({"Director.Name": req.params.directorName})
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});


// Get one User by username
app.get("/user/:username", passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOne( {Username: req.params.Username})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});


// Task5: User exists or has to send credentials
app.post("/users", [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
    ],
    (req,res)=>{

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({Username: req.body.Username}) // search for user with username, exist
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + "already exists.");
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then ((user) => {res.status(201).json(user)
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Error: " + error);
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
});



// Get ALL user
app.get("/users", passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            res.status(500).send("Error: " + err);
        });
});



// Task6: Update a users info by its Username
app.patch("/users/:Username", passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        { $set:{
            Username: req.body.Username,
            Passowrd: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
            }
        },
        {new: true},
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error :" + err);
            }
            else {
                res.json(updatedUser);
            }
        });
});

// Task7: add a movie to a users favorite list
app.post("/users/:Username/movies/:MovieID", passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        {
            $push: {FavoriteMovie: req.params.MovieID}
        },
        {new: true},
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error :" + err);
            }
            else {
                res.json(updatedUser);
            }
        });
});

// Task8: Remove a movie from a users favorite list
app.delete("/users/:Username/movie/:MovieID", passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
     {
        $pull: {FavoriteMovie: req.params.MovieID}
     },
     {new:true},
     (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
        }
        else {
            res.json(updatedUser);
        }
     });
});

// Task9: remove user from user list
app.delete("/users/:Username", passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({Username: req.params.Username})
        .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + " does not exist.");
        }
        else {
            res.status(201).send(req.params.Username + " was deleted.");
        }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/*app.listen(8080, () => {
    console.log("Listening on port 8080");
});*/

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});