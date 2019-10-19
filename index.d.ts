interface IHeaders {
  [key: string]: string | string[]
}
interface IHttpResponse {
  statusCode: number
  body: string
  headers: IHeaders,
  isBase64Encoded: boolean
}

import httpResponse = require('httpResponse')

declare function httpResponse(body?: any, statusCode?: number, headers: IHeaders, isBase64Encoded?: boolean): IHttpResponse

export = httpResponse
