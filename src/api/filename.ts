const CHAR_LIST =
  "tkeBHuETsp8XNbPfFKDrydARW70L36caiG14jh9SIYUJn2zVO5MCmovxgwZqQl".split("");

const getChars = (number: number) => {
  const count = CHAR_LIST.length;
  const result = [];
  let left = Math.floor(number / count);
  result.unshift(number % count);
  while (true) {
    if (left < count) {
      result.unshift(left);
      break;
    }
    result.unshift(left % count);
    left = Math.floor(left / count);
  }
  return result.map((nth) => CHAR_LIST[nth]).join("");
};

const encode = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  fix: number
) => {
  // 22,99 78 7   A
  // 01,12 12 4   C
  // 01,31 31 5   B
  // 00,23 24 5   B
  // 00,59 60 6   B
  // 00,59 60 6   A
  // 00,8  8  3   A

  const full = 0b0000000000000000;

  year = full | (year << (16 - 7));
  second = full | (second << (16 - 7 - 6));
  fix = full | fix;

  month = month;

  day = full | (day << (16 - 5));
  hour = full | (hour << (16 - 5 - 5));
  minute = full | (minute << (16 - 5 - 5 - 6));

  const partA = year | second | fix;
  const partB = day | hour | minute;
  const partC = month;
  return [partA, partB, partC];
};

const decode = ([partA, partB, partC]: number[]) => {
  const year = (0b1111111000000000 & partA) >> 9;
  const second = (0b0000000111111000 & partA) >> 3;
  const fix = (0b0000000000000111 & partA) >> 0;

  const day = (0b1111100000000000 & partB) >> 11;
  const hour = (0b0000011111000000 & partB) >> 6;
  const minute = (0b0000000000111111 & partB) >> 0;

  const month = partC;
};

export const genFilename = (order = 0) => {
  const now = new Date();
  let year = now.getFullYear() - 2021;
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours() + 1;
  let minute = now.getMinutes() + 1;
  let second = now.getSeconds() + 1;
  let fix = order + 1;

  // console.log(year, month, day, hour, minute, second, fix);

  const [partA, partB, partC] = encode(
    year,
    month,
    day,
    hour,
    minute,
    second,
    fix
  );
  // decode([partA, partB, partC])
  return [partB, partC, partA].map((n) => getChars(n)).join("");
};
