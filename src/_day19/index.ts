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

const getBeaconConnections = (scanner: Scanner) =>
  scanner.map((beacon: Beacon) =>
    scanner
      .map((other: Beacon) => {
        if (beacon === other) return "";

        const diffs = [
          other.x - beacon.x,
          other.y - beacon.y,
          other.z - beacon.z,
        ].map(Math.abs);
        // const length =

        return diffs.sort((a, b) => a - b).join(",");
        // const hash = [
        //   diffs[0] * diffs[0] + diffs[1] * diffs[1] * diffs[2] * diffs[2],
        //   Math.atan(diffs[0] / diffs[1]),
        //   Math.atan(diffs[1] / diffs[2]),
        // ].join(",");
        // return hash;
      })
      .filter(Boolean)
  );

const part1 = (scanners: Scanner[]) => {
  const connections = scanners.map(getBeaconConnections);
  const beacons: string[][] = [];

  for (const scanner of connections) {
    for (const vertices of scanner) {
      beacons.push(vertices.sort());
    }
  }

  const uniqueBeacons: string[][] = [];

  beaconLoop: for (const beacon of beacons) {
    let found = false;

    existingLoop: for (const uniqueI in uniqueBeacons) {
      const unique = uniqueBeacons[uniqueI];
      const diff = beacon.filter((vertex) => !unique.includes(vertex));
      const matches = beacon.length - diff.length;

      if (matches >= 11) {
        found = true;
        uniqueBeacons[uniqueI] = unique.concat(diff);
        console.log(
          "found",
          matches,
          beacon,
          unique.length,
          uniqueBeacons[uniqueI].length
        );
        break existingLoop;
      }
    }

    if (!found) uniqueBeacons.push(beacon);
  }

  return uniqueBeacons.length;
  console.log("unique", beacons.length, uniqueBeacons.length);
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
