'use strict'

const underTest = require('../index')

const defaultHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Max-Age': '86400'
}

describe('Amazon API Gateway HTTP response', () => {
  test('should export a function', () => {
    expect(typeof underTest).toBe('function')
  })

  test('should return status 204 and an empty body if it is called without arguments', () => {
    expect(underTest()).toEqual({
      statusCode: 204,
      body: '',
      isBase64Encoded: false,
      headers: defaultHeaders 
    })
  })

  test('should return status 200 if body is provided', () => {
    expect(underTest('body')).toEqual({
      statusCode: 200,
      body: 'body',
      isBase64Encoded: false,
      headers: defaultHeaders
    })
  })

  test('should stringify a body if an object is provided', () => {
    const bodyObject = { object: true }

    expect(underTest(bodyObject)).toEqual({
      statusCode: 200,
      body: JSON.stringify(bodyObject),
      isBase64Encoded: false,
      headers: defaultHeaders
    })
  })

  test('should stringify a body and set default status to 400 if an error object is provided', () => {
    const errors = [new Error('error'), new TypeError('type error'), new RangeError('range error'), new ReferenceError('referrence error')]

    errors.forEach(error => {
      expect(underTest(error)).toEqual({
        statusCode: 400,
        body: error.toString(),
        isBase64Encoded: false,
        headers: defaultHeaders
      })
    })
  })

  test('should set a custom status code if it is provided', () => {
    const bodies = [null, , '', { object: true }, new Error('error')]

    bodies.forEach(body => {
      expect(underTest(body, 418)).toEqual(expect.objectContaining({
        statusCode: 418
      })) 
    })
  })

  test('should set multi value headers if they are provided', () => {
    expect(underTest('', 418, {
      'Set-Cookie': [
        'cookie1=test; Domain=.example.com; Secure; HttpOnly; Path=/; Expires=Thu, 12 Nov 2020 19:09:04 GMT',
        'cookie2=test; Domain=.example.com; Secure; HttpOnly; Path=/; Expires=Thu, 12 Nov 2020 19:09:04 GMT'
      ]
    })).toEqual({
      statusCode: 418,
      body: '',
      headers: {},
      multiValueHeaders: {
        'Set-Cookie': [
          'cookie1=test; Domain=.example.com; Secure; HttpOnly; Path=/; Expires=Thu, 12 Nov 2020 19:09:04 GMT',
          'cookie2=test; Domain=.example.com; Secure; HttpOnly; Path=/; Expires=Thu, 12 Nov 2020 19:09:04 GMT'
        ]
      },
      isBase64Encoded: false
    })
  })

  test('should set regular and multi value headers if they are provided', () => {
    expect(underTest('', 418, {
      'Custom-Headers': true,
      'Set-Cookie': [
        'cookie1=test; Domain=.example.com; Secure; HttpOnly; Path=/; Expires=Thu, 12 Nov 2020 19:09:04 GMT',
        'cookie2=test; Domain=.example.com; Secure; HttpOnly; Path=/; Expires=Thu, 12 Nov 2020 19:09:04 GMT'
      ]
    })).toEqual({
      statusCode: 418,
      body: '',
      headers: { 'Custom-Headers': true },
      multiValueHeaders: {
        'Set-Cookie': [
          'cookie1=test; Domain=.example.com; Secure; HttpOnly; Path=/; Expires=Thu, 12 Nov 2020 19:09:04 GMT',
          'cookie2=test; Domain=.example.com; Secure; HttpOnly; Path=/; Expires=Thu, 12 Nov 2020 19:09:04 GMT'
        ]
      },
      isBase64Encoded: false
    })
  })

  test('should set multi value header', () => {
    expect(underTest('', 418, {
      'Custom-Headers': true
    })).toEqual({
      statusCode: 418,
      body: '',
      headers: { 'Custom-Headers': true },
      isBase64Encoded: false
    })
  })

  test('should enable base64 encoding if truthy value is passed', () => {
    const values = [true, 'ok']

    values.forEach(value => {
      expect(underTest('', 418, {
        'Custom-Headers': value
      }, true)).toEqual(expect.objectContaining({
        isBase64Encoded: true
      }))
    })
  })
})

