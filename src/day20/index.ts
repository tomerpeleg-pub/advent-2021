import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Coord = {
  x: number;
  y: number;
};

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

const parseLine = (line: string) =>
  line.split("").map((char) => (char === "#" ? 1 : 0));

const parseInput = (input: string) => {
  const [enhance, ...image] = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    enhance: parseLine(enhance),
    image: image.map(parseLine),
  };
};

const renderImage = (image: number[][]) => {
  const str = image
    .map((row) => row.map((cell) => (cell ? bright("#") : dim("."))).join(""))
    .join("\n");
  console.log(str);
};

const getNinePoints = (grid: number[][], coord: Coord, empty = 0) => [
  grid?.[coord.y - 1]?.[coord.x - 1] ?? empty, // NW
  grid?.[coord.y - 1]?.[coord.x] ?? empty, // N
  grid?.[coord.y - 1]?.[coord.x + 1] ?? empty, // NE
  grid?.[coord.y]?.[coord.x - 1] ?? empty, // W
  grid?.[coord.y]?.[coord.x] ?? empty, // .
  grid?.[coord.y]?.[coord.x + 1] ?? empty, // E
  grid?.[coord.y + 1]?.[coord.x - 1] ?? empty, // SW
  grid?.[coord.y + 1]?.[coord.x] ?? empty, // S
  grid?.[coord.y + 1]?.[coord.x + 1] ?? empty, // SE
];

const getEnhanceIndex = (image: number[][], coord: Coord, empty = 0) =>
  parseInt("0" + getNinePoints(image, coord, empty).map(String).join(""), 2);

const padImage = (image: number[][], empty = 0) => {
  const width = image[0].length;
  const emptyRow = new Array(width + 2).fill(empty);

  return [
    [...emptyRow],
    ...image.map((row) => [empty, ...row, empty]),
    [...emptyRow],
  ];
};

const enhanceImage = (image: number[][], enhance: number[], empty = 0) => {
  const padded = padImage(image, empty);
  const enhanced = padded.map((row, y) =>
    row.map((_, x) => enhance[getEnhanceIndex(padded, { x, y }, empty)])
  );
  return enhanced;
};

const countLit = (image: number[][]) =>
  image.flat(2).filter((c) => c === 1).length;

const part1 = (enhance: number[], image: number[][]) => {
  const otherEmpty = enhance[0];

  // renderImage(image);
  const enhanced1 = enhanceImage(image, enhance, 0);
  // console.log("\n\n");
  // renderImage(enhanced1);
  const enhanced2 = enhanceImage(enhanced1, enhance, otherEmpty);
  // console.log("\n\n");
  // renderImage(enhanced2);
  const numLit = countLit(enhanced2);
  return numLit;
};

const part2 = (enhance: number[], image: number[][]) => {
  const otherEmpty = enhance[0];
  let enhanced = image;

  for (let i = 0; i < 50; i++) {
    const empty = i % 2 ? otherEmpty : 0;
    enhanced = enhanceImage(enhanced, enhance, empty);
  }
  const numLit = countLit(enhanced);
  return numLit;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const { enhance, image } = parseInput(data);

  console.log("DAY 20 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(enhance, image);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("p2 ----------");
  console.time("p2");
  const p2Result = part2(enhance, image);
  console.timeEnd("p2");
  console.log("p2 Result: ", p2Result);
};
