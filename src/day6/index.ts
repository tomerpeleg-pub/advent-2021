import getInput from "../util/getInput";
import path from "path";
import util from "util";

const FISH_TIME = 6;
const NEW_FISH_TIME = 8;

const parseInput = (input: string): Array<number> =>
  input
    .trim()
    .split(",")
    .map((n) => parseInt(n));

const part1 = (fishes: Array<number>, days: number) => {
  let _fishes = [...fishes];

  for (let i = 0; i < days; i++) {
    for (let j in _fishes) {
      _fishes[j]--;

      if (_fishes[j] === -1) {
        _fishes[j] = FISH_TIME;
        _fishes.push(NEW_FISH_TIME);
      }
    }
  }

  return _fishes.length;
};
const part2 = (fishes: Array<number>, days: number) => {
  let fishTimers = new Array(NEW_FISH_TIME + 1).fill(0);

  for (let fish of fishes) {
    fishTimers[fish]++;
  }

  let totalFish = fishes.length;
  // console.log(
  //   "Initial state: \t",
  //   fishTimers.map((n, i) => `${i}: ${n}`).join(", ")
  // );

  for (let i = 0; i < days; i++) {
    const newFish = fishTimers.shift();
    fishTimers[NEW_FISH_TIME] = newFish;
    fishTimers[FISH_TIME] += newFish;
    totalFish += newFish;
    // console.log(
    //   "After day",
    //   i,
    //   "\t",
    //   fishTimers.map((n, i) => `${i}: ${n}`).join(", ")
    // );
  }

  return totalFish;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const fishes = parseInput(data);

  console.log("DAY 6 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(fishes, 18);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("P2 ----------");
  console.time("p2");
  const p2Result = part2(fishes, 256);
  console.timeEnd("p2");
  console.log("P2 Result: ", p2Result);
};
