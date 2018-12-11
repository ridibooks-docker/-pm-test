const newman = require('newman');
const { checkErrorAndSummary, noticeError } = require('./result_handler');
const { getCollections, getEnvironment } = require('./test_data_handler');


const scenarioTest = (collection, environment) => {
  const options = {
    collection,
    environment,
    insecure: true,
    ignoreRedirects: true,
    // reporters: 'cli',// error가 있으면 그것만 출력하고 전체 결과는 reporter는 사용하지 않는다.
  };
  newman.run(options, checkErrorAndSummary);
};

const main = async () => {
  try {
    const [collections, environment] = await Promise.all([getCollections(), getEnvironment()]);
    collections.forEach(collection => scenarioTest(collection, environment));
  } catch (err) {
    noticeError(err.message);
    process.exit(1);
  }
};

main();
