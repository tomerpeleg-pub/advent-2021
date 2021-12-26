import getInput from "../util/getInput";
import path from "path";
import util from "util";

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

type Range = {
  x: [number, number];
  y: [number, number];
  z: [number, number];
};

interface Instruction extends Range {
  turnOn: boolean;
}

type Cube = {
  on: boolean;
  x: number;
  y: number;
  z: number;
};

const parseLine = (line: string = ""): Instruction => {
  const result = line.match(
    /(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
  );

  const turnOn: boolean = result?.[1] === "on";
  const x1 = parseInt(result?.[2] || "");
  const x2 = parseInt(result?.[3] || "");
  const y1 = parseInt(result?.[4] || "");
  const y2 = parseInt(result?.[5] || "");
  const z1 = parseInt(result?.[6] || "");
  const z2 = parseInt(result?.[7] || "");

  return {
    turnOn,
    x: [x1, x2],
    y: [y1, y2],
    z: [z1, z2],
  };
};

const inRange = (instruction: Instruction) =>
  instruction.x[0] >= -50 &&
  instruction.x[1] <= 50 &&
  instruction.y[0] >= -50 &&
  instruction.y[1] <= 50 &&
  instruction.z[0] >= -50 &&
  instruction.z[1] <= 50;

const parseInput = (input: string): Instruction[] =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseLine)
    .filter(inRange);

const getRange = (instructions: Instruction[]): Range =>
  instructions.reduce(
    ({ x, y, z }, instruction) => ({
      x: [
        instruction.x[0] < x[0] ? instruction.x[0] : x[0],
        instruction.x[1] > x[1] ? instruction.x[1] : x[1],
      ],
      y: [
        instruction.y[0] < y[0] ? instruction.y[0] : y[0],
        instruction.y[1] > y[1] ? instruction.y[1] : y[1],
      ],
      z: [
        instruction.z[0] < z[0] ? instruction.z[0] : z[0],
        instruction.z[1] > z[1] ? instruction.z[1] : z[1],
      ],
    }),
    {
      x: [Infinity, -Infinity],
      y: [Infinity, -Infinity],
      z: [Infinity, -Infinity],
    }
  );

const normalizeRange = (range: Range): Range => ({
  x: [0, range.x[1] - range.x[0]],
  y: [0, range.x[1] - range.x[0]],
  z: [0, range.x[1] - range.x[0]],
});

const getGrid = (range: Range) => {
  const grid: boolean[][][] = [];
  for (let x = range.x[0]; x <= range.x[1]; x++) {
    if (!grid[x]) grid[x] = [];
    for (let y = range.y[0]; y <= range.y[1]; y++) {
      if (!grid[x][y]) grid[x][y] = [];
      for (let z = range.z[0]; z <= range.z[1]; z++) {
        grid[x][y][z] = false;
      }
    }
  }
  return grid;
};

const doInstruction = (grid: boolean[][][]) => (instruction: Instruction) => {
  for (let x = instruction.x[0]; x <= instruction.x[1]; x++) {
    if (!grid[x]) grid[x] = [];
    for (let y = instruction.y[0]; y <= instruction.y[1]; y++) {
      if (!grid[x][y]) grid[x][y] = [];
      for (let z = instruction.z[0]; z <= instruction.z[1]; z++) {
        grid[x][y][z] = instruction.turnOn;
      }
    }
  }
  return grid;
};

const part1 = (instructions: Instruction[]) => {
  const range = getRange(instructions);
  const normalRange: Range = normalizeRange(range);
  const normalInstructions: Instruction[] = instructions.map(
    (instruction: Instruction) => ({
      ...instruction,
      x: [instruction.x[0] - range.x[0], instruction.x[1] - range.x[0]],
      y: [instruction.y[0] - range.y[0], instruction.y[1] - range.y[0]],
      z: [instruction.z[0] - range.z[0], instruction.z[1] - range.z[0]],
    })
  );
  const grid = getGrid(normalRange);
  let result = grid;
  for (const instruction of normalInstructions) {
    result = doInstruction(result)(instruction);
  }
  const countOn = result.flat(3).filter(Boolean).length;
  return countOn;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const instructions = parseInput(data);

  console.log("DAY 22 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(instructions);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
