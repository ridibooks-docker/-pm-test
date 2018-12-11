const POSTMAN_BASE_URL = 'https://api.getpostman.com';
const COLLECTION_FILE_NAME = 'postman_collection.json';
const ENVIRONMENT_FILE_NAME = 'postman_environment.json';
const COLLECTION_NAMES = process.argv[2].split(',');
const ENVIRONMENT_NAME = process.argv[3];
const API_KEY = process.argv[4];

module.exports = {
  API_KEY,
  POSTMAN_BASE_URL,
  COLLECTION_NAMES,
  ENVIRONMENT_NAME,
  COLLECTION_FILE_NAME,
  ENVIRONMENT_FILE_NAME,
};
