'use strict'

function httpResponse(body, statusCode, headers, isBase64Encoded) {
  const code = statusCode || (body ? (body instanceof Error ? 400: 200) : 204)
  const responseHeaders = headers || {
    'Access-Control-Allow-Headers':
      'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': '86400'
  }

  if (typeof body === 'object') {
    body = body instanceof Error ?  body.toString() : JSON.stringify(body)
  }

  const regularHeaders = {}
  const multiValueHeaders = {}

  Object.keys(responseHeaders).forEach(headerName => {
    if (Array.isArray(responseHeaders[headerName])) {
      multiValueHeaders[headerName] = responseHeaders[headerName]
    } else {
      regularHeaders[headerName] = responseHeaders[headerName]
    }
  })

  const response = {
    statusCode: code,
    body: body || '',
    headers: regularHeaders,
    isBase64Encoded: isBase64Encoded ? true : false
  };

  if (Object.keys(multiValueHeaders).length)
    response.multiValueHeaders = multiValueHeaders

  return response;
}

module.exports = httpResponse

