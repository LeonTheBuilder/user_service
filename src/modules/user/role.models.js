const a = require('aframework');
const db = a.db;
const DataTypes = a.models.DataTypes;


const UserRole = db.define(
    'UserRole',
    {
        id: {
            type: DataTypes.STRING(25),
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: 'user_user_role',
        freezeTableName: true,
        charset: 'utf8mb4',
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'role'],
            }
        ]
    }
);


module.exports = {
    UserRole,
};
