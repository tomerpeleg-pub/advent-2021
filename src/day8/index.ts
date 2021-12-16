import getInput from "../util/getInput";
import path from "path";
import util from "util";

const nums = [
  "abcefg",
  "cf",
  "acdeg",
  "acdfg",
  "bcdf",
  "abdfg",
  "abdefg",
  "acf",
  "abcdefg",
  "abcdfg",
];

const parseLine = (line: string) => {
  const [inputs, outputs] = line.trim().split(" | ");

  return { inputs: inputs.split(" "), outputs: outputs.split(" ") };
};

const parseInput = (input: string) => input.trim().split("\n");

const getUniqueLengths = (vals: Array<string>) => {
  let lengths: Record<string, string> = {};

  for (let n of vals) {
    if (!lengths.hasOwnProperty(n.length)) {
      lengths[n.length] = n;
    } else {
      lengths[n.length] = "";
    }
  }

  return vals
    .map((n: string) => ({ n, length: n.length }))
    .filter((val) => Boolean(lengths[val.length]));
};

const getSharedSegments = (vals: Array<string>) => {
  const chars: Record<string, Array<any>> = {};

  vals.forEach((val, n) => {
    val.split("").forEach((char) => {
      if (!chars[char]) chars[char] = [];

      chars[char].push({ val, n });
    });
  });

  return chars;
};

const part1 = (lines: Array<string>) => {
  const lengths = getUniqueLengths(nums);

  const outputs = lines.map(parseLine).map((l) => l.outputs);

  let count = 0;

  for (let output of outputs) {
    for (let code of output) {
      if (lengths[code.length]) {
        count++;
      }
    }
  }

  return count;
};

const figureOutLine = (inputs: Array<string>, uniqueLengths: Array<any>) => {
  const sharedSegments = getSharedSegments(inputs);
  console.log(
    "Input:",
    inputs,
    Object.keys(sharedSegments)
      .map((key) => ({
        key,
        l: sharedSegments[key].length,
      }))
      .sort((a, b) => (a.l > b.l ? 1 : -1))
  );
};

const part2 = (lines: Array<string>) => {
  const uniqueLength = getUniqueLengths(nums);
  const sharedSegments = getSharedSegments(nums);
  console.log(
    uniqueLength,
    Object.keys(sharedSegments)
      .map((key) => ({
        key,
        l: sharedSegments[key].length,
      }))
      .sort((a, b) => (a.l > b.l ? 1 : -1))
  );
  // );
  // const results = lines
  //   .map(parseLine)
  //   .map((line) => figureOutLine(line.inputs, uniqueLength));

  return 12;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./example"));
  const inputs = parseInput(data);

  console.log("DAY 6 ---------------");
  console.log("input: ", inputs.length);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(inputs);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("P2 ----------");
  console.time("p2");
  const p2Result = part2(inputs);
  console.timeEnd("p2");
  console.log("P2 Result: ", p1Result);
};
