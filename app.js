
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const sessions = require('./sessionholder/sessions.js');
// Set the view engine to ejs
app.set('view engine', 'ejs');

// Parse JSON data in the request body
app.use(bodyParser.json());


// Serve static files from the public directory
app.use(express.static('public'));

// Listen for incoming socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for incoming messages from the client
    socket.on('message', (msg) => {
        console.log('Received message:', msg);
    });

    // Listen for disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


const fs = require('fs');


function isUnique(word, words) {
    for (let i = 0; i < words.length; i++) {
        if (word === words[i]['infinitive'] )  {
            return false;
        }
    }
    return true;
}



function generateWordsToLearn() {
    let data =   JSON.parse(fs.readFileSync('data.json'));
    let words = [];
    let i = 0;
    while (i < 15) {
        let rand = Math.floor(Math.random() * Object.keys(data).length);
        while (!isUnique(data[rand]['infinitive'], words)) {
            rand = Math.floor(Math.random() * Object.keys(data).length);
        }
        if (rand != 0) {
            let temp = { ...data[rand] }
            let rand2 = Math.floor(Math.random() * 3);
            if (rand2 == 0) {
                temp["past"] = "";
                temp["past participle"] = "";
            } else if (rand2 == 1) {
                temp["past participle"] = "";
                temp["infinitive"] = "";
            } else {
                temp["infinitive"] = "";
                temp["past"] = "";
            }
            words.push(temp);
            i++;
        }
        
    }
            return words;
}

// console.log(generateWordsToLearn());

// Respond with an ejs page on GET /
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

app.use(session({
    secret: '249tuhgjniorvw123uh9',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    })
}));

app.get('/', (req, res) => {
    let words;
    if(sessions.getSession(req.sessionID) == undefined) {
        words = generateWordsToLearn();
        sessions.createSession(req.sessionID, words);
    } else {
        words = sessions.getSession(req.sessionID).words;
    }
    res.render('index', { words: words });
});

function findWords(words) {
    let data = JSON.parse(fs.readFileSync('data.json'));
    let matchingWords = null;
        for (let j = 0; j <= (Object.keys(data).length-2); j++) {
            let word = data[j];
            if (word["infinitive"].toLowerCase() === words['infinitive'].toLowerCase() || word["past"].toLowerCase() === words["past"].toLowerCase() || word["past participle"].toLowerCase() === words["past participle"].toLowerCase()) {
                matchingWords = word
            }
        }
    
    return matchingWords;
}

function checkValidity(wordsFromUser, wordsFromData) {
    let validty = { "infinitive": false, "past": false, "past participle": false };
    if (wordsFromUser["infinitive"].toLowerCase() === wordsFromData["infinitive"].toLowerCase()) {
        validty["infinitive"] = true;
    }
    if (wordsFromUser["past"].toLowerCase() === wordsFromData["past"].toLowerCase()) {
        validty["past"] = true;
    }
    if (wordsFromUser["past participle"].toLowerCase() === wordsFromData["past participle"].toLowerCase()) {
        validty["past participle"] = true;
    }
    return validty;
}

app.post('/api/words', (req, res) => {
    let words = findWords(req.body);
    let validity = checkValidity(req.body, words);
    res.json({ validity: validity });

});


app.get("/api/reroll", (req, res) => {
    let words = generateWordsToLearn();
    sessions.updateSession(req.sessionID, words);
    res.send(true)
});

// Start the server
http.listen(3000, () => {
    console.log('Server listening on port 3000');
});
