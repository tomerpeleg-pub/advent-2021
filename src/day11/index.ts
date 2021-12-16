import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Cell = {
  x: number;
  y: number;
  n: number;
  flash?: boolean;
};

type Grid = Array<Array<Cell>>;

let totalFlashes = 0;

const parseInput = (input: string): Grid =>
  input
    .split("\n")
    .filter((row) => row.length > 0)
    .map((row, y) => row.split("").map((n, x) => ({ x, y, n: parseInt(n) })));

const getNeighbours = (grid: Grid, cell: Cell) => {
  let neighbours = [
    grid?.[cell.y - 1]?.[cell.x], // N
    grid?.[cell.y + 1]?.[cell.x], // S
    grid?.[cell.y]?.[cell.x - 1], // W
    grid?.[cell.y]?.[cell.x + 1], // E
    grid?.[cell.y - 1]?.[cell.x - 1], // NW
    grid?.[cell.y - 1]?.[cell.x + 1], // NE
    grid?.[cell.y + 1]?.[cell.x - 1], // SW
    grid?.[cell.y + 1]?.[cell.x + 1], // SE
  ].filter(Boolean);

  return neighbours;
};

const flash = (grid: Grid, cell: Cell): Grid => {
  if (cell.flash) return grid;

  cell.n = 0;
  cell.flash = true;
  totalFlashes++;

  getNeighbours(grid, cell)
    .map((neighbour) => {
      if (!neighbour.flash) neighbour.n++;
      return neighbour;
    })
    .map((neighbour) => {
      if (neighbour.n > 9) flash(grid, neighbour);
    });

  return grid;
};

const printGrid = (grid: Grid) =>
  console.log(
    grid
      .map((row) =>
        row
          .map(
            (cell) =>
              (cell.n === 0 ? "\x1b[1m" + "0" : "\x1b[2m" + String(cell.n)) +
              "\x1b[0m"
          )
          .join(" ")
      )
      .join("\n")
  );

const part1 = (grid: Grid) => {
  totalFlashes = 0;

  console.log("At start");
  printGrid(grid);

  for (let i = 0; i < 100; i++) {
    let flashes = [];

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid.length; x++) {
        const cell = grid[y][x];
        cell.flash = false;
        cell.n++;

        if (cell.n > 9) {
          flashes.push(cell);
        }
      }
    }

    flashes.forEach((cell) => flash(grid, cell));

    // console.log(
    //   "\nAfter Round",
    //   i + 1,
    //   "this round:",
    //   flashes.length,
    //   "total:",
    //   totalFlashes
    // );

    // printGrid(grid);
  }

  console.log("\nAfter Round", 195, "total:", totalFlashes);

  printGrid(grid);

  return totalFlashes;
};
const part2 = (grid: Grid) => {
  totalFlashes = 0;

  console.log("At start");
  printGrid(grid);

  let i = 1;
  let sync = false;

  while (!sync) {
    let flashes: Array<Cell> = [];

    sync = true;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid.length; x++) {
        const cell = grid[y][x];
        if (cell.n > 0) sync = false;

        cell.flash = false;
        cell.n++;

        if (cell.n > 9) {
          flashes.push(cell);
        }
      }
    }

    if (sync) {
      console.log(
        "\nAfter Round",
        i,
        "this round:",
        flashes.length,
        "total:",
        totalFlashes
      );

      printGrid(grid);
      return i;
    }

    flashes.forEach((cell) => flash(grid, cell));

    i++;
  }

  console.log("\nAfter Round", 100, "total:", totalFlashes);

  printGrid(grid);

  return totalFlashes;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const grid = parseInput(data);

  console.log("DAY 11 ---------------");
  console.log("input: ", grid.length);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(grid);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("P2 ----------");
  console.time("p2");
  const p2Result = part2(parseInput(data));
  console.timeEnd("p2");
  console.log("P2 Result: ", p2Result);
};
