module.exports = (arr, indexesArr) => {
  const newArr = [...arr];

  for (let i = indexesArr.length - 1; i >= 0; i -= 1) {
    newArr.splice(indexesArr[i], 1);
  }

  return newArr;
};
