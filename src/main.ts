import { App, CustomResource, Duration, RemovalPolicy, Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { PulumiFunction } from './pulumi-function';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new s3.Bucket(this, 'pulumi-state', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // define resources here...
    const pulumiLambda = new PulumiFunction(this, 'pulumiLambda', {
      timeout: Duration.minutes(15),
    });

    const pulumiResourceProvider = new Provider(this, 'pulumiResourceProvider', {
      onEventHandler: pulumiLambda,
    });

    new CustomResource(this, 'pulumiResourceResult', {
      serviceToken: pulumiResourceProvider.serviceToken,
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'cursed-pulumi-dev', { env: devEnv });
// new MyStack(app, 'cursed-pulumi-prod', { env: prodEnv });

app.synth();