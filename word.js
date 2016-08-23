var dict, reader,
  two = [], three = [], four = [],
  five = [], six = [], seven = [];

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
        case 7:
          seven.push(line);
      }
    })
  }
}

function solve(table, num_words) {

}
