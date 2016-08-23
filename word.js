var dict, reader, len_map, pos_map, test = true,
  two = [], three = [], four = [],
  five = [], six = [], seven = [],
  eigth = [], base = 'a'.charCodeAt(0),
  table, filterd_words;

window.addEventListener("DOMContentLoaded", init);

function init() {
  dict = new Object();
  pos_map = new Object();
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
  for (i = 0; i < 26; i++) char_arr.push(0);
  for (i = 0; i < word.length; i++) {
    chn = word.charCodeAt(i) - base;
    char_arr[chn]++;
  }
  return char_arr;
}

function isPossible(main, sub) {
  var i;
  for (i = 0; i < 26; i++) {
    if (main[i] < sub[i]) return false;
  }
  return true;
}

function permutation(arr, used, result) {
  var i, sub;
  if (!used) used = [];
  if (!result) result = [];
  for (i = 0; i < arr.length; i++) {
    sub = arr.splice(i, 1)[0];
    used.push(sub);
    if (!arr.length) result.push(used.concat());
    permutation(arr, used, result);
    arr.splice(i, 0, sub);
    used.pop();
  }
  return result;
}

function subtract(main, sub) {
  var i, result = [];
  for (i = 0; i < 26; i++) {
    if (main[i] < sub[i]) return null;
    result[i] = main[i] - sub[i];
  }
  return result;
}

function getResult(order, info) {
  var i, words, word, tmp_1, tmp_2,
    new_info = new Object();
  words = filterd_words[info.level];
  for (i = 0; i < words.length; i++) {
    word = words[i];
    tmp_1 = subtract(info.char_arr, getWordCharArray(word));
    if (!tmp_1) return;

    // add more condition here

    // base case
    if (info.level == order.length - 1) {
      info.result.push(info.word_set);
    } else {
      new_info.char_arr = tmp_1;
      new_info.result = info.result;
      new_info.level = info.level + 1;
      new_info.word_set = info.word_set.concat([word]);
      getResult(order, new_info);
    }
  }
}

function solve(table, num_words) {
  var i, j, ch, chn, num_word,
    char_arr, tmp_arr_1, tmp_arr_2,
    perm_arr, pos_words, info, result;
  if (test) { // override actual data with test data
    table = [['e', 'i', 'd', 't'], ['r', 's', 'o', 'n'], ['g', 'i', 'a', 'l']];
    num_words = [5, 7]
  }

  this.table = table;

  char_arr = [];
  for (i = 0; i < 26; i++) char_arr.push(0);
  for (i = 0; i < table.length; i++) {
    pos_map[i] = new Object();
    for (j = 0; j < table[i].length; j++) {
      ch = table[i][j];
      pos_map[i][j] = ch;
      chn = ch.charCodeAt(0) - base;
      char_arr[chn]++;
    }
  }

  // step 1: filter all possible word
  filterd_words = [];
  for (i = 0; i < num_words.length; i++) {
    tmp_arr_1 = [];
    num_word = num_words[i];
    pos_words = len_map[num_word];
    for (j = 0; j < pos_words.length; j++) {
      tmp_arr_2 = getWordCharArray(pos_words[j]);
      if (isPossible(char_arr, tmp_arr_2)) {
        tmp_arr_1.push(pos_words[j]);
      }
    }
    filterd_words.push(tmp_arr_1)
  }

  // step 2: filter with more restrict condition
  result = [];
  tmp_arr_1 = []
  for (i = 0; i < num_words.length; i++) tmp_arr_1.push(i);
  perm_arr = permutation(tmp_arr_1);
  for (i = 0; i < perm_arr.length; i++) {
    info = new Object();
    info.level = 0;
    info.result = [];
    info.word_set = [];
    info.table = table;
    info.pos_map = pos_map;
    info.char_arr = char_arr.concat();
    result = result.concat(getResult(perm_arr[i], info));
  }
}
