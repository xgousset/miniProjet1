const passport = require('passport')

exports.signup = function (req,res) {
    passport.authenticate('local-signup', {
        successRedirect: '/home',
        failureRedirect: '/signup'
    });
}

exports.signin = function (req,res) {
    passport.authenticate('local-signin', {
        successRedirect: '/home',
        failureRedirect: '/signin'
    });
}
exports.home = function (req,res) {
    passport.authenticate('local-signin', {
        successRedirect: '/home',
        failureRedirect: '/signin'
    });
}
exports.logout = (req,res)=>{
    req.session.destroy((err)=>{
        if(!err){
            passport.authenticate('local-signin', {
                successRedirect: '/home',
                failureRedirect: '/signin'
            });
        }
    });
}