require('dotenv').config();

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test' || process.env.SHOW_LOGS === 'true') {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test' || process.env.SHOW_LOGS === 'true') {
    console.error(...params);
  }
};

module.exports = { info, error };
