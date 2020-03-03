require('dotenv/config');

module.exports = {
  secreteKey: process.env.SECRET_KEY,
  expiresIn: '7d'
};
