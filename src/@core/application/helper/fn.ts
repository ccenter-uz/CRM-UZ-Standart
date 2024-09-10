// FIRSTNAME CAPITALIZER
export const firstLetterCapitalizer = (item: string | undefined) =>
  item !== undefined ? `${item[0]?.toUpperCase()}${item.slice(1)}` : "";

// LASTNAME CAPITALIZER
export const secondNameCapitalizer = (str: string) => {
  return str
    .split(` `)
    .map((item) => firstLetterCapitalizer(item))
    .filter((fil) => fil !== "undefined")
    .join(" ");
};