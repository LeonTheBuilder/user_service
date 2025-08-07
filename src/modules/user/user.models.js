const a = require('aframework');
const db = a.db;
const DataTypes = a.models.DataTypes;
const User = db.define(
    'User',
    {
        id: {
            type: DataTypes.BIGINT,
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
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        hint: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    }
    , {
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
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.BIGINT,
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


const UserProduct = db.define(
    'UserProduct',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        productId: {
            // vip1, vip2 , mat-somematid, voice-somevoiceid,widget-somewidgetid
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        productTitle: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true,
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
                fields: ['userId', 'productId'],
            }
        ]
    },
);


module.exports = {
    User,
    UserPasswordHint,
    UserEndpoint,
    UserProduct,
};
