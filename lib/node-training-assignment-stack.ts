import * as cdk from 'aws-cdk-lib';
import { AuthorizationType, Definition, GraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NodeTrainingAssignmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, 'AssignmentFunction', {
      entry: 'lib/handlers/assignment-function.ts'
    })

    new Table(this, 'AssignmentTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      }
    })

    new Bucket(this, 'AssignmentBucket',{
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    new GraphqlApi(this, 'AssignmentGraphQlAPI', {
      name: 'AssignmentGraphQlAPI',
      definition: Definition.fromFile(path.join(__dirname, 'schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });
  }
}
