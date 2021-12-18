import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Insert = {
  left: string;
  right: string;
  insert: string;
};

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

const parseInsertion = (input: string): Insert => ({
  left: input[0],
  right: input[1],
  insert: input[6],
});

const parseInput = (input: string) => {
  const [template, ...insertLines] = input
    .split("\n")
    .filter((line) => Boolean(line.trim()));

  const insertions = insertLines.map(parseInsertion);

  return { template: template.trim(), insertions };
};

const doInserts = (template: string, insertions: Array<Insert>) => {
  let matches = [];
  for (let insert of insertions) {
    let index = -1;
    while (
      (index = template.indexOf(insert.left + insert.right, index + 1)) !== -1
    ) {
      matches[index] = insert.insert;
    }
  }

  let result = [];
  for (let i = 0; i < template.length; i++) {
    const char = template[i];
    const insert = matches[i];
    result.push(char);
    if (insert) result.push(insert);
  }
  return result.join("");
};

const countElems = (template: string) =>
  template.split("").reduce((counts: Record<string, number>, char: string) => {
    counts[char] = counts[char] ? counts[char] + 1 : 1;
    return counts;
  }, {});

const part1 = (template: string, insertions: Array<Insert>, repeat = 1) => {
  console.log(
    "Start:",
    bright(template),
    "doing insertions:",
    insertions.length
  );

  let result = template;
  for (let i = 0; i < repeat; i++) {
    result = doInserts(result, insertions);
    // console.log("After step", i + 1, ": ", result);
  }

  const counts = countElems(result);
  const sortedCounts = Object.values(counts).sort((a, b) => (a > b ? 1 : -1));
  return sortedCounts[sortedCounts.length - 1] - sortedCounts[0];
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const input = parseInput(data);

  console.log("DAY 14 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(input.template, input.insertions, 10);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
