import { read } from "fs"
import * as readline from "readline"

const read1 = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

read1.question("Please Enter Phrase or Sentence:\n",(inputSentence:String) => {
    

    function removePunctuation(text: string): string {
        // Use a regular expression to remove punctuation marks
        return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      }

    
    const words = inputSentence.split(/\s+/)

    

    // count 
    const wordCount:Record<string,number> = {}
    for (const word of words) {
        const normalizedWord = word.toLowerCase() 
        // wordCount[word] = (wordCount[word] || 0) + 1
        wordCount[normalizedWord] = (wordCount[normalizedWord] || 0) + 1
    }
    for (const [word,count] of Object.entries(wordCount)) {
        console.log(`${word} ${count}`)
    }
    read1.close()
})




