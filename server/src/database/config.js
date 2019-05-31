require('dotenv').config();

const env = process.env.ENV || process.env.NODE_ENV;

const DBConfig = {
  test: {
    connectionString: process.env.TEST_URL,
  },
  dev: {
    connectionString: process.env.DEV_URL,
  },
  production: {
    connectionString: process.env.DATABASE_URL,
  },
  staging: {
    connectionString: process.env.DATABASE_URL,
  },
};

let credentials = DBConfig[env];
if (!credentials) {
  credentials = DBConfig.dev;
}

const config = credentials;

export default config;
