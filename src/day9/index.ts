import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Cell = {
  x: number;
  y: number;
  val: number;
  passed?: boolean;
};

type Grid = Array<Array<Cell>>;

const parseInput = (input: string): Grid =>
  input
    .split("\n")
    .map((row, y) =>
      row
        .split("")
        .map((char, x) => ({ x, y, val: parseInt(char), passed: false }))
    )
    .filter((row) => row.length > 0);

const getNeighbours = (grid: Grid, coord: Cell) => {
  let neighbours = [];

  if (coord.y > 0) neighbours.push(grid[coord.y - 1][coord.x]);
  if (coord.y < grid.length - 1) neighbours.push(grid[coord.y + 1][coord.x]);
  if (coord.x > 0) neighbours.push(grid[coord.y][coord.x - 1]);
  if (coord.x < grid[0].length - 1) neighbours.push(grid[coord.y][coord.x + 1]);

  return neighbours;
};

const getLowPoints = (grid: Grid): Array<Cell> => {
  const lowPoints = [];

  for (let yi = 0; yi < grid.length; yi++) {
    const row = grid[yi];
    for (let xi = 0; xi < row.length; xi++) {
      const cell = row[xi];
      const neighbours = getNeighbours(grid, cell);

      if (
        neighbours.filter((neighbour) => cell.val >= neighbour.val).length === 0
      )
        lowPoints.push(cell);
    }
  }

  return lowPoints;
};

const part1 = (grid: Grid) => {
  const lowPoints = getLowPoints(grid);

  return lowPoints.reduce((sum, cell) => sum + cell.val + 1, 0);
};

const getBasin = (grid: Grid, cell: Cell): Array<Cell> => {
  if (cell.passed) return [];
  const neighbours: Array<Cell> = getNeighbours(grid, cell).filter(
    (c) => c.val !== 9 && c.passed !== true
  );
  cell.passed = true;
  let basin: Array<Cell> = [cell];

  for (let neighbour of neighbours) {
    if (neighbour.passed) continue;
    const neighbourBasin = getBasin(grid, neighbour);
    basin = basin.concat(neighbourBasin);
  }
  return basin;
};

const part2 = (grid: Grid) => {
  const lowPoints = getLowPoints(grid);
  const basins = lowPoints.map((cell) => getBasin(grid, cell));

  return basins
    .map((basin) => basin.length)
    .sort((a, b) => (a > b ? 1 : -1))
    .slice(-3)
    .reduce((sum, val) => sum * val, 1);
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const grid = parseInput(data);

  console.log("DAY 9 ---------------");
  console.log("input: ", grid.length);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(grid);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("P2 ----------");
  console.time("p2");
  const p2Result = part2(grid);
  console.timeEnd("p2");
  console.log("P2 Result: ", p2Result);
};
