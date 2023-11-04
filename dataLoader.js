const fs = require("fs")
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
let data =   JSON.parse(fs.readFileSync('data.json'));

function getBiggestNumFromData() {
    return  Object.keys(data).length-1;
}


let wantInput = true;
let i = getBiggestNumFromData();
console.log(i);
function askFor() {
    let temp = { ...data["schema"] }
    readline.question('Infinitive word: ', infinitive => {
        
        temp["infinitive"] = infinitive;
        console.log(temp);
  
        readline.question('past word: ', past => {
            temp["past"] = past;
            console.log(temp);

            readline.question('past participle word: ', pastparticiple => {
                temp["past participle"] = pastparticiple;
                console.log(temp);
                
                data[i] = temp;
                fs.writeFile('data.json', JSON.stringify(data), function (err) {
                    if (err) throw err;
                    console.log('\nSaved!');
                    i = getBiggestNumFromData();
                  askFor();
                  });
                  
              });
          });
      });   
}
askFor();
    

