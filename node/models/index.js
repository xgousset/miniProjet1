const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname,
    "..", "config", "config.json"
))[env];
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);
const db = {};
fs.readdirSync(__dirname)
        .filter(function(file){
            return (file.indexOf(".") !== 0) &&
            (file !== "index.js");
        }).forEach(function(file){
            let model = 
                require(path.join(__dirname,file))(sequelize);
            db[model.name] = model;
        })
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;