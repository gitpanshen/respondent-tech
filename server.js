const express = require('express');
const csvdb = require('csv-database');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

function getCSVDataSource() {
  return csvdb('./data/SDET-TEST-data-candidate.csv',
    ['id', 'firstName', 'gender', 'email', 'jobTitle', 'industry', 'city', 'latitude', 'longitude'], ',');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  res.send('API server is running');
});

app.get('/users', async (req, res) => {
  const ds = await getCSVDataSource();
  const users = await ds.get();
  console.log('list all users');
  res.send(users);
});

app.get('/search-by-name/:name', async (req, res) => {
  const ds = await getCSVDataSource();
  const userName = req.params.name;
  const users = await ds.get({ firstName: userName });
  console.log(`search by user name: ${userName}`);
  res.send(users);
});

app.get('/search-by-city/:city', async (req, res) => {
  const userCity = req.params.city;
  const ds = await getCSVDataSource();
  const users = await ds.get({ city: userCity });
  console.log(`search by location: ${userCity}`);
  res.send(users);
});

app.post('/add', async (req, res) => {
  const userId = crypto.randomBytes(16).toString('hex');
  const userName = req.body.firstName;
  const userGender = req.body.gender;
  const userEmail = req.body.email;
  const userJob = req.body.jobTitle;
  const userIndustry = req.body.industry;
  const userCity = req.body.city;
  const userLat = req.body.latitude;
  const userLon = req.body.longitude;
  const ds = await getCSVDataSource();
  await ds.add({
    id: userId,
    firstName: userName,
    gender: userGender,
    email: userEmail,
    jobTitle: userJob,
    industry: userIndustry,
    city: userCity,
    latitude: userLat,
    longitude: userLon,
  });
  res.send(`user '${userName}' has been added into csv file`);
  console.log(`user '${userName}' has been added into csv file`);
});

app.put('/update', async (req, res) => {
  const userId = req.body.id;
  const userCity = req.body.city;
  const userLat = req.body.latitude;
  const userLon = req.body.longitude;
  const ds = await getCSVDataSource();
  await ds.edit({ id: userId },
    {
      city: userCity,
      latitude: userLat,
      longitude: userLon,
    });
  res.send(`user with ID '${userId}' has been updated in csv file`);
  console.log(`user with ID '${userId}' has been updated in csv file`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
