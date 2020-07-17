FROM node:12.18.2 as build
LABEL author='panshen@hotmail.com'

ARG CHROME_VERSION=83.0.4103.39

# Chrome latest (borrowed from docker-selenium)
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update -qqy \
  && apt-get -qqy install google-chrome-stable

# Install Java
RUN apt-get update -qqy && apt-get -qqy install openjdk-8-jdk

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/

# Set the working directory
WORKDIR /home/respondent-tech

#copy scripts from local to the container's related folder
COPY . /home/respondent-tech

#install protractor
RUN npm install
RUN node_modules/.bin/webdriver-manager update --versions.chrome $CHROME_VERSION

ENTRYPOINT ["bash","e2e-api-tests.sh"]