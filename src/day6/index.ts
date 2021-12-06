import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Fish = {
  timer: number;
  age: number;
};

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

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const fishes = parseInput(data);

  console.log("DAY 6 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(fishes, 80);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
