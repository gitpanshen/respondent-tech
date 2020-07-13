const Request = require('request');
const csv = require('csvtojson');

const csvFilePath = './data/SDET-TEST-data-candidate.csv';

describe('e2e API test - put: ', () => {
  describe('when testing post with correct URL to update location', () => {
    it('should return status code 200', (done) => {
      Request.put({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}update`,
        body: JSON.stringify(browser.params.updateLocation),

      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code when putting with correct API URL...');
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it('should return correct response', (done) => {
      Request.put({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}update`,
        body: JSON.stringify(browser.params.updateLocation),

      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking response content when putting with correct API URL...');
        expect(body).toBe('user with ID \'54e333ade19982b7e852edf9227485a6\' has been updated in csv file');
        done();
      });
    });

    it('should get the same user number in CSV file', async (done) => {
      const csvJsonArrayOld = await csv().fromFile(csvFilePath);
      Request.put({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}update`,
        body: JSON.stringify(browser.params.updateLocation),

      }, async (err) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking csv file length when putting with correct API URL...');
        const csvJsonArrayNew = await csv().fromFile(csvFilePath);
        expect(csvJsonArrayNew.length).toEqual(csvJsonArrayOld.length);
        done();
      });
    });

    it('should  update user location in csv file', (done) => {
      Request.put({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}update`,
        body: JSON.stringify(browser.params.updateLocation),

      }, async (err) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking updated content in CSV after putting with correct API URL..');
        const csvJsonArray = await csv().fromFile(csvFilePath);
        for (let i = 0; i < csvJsonArray.length; i += 1) {
          if (csvJsonArray[i].id === '54e333ade19982b7e852edf9227485a6') {
            expect(csvJsonArray[i].city).toBe(browser.params.updateLocation.city);
            expect(csvJsonArray[i].latitude).toBe(browser.params.updateLocation.latitude);
            expect(csvJsonArray[i].longitude).toBe(browser.params.updateLocation.longitude);
          }
        }
        done();
      });
    });
  });

  describe('when testing put with incorrect URL to update location', () => {
    it('should return status code 404', (done) => {
      Request.put({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}updates`,
        body: JSON.stringify(browser.params.updateLocation),

      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code when putting with incorrect API URL...');
        expect(res.statusCode).toBe(404);
        done();
      });
    });

    it('should return correct response', (done) => {
      Request.put({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}updates`,
        body: JSON.stringify(browser.params.updateLocation),

      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking response content when putting with incorrect API URL ...');
        expect(body).toContain('Cannot PUT');
        done();
      });
    });
  });

  beforeAll(async () => {
    const csvJsonArray = await csv().fromFile(csvFilePath);
    let flag = false;
    for (let i = 0; i < csvJsonArray.length; i += 1) {
      if (csvJsonArray[i].id === '54e333ade19982b7e852edf9227485a6') {
        flag = true;
      }
    }
    if (!flag) {
      console.log('All API test about put may fail due to no expected user in data source.');
    }
  });

  afterAll((done) => {
    Request.put({
      headers: { 'content-type': 'application/json' },
      url: `${browser.params.basicUrl}update`,
      body: JSON.stringify(browser.params.oldLocation),

    }, (err, res) => {
      if (err) {
        console.log(err);
      }
      if (res.statusCode !== 200) {
        console.log('Next round of API test about put may not work as expected due to old location is not restored');
      }
      done();
    });
  });
});
