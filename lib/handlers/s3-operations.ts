import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
import path = require("path");

const client = new S3Client({});

export const uploadToS3FromFile = async (key: string, filePath: string) => {
  const bucketName = process.env.BUCKET_NAME;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: await readFile(filePath),
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "EntityTooLarge"
    ) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}. \
  The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
  or the multipart upload API (5TB max).`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};

export const deleteS3Object = async (key: string) => {
  const bucketName = process.env.BUCKET_NAME;
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    console.log(
      `The object "${key}" from bucket "${bucketName}" was deleted, or it didn't exist.`
    );
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "NoSuchBucket"
    ) {
      console.error(
        `Error from S3 while deleting object from ${bucketName}. The bucket doesn't exist.`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting object from ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};
export const getS3Object = async (key: string) => {
  const bucketName = process.env.BUCKET_NAME;
  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    const str = await response.Body?.transformToString();
    return str;
  } catch (caught) {
    if (caught instanceof NoSuchKey) {
      console.error(
        `Error from S3 while getting object "${key}" from "${bucketName}". No such key exists.`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while getting object from ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    }
    throw caught;
  }
};

export const handler = async (event: { action: string; key: string }) => {
  try {
    if (!process.env.BUCKET_NAME) {
      throw new Error("Bucket name is required");
    }
    const { action, key } = event;
    switch (action) {
      case "getObject":
        return getS3Object(key);
      case "putObject":
        return uploadToS3FromFile(key, path.join(__dirname, "./test.json"));
      case "deleteObject":
        return deleteS3Object(key);
      default:
        throw new Error("Invalid action");
    }
    return;
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: "Error while performing s3 operaton",
    };
  }
};
