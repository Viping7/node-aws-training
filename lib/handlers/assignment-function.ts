import { APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";

const fetchData = async (query:string, variables: { [key: string]: any }) => {
  try {
    const response = await axios.post(
      process.env.API_URL!,
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${process.env.API_KEY}`,
        },
      }
    );

    console.dir(response.data,{depth:null});
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const handler = async (event:{query:string,variables:{[key:string]:any}}): Promise<APIGatewayProxyResult> => {
  try {
    if (!process.env.API_URL || !process.env.API_KEY) {
      throw new Error('API_URL and API_KEY must be defined');
    }
    const {query, variables} = event;
    await fetchData(query,variables);
    return {
      statusCode: 200,
      body: "ok",
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: e.message,
    }
  }
};
