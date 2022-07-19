/* create a new endpoint for registered users to log in
-----------------------------------------------------------*/

const JWTSecret ="your_jwt_secret"; /* code checks "local strategy" from passport.js */

const jwt = require("jsonwebtoken"),
    passport = require("passport");

require("./passport");

let generateJWTToken = (user) => {  /* create a JWT Token */
    return jwt.sign(user, JWTSecret, {
        subject: user.Username,
        expiresIn: "7d",
        algorithm: "HS256"
    });
}

module.exports =(router) => {
    router.post("/login", (req, res) => {
        passport.authenticate("local", {session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: "Something is not right",
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
            let token = generateJWTToken(user.toJSON());
            return res.json({ user, token });  /* shorthand for res.json({ user: user, token: token })*/
            });
        })(req, res);
    });
}