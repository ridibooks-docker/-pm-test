
const noticeError = (error) => {
  console.log(error); // TODO: slack 연결 추가
};

const getParsedRequest = request => ({
  method: request.method,
  url: `${request.url.protocol}/${request.url.host.join('.')}`,
  query: JSON.stringify(request.url.query.reference),
  header: JSON.stringify(request.headers.reference),
  body: JSON.stringify(request.body),
});

const checkErrorAndSummary = (err, summary) => {
  const collectionName = summary.collection.name;
  let errorRaised = false;
  if (err !== null) {
    noticeError(err);
    throw new Error('test fail');
  }
  for (const exceution of summary.run.executions) {
    const { requestError, request } = exceution;
    if (requestError) {
      noticeError({ collectionName, error: requestError, request: getParsedRequest(request) });
      errorRaised = true;
      continue;
    }
    for (const assertion of exceution.assertions) {
      const { error } = assertion;
      if (error) {
        errorRaised = true;
        noticeError({ collectionName, error, request: getParsedRequest(request) });
      }
    }
  }

  if (errorRaised) {
    throw new Error('test fail');
  }
  console.log(`collection: "${collectionName}" passed`);
};

module.exports = {
  checkErrorAndSummary, noticeError,
};
