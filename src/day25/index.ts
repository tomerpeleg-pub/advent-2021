import getInput from "../util/getInput";
import path from "path";
import util from "util";

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;
const cyan = (str: string) => `\x1b[36m${str}\x1b[0m`;
const magenta = (str: string) => `\x1b[35m${str}\x1b[0m`;

enum Cell {
  Empty = ".",
  Down = "v",
  Right = ">",
}

const parseLine = (line: string): Cell[] =>
  line.split("").map((cell) => {
    switch (cell) {
      case Cell.Down:
        return Cell.Down;
      case Cell.Right:
        return Cell.Right;
      default:
        return Cell.Empty;
    }
  });

const parseInput = (input: string): Cell[][] =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseLine);

const renderGrid = (grid: Cell[][]) =>
  grid
    .map((row) =>
      row
        .map((cell) =>
          cell === Cell.Empty
            ? dim(cell)
            : cell === Cell.Right
            ? cyan(cell)
            : magenta(cell)
        )
        .join("")
    )
    .join("\n");

const part1 = (grid: Cell[][]) => {
  let moved = Infinity;
  let newGrid = Array.from(grid.map((line) => Array.from(line)));
  let i = 0;
  console.log("start\n" + renderGrid(grid));

  while (moved > 0) {
    i++;
    moved = 0;
    const stepGrid = Array.from(newGrid.map((line) => Array.from(line)));

    for (let y = 0; y < newGrid.length; y++) {
      const row = newGrid[y];

      for (let x = 0; x < row.length; x++) {
        const cell = row[x];

        if (cell === Cell.Right) {
          if (x < row.length - 1) {
            if (row[x + 1] === Cell.Empty) {
              stepGrid[y][x] = Cell.Empty;
              stepGrid[y][x + 1] = cell;
              moved++;
            }
          } else {
            if (row[0] === Cell.Empty) {
              stepGrid[y][x] = Cell.Empty;
              stepGrid[y][0] = cell;
              moved++;
            }
          }
        }
      }
    }
    const stepGrid2 = Array.from(stepGrid.map((line) => Array.from(line)));

    for (let y = 0; y < stepGrid.length; y++) {
      const row = stepGrid[y];

      for (let x = 0; x < row.length; x++) {
        const cell = row[x];

        if (cell === Cell.Down) {
          if (y < stepGrid.length - 1) {
            if (stepGrid[y + 1][x] === Cell.Empty) {
              stepGrid2[y][x] = Cell.Empty;
              stepGrid2[y + 1][x] = cell;
              moved++;
            }
          } else {
            if (stepGrid[0][x] === Cell.Empty) {
              stepGrid2[y][x] = Cell.Empty;
              stepGrid2[0][x] = cell;
              moved++;
            }
          }
        }
      }
    }

    newGrid = stepGrid2;
    // console.log(
    //   "\nstep " + i + "\n" + "moved: " + moved + "\n" + renderGrid(newGrid)
    // );
  }
  console.log("\nend\n" + renderGrid(newGrid));

  return i;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const input = parseInput(data);

  console.log("DAY 25 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(input);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
