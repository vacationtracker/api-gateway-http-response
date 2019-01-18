# API Gateway HTTP Response for AWS Lambda

A small library that generates API Gateway HTTP responses for Lambda proxy integration. It can be used with AWS CloudFormation and AWS SAM.

## Usage

This package exports a function that accepts four params and returns an object.

### Function Params

Function accepts following four params:

- Response body (optional) - A string or an object that should be returned as a HTTP response from the API Gateway. Default value is an empty string.

- Status code (optional) - A number that represents HTTP status code. Default values are:

    - 204, if response body is an empty string.
    - 200, if response body is a string or an object.
    - 400, if response body is an instance of JavaScript Error.

- Headers (optional) - An object with headers that will be passed as response headers. Default value is:

    ```json
    {
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    	"Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    	"Access-Control-Allow-Origin": "*",
    	"Access-Control-Max-Age": "86400"
    }
    ```

- isBase64Encoded (optional) - `true` or `false` to enable or disable base64 encoding. Default value is `false`.

### Output

The output of this function is an object in a valid Lambda function proxy integration format, described [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format). For example, a valud output for `httpResponse('hello world')` would be the following object:

```json
{
    "isBase64Encoded": false,
    "statusCode": 200,
    "body": "hello world",
    "headers": {
   		"Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
		"Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Max-Age": "86400"
	}
}
```

### Example usage

A common usage would be inside an AWS Lambda function, similar to this:

```javascript
'use strict'

const httpResponse = require('api-gateway-http-response')
const parseApiEvent = require('./parse-event') // A function that parses an event
const businessLogic = require('./business-logic') // A function that handles a logic for your Lambda function

async function lambda(event) {
  const request = parseApiEvent(event)
  try {
    const body = await businessLogic(request)
    return httpResponse(body)
  } catch(err) {
    return httpResponse(err)
  }
}

exports.handler = lambda
```

### CORS support

By default, this function will return headers that supports CORS from any origin. Supported HTTP methods are: OPTIONS, POST, GET, PUT and DELETE.

## Motivation

I wrote similar thing many times, packing it into a small independent package is easier that searching through other projects.

## License

MIT -- see [LICENSE](LICENSE)

