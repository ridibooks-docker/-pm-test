
const noticeError = (error) => {
  console.log(error); // TODO: slack 연결 추가
};

const getParsedRequest = request => ({
  method: request.method,
  url: `${request.url.protocol}://${request.url.host.join('.')}`,
  query: JSON.stringify(request.url.query.reference),
  header: JSON.stringify(request.headers.reference),
  body: JSON.stringify(request.body),
});

const getParsedResponse = response =>({
  status:response.status,
  code : response.code,
  headers : JSON.stringify(response.headers),
  cookies: JSON.stringify(response.cookies)
})

const checkErrorAndSummary = (err, summary) => {
  const collectionName = summary.collection.name;
  let errorRaised = false;
  if (err !== null) {
    noticeError(err);
    throw new Error('test fail');
  }
  for (const exceution of summary.run.executions) {
    const { requestError, request,response, assertions } = exceution;
    
    if (requestError) {
      noticeError({ collectionName, error: requestError, request: getParsedRequest(request), response: getParsedResponse(response)});
      errorRaised = true;
      continue;
    }
    if(assertions){
      for (const assertion of assertions) {
        const { error } = assertion;
        if (error) {
          errorRaised = true;
          noticeError({ collectionName, error, request: getParsedRequest(request), response: getParsedResponse(response)});
        }
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
