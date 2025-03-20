import { APIGatewayProxyResult } from "aws-lambda";

export const handler = ():APIGatewayProxyResult => {
  
  return {
    statusCode: 200,
    body: "ok",
  };
};
