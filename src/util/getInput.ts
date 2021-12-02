import * as fs from "fs";
import * as path from "path";

const getInput = (file: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (error, data: string) => {
      if (error) {
        reject(error);
        throw error;
      }

      resolve(data);
    });
  });

export default getInput;
