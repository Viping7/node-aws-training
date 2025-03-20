import * as cdk from 'aws-cdk-lib';
import { AuthorizationType, Definition, DynamoDbDataSource, GraphqlApi, LambdaDataSource } from 'aws-cdk-lib/aws-appsync';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy, Role } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NodeTrainingAssignmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   
    
    const table = new Table(this, 'AssignmentTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.NUMBER,
      }
    })

    const lambda = new NodejsFunction(this, 'GraphQlResolverFunction', {
      entry: 'lib/handlers/graphql-resolver.ts',
      environment: {
        TABLE_NAME: table.tableName
      }
    })

    lambda.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));


   

    new Bucket(this, 'AssignmentBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const api = new GraphqlApi(this, 'AssignmentGraphQlAPI', {
      name: 'AssignmentGraphQlAPI',
      definition: Definition.fromFile(path.join(__dirname, 'schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });


    const dataSource = new LambdaDataSource(this, 'AssignmentDataSource', {
      api: api,
      description: 'DynamoDB DataSource',
      name: "AssignmentDataSource",
      lambdaFunction: lambda
    })

    new NodejsFunction(this, 'AssignmentFunction', {
      entry: 'lib/handlers/assignment-function.ts',
      environment:{
        API_URL: api.graphqlUrl,
        API_KEY: api.apiKey || ''
      }
    })

    dataSource.createResolver("CreateUserResolver", {
      typeName: "Mutation",
      fieldName: "createUser"
    })

    dataSource.createResolver("GetUserResolver", {
      typeName: "Query",
      fieldName: "getUsers"
    })

    dataSource.createResolver("GetUserByIdResolver", {
      typeName: "Query",
      fieldName: "getUser"
    })
    dataSource.createResolver("UpdateUserByIdResolver", {
      typeName: "Mutation",
      fieldName: "updateUser"
    })

    dataSource.createResolver("DeleteUserByIdResolver", {
      typeName: "Mutation",
      fieldName: "deleteUser"
    })

  }
}
