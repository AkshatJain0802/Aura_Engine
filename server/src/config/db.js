const mongoose = require('mongoose');

async function connectDb({ mongoUri, nodeEnv }) {
  mongoose.set('strictQuery', true);
  mongoose.set('autoIndex', nodeEnv !== 'production');
  await mongoose.connect(mongoUri);
}

module.exports = { connectDb };
