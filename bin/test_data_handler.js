const fs = require('fs');
const {
  COLLECTION_FILE_NAME, COLLECTION_NAMES,
  ENVIRONMENT_NAME, ENVIRONMENT_FILE_NAME,
} = require('./constants');
const requests = require('./requests');

const checkAllFilesExists = (filePaths) => {
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      return false;
    }
  }
  return true;
};

const getData = filePaths => filePaths.map((filePath) => {
  const file = require(`${filePath}`);
  return file;
});

const getCollections = () => {
  const collectionPaths = COLLECTION_NAMES.map(collectionName => `./src/${collectionName}.${COLLECTION_FILE_NAME}`);
  if (checkAllFilesExists(collectionPaths)) {
    return getData(collectionPaths);
  }
  return requests.getCollections();
};

const getEnvironment = () => {
  const envrionmentPath = `./src/${ENVIRONMENT_NAME}.${ENVIRONMENT_FILE_NAME}`;
  if (fs.existsSync(envrionmentPath)) {
    const file = require(`${envrionmentPath}`);
    return file;
  }
  return requests.getEnvironment();
};

module.exports = {
  getCollections, getEnvironment,
};
