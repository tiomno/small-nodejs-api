Coding Test :: Small Node.js API
=========================

[![Build Status](https://travis-ci.org/tiomno/small-nodejs-api.svg?branch=master)](https://travis-ci.org/tiomno/small-nodejs-api)


This is my approach to the solution of a simple Node.js API.

> For the completion of this task, I decided to use Express.js and Mocha +Chai for unit testing.

### Requirements

* Node.js 7.6+ and NPM

### Heroku

The API can be consumed accessing the heroku subdomain <https://small-nodejs-api.herokuapp.com/>

##### Possible error responses are

- When not matching URL is found
```
{
    "error": "Not Found!!!"
}
```

- When a malformed JSON structure is received

```
{
    "error": "Could not decode request: JSON parsing failed"
}
``` 

- When there is no `payload` property in the request

```
{
    "error": "The payload of properties is missing in the request."
}
```

To run the tests, from the root of the repo:

```
npm test
```

### License

<https://www.isc.org/downloads/software-support-policy/isc-license/>
