import * as fs from "fs";
import * as path from "path";

const getInput = (file: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, file), "utf8", (error, data: string) => {
      if (error) {
        reject(error);
        throw error;
      }

      resolve(data);
    });
  });

export const part1 = (depths: Array<number>): number => {
  let count = 0;
  for (let i = 1; i < depths.length; i++) {
    if (depths[i] > depths[i - 1]) count++;
  }

  return count;
};

export const part2 = (depths: Array<number>): number => {
  let windows = [];
  for (let i = 2; i < depths.length; i++) {
    windows.push(depths[i] + depths[i - 1] + depths[i - 2]);
  }

  return part1(windows);
};

export default async () => {
  const data: string = await getInput("./input");
  const depths: Array<number> = data.split("\n").map((num) => parseInt(num));

  if (!depths.length) throw new Error("Invalid input, no numbers");

  console.log("DAY 1 ---------------");
  const p1Result = part1(depths);
  console.log("P1 Result: ", p1Result);

  const p2Result = part2(depths);
  console.log("P2 Result: ", p2Result);
};
