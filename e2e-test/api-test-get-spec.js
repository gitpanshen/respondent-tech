const Request = require('request');
const csv = require('csvtojson');

const csvFilePath = './data/SDET-TEST-data-candidate.csv';

describe('e2e API test - get: ', () => {
  describe('when testing correct basic API', () => {
    it('should return status code 200', (done) => {
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: browser.params.basicUrl,
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code using correct basic API URL...');
        expect(res.statusCode).toBe(200);
        // https://chercher.tech/protractor/api-testing-protractor, done() is very very important
        // this is one will enable to integrate the request module with Typescript
        done();
      });
    });

    it('should return corret response', (done) => {
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: browser.params.basicUrl,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking response using correct basic API URL...');
        expect(body).toBe('API server is running');
        done();
      });
    });

    describe('when testing incorrect basic API', () => {
      it('should not return response', (done) => {
        Request.get({
          headers: { 'content-type': 'application/json' },
          url: browser.params.incorrectBasicUrl,
        }, (err) => {
          if (err) {
            console.log(err);
          }
          console.log('\nchecking response using incorrect basic API URL...');
          expect(err).not.toBeNull();
          done();
        });
      });
    });
  });

  describe('when testing correct API to get all users', () => {
    it('should return status code 200', (done) => {
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}users`,
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code using correct list URL...');
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it('should return correct number of users', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}users`,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking number of users...');
        expect(JSON.parse(body).length).toBe(csvJsonArray.length);
        done();
      });
    });

    it('should return correct response content', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}users`,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        const bodyArray = JSON.parse(body);
        console.log('\nchecking content of users ...');
        for (let i = 0; i < bodyArray.length; i += 1) {
          expect(JSON.stringify(bodyArray[i]).replace(/ /g, '')).toBe(JSON.stringify(csvJsonArray[i]).replace(/ /g, ''));
        }
        done();
      });
    });
  });

  describe('when testing incorrect API URL to get all users', () => {
    it('should return 404', (done) => {
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}users123`,
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code using incorrect list URL...');
        expect(res.statusCode).toBe(404);
        done();
      });
    });
  });

  describe('when testing correct API to search user by name', () => {
    it('should return status code 200', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      const name = csvJsonArray[0].firstName;
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}search-by-name/${name}`,
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code using correct name search URL...');
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it('should return correct number of results when searching by name', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      const name = csvJsonArray[0].firstName;
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}search-by-name/${name}`,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking number of results found in search by name...');
        let count = 0;
        const bodyArray = JSON.parse(body);
        for (let i = 0; i < csvJsonArray.length; i += 1) {
          if (csvJsonArray[i].firstName === name) {
            count += 1;
          }
        }
        expect(bodyArray.length).toBe(count);
        done();
      });
    });

    it('should return correct names when searching by name', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      const name = csvJsonArray[0].firstName;
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}search-by-name/${name}`,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking user names found in search...');
        const bodyArray = JSON.parse(body);
        for (let i = 0; i < bodyArray.length; i += 1) {
          expect(bodyArray[i].firstName).toBe(name);
        }
        done();
      });
    });
  });

  describe('when testing incorrect API URL to search user by name', () => {
    it('should return 404', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      const name = csvJsonArray[0].firstName;
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}searchbyname/${name}`,
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code using incorrect search URL to search by name...');
        expect(res.statusCode).toBe(404);
        done();
      });
    });
  });

  describe('when testing correct API to search a user who is not in datasource', () => {
    it('should return null result', (done) => {
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}search-by-name/abc123`,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking response by not existing user name...');
        expect(JSON.parse(body)).toEqual([]);
        done();
      });
    });
  });

  //
  describe('when testing correct API to search user by location', () => {
    it('should return status code 200', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      const location = csvJsonArray[0].city;
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}search-by-city/${location}`,
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code using correct location search URL...');
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it('should return correct number of results when searching by location', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      const location = csvJsonArray[0].city;
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}search-by-city/${location}`,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking number of locations found in search by location...');
        let count = 0;
        const bodyArray = JSON.parse(body);
        for (let i = 0; i < csvJsonArray.length; i += 1) {
          if (csvJsonArray[i].city === location) {
            count += 1;
          }
        }
        expect(bodyArray.length).toBe(count);
        done();
      });
    });

    it('should return correct locations', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      const location = csvJsonArray[0].city;
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}search-by-city/${location}`,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking locations found in search...');
        const bodyArray = JSON.parse(body);
        for (let i = 0; i < bodyArray.length; i += 1) {
          expect(bodyArray[i].city).toBe(location);
        }
        done();
      });
    });
  });

  describe('when testing incorrect API URL to search by location', () => {
    it('should return 404', async (done) => {
      const csvJsonArray = await csv().fromFile(csvFilePath);
      const location = csvJsonArray[0].city;
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}searchbycity/${location}`,
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code using incorrect location search URL...');
        expect(res.statusCode).toBe(404);
        done();
      });
    });
  });

  describe('when testing correct API to search location that is not in datasource', () => {
    it('should return null result', (done) => {
      Request.get({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}search-by-city/abc123`,
      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking response by not existing location...');
        expect(JSON.parse(body)).toEqual([]);
        done();
      });
    });
  });
});
