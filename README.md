# SC5 AWS LAMBDA MICROSERVICE BOILERPLATE

A boilerplate for developing, testing and deploying AWS Lambda functions using node.js

## Installation

### Prerequisites 

Clone the project and trigger installation of the project dependencies by

    > git clone https://github.com/SC5/sc5-aws-lambda-boilerplate.git [module name]
    > cd [module name]
    > npm install

Set up your AWS credentials e.g. to ~/.aws/credentials (see http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html). e.g.
    
    [default]
    aws_access_key_id = [YOUR_ACCESS_KEY_ID]
    aws_secret_access_key = [YOUR_SECRET_ACCESS_KEY]

Set up your lambda environment by copying example_lambdaenv.json to lambdaenv.json and setting the parameter values. You will need an AWS IAM role for use with your Lambda function.

## Development

Set up your module information into package.json prior to deployment

### Project layout

    src/    The source of the Lambda function (index.js)
    tests/  The tests for the Lambda function. Tests to run must start with test_
    gulpfile.js     The gulpfile used for deployment
    package.json    The package file for the module. Defines the function name, version and dependencies

## Testing

Run gulp tests. 

    > gulp test

Tests reside in the tests/directory
A "pseudolambda" framework is provided to simulate the Lambda environment

## Deploying to AWS

The module is deployed to Lambda using
    
    > gulp deploy

This will create a new lamda function to the region defined in lambdaenv.json with the name [module_name]_[version] (cleaned up from illegal characters)


## Release History

* 2015/07/15 - v0.1.0 - Initial version of boilerplate


## License

Copyright (c) 2015 [SC5](http://sc5.io/), licensed for users and contributors under MIT license.
https://github.com/sc5/grunt-bobrsass-boilerplate/blob/master/LICENSE-MIT


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/SC5/sc5-aws-lambda-boilerplate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
