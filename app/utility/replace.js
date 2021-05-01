module.exports = {
  name: 'replace',
  all(text, replaceTo = '') {
    let newText = text;
    newText = this.quotes(newText, replaceTo);
    newText = this.emojis(newText, replaceTo);
    return newText;
  },
  quotes(text, replaceTo = '') {
    return text.toString().replaceAll('`', replaceTo);
  },
  emojis(text, replaceTo = '') {
    return text.toString().replaceAll(/:(\w+):/g, replaceTo);
  },
};
