var dict, reader, i, j, test = true,
  two = [], three = [], four = [],
  five = [], six = [], seven = [], eigth = [];

window.addEventListener("DOMContentLoaded", init);

function init() {
  dict = new Object();
  reader = new XMLHttpRequest();
  loadDictionary();
}

function loadDictionary() {
  reader.open("GET", "dict.txt");
  reader.onreadystatechange = loadDictionaryCompleteHandler;
  reader.send(null);
}

function loadDictionaryCompleteHandler() {
  if (reader.readyState == 4) {
    var line, lines
    lines = reader.responseText.split(/[\n\r]/g);
    lines.forEach(function(line) {
      line = line.toLowerCase();
      dict[line] = true;
      switch (line.length) {
        case 2:
          two.push(line);
          break;
        case 3:
          three.push(line);
          break;
        case 4:
          four.push(line);
          break;
        case 5:
          five.push(line);
          break;
        case 6:
          six.push(line);
          break;
        case 7:
          seven.push(line);
          break;
        case 8:
          eigth.push(line);
          break;
      }
    })
  }
}

function solve(table, num_words) {
  var row, base;
  if (test) { // override actual data with test data
    table = [['e', 'i', 'd', 't'], ['r', 's', 'o', 'n'], ['g', 'i', 'a', 'l']];
    num_words = [5, 7]
  }
  base = 'a'.charCodeAt(0);
  char_table = [];
  for (i = 0; i < 26; i++) {
    char_table.push(0);
  }
  for (i = 0; i < table.length; i++) {
    for (j = 0; j < table[i].length; j++) {
      c = table[i][j];
      c = c.charCodeAt(0) - base;
      char_table[c]++;
    }
  }
}
