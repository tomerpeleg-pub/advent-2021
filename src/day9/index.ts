import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Grid = Array<Array<number>>;

type Coord = {
  x: number;
  y: number;
};

const parseInput = (input: string): Grid =>
  input
    .split("\n")
    .map((row) => row.split("").map((char) => parseInt(char)))
    .filter((row) => row.length > 0);

const getNeighbours = (grid: Grid, coord: Coord) => {
  let neighbours = [];

  if (coord.y > 0) neighbours.push(grid[coord.y - 1][coord.x]);
  if (coord.y < grid.length - 1) neighbours.push(grid[coord.y + 1][coord.x]);
  if (coord.x > 0) neighbours.push(grid[coord.y][coord.x - 1]);
  if (coord.x < grid[0].length - 1) neighbours.push(grid[coord.y][coord.x + 1]);

  return neighbours;
};

const part1 = (grid: Grid) => {
  const lowPoints = [];

  for (let yi = 0; yi < grid.length; yi++) {
    const row = grid[yi];
    for (let xi = 0; xi < row.length; xi++) {
      const cell = row[xi];
      const neighbours = getNeighbours(grid, { x: xi, y: yi });
      if (neighbours.filter((neighbour) => cell >= neighbour).length === 0)
        lowPoints.push(cell);
    }
  }

  return lowPoints.reduce((sum, cur) => sum + cur + 1, 0);
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const grid = parseInput(data);

  console.log("DAY 6 ---------------");
  console.log("input: ", grid.length);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(grid);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
