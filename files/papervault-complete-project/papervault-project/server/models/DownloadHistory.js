const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DownloadHistory = sequelize.define('DownloadHistory', {
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
        },
        downloadedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                field: 'downloaded_at'
        }
}, {
        tableName: 'download_history',
        timestamps: true,
        underscored: true
});

module.exports = DownloadHistory;
