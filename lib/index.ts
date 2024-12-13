// import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface FastmailRoute53ConstructsProps {
  // Define construct properties here
}

export class FastmailRoute53Constructs extends Construct {

  constructor(scope: Construct, id: string, props: FastmailRoute53ConstructsProps = {}) {
    super(scope, id);

    // Define construct contents here

    // example resource
    // const queue = new sqs.Queue(this, 'FastmailRoute53ConstructsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
