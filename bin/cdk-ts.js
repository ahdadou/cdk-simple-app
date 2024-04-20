#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { CdkTsStack } = require('../lib/cdk-ts-stack');

const app = new cdk.App();
new CdkTsStack(app, 'CdkTsStack');
