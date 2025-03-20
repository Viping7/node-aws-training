import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { User } from "../common/types";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});

const TABLE_NAME = process.env.TABLE_NAME || "";

const createUser = async ({ user }: { user: User }) => {
    try {
        const command = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: marshall(user),
        });
        await client.send(command);
        return user;
    } catch (e) {
        console.error(e);
        throw new Error("Error while creating users");
    }

}


const getUsers = async () => {
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME,
        });
        const response = await client.send(command);
        return response.Items?.map(item => unmarshall(item));
    } catch (e) {
        console.error(e)
        throw new Error("Error while fetching users");
    }

}



const getUserById = async (id: number) => {
    console.log(id);
    try {
        const command = new GetItemCommand({
            TableName: TABLE_NAME,
            Key: marshall({ id }),
        });
        const response = await client.send(command);
        return response.Item && unmarshall(response.Item);
    } catch (e) {
        console.error(e)
        throw new Error("Error while fetching users");
    }
}

const updateUser = async (id: number, updateParams: User) => {
    try {
        const updateExpressionParts: string[] = [];
        const expressionAttributeValues: { [key: string]: any } = {};
        Object.keys(updateParams).forEach((key, index) => {
            updateExpressionParts.push(`${key} = :${key}`);
            expressionAttributeValues[`:${key}`] = updateParams[key as keyof User];
        }); 10
        const updateExpression = `set ${updateExpressionParts.join(", ")}`;
        console.log(updateExpression);
        console.dir(expressionAttributeValues, { depth: null });
        const command = new UpdateItemCommand({
            TableName: TABLE_NAME,
            Key: marshall({ id }),
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: marshall(expressionAttributeValues),
            ReturnValues: "ALL_NEW",
        });
        await client.send(command);
        return updateParams
    } catch (e) {
        console.error(e)
        throw new Error("Error while updating users");
    }

}

const deleteUser = async (id: number) => {
    try {
        const command = new DeleteItemCommand({
            Key: marshall({ id }),
            TableName: TABLE_NAME
        })
        await client.send(command);
        return id;
    } catch (e) {
        console.error(e)
        throw new Error("Error while deleting users");
    }
}



export const handler = async (event: { info: { fieldName: string }, arguments: any }) => {
    try {

        const { info, arguments: args } = event;
        switch (info.fieldName) {
            case "createUser": return createUser(args);
            case "getUsers": return getUsers();
            case "getUser": return getUserById(args.id);
            case "updateUser": return updateUser(args.id, args.user);
            case "deleteUser": return deleteUser(args.id);
            default: throw new Error(`Unknown field, unable to resolve ${info.fieldName}`);
        }
    } catch (e) {
        console.error(e);
        return e;
    }
};
