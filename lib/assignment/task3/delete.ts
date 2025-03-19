import {
  createReadStream,
  createWriteStream,
  readFileSync,
  unlinkSync,
  write,
  writeFileSync,
} from "fs";
import { getUsers } from "../../common/placeholder";
import path = require("path");
import { readFile, unlink, writeFile } from "fs/promises";
import axios from "axios";
import { BASE_URL } from "../../common/constants";

const FILE_NAME = path.join(__dirname, "/user.txt");

const deleteFileAsync = async () => {
  try {
    const content = await unlink(FILE_NAME);
    console.log(`File content`, content);
  } catch (e) {
    console.error("Error while deleteing file asynchronously", e);
  }
};

const deleteFileSync = async () => {
  try {
    const content = unlinkSync(FILE_NAME);
    console.log(`File content`, content);
  } catch (e) {
    console.error("Error while deleteing file synchronously", e);
  }
};


// To delete File Asynchoronously
// deleteFileAsync();

// To delete File synchoronously
// deleteFileSync();

