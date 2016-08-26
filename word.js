var dict, reader, len_map, test = false,
  two = [], three = [], four = [],
  five = [], six = [], seven = [],
  eigth = [], nine = [], ten = [],
  eleven = [], base = 'a'.charCodeAt(0),
  filterd_words;

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
  len_map[9] = nine;
  len_map[10] = ten;
  len_map[11] = eleven;
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
      if (line.length > 1 && line.length < 12) {
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

function isWordPossible(main, sub) {
  var i;
  for (i = 0; i < 26; i++) {
    if (main[i] < sub[i]) return false;
  }
  return true;
}

function isTablePossible(info, word) {
  var table = info.table, pos_map = info.pos_map,
    start_pos_arr = [], first_ch = word.charAt(0),
    start_pos, row, col, paths, path_info, new_path_info,
    i, j, k, l, ch, n, ne, e, se, s, sw, w, nw, current,
    directions, pos, tmp, sig, result = [], posible_paths = [],
    new_table, new_pos_map, new_info;

    for (i = 0; i < table.length; i++) {
      for (j = 0; j < table[i].length; j++) {
        if (table[i][j] == first_ch) start_pos_arr.push([i, j]);
      }
    }

    for (i = 0; i < start_pos_arr.length; i++) {
      start_pos = start_pos_arr[i];
      row = start_pos[0];
      col = start_pos[1];
      sig = row.toString() + ',' + col.toString();
      current = [row, col]

      path_info = new Object();
      path_info.last = current;
      path_info.paths = [current];
      path_info.visited = new Object();
      path_info.visited[sig] = true;
      path_info.str = pos_map[row][col];

      paths = [path_info];
      while (paths.length) {
        tmp = [];
        for (j = 0; j < paths.length; j++) {
          path_info = paths[j];
          current = path_info.last;
          row = current[0];
          col = current[1];
          n = [row - 1, col];
          ne = [row - 1, col + 1];
          e = [row, col + 1];
          se = [row + 1, col + 1];
          s = [row + 1, col];
          sw = [row + 1, col - 1];
          w = [row, col - 1];
          nw = [row - 1, col - 1]
          directions = [n, ne, e, se, s, sw, w, nw];
          for (k = 0; k < directions.length; k++) {
            pos = directions[k];
            row = pos[0];
            col = pos[1];
            sig = row.toString() + ',' + col.toString();
            if (path_info.visited[sig]) continue;
            if (!pos_map[row] || !pos_map[row][col]) continue;
            if (pos_map[row][col] != word.charAt(path_info.str.length)) {
              continue;
            }
            new_path_info = new Object();
            new_path_info.last = pos;
            new_path_info.paths = path_info.paths.concat([pos]);
            new_path_info.visited = new Object();
            for (l = 0; l < new_path_info.paths.length; l++) {
              sig = new_path_info.paths[l][0].toString() + ',' + new_path_info.paths[l][1].toString();
              new_path_info.visited[sig] = true;
            }
            new_path_info.str = path_info.str + pos_map[row][col];

            if (new_path_info.str == word) {
              posible_paths.push(new_path_info);
            } else {
              tmp.push(new_path_info);
            }
          }
        }
        paths = tmp;
      }
    }

    if (!posible_paths.length) return null;

    for (i = 0; i < posible_paths.length; i++) {
      path_info = posible_paths[i];
      new_pos_map = new Object();
      new_table = [];
      for (i = 0; i < table.length; i++) {
        new_table.push(table[i].concat());
      }
      // remove char in table
      for (j = 0; j < path_info.paths.length; j++) {
        pos = path_info.paths[j];
        row = pos[0];
        col = pos[1];
        new_table[row][col] = "";
      }
      // gravity
      for (j = new_table.length-1; j > 0; j--) {
        for (k = 0; k < new_table[j].length; k++) {
          if (new_table[j][k] == "") {
            tmp = new_table[j - 1][k];
            new_table[j][k] = tmp;
            new_table[j - 1][k] = "";
          }
        }
      }
      // update pos_map
      for (j = 0; j < new_table.length; j++) {
        new_pos_map[j] = new Object();
        for (k = 0; k < new_table[j].length; k++) {
          ch = new_table[j][k];
          new_pos_map[j][k] = ch;
        }
      }

      new_info = new Object();
      new_info.table = new_table;
      new_info.pos_map = new_pos_map;
      result.push(new_info);
    }

    return result;
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
  var i, j, words, word, tmp_1, tmp_2,
    new_info = new Object(), table_info = new Object(),
    new_table_info, new_table_info_arr;

  table_info.table = info.table;
  table_info.pos_map = info.pos_map;
  words = filterd_words[order[info.level]];
  if (!words) return;

  for (i = 0; i < words.length; i++) {
    word = words[i];
    tmp_1 = subtract(info.char_arr, getWordCharArray(word));
    if (!tmp_1) continue;

    new_table_info_arr = isTablePossible(table_info, word);
    if (!new_table_info_arr) continue;

    for (j = 0; j < new_table_info_arr.length; j++) {
      new_table_info = new_table_info_arr[j];
      // base case
      if (info.level == order.length - 1) {
        info.result.push(info.word_set.concat([word]));
      } else {
        new_info.char_arr = tmp_1;
        new_info.result = info.result;
        new_info.level = info.level + 1;
        new_info.table = new_table_info.table.concat();
        new_info.pos_map = new_table_info.pos_map;
        new_info.word_set = info.word_set.concat([word]);
        getResult(order, new_info);
      }
    }
  }
}

function solve(table, num_words) {
  var i, j, ch, chn, num_word, table, pos_map,
    char_arr, tmp_arr_1, tmp_arr_2,
    perm_arr, pos_words, info, result,
    result_dom, p, node;
  if (test) { // override actual data with test data
    table = [['e', 'i', 'd', 't'], ['r', 's', 'o', 'n'], ['g', 'i', 'a', 'l']];
    num_words = [5, 7]
  }

  char_arr = [];
  pos_map = new Object();
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
    if (!pos_words) continue;
    for (j = 0; j < pos_words.length; j++) {
      tmp_arr_2 = getWordCharArray(pos_words[j]);
      if (isWordPossible(char_arr, tmp_arr_2)) {
        tmp_arr_1.push(pos_words[j]);
      }
    }
    filterd_words.push(tmp_arr_1)
  }

  if (!filterd_words.length) {
    alert("Couldn't find result.");
    return;
  }

  // step 2: filter with more restrict condition
  result_dom = document.getElementById("result");
  // clear answer
  while (result_dom.firstChild) {
    result_dom.removeChild(result_dom.firstChild);
  }

  result = [];
  tmp_arr_1 = []
  for (i = 0; i < num_words.length; i++) tmp_arr_1.push(i);
  perm_arr = permutation(tmp_arr_1);
  for (i = 0; i < perm_arr.length; i++) {
    info = new Object();
    info.level = 0;
    info.result = [];
    info.word_set = [];
    info.table = table.concat();
    info.pos_map = pos_map;
    info.char_arr = char_arr.concat();
    getResult(perm_arr[i], info);
    for (i = 0; i < info.result.length; i++) {
      p = document.createElement("p");
      node = document.createTextNode(info.result[i].join(", "));
      p.appendChild(node);
      result_dom.appendChild(p);
    }
    result = result.concat(info.result);
  }

  if (!result.length) {
    alert("Couldn't find result.");
  }
}
