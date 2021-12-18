import getInput from "../util/getInput";
import path from "path";
import util from "util";

const parseInput = (input: string): Array<number> =>
  input
    .trim()
    .split(",")
    .map((n) => parseInt(n));

const calcFuel = (positions: Array<number>, position: number): number =>
  positions.reduce((total, pos) => total + Math.abs(pos - position), 0);

const calcFibFuel = (
  positions: Array<number>,
  position: number,
  costs: Array<number>
): number =>
  positions.reduce((total, pos) => total + costs[Math.abs(pos - position)], 0);

const part1 = (positions: Array<number>) => {
  const maxPosition = Math.max.apply(this, positions);

  let smallestTotal = calcFuel(positions, 1);
  let smallestChange = 1;

  for (let i = 2; i < maxPosition; i++) {
    const totalFuel = calcFuel(positions, i);
    if (totalFuel < smallestTotal) {
      smallestTotal = totalFuel;
      smallestChange = i;
    }
  }

  return smallestTotal;
};

const part2 = (positions: Array<number>) => {
  const maxPosition = Math.max.apply(this, positions);

  let runningTotal = 0;
  const fuelCosts = new Array(maxPosition + 1).fill(0).map((_, i) => {
    let cost = i + runningTotal;
    runningTotal += i;
    return cost;
  });

  let smallestTotal = calcFibFuel(positions, 1, fuelCosts);
  let smallestChange = 1;

  for (let i = 2; i < maxPosition; i++) {
    const totalFuel = calcFibFuel(positions, i, fuelCosts);
    if (totalFuel < smallestTotal) {
      smallestTotal = totalFuel;
      smallestChange = i;
    }
  }

  return smallestTotal;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const positions = parseInput(data);

  console.log("DAY 7 ---------------");
  console.log("input: ", positions.length);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(positions);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("P2 ----------");
  console.time("p2");
  const p2Result = part2(positions);
  console.timeEnd("p2");
  console.log("P2 Result: ", p2Result);
};
