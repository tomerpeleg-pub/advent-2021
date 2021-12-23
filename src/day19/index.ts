import getInput from "../util/getInput";
import path from "path";
import util from "util";
import { cursorTo } from "readline";

type Beacon = {
  x: number;
  y: number;
  z: number;
};

type Vector = {
  length: number;
  angleA: number;
  angleB: number;
};

type Scanner = Beacon[];

const parseInput = (input: string) => {
  const scanners: Scanner[] = [];

  const lines = input.split("\n");

  let curScanner: Scanner = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    if (line.startsWith("---")) {
      if (curScanner.length) scanners.push(curScanner);
      curScanner = [];
      continue;
      `1`;
    }

    const [x, y, z] = line.split(",").map((val) => parseInt(val));
    curScanner.push({ x, y, z });
  }
  if (curScanner.length) scanners.push(curScanner);

  return scanners;
};

const part1 = (scanners: Scanner[]) => {
  const str = scanners
    .map((beacons) =>
      beacons.map((beacon) => `${beacon.x},${beacon.y},${beacon.z}\n`).join("")
    )
    .join("\n\n");
  console.log("scanners", str);
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./example2"));
  const scanners = parseInput(data);

  console.log("DAY 19 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(scanners);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
