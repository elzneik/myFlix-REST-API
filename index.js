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

// List of allowed domains
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'http://testsite.com'];

app.use(cors({
   wi: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application does not// allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// code for authentification
let auth = require('./auth')(app); 

// Require passport module & import passport.js file
const passport = require('passport');
require('./passport');

const Movies = Models.Movie;
const Users = Models.User;

// PROD mode DB
mongoose.connect(process.env.CONNECTION_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * GET: Returns welcome message fro '/' request URL
 * @returns Welcome message
 */
    app.get('/', (req, res) => {
        res.send('Welcome to MyFlix!');
      });

/**CRUD */
// READ all movies
/**
 * GET: returns a list of ALL movies to the user
 * Request body: Bearer Token
 * @returns array of movie objects
 * @ requires passport
 */
app.get("/movies", passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            res.status(500).send("Error: " + err);
        });
});

// READ a single movie by title
/**
 * GET: Returns data (description, genre, director, image URL, whether it's featured or not) about a single movie by title to the user
 * REquest body: Bearer token
 * @param Title (of movie)
 * @returns movie object
 * @requires passport
 */
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

// READ genre description by genre name
/**
 * GET: Returns data about a genre (description) by name/title (e.g., "Fantasy")
 * Request body: Bearer token
 * @param Name (of genre)
 * @returns genre object
 * @requires passport
 */
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

//READ about director by director name
/**
 * GET: Returns data about a director (bio, birth year) by name
 * Request body: Bearer token
 * @param Name (of director)
 * @returns director object
 * @requires passport
 */
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


// READ user by Username
/**
 * GET: Returns data on a single user (user object) by username
 * Request body: Bearer token
 * @param Username
 * @returns user object
 * @requires passport
 */
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


// CREATE a new user
/**
 * POST: Allow new users to register, Username password & Email are required fields!
 * Request body: Bearer token, JSON with user information
 * @returns user object
 */
app.post("/users", 
    // Validation logic here for post request
    [
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



// READ user by Username
/**
 * GET: Returns data on a single user (user object) by username
 * Request body: Bearer token
 * @param Username
 * @returns user object
 * @requires passport
 */
app.get("/users", passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            res.status(500).send("Error: " + err);
        });
});


// UPDATE username of the user by username
/**
 * PUT: Allow users to update their user info (find by username)
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns user object with updates
 * @requires passport
 */
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
// Add favorite movie to a users favorite list
/**
 * POST: Adds a favorite movies to the user list
 * @param Username
 * @returns array of favorite movies
 * @requires passport
 */
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



// GET favorite movies list from a user
/**
 * GET: Returns a list of favorite movies from the user
 * Request body: Bearer token
 * @param Username
 * @returns array of favorite movies
 * @requires passport
 */
app.get(
  '/users/:Username/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        if (user) {
          // If a user with the corresponding username was found, return user info
          res.status(200).json(user.FavoriteMovies);
        } else {
          res.status(400).send('Could not find favorite movies for this user');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);


// DELETE a movie from user favoriteMovies list by username
/**
 * DELETE: Allows users to remove a movie from their list of favorites
 * Request body: Bearer token
 * @param Username
 * @param movieId
 * @returns user object
 * @requires passport
 */
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

// DELETE a user by username
/**
 * DELETE: Allows existing users to deregister
 * Request body: Bearer token
 * @param Username
 * @returns success message
 * @requires passport
 */
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



/**
 * defines port, listening to port 8080
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
