import getInput from "../util/getInput";
import path from "path";
import util from "util";

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

const parsePlayer = (line: string) => parseInt(line[line.length - 1]);

const parseInput = (input: string) =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parsePlayer);

const roll = (dice: number = 1) =>
  [dice, dice + 1, dice + 2].map((val) => (val > 100 ? val - 100 : val));

const sum = (arr: number[]) =>
  arr.reduce((tot: number, cur: number) => tot + cur, 0);
const product = (arr: number[]) =>
  arr.reduce((tot: number, cur: number) => tot * cur, 1);

const part1 = (startingPositions: number[]) => {
  let dice = 1;
  const spaces = 10;
  const positions = [...startingPositions.map((start) => start - 1)];
  const scores = [0, 0];

  const winner = false;

  let round = 3;
  console.log("starting positions", startingPositions);

  while (!winner) {
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];

      const diceRolls = roll(dice);
      positions[i] = (positions[i] + sum(diceRolls)) % 10;
      dice = diceRolls[diceRolls.length - 1] + 1;
      scores[i] += positions[i] + 1;

      if (scores[i] >= 1000) {
        console.log("winner", { i, positions, scores });
        return scores.sort((a, b) => a - b)[0] * round;
      }
      round += 3;
    }
  }
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const startingPositions = parseInput(data);

  console.log("DAY 21 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(startingPositions);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
