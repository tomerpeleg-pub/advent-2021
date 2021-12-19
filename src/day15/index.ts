import getInput from "../util/getInput";
import path from "path";
import util from "util";

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

type Grid = Array<Array<Point>>;
type Point = { x: number; y: number; cost: number; neighbours?: Array<Point> };

const parseInput = (input: string): Grid =>
  input.split("\n").map((row, y) =>
    row
      .split("")
      .filter((cell) => Boolean(cell.trim()))
      .map((cell, x) => ({ x, y, cost: parseInt(cell) }))
  );

const getMin = (queue: Map<Point, number>): Point => {
  const entries = queue.entries();

  let entry = entries.next();
  let min = entry.value;
  while (entry?.value) {
    if (entry.value[1] < min[1]) min = entry.value;

    entry = entries.next();
  }
  return min[0];
};

const getNeighbours = (grid: Grid, cell: Point) => {
  if (cell.neighbours?.length) return cell.neighbours;

  cell.neighbours = [
    grid?.[cell.y - 1]?.[cell.x], // N
    grid?.[cell.y + 1]?.[cell.x], // S
    grid?.[cell.y]?.[cell.x - 1], // W
    grid?.[cell.y]?.[cell.x + 1], // E
  ].filter(Boolean);

  return cell.neighbours;
};

const getCost = (grid: Grid, startPoint: Point, endPoint: Point) => {
  const queue: Map<Point, number> = new Map();
  const completed: Map<Point, number> = new Map();
  queue.set(startPoint, 0);
  completed.set(startPoint, 0);

  while (queue.size > 0) {
    const nextPoint = getMin(queue);
    queue.delete(nextPoint);
    const neighbours = getNeighbours(grid, nextPoint);

    for (let neighbour of neighbours) {
      if (!completed.get(neighbour)) {
        const cost = (completed.get(nextPoint) || 0) + neighbour.cost;

        if (neighbour === endPoint) return cost;

        completed.set(neighbour, cost);
        queue.set(neighbour, cost);
      }
    }
  }

  return completed.get(endPoint);
};

const part1 = (grid: Grid) => {
  const startPoint = grid[0][0];
  const endPoint = grid[grid.length - 1][grid[grid.length - 1].length - 1];
  const cost = getCost(grid, startPoint, endPoint);
  return cost;
};

const expandGrid = (grid: Grid, expand = 5): Grid => {
  let biggerGrid: Grid = [];

  const maxY = grid.length;
  const maxX = grid[0].length;

  for (let y = 0; y < maxY * expand; y++) {
    for (let x = 0; x < maxX * expand; x++) {
      const yi = Math.floor(y / maxY);
      const xi = Math.floor(x / maxX);
      const ogY = y % maxY;
      const ogX = x % maxX;
      const ogPoint = grid[ogY][ogX];
      const newPoint = {
        x,
        y,
        cost: ogPoint.cost + xi + yi,
      };
      newPoint.cost =
        newPoint.cost > 9 ? (newPoint.cost % 10) + 1 : newPoint.cost;

      if (!biggerGrid[newPoint.y]) biggerGrid[newPoint.y] = [];
      biggerGrid[newPoint.y][newPoint.x] = newPoint;
    }
  }

  return biggerGrid;
};

const part2 = (grid: Grid) => {
  const biggerGrid = expandGrid(grid, 5);

  const startPoint = biggerGrid[0][0];
  const endPoint =
    biggerGrid[biggerGrid.length - 1][
      biggerGrid[biggerGrid.length - 1].length - 1
    ];

  const cost = getCost(biggerGrid, startPoint, endPoint);
  return cost;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const grid = parseInput(data);

  console.log("DAY 15 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(grid);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("p2 ----------");
  console.time("p2");
  const p2Result = part2(grid);
  console.timeEnd("p2");
  console.log("p2 Result: ", p2Result);
};
