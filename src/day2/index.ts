import getInput from "../util/getInput";
import path from "path";

type Position = {
  x: number;
  y: number;
  aim?: number;
};

const parseInstruction = (instruction: string): Position => {
  const parts = instruction.split(/\s+/);
  const dir = parts?.[0];
  const amount = parseInt(parts?.[1]);
  switch (dir) {
    case "down":
      return {
        x: 0,
        y: amount,
      };
    case "up":
      return {
        x: 0,
        y: -amount,
      };
    case "forward":
      return {
        x: amount,
        y: 0,
      };
    default:
      return {
        x: 0,
        y: 0,
      };
  }
};

export const part1 = (diffs: Array<Position>): any =>
  diffs.reduce(
    (acc, diff) => {
      acc = {
        x: acc.x + diff.x,
        y: acc.y + diff.y,
      };
      return acc;
    },
    { x: 0, y: 0 }
  );

export const part2 = (diffs: Array<Position>): any =>
  diffs.reduce(
    (acc, diff) => {
      acc = {
        aim: (acc.aim || 0) + diff.y,
        x: acc.x + diff.x,
        y: acc.y + (acc.aim || 0) * diff.x,
      };
      return acc;
    },
    { x: 0, y: 0 }
  );

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const diffs: Array<Position> = data.split("\n").map(parseInstruction);

  if (!diffs.length) throw new Error("Invalid input, no numbers");

  console.log("DAY 2 ---------------");
  const p1Result = part1(diffs);
  console.log("P1 Result: ", p1Result, "total", p1Result.x * p1Result.y);
  const p2Result = part2(diffs);
  console.log("P2 Result: ", p2Result, "total", p2Result.x * p2Result.y);
};
