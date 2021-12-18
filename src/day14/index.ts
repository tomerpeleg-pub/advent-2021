import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Insert = {
  left: string;
  right: string;
  pair?: string;
  insert: string;
};

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

const parseInsertion = (input: string): Insert => ({
  left: input[0],
  right: input[1],
  pair: input[0] + input[1],
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

const getPairs = (template: string) => {
  let pairs: Record<string, number> = {};
  let chars: Record<string, number> = {};

  for (let i = 0; i < template.length - 1; i++) {
    chars[template[i]] = (chars[template[i]] || 0) + 1;
    pairs[template[i] + template[i + 1]] =
      (pairs[template[i] + template[i + 1]] || 0) + 1;
  }
  chars[template[template.length - 1]] =
    (chars[template[template.length - 1]] || 0) + 1;

  return { pairs, chars };
};

const doPairInserts = (
  pairs: Record<string, number>,
  chars: Record<string, number>,
  insertions: Array<Insert>
) => {
  let newPairs: Record<string, number> = {};
  let newChars: Record<string, number> = { ...chars };

  for (let insert of insertions) {
    const pair = insert.left + insert.right;
    if (pairs.hasOwnProperty(pair) && pairs[pair] > 0) {
      const prevPair = insert.left + insert.right;
      const newPairLeft = insert.left + insert.insert;
      const newPairRight = insert.insert + insert.right;

      newPairs[newPairLeft] = (newPairs[newPairLeft] || 0) + pairs[prevPair];
      newPairs[newPairRight] = (newPairs[newPairRight] || 0) + pairs[prevPair];
      newChars[insert.insert] =
        (newChars[insert.insert] || 0) + pairs[prevPair];
    }
  }

  return { pairs: newPairs, chars: newChars };
};

const part2 = (template: string, insertions: Array<Insert>, repeat = 1) => {
  let { pairs, chars } = getPairs(template);
  // console.log(
  //   "Start:",
  //   bright(template),
  //   "doing insertions:",
  //   insertions.length,
  //   { pairs, chars }
  // );
  for (let i = 0; i < repeat; i++) {
    const result = doPairInserts(pairs, chars, insertions);
    pairs = result.pairs;
    chars = result.chars;
  }

  const sortedCounts = Object.values(chars)
    .filter((n) => n > 0)
    .sort((a, b) => (a > b ? 1 : -1));

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

  console.log("p2 ----------");
  console.time("p2");
  const p2Result = part2(input.template, input.insertions, 40);

  console.timeEnd("p2");
  console.log("p2 Result: ", p2Result);
};
