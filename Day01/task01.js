const readline = require("readline");
const read1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

read1.question("Please Enter Your name: ", (name) => {
  var favoriteLang = [];
  read1.question("How Many Favorite Languages Do You Have? ", (numLanguages) => {
    const numLang = parseInt(numLanguages, 10);

    function askLanguage(index) {
      if (index < numLang) {
        read1.question(`Please Enter your number ${index + 1} language: `, (fav) => {
          favoriteLang.push(fav);
          
          askLanguage(index + 1);
        });
      } else {
        read1.close();
        console.log(`Hello ${name}! Below are your Top ${favoriteLang.length} languages:`);
        let numCharacters = 0
        for (const lang in favoriteLang) {
          console.log('Your Number ' ,parseInt(lang) + 1 , ` language is: `, favoriteLang[lang]);
          numCharacters+=favoriteLang[lang].length
        }
        console.log(`Total Numbers of characters in Your Favorite Languages are ${numCharacters}`)
      }
    }
    askLanguage(0);
  });
});
