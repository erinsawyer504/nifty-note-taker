const express = require('express');
const fs = require('fs');
const path = require('path');
const { readFromFile, readAndAppend } = require('./Develop/helpers/fsUtils');
const { notes } = require('./Develop/db/db.json');

const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// function createNote (body, notesAdd) {
//     const note = body; 
//     notesAdd.push(note); 

//     // path to write file 
//     fs.writeFileSync(
//         path.join(__dirname, './Develop/db/db.json'),
//         JSON.stringify({ notes : notesAdd }, null, 2)
//     );
//     return note; 
// };

app.get('/notes', (req, res) => {
    // res.json(notes); 
    readFromFile('./Develop/db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/notes', (req, res) => {
    console.log(req.body);

    const  { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
        };

        readAndAppend(newNote, './Develop/db/db.json');
        res.json('Note successfully added');
    } else {
        res.errored('Error in adding note');
    }
})

// app.post('/notes', (req, res) => {
//     req.body.id = notes.length.toString(); 
//     const note = createNote(req.body, notes); 

//     res.json(note);
//     }
// );


// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
