import getInput from "../util/getInput";
import path from "path";
import util from "util";

enum Axis {
  y = "y",
  x = "x",
}

type Coord = {
  x: number;
  y: number;
};

type Fold = {
  axis: Axis;
  n: number;
};

type Input = {
  dots: Array<Coord>;
  folds: Array<Fold>;
};

const parseDotLine = (line: string) => {
  const [x, y] = line.split(",").map((n) => parseInt(n));
  return { x, y };
};

const parseFoldLine = (line: string): Fold => {
  const result = line.match(/fold along (x|y)=(\d+)/);
  const axis: Axis = result?.[1] === "x" ? Axis.x : Axis.y;
  const n = parseInt(result?.[2] || "0");
  return { axis, n };
};

const parseInput = (input: string): Input => {
  const [dotLines, foldLines] = input.split("\n\r\n");
  const dots = dotLines.split("\n").map(parseDotLine);
  const folds = foldLines.split("\n").map(parseFoldLine);

  return { dots, folds };
};

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

const renderDots = (dots: Array<Coord>) => {
  const maxX = dots.reduce((max, dot) => (dot.x > max ? dot.x : max), 0);
  const maxY = dots.reduce((max, dot) => (dot.y > max ? dot.y : max), 0);
  let grid: Array<Array<boolean>> = [...Array(maxY + 1)].map((_) => [
    ...Array(maxX + 1),
  ]);

  for (let dot of dots) {
    grid[dot.y][dot.x] = true;
  }

  console.log(
    grid
      .map((row) => row.map((cell) => (cell ? bright("█") : dim(" "))).join(""))
      .join("\n")
  );
};

const doFold = (dots: Array<Coord>, fold: Fold) => {
  const belowFold = dots.filter((dot) => dot[fold.axis] < fold.n);
  const aboveFold = dots.filter((dot) => dot[fold.axis] >= fold.n);

  return aboveFold
    .map((dot) => ({
      ...dot,
      [fold.axis]: fold.n - (dot[fold.axis] - fold.n),
    }))
    .filter(
      (dot) => !belowFold.find((_dot) => _dot.x === dot.x && _dot.y === dot.y)
    )
    .concat(belowFold);
};

const part1 = (input: Input) => {
  console.log("Input", input.dots.length);
  const afterFold = doFold(input.dots, input.folds[0]);
  console.log("After fold 0:", afterFold.length);
  return afterFold.length;
};

const part2 = (input: Input) => {
  console.log("Input", input.dots.length);

  let dots = input.dots;
  for (let fold of input.folds) {
    dots = doFold(dots, fold);
  }

  console.log("After all folds", dots.length);
  renderDots(dots);

  return dots.length;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const input = parseInput(data);

  console.log("DAY 12 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(input);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("P2 ----------");
  console.time("p2");
  const p2Result = part2(input);
  console.timeEnd("p2");
  console.log("p2 Result: ", p2Result);
};
