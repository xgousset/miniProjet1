const {DataTypes} = require("sequelize");
module.exports = function(sequelize) {
    const User = sequelize.define('user',{
        id:{autoIncrement:true,primaryKey:true,
            type: DataTypes.INTEGER, allowNull:false
        },
        firstname: {type:DataTypes.STRING, notEmpty:false},
        lastname: {type:DataTypes.STRING, notEmpty:false},
        emailId: {type:DataTypes.STRING, notEmpty:true,
            validate:{isEmail:true}
        },
        password: {type:DataTypes.STRING,allowNull:false}
    },
    {tableName:"users"}
    );
    return User;
}