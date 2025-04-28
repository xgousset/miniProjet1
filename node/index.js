const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const models = require('./models');

// Load environment variables from .env file
dotenv.config();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:8080',
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Sync models with the database
models.sequelize.sync().then(() => {
    console.log('BDD fonctionne bien');
}).catch((err) => {
    console.log(err);
});

// Passport configuration
app.use(session({ secret: process.env.SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport, models.user); // Passez `models.user` correctement

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Serveur ecoute sur port 3000');
});