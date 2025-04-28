const bCrypt = require("bcrypt");

module.exports = function(passport, user) {
    if (!user) {
        throw new Error("User model is not defined. Please check the model import.");
    }

    const User = user; // Assurez-vous que `user` est correctement passé
    const LocalStrategy = require("passport-local").Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findByPk(id).then((user) => {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use("local-signup", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        let generateHash = function(password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        User.findOne({ where: { emailId: email } }).then((user) => {
            if (user) {
                console.log("Signup attempt with existing email:", email);
                return done(null, false, { message: "Email déjà pris" });
            } else {
                let userPassword = generateHash(password);
                let data = {
                    emailId: email,
                    password: userPassword,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                };
                console.log("Creating new user with data:", data);
                User.create(data).then((newUser, created) => {
                    if (!newUser) {
                        return done(null, false);
                    }
                    if (newUser) {
                        console.log("New user created:", newUser.get());
                        return done(null, newUser);
                    }
                });
            }
        });
    }));

    passport.use("local-signin", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        console.log("Signin attempt with email:", email);

        let isValidPassword = function(userpass, password) {
            return bCrypt.compareSync(password, userpass);
        };

        User.findOne({ where: { emailId: email } }).then((user) => {
            if (!user) {
                console.log("No user found with email:", email);
                return done(null, false, { message: "Email n'existe pas" });
            }
            console.log("User found:", user.get());

            if (!isValidPassword(user.password, password)) {
                console.log("Invalid password for email:", email);
                return done(null, false, { message: "Mot de passe incorrect" });
            }

            console.log("Password is valid. User authenticated:", user.get());
            return done(null, user.get());
        }).catch(err => {
            console.error("Error during signin process:", err);
            return done(null, false, { message: "Une erreur s'est produite." });
        });
    }));
};