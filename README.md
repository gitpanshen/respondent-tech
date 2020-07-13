1. What is this repository for?
This repository is for Respondent SDET test.

2. Task:
(1)using csv file (respondents_data_test.csv) as a data source, write a simple REST api that includes :
* Get a list of the following attributes of an existing user:
  * ID
  * Name
  * Gender
  * Email
  * Job Title
  * Industries
  * Location
     - City
     - Longitude
     - Latitude
* Create a new user
* Update user details
   - Mover user to a new location
* Search for users by job title
* Search for users by location
(2) write automated tests that cover some of the mentioned functionality.


3. How do I get set up?
(1) unzip the file
(2) open your terminal, go to folder unzippedFile/respondent-tech
(3) if you want to run it locally, then run the following commands one by one in your terminal: 
    npm install
    node_modules/.bin/webdriver-manager update
    npm run ci
(4) if you want to run it in docker, then run the following commands one by one in your terminal: 
    docker build -t respondent-tech .
    docker run -i -t respondent-tech

4. Contribution guidelines
(1)Writing tests: Shen
(2)Code review:


5. Who do I talk to?
Repo owner: panshen@hotmail.com
