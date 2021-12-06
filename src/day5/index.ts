import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Point = {
  x: number;
  y: number;
};

type Line = {
  start: Point;
  end: Point;
};

const parseLine = (lineStr: string): Line => {
  const parts = lineStr.trim().match(/(\d+),(\d+) -> (\d+),(\d+)/);

  return {
    start: { x: parseInt(parts?.[1] || "0"), y: parseInt(parts?.[2] || "0") },
    end: { x: parseInt(parts?.[3] || "0"), y: parseInt(parts?.[4] || "0") },
  };
};

const parseInput = (input: string = ""): Array<Line> =>
  input
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map(parseLine);

const getPoints = (line: Line): Array<Point> => {
  const minX = Math.min(line.start.x, line.end.x);
  const minY = Math.min(line.start.y, line.end.y);
  const maxY = Math.max(line.start.y, line.end.y);

  // horizontal
  if (line.start.x === line.end.x) {
    return new Array(Math.abs(line.end.y - line.start.y) + 1)
      .fill(0)
      .map((_, i) => ({
        x: minX,
        y: minY + i,
      }));
  }

  // vertical
  if (line.start.y === line.end.y) {
    return new Array(Math.abs(line.end.x - line.start.x) + 1)
      .fill(0)
      .map((_, i) => ({
        x: minX + i,
        y: minY,
      }));
  }

  // diagonal: top left to bottom left
  if (
    (line.end.y >= line.start.y && line.end.x >= line.start.x) ||
    (line.end.y <= line.start.y && line.end.x <= line.start.x)
  ) {
    return new Array(Math.abs(line.end.x - line.start.x) + 1)
      .fill(0)
      .map((_, i) => ({
        x: minX + i,
        y: minY + i,
      }));
  }

  // diagonal: bottom left to top left
  return new Array(Math.abs(line.end.x - line.start.x) + 1)
    .fill(0)
    .map((_, i) => ({
      x: minX + i,
      y: maxY - i,
    }));
};

const applyLines = (grid: Record<string, number>, lines: Array<Line>) => {
  let overlaps = 0;

  for (const line of lines) {
    const points = getPoints(line);

    for (const point of points) {
      const pointStr: string = point.x + ":" + point.y;

      if (grid[pointStr] === undefined) {
        grid[pointStr] = 1;
      } else {
        grid[pointStr]++;

        if (grid[pointStr] === 2) overlaps++;
      }
    }
  }

  return { overlaps, grid };
};

const renderGrid = (grid: Record<string, number>) => {
  const gridArr: Array<Array<number>> = [];

  let highestX = 0;
  let highestY = 0;

  for (const pointStr in grid) {
    const [x, y] = pointStr.split(":").map((n) => parseInt(n));

    if (x > highestX) highestX = x;
    if (y > highestY) highestY = y;

    if (gridArr[y] === undefined) gridArr[y] = [];

    gridArr[y][x] = grid[pointStr];
  }

  let gridStr = "";

  for (let y = 0; y <= highestY; y++) {
    for (let x = 0; x <= highestX; x++) {
      const val = gridArr?.[y]?.[x];

      if (val === undefined) gridStr += ".";
      else gridStr += val;
    }
    gridStr += "\n";
  }

  console.log(gridStr);
};

const part1 = (lines: Array<Line>) => {
  const grid: Record<string, number> = {};
  const singleLines = lines.filter(
    (line) => line.start.x === line.end.x || line.start.y === line.end.y
  );
  const { overlaps } = applyLines(grid, singleLines);

  // renderGrid(grid);

  return overlaps;
};

const part2 = (lines: Array<Line>) => {
  const grid: Record<string, number> = {};
  const { overlaps } = applyLines(grid, lines);
  // renderGrid(grid);

  return overlaps;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const lines = parseInput(data);

  console.log("DAY 5 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(lines);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("\nP2 ----------");
  console.time("p2");
  const p2Result = part2(lines);
  console.timeEnd("p2");
  console.log("P2 Result: ", p2Result);
};
