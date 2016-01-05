# AWS Lambda to encode incoming media files automagically

This is build based on the Lambda boilerplate by [SC5](http://sc5.io/), and forking the [Sitebase example](https://gist.github.com/Sitebase/1004af7d738929d0a7f1) on github. 

## Quick Start (run in the cloud)

Paste src/index.js content to a AWS Lambda code editor, fill in the correct bucket names and set the script as handler for AWS S3 ObjectCreated (All) events. Make sure the Lambda role has permissions to read and write to the buckets you chose. Also, change the copyright to match your company (no special characters allowed byt Elastic Transcoder).

## Installation for local testing

### Prerequisites

Clone the project and trigger installation of the project dependencies by

    > git clone https://github.com/hybe/aws-autotranscode.git [module name]
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

## Testing locally

Run gulp tests. 

    > gulp test

Tests reside in the tests/directory. Uses lambda-wrapper module to wrap the code.

## Deploying to AWS

The module is deployed to Lambda using
    
    > gulp deploy

This will create a new lamda function to the region defined in lambdaenv.json with the name [module_name]_[version] (cleaned up from illegal characters)


## Release History

* 2016/01/05 - v0.1.0 - Initial version of the transcoder lambda


## License

Copyright (c) 2016 [HYBE Media](http://hybe.com/), licensed for users and contributors under MIT license.
https://github.com/sc5/grunt-bobrsass-boilerplate/blob/master/LICENSE-MIT


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/SC5/sc5-aws-lambda-boilerplate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
