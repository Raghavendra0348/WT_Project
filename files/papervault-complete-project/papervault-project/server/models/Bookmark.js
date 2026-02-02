const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bookmark = sequelize.define('Bookmark', {
        id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
        },
        userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                        model: 'users',
                        key: 'id'
                },
                field: 'user_id'
        },
        paperId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                        model: 'papers',
                        key: 'id'
                },
                field: 'paper_id'
        }
}, {
        tableName: 'bookmarks',
        timestamps: true,
        underscored: true,
        indexes: [
                {
                        unique: true,
                        fields: ['user_id', 'paper_id']
                }
        ]
});

module.exports = Bookmark;
