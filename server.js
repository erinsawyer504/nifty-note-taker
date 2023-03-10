const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const notes = require('./db/db.json');

//helper method for generating unique IDs
const uuid = require('./helpers/uuid');


const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));


// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
    console.log(content, file);
fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
    console.error(err);
    } else {
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    writeToFile(file, parsedData);
    }
});
};

// GET Route for retrieving all the tips
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

  // POST Route for a new UX/UI tip
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (req.body) {
    const newNote = {
        title,
        text,
        id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
    } else {
    res.error('Error in adding note');
    }
});

// delete notes
function deleteNote(id, parsedData) {
    console.log(parsedData);
    for (let i = 0; i< parsedData.length; i++){
        let note = parsedData[i];

        if (note.id == id) {
            parsedData.splice(i, 1);
            console.log(parsedData);


            break;
        }
    }
return parsedData;
}

const readAndDelete = (id, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
        console.error(err);
    } else {
        let parsedData = JSON.parse(data);
        parsedData = deleteNote(id, parsedData);
        writeToFile(file, parsedData);
    }
});
};


app.delete('/api/notes/:id', (req, res) => {
    readAndDelete(req.params.id, './db/db.json');
    res.json(true);
});



// GET Route for homepage
app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} ????`)
);
