require('dotenv').config();

const { env } = require('./config/env');
const { connectDb } = require('./config/db');
const { createApp } = require('./app');

async function start() {
  await connectDb({ mongoUri: env.mongoUri, nodeEnv: env.nodeEnv });

  const app = createApp({ corsOrigin: env.corsOrigin });

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
