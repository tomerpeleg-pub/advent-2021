import getInput from "../util/getInput";
import path from "path";
import util from "util";

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

const parsePlayer = (line: string) => parseInt(line[line.length - 1]);

const parseInput = (input: string) =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parsePlayer);

const roll = (dice: number = 1) =>
  [dice, dice + 1, dice + 2].map((val) => (val > 100 ? val - 100 : val));

const sum = (arr: number[]) =>
  arr.reduce((tot: number, cur: number) => tot + cur, 0);
const product = (arr: number[]) =>
  arr.reduce((tot: number, cur: number) => tot * cur, 1);

const part1 = (startingPositions: number[]) => {
  let dice = 1;
  const spaces = 10;
  const positions = [...startingPositions.map((start) => start - 1)];
  const scores = [0, 0];

  const winner = false;

  let round = 3;
  console.log("starting positions", startingPositions);

  while (!winner) {
    for (let i = 0; i < positions.length; i++) {
      const diceRolls = roll(dice);
      positions[i] = (positions[i] + sum(diceRolls)) % 10;
      dice = diceRolls[diceRolls.length - 1] + 1;
      scores[i] += positions[i] + 1;

      if (scores[i] >= 1000) {
        console.log("winner", { i, positions, scores });
        return scores.sort((a, b) => a - b)[0] * round;
      }
      round += 3;
    }
  }
};

type State = {
  player: number;
  positions: number[];
  scores: number[];
  round: number;
  universes: number;
  win: number;
};

const playRound = ({ player, positions, scores, round, universes }: State) => {
  const diceRolls = [
    [3, 1],
    [4, 3],
    [5, 6],
    [6, 7],
    [7, 6],
    [8, 3],
    [9, 1],
  ];
  const results: State[] = [];

  for (const [roll, times] of diceRolls) {
    const result = {
      player,
      positions: Array.from(positions),
      scores: Array.from(scores),
      round,
      universes,
      win: -1,
    };

    result.positions[player] = (result.positions[player] + roll) % 10;
    result.scores[player] += result.positions[player] + 1;
    result.universes *= times;
    result.win = result.scores[player] >= 21 ? result.universes : -1;
    results.push(result);
  }

  return results;
};

const part2 = (startingPositions: number[]) => {
  const startingState: State = {
    player: 0,
    positions: [...startingPositions.map((start) => start - 1)],
    scores: [0, 0],
    round: 1,
    universes: 1,
    win: -1,
  };

  let states: State[] = [startingState];
  let winners = [0, 0];
  let round = 1;

  let universes = states.length;

  while (states.length > 0) {
    let roundStates = [];

    for (const state of states) {
      const newStates = playRound(state);

      universes += newStates.length;

      for (const newState of newStates) {
        if (newState.win > 0) {
          winners[newState.player] += newState.win;
        } else {
          newState.player = newState.player === 1 ? 0 : 1;
          newState.round++;
          roundStates.push(newState);
        }
      }
    }

    round++;
    states = roundStates;
  }

  return winners;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const startingPositions = parseInput(data);

  console.log("DAY 21 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(startingPositions);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  // V. slow
  console.log("p2 ----------");
  console.time("p2");
  const p2Result = part2(startingPositions);
  console.timeEnd("p2");
  console.log("p2 Result: ", p2Result);
};
