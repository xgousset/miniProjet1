const express = require('express');
const router = express.Router();
const passport = require('passport');

// Signin route
router.post('/signin', (req, res, next) => {
    console.log("Signin request body:", req.body); // Log des données reçues
    passport.authenticate('local-signin', (err, user, info) => {
        if (err) {
            console.error("Error during authentication:", err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!user) {
            console.log("Authentication failed:", info);
            return res.status(400).json({ message: info.message || 'Bad Request' });
        }
        console.log("User authenticated successfully:", user);
        return res.json({ message: 'Signin successful', user });
    })(req, res, next);
});

// Signup route
router.post('/signup', (req, res, next) => {
    console.log("Signup request body:", req.body); // Log des données reçues
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) {
            console.error("Error during signup:", err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!user) {
            console.log("Signup failed:", info);
            return res.status(400).json({ message: info.message || 'Bad Request' });
        }
        console.log("User signed up successfully:", user);
        return res.json({ message: 'Signup successful', user });
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Session destruction failed' });
            }
            res.json({ message: 'Logout successful' });
        });
    });
});

module.exports = router;