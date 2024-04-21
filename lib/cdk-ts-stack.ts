import { CfnOutput, Duration, RemovalPolicy, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';


export class CdkTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'CdkTsQueue', {
      visibilityTimeout: Duration.seconds(300),
      queueName: 'products',
    });


    const  smsFunction = new lambdaNodejs.NodejsFunction(this, 'SmsFunction', {
      entry: path.join(__dirname, 'lambda', 'sms-function.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(30),
    });

    smsFunction.addEventSource(new eventsources.SqsEventSource(queue));


    const bucket = new Bucket(this, 'WebsiteBucket', {
      bucketName: `products`,
      encryption: BucketEncryption.S3_MANAGED,
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    new CfnOutput(this, 'queueUrl', {
      value: queue.queueUrl
    });

    new CfnOutput(this, 'bucketName', {
      value: bucket.bucketWebsiteUrl
    });

    new CfnOutput(this, 'lambdaName', {
      value: smsFunction.functionArn
    });


  }
}
