"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var read1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
read1.question("Please Enter Phrase or Sentence:\n", function (inputSentence) {
    var words = inputSentence.split(/\s+/);
    // count 
    var wordCount = {};
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        var normalizedWord = word.toLowerCase();
        // wordCount[word] = (wordCount[word] || 0) + 1
        wordCount[normalizedWord] = (wordCount[normalizedWord] || 0) + 1;
    }
    for (var _a = 0, _b = Object.entries(wordCount); _a < _b.length; _a++) {
        var _c = _b[_a], word = _c[0], count = _c[1];
        console.log("".concat(word, " ").concat(count));
    }
    read1.close();
});
