const a = require('aframework');
const db = a.db;
const DataTypes = a.models.DataTypes;


const UserRole = db.define(
    'UserRole',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
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
