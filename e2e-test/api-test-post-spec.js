const Request = require('request');
const csv = require('csvtojson');

const csvFilePath = './data/SDET-TEST-data-candidate.csv';

describe('e2e API test - post: ', () => {
  describe('when testing post with correct URL to add new user', () => {
    it('should return status code 200', (done) => {
      Request.post({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}add`,
        body: JSON.stringify(browser.params.newUser),

      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code when posting with correct API URL...');
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it('should return correct response', (done) => {
      Request.post({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}add`,
        body: JSON.stringify(browser.params.newUser),

      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking response content when posting with correct API URL...');
        expect(body).toBe('user \'Shen\' has been added into csv file');
        done();
      });
    });

    it('should get one more user in CSV file', async (done) => {
      const csvJsonArrayOld = await csv().fromFile(csvFilePath);
      Request.post({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}add`,
        body: JSON.stringify(browser.params.newUser),

      }, async (err) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking csv file length when posting with correct API URL...');
        const csvJsonArrayNew = await csv().fromFile(csvFilePath);
        expect(csvJsonArrayNew.length).toEqual(csvJsonArrayOld.length + 1);
        done();
      });
    });

    it('should add new user into csv file with correct content', (done) => {
      Request.post({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}add`,
        body: JSON.stringify(browser.params.newUser),

      }, async (err) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking last line content in CSV when posting with correct API URL..');
        const csvJsonArray = await csv().fromFile(csvFilePath);
        const lastLine = csvJsonArray[csvJsonArray.length - 1];
        expect(lastLine.firstName).toBe(browser.params.newUser.firstName);
        expect(lastLine.gender).toBe(browser.params.newUser.gender);
        expect(lastLine.email).toBe(browser.params.newUser.email);
        expect(lastLine.jobTitle).toBe(browser.params.newUser.jobTitle);
        expect(lastLine.industry).toBe(browser.params.newUser.industry);
        expect(lastLine.city).toBe(browser.params.newUser.city);
        expect(lastLine.latitude).toBe(browser.params.newUser.latitude);
        expect(lastLine.longitude).toBe(browser.params.newUser.longitude);
        done();
      });
    });
  });

  describe('when testing post with incorrect URL to add new user', () => {
    it('should return status code 404', (done) => {
      Request.post({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}adds`,
        body: JSON.stringify(browser.params.newUser),

      }, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking status code when posting with incorrect API URL...');
        expect(res.statusCode).toBe(404);
        done();
      });
    });

    it('should return correct response', (done) => {
      Request.post({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}adds`,
        body: JSON.stringify(browser.params.newUser),

      }, (err, res, body) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking response content when posting with incorrect API URL ...');
        expect(body).toContain('Cannot POST');
        done();
      });
    });

    it('should not get one more user in CSV file', async (done) => {
      const csvJsonArrayOld = await csv().fromFile(csvFilePath);
      Request.post({
        headers: { 'content-type': 'application/json' },
        url: `${browser.params.basicUrl}adds`,
        body: JSON.stringify(browser.params.newUser),

      }, async (err) => {
        if (err) {
          console.log(err);
        }
        console.log('\nchecking csv file length when posting with incorrect API URL...');
        const csvJsonArrayNew = await csv().fromFile(csvFilePath);
        expect(csvJsonArrayNew.length).toEqual(csvJsonArrayOld.length);
        done();
      });
    });
  });
});
