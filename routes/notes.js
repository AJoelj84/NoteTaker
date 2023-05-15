const notes = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');

const uuid = require('../helpers/uuid');

console.log("notes running");
notes.get('/', (req, res) => {
console.info(`${req.method} request received for notes!`);
readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a tip`);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully 🚀`);
    } else {
      res.error('Error in adding note');
    }
  });


  notes.get('/:id', (req, res) => {
    console.info(`${req.method} request received for a single note`);
    const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => {
        const notes = JSON.parse(data);
        const note = notes.find((note) => note.note_id === noteId);
        if (note) {
          res.json(note);
        } else {
          res.status(404).json({ message: 'Note not found' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  






  notes.delete('/:id', (req, res) => {
    console.info(`${req.method} request received to delete a note`);
    const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => {
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.note_id !== noteId);
        writeToFile('./db/db.json', notes);
        res.json('Note deleted successfully');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  

  
module.exports = notes;
