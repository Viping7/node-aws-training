import { createWriteStream, write, writeFileSync } from "fs";
import { getUsers } from "../../common/placeholder";
import path = require("path");
import { writeFile } from "fs/promises";
import axios from "axios";
import { BASE_URL } from "../../common/constants";

const FILE_NAME = path.join(__dirname, "/user.txt");

const createFileAsync = async () => {
  try {
    console.log("Generating content to write...");
    const users = await getUsers();
    const userNames = users.map((user) => user.name).join("\n");
    console.log("Content generated..\nWriting to file..");
    await writeFile(FILE_NAME, userNames);
    console.log(`Content written to file successfully`);
  } catch (e) {
    console.error("Error while creating file asynchrnously", e);
  }
};

const createFileSync = async () => {
  try {
    console.log("Generating content to write...");
    const users = await getUsers();
    const userNames = users.map((user) => user.name).join("\n");
    console.log("Content generated..\nWriting to file..");
    writeFileSync(FILE_NAME, userNames);
    console.log(`Content written to file successfully`);
  } catch (e) {
    console.error("Error while creating file asynchrnously", e);
  }
};

const createFileStream = async () => {
  try {
    console.log("Generating content to write...");
    const writer = createWriteStream(FILE_NAME);
    const resp = await axios.get(`${BASE_URL}/users`, {
      responseType: "stream",
    });
    resp.data.pipe(writer);
    await new Promise<void>((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`Content written to file successfully`);
        resolve();
      });
      writer.on("error", (err) => {
        reject(err);
      });
    });
  } catch (e) {
    console.error("Error while creating file asynchrnously", e);
  }
};

// To Write File Asynchoronously
// createFileAsync();

// To Write File synchoronously
// createFileSync()

// To Write File as stream
createFileStream();