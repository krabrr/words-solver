var dict, reader, len_map, test = true,
  two = [], three = [], four = [],
  five = [], six = [], seven = [],
  eigth = [], base = 'a'.charCodeAt(0);

window.addEventListener("DOMContentLoaded", init);

function init() {
  dict = new Object();
  len_map = new Object();
  len_map[2] = two;
  len_map[3] = three;
  len_map[4] = four;
  len_map[5] = five;
  len_map[6] = six;
  len_map[7] = seven;
  len_map[8] = eigth;
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
      if (line.length > 1 && line.length < 9) {
        len_map[line.length].push(line);
      }
    })
  }
}

function getWordCharArray(word) {
  var i, chn, char_arr = [];
  for (i = 0; i < 26; i++) {
    char_arr.push(0);
  }
  for (i = 0; i < word.length; i++) {
    chn = word.charCodeAt(i) - base;
    char_arr[chn]++;
  }
  return char_arr;
}

function isPossibleLevel1(main, sub) {
  var i;
  for (i = 0; i < 26; i++) {
    if (main[i] < sub[i]) {
      return false;
    }
  }
  return true;
}

function permutation(arr, used, result) {
  var i, sub;
  if (!used) {
    used = [];
  }
  if (!result) {
    result = [];
  }
  for (i = 0; i < arr.length; i++) {
    sub = arr.splice(i, 1)[0];
    used.push(sub);
    if (!arr.length) {
      result.push(used.concat());
    }
    permutation(arr, used, result);
    arr.splice(i, 0, sub);
    used.pop();
  }
  return result;
}

function solve(table, num_words) {
  var i, j, ch, chn, row, char_arr,
    num_word, tmp_arr, result,
    pos_words, filterd_pos_words;
  if (test) { // override actual data with test data
    table = [['e', 'i', 'd', 't'], ['r', 's', 'o', 'n'], ['g', 'i', 'a', 'l']];
    num_words = [5, 7]
  }
  char_arr = [];
  for (i = 0; i < 26; i++) {
    char_arr.push(0);
  }
  for (i = 0; i < table.length; i++) {
    for (j = 0; j < table[i].length; j++) {
      ch = table[i][j];
      chn = ch.charCodeAt(0) - base;
      char_arr[chn]++;
    }
  }

  // step 1: filter all possible word
  result = [];
  for (i = 0; i < num_words.length; i++) {
    filterd_pos_words = [];
    num_word = num_words[i];
    pos_words = len_map[num_word];
    for (j = 0; j < pos_words.length; j++) {
      tmp_arr = getWordCharArray(pos_words[j]);
      if (isPossibleLevel1(char_arr, tmp_arr)) {
        filterd_pos_words.push(pos_words[j]);
      }
    }
    result.push(filterd_pos_words)
  }
}
