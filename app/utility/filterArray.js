var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
module.exports = function (arr, indexesArr) {
    var newArr = __spreadArray([], arr);
    for (var i = indexesArr.length - 1; i >= 0; i--) {
        newArr.splice(indexesArr[i], 1);
    }
    return newArr;
};
