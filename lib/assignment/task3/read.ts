import {
  createReadStream,
  createWriteStream,
  readFileSync,
  write,
  writeFileSync,
} from "fs";
import { getUsers } from "../../common/placeholder";
import path = require("path");
import { readFile, writeFile } from "fs/promises";
import axios from "axios";
import { BASE_URL } from "../../common/constants";

const FILE_NAME = path.join(__dirname, "/user.txt");

const readFileAsync = async () => {
  try {
    const content = await readFile(FILE_NAME, "utf-8");
    console.log(`File content`, content);
  } catch (e) {
    console.error("Error while reading file asynchronously", e);
  }
};

const readFileSynch = async () => {
  try {
    const content = readFileSync(FILE_NAME, "utf-8");
    console.log(`File content`, content);
  } catch (e) {
    console.error("Error while reading file synchronously", e);
  }
};

const readFileStream = async () => {
  try {
    const reader = createReadStream(FILE_NAME, "utf-8");
    const buff: string[] = [];
    reader.on("data", (chunk) => {
      buff.push(chunk as string);
    });

    reader.on("end", () => {
      console.log(`File content`, buff.join(''));
    });
    reader.on("error", (err) => {});
  } catch (e) {
    console.error("Error while reading file via stream", e);
  }
};

// To Read File Asynchoronously
// readFileAsync();

// To Read File synchoronously
// readFileSynch();

// To Read File as stream
// readFileStream();
