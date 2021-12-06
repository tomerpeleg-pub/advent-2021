import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Cell = {
  num: number;
  played: boolean;
};

type Board = Array<Array<Cell>>;

interface Result {
  board: Board;
  win: Boolean;
}

const parseInput = (input: string = "") => {
  const lines = input.split("\n");

  if (!lines || !lines.length) throw new Error("Invalid input, no numbers");

  const draws = (lines.shift() || "")
    .split(",")
    .map((n: string) => parseInt(n));

  if (lines[0]?.trim() === "") lines.shift(); // remove extra \n

  const boards = [];
  let curBoard: Array<Array<number>> = [];

  for (let i in lines) {
    const line = lines[i].trim();
    if (!line) {
      boards.push(curBoard);
      curBoard = [];
      continue;
    }

    curBoard.push(line.split(/\s+/g).map((n) => parseInt(n)));
  }

  return { boards, draws };
};

const updateBoard =
  (draw: number) =>
  (board: Board): Result => {
    for (let i in board) {
      for (let j in board[i]) {
        if (board[i][j].num === draw) {
          board[i][j].played = true;

          const winRow =
            board[i].filter((cell) => cell.played).length === board[i].length;
          const winCol =
            board.filter((row) => row[j].played).length === board.length;

          if (winRow || winCol) {
            return { board, win: true };
          } else {
            return { board, win: false };
          }
        }
      }
    }
    return { board, win: false };
  };

const sumUnmarked = (board: Board) =>
  board.reduce(
    (sum, row) =>
      sum +
      row
        .filter((cell) => !cell.played)
        .reduce((tot, cell) => tot + cell.num, 0),
    0
  );

export const part1 = (
  boards: Array<Array<Array<number>>>,
  draws: Array<number>
): Number => {
  let playBoards: any = boards.map((board) =>
    board.map((row) => row.map((n) => ({ played: false, num: n })))
  );

  for (const draw of draws) {
    const results: Array<Result> = playBoards.map(updateBoard(draw));

    for (const result of results) {
      if (result.win) {
        const sum = sumUnmarked(result.board);
        return sum * draw;
      }
    }

    playBoards = results.map((res: Result) => res.board);
  }

  return 0;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const { boards, draws } = parseInput(data);

  console.log("DAY 4 ---------------");
  const p1Result = part1(boards, draws);
  console.log("P1 Result: ", p1Result);
};
