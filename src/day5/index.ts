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
  let points = [];

  const start = {
    x: line.start.x <= line.end.x ? line.start.x : line.end.x,
    y: line.start.y <= line.end.y ? line.start.y : line.end.y,
  };
  const end = {
    x: line.end.x > line.start.x ? line.end.x : line.start.x,
    y: line.end.y > line.start.y ? line.end.y : line.start.y,
  };
  for (let x = start.x; x <= end.x; x++) {
    for (let y = start.y; y <= end.y; y++) {
      points.push({ x, y });
    }
  }
  return points;
};

const part1 = (lines: Array<Line>) => {
  const grid: Record<string, number> = {};
  const singleLines = lines.filter(
    (line) => line.start.x === line.end.x || line.start.y === line.end.y
  );

  let overlaps = 0;

  for (const line of singleLines) {
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

  return overlaps;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const lines = parseInput(data);

  console.log("DAY 5 ---------------");
  console.time("p1");
  const p1Result = part1(lines);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
