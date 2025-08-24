const a = require('aframework');
const db = a.db;
const DataTypes = a.models.DataTypes;
const User = db.define(
    'User',
    {
        id: {
            type: DataTypes.STRING(25),
            allowNull: false,
            primaryKey: true,
        },
        nickName: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        username: { // 账号密码登录的用户名
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        password: { // 账号密码登录的密码
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        scode: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        parentId: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },

    }
    , {
        tableName: 'user_user',
        freezeTableName: true,
        charset: 'utf8mb4',
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        indexes: [
            {
                unique: true,
                fields: ['username'],
            }
        ]
    }
);


const UserPasswordHint = db.define(
    'UserPasswordHint',
    {
        id: {
            type: DataTypes.STRING(25),
            allowNull: false,
            primaryKey: true,
        },
        hint: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    }
    , {
        tableName: 'user_user_password_hit',
        freezeTableName: true,
        charset: 'utf8mb4',
        timestamps: true,
        createdAt: true,
        updatedAt: true,
    }
);

const UserEndpoint = db.define(
    'UserEndpoint',
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
        endpointType: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        endpoint: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    },
    {
        tableName: 'user_user_endpoint',
        freezeTableName: true,
        charset: 'utf8mb4',
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        indexes: [
            {
                unique: true,
                fields: ['endpointType', 'endpoint'],
            }
        ]
    }
);


module.exports = {
    User,
    UserPasswordHint,
    UserEndpoint,
};
