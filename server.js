const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB Connected Successfully !!!');
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    if (err.syscall === 'querySrv') {
      console.error(
        'DNS could not resolve MongoDB Atlas (SRV lookup). Try another network/DNS, or use a mongodb:// URI in config.env instead of mongodb+srv://',
      );
    }
    process.exit(1);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
