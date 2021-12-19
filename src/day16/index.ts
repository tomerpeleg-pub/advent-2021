import getInput from "../util/getInput";
import path from "path";
import util from "util";

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

let totalVersions = 0;

type Packet = {
  typeID: number;
  version: number;
  subPackets?: Array<Packet>;
  payload?: number;
};

type Result = [Packet, string];

const parseHex = (input: string) =>
  input
    .split("")
    .map((n) => parseInt(n, 16).toString(2).padStart(4, "0"))
    .join("");

const parseInput = (input: string) => parseHex(input);

const toDec = (input: string) => parseInt("0" + input, 2);

const parseLiteralPacket = (
  input: string,
  version: number,
  typeID: number
): Result => {
  let start = 0;
  let finished = false;
  let number = "";

  while (!finished) {
    const part = input.substr(start, 5);
    if (part[0] === "0") finished = true;

    number += part.substr(1, 4);
    start += 5;
  }

  return [
    {
      version,
      typeID,
      payload: toDec(number),
    },
    input.substr(start),
  ];
};

const parseOperatorByLength = (
  input: string,
  version: number,
  typeID: number
): Result => {
  const length = toDec(input.substr(0, 15));
  let subPacketBits = input.substr(15, length);
  const subPackets = [];
  let finished = false;

  while (!finished) {
    const [subPacket, remainder] = parsePacket(subPacketBits);
    subPacketBits = remainder || "";
    if (!subPacketBits.trim()) finished = true;
    subPackets.push(subPacket);
  }

  const remainder = input.substr(15 + length);

  return [{ version, typeID, subPackets }, remainder];
};

const parseOperatorByNumSubPackets = (
  input: string,
  version: number,
  typeID: number
): Result => {
  const numSubpackets = toDec(input.substr(0, 11));
  let subPacketBits = input.substr(11);
  const subPackets = [];

  for (let i = 0; i < numSubpackets; i++) {
    const [subPacket, remainder] = parsePacket(subPacketBits);
    subPackets.push(subPacket);
    subPacketBits = remainder || "";
  }

  return [{ version, typeID, subPackets }, subPacketBits];
};

const parsePacket = (input: string): Result => {
  const version = toDec(input.substr(0, 3));
  const typeID = toDec(input.substr(3, 3));

  totalVersions += version;

  if (typeID === 4) return parseLiteralPacket(input.substr(6), version, typeID);

  const isLength = input[6] === "0";

  if (isLength) {
    return parseOperatorByLength(input.substr(7), version, typeID);
  } else {
    return parseOperatorByNumSubPackets(input.substr(7), version, typeID);
  }
};

const part1 = (input: string) => {
  parsePacket(input);
  return totalVersions;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const input = parseInput(data);

  console.log("DAY 16 ---------------");
  console.log("input", data);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(input);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
