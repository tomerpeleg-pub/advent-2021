import getInput from "../util/getInput";
import path from "path";
import util from "util";

const parseInput = (input: string): Array<string> =>
  input.split("\n").filter((row) => row.length > 0);

const checkLine = (line: string) => {
  const starts: Record<string, string> = {
    "{": "}",
    "(": ")",
    "[": "]",
    "<": ">",
  };
  const ends: Record<string, number> = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  let running = [];

  for (let char of line) {
    if (starts.hasOwnProperty(char)) running.push(starts[char]);
    else if (ends.hasOwnProperty(char)) {
      if (char === running[running.length - 1]) {
        running.pop();
      } else {
        // console.log(
        //   `Expected ${running[running.length - 1]} but got ${char}. Score: ${
        //     ends[char]
        //   }`
        // );
        return ends[char];
      }
    }
  }

  return 0;
};

const completeLine = (line: string) => {
  const starts: Record<string, string> = {
    "{": "}",
    "(": ")",
    "[": "]",
    "<": ">",
  };
  const ends: Record<string, number> = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };

  let running = [];

  for (let char of line) {
    if (starts.hasOwnProperty(char)) running.push(starts[char]);
    else if (ends.hasOwnProperty(char)) {
      if (char === running[running.length - 1]) {
        running.pop();
      } else {
        return 0;
      }
    }
  }

  if (running.length === 0) return 0;

  return running
    .reverse()
    .reduce((sum: number, char: string) => sum * 5 + ends[char], 0);
};

const part1 = (lines: Array<string>) =>
  lines.map(checkLine).reduce((sum, score) => sum + score, 0);

const part2 = (lines: Array<string>) => {
  const results = lines
    .map(completeLine)
    .filter((l) => l > 0)
    .sort((a, b) => (a > b ? 1 : -1));

  return results[Math.floor(results.length / 2)];
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const lines = parseInput(data);

  console.log("DAY 10 ---------------");
  console.log("input: ", lines.length);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(lines);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("P2 ----------");
  console.time("p2");
  const p2Result = part2(lines);
  console.timeEnd("p2");
  console.log("P2 Result: ", p2Result);
};
