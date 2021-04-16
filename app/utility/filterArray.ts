module.exports = function (arr: any[], indexesArr: number[]): any[] {
  const newArr: any[] = [...arr];

  for (let i: number = indexesArr.length - 1; i >= 0; i--) {
    newArr.splice(indexesArr[i], 1);
  }

  return newArr;
};
