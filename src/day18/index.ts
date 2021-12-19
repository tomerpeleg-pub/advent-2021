import getInput from "../util/getInput";
import path from "path";
import util from "util";

const parseInput = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));

const add = (left: string, right: string) => `[${left},${right}]`;

const explode = (val: string) => {
  let depth = 0;
  let consuming = false;
  let token = {};

  for (let i = 0; i < val.length; i++) {
    const char = val[i];

    if (char === ",") continue;

    if (char === "[") {
      depth++;
      continue;
    }

    if (char === "]") {
      depth--;
      continue;
    }

    if (/[0-9]/.test(char) && depth >= 5) {
      // explode
      const closing = val.indexOf("]", i);

      const left = val.substring(0, i - 1);
      const right = val.substring(closing + 1);

      const leftNum = val.substring(i).match(/[0-9]+/) || "";
      const rightNum = val.substring(i).match(/[0-9]+,([0-9]+)/);

      const lastNum = left.match(/([\[\],0-9]*)([0-9]+)([\[\],]*)/);
      const nextNum = right.match(/[0-9]+/);

      let result = left;

      if (lastNum) {
        result =
          lastNum[1] +
          String(parseInt(lastNum[2]) + parseInt(leftNum[0])) +
          lastNum[3];
      } else {
        // no left number
        result += "0";
      }

      result += ",";

      if (nextNum) {
        result += 
      } else {
        result += "0";
      }
    }
  }
};

const split = (val: number) => {
  if (Array.isArray(val)) {
  }
  return val;
};

const doSnailMath = (left: string, right: string) => {
  const afterAdd = add(left, right);

  const afterExplode = explode(afterAdd);

  return afterAdd;
};

const part1 = (lines: Array<any>) => {
  const [first, ...rest] = lines;
  const result = rest.reduce(doSnailMath, first);
  console.log("result", util.inspect(result, false, 1000, true));
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./example"));
  const lines = parseInput(data);

  console.log("DAY 17 ---------------");

  console.log(explode(`[7,[6,[5,[4,[3,2]]]]]`));

  // console.log("P1 ----------");
  // console.time("p1");
  // const p1Result = part1(data.split("\n"));
  // console.timeEnd("p1");
  // console.log("P1 Result: ", p1Result);

  // console.log("p2 ----------");
  // console.time("p2");
  // const p2Result = part2(target);
  // console.timeEnd("p2");
  // console.log("p2 Result: ", p2Result);
};
