const fs = require('fs');
const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const Trip = require('../../models/tripModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// READ JSON FILES
const trips = JSON.parse(fs.readFileSync(`${__dirname}/trips.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

//IMPORTING DATA TO THE DB
const importData = async () => {
  try {
    await Trip.create(trips);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded !!!');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Trip.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted !!!');
  } catch (err) {
    console.log(err);
  }
};

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
    if (process.argv[2] === '--import') {
      return importData();
    }
    if (process.argv[2] === '--delete') {
      return deleteData();
    }
  })
  .then(() => mongoose.disconnect())
  .then(() => process.exit());
