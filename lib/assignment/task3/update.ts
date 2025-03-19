import { appendFileSync, createReadStream, createWriteStream, write, writeFileSync } from "fs";
import { getTodos, getUsers } from "../../common/placeholder";
import path = require("path");
import { appendFile, rename, writeFile } from "fs/promises";
import axios from "axios";
import { BASE_URL } from "../../common/constants";
import { Transform } from "stream";
import { User } from "../../common/types";

const FILE_NAME = path.join(__dirname, "/user.txt");
const TEMP_FILE_NAME = path.join(__dirname, "/user.temp.txt");


const updateFileAsync = async () => {
  try {
    console.log("Generating content to write...");
    const users = await getTodos();
    const userNames = users.map((todo) => todo.title).join("\n");
    console.log("Content generated..\nWriting to file..");
    await appendFile(FILE_NAME, userNames);
    console.log(`Content written to file successfully`);
  } catch (e) {
    console.error("Error while creating file asynchrnously", e);
  }
};

const updateFileSync = async () => {
  try {
    console.log("Generating content to write...");
    const users = await getTodos();
    const userNames = users.map((todo) => todo.title).join("\n");
    console.log("Content generated..\nWriting to file..");
    appendFileSync(FILE_NAME, userNames);
    console.log(`Content updated successfully`);
  } catch (e) {
    console.error("Error while updating file asynchrnously", e);
  }
};

function getJSONFromString(str:string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false; 
    }
  }

class ModifyContentStream extends Transform {
    constructor() {
      super();
    }
  
    _transform(chunk:string, encoding:'utf-8', callback:()=>void) {
      const transformedChunk = chunk.toString();
      const transfomedJSON = getJSONFromString(transformedChunk);
      if(transfomedJSON){
        const userNames = transfomedJSON.map((user:User) => user.name).join("\n");
        this.push(userNames);
      }
      callback();
    }
  }

const updateFileStream = async () => {
  try {
    const writer = createWriteStream(TEMP_FILE_NAME);
    const readStream = createReadStream(FILE_NAME,'utf-8');
    const modifyStream = new ModifyContentStream();
    readStream.pipe(modifyStream).pipe(writer);
    writer.on('error', (err) => {
        console.error('Error writing to the file:', err);
    });
    writer.on('finish', async () => {
        try {
          await rename(TEMP_FILE_NAME, FILE_NAME);
          console.log('Original file has been updated successfully.');
        } catch (err) {
          console.error('Error replacing the original file:', err);
        }
      });
    readStream.on('error', (err) => {
        console.error('Error reading the file:', err);
    });
  } catch (e) {
    console.error("Error while updating file asynchrnously", e);
  }
};

// To Write File Asynchoronously
// updateFileAsync();

// To Write File synchoronously
// updateFileSync()

// To Write File as stream
// updateFileStream();