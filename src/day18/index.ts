import getInput from "../util/getInput";
import path from "path";
import util from "util";

const parseInput = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));

type Token = "," | "[" | "]" | number;

const scan = (line: string): Token[] => {
  let i = 0;
  let num = "";
  const tokens: Token[] = [];

  while (i < line.length) {
    const char = line[i];

    if (/[0-9]/.test(char)) {
      num += char;
    } else if (num) {
      tokens.push(parseInt(num));
      num = "";
    }

    if (char === "," || char === "[" || char === "]") {
      tokens.push(char);
    }

    i++;
  }

  return tokens;
};

const explode = (val: Token[]): Token[] => {
  let depth = 0;
  let found;

  let right;
  let prev;
  let next;

  let result = Array.from(val);

  let minI = -1;

  for (let i = 0; i < val.length; i++) {
    if (i <= minI) continue;
    const token = val[i];
    if (found) {
      console.log("after found", i, token);
    }

    switch (token) {
      case "[":
        depth++;
        continue;
      case "]":
        depth--;
        continue;
      case ",":
        continue;

      default:
        if (found && typeof right === "number") {
          next = { i, token };
          console.log("before splice", val[i], val[i - 1]);
          console.log("splicing right", i, token, right, result.join(""));
          result.splice(i - 4, 1, right + token);
          console.log(" spliced right", i, token, right, result.join(""));
          // console.log("next", { i, right, token, result: result.join("") });
          return result;
        } else {
          if (depth >= 5 && typeof val?.[i + 2] === "number") {
            found = true;

            if (prev) {
              result.splice(prev.i, 1, prev.token + token);
            }

            right = val[i + 2];
            // console.log("found", { token, result: result.join("") });
            console.log(
              "doing explode",
              i,
              val.length,
              token,
              right,
              result.join("")
            );
            result.splice(i - 1, 5, 0);
            // console.log("after", { token, result: result.join("") });
            minI = i + 2;
            console.log(
              " done explode",
              i,
              minI,
              val.length,
              token,
              right,
              result.join("")
            );
          } else if (!found) {
            prev = { i, token };
          }
        }
        break;
    }
  }

  return result;
};

const split = (val: Token[]): Token[] => {
  const result = [...val];
  console.log("before split", result.join(""));
  // val.reduce((arr: Token[], token: Token, i: number) => {
  for (let i = 0; i < result.length; i++) {
    const token = result[i];
    if (typeof token === "number" && token > 9) {
      console.log("doing split", i, token);
      result.splice(
        i,
        1,
        "[",
        Math.floor(token / 2),
        ",",
        Math.ceil(token / 2),
        "]"
      );
    }
  }
  return result;
};

const add = (left: Token[], right: Token[]): Token[] => [
  "[",
  ...left,
  ",",
  ...right,
  "]",
];

const doSnailMath = (left: Token[], right: Token[]) => {
  const afterAdd = add(left, right);
  console.log("after add", afterAdd.join(""));

  let finished = false;
  let result = afterAdd;
  while (!finished) {
    let newResult = split(explode(result));
    finished = newResult.join("") === result.join("");
    result = newResult;
    console.log("after exp", result.join(""));
  }

  return result;
};

const part1 = (lines: Array<any>) => {
  // const line = scan(lines[0]);
  // const result = explode(line);
  const [first, ...rest] = lines.map(scan);
  const result = rest.reduce(doSnailMath, first);
  console.log("result", result.join(""));
  return result;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./example"));
  const lines = parseInput(data);

  console.log("DAY 18 ---------------");

  // console.log(
  //   explode(add(scan("[[[[4,3],4],4],[7,[[8,4],9]]]"), scan("[1,1]"))).join("")
  // );

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(data.split("\n").map((line) => line.trim()));
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  // console.log("p2 ----------");
  // console.time("p2");
  // const p2Result = part2(target);
  // console.timeEnd("p2");
  // console.log("p2 Result: ", p2Result);
};
