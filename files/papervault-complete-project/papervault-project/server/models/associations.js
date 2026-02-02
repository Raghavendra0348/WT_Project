const User = require('./User');
const Paper = require('./Paper');
const Review = require('./Review');
const Bookmark = require('./Bookmark');
const DownloadHistory = require('./DownloadHistory');

// User - Paper (One-to-Many: User uploads many papers)
User.hasMany(Paper, {
        foreignKey: 'uploadedById',
        as: 'uploadedPapers'
});
Paper.belongsTo(User, {
        foreignKey: 'uploadedById',
        as: 'uploadedBy'
});

// User - Review (One-to-Many: User writes many reviews)
User.hasMany(Review, {
        foreignKey: 'userId',
        as: 'reviews'
});
Review.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
});

// Paper - Review (One-to-Many: Paper has many reviews)
Paper.hasMany(Review, {
        foreignKey: 'paperId',
        as: 'reviews'
});
Review.belongsTo(Paper, {
        foreignKey: 'paperId',
        as: 'paper'
});

// User - Paper (Many-to-Many via Bookmarks)
User.belongsToMany(Paper, {
        through: Bookmark,
        foreignKey: 'userId',
        otherKey: 'paperId',
        as: 'bookmarkedPapers'
});
Paper.belongsToMany(User, {
        through: Bookmark,
        foreignKey: 'paperId',
        otherKey: 'userId',
        as: 'bookmarkedBy'
});

// User - DownloadHistory (One-to-Many)
User.hasMany(DownloadHistory, {
        foreignKey: 'userId',
        as: 'downloadHistory'
});
DownloadHistory.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
});

// Paper - DownloadHistory (One-to-Many)
Paper.hasMany(DownloadHistory, {
        foreignKey: 'paperId',
        as: 'downloads'
});
DownloadHistory.belongsTo(Paper, {
        foreignKey: 'paperId',
        as: 'paper'
});

module.exports = {
        User,
        Paper,
        Review,
        Bookmark,
        DownloadHistory
};
