const notes = require('express').Router();
const { readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');
const fs = require('fs');

console.log("notes running");
// get notes route
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes!`);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(JSON.parse(data));
  });
});

// get notes route by id for editing
notes.get('/:id', (req, res) => {
  console.info(`${req.method} request received to get a single note`);
  const noteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);
    const note = notes.find((note) => note.note_id === noteId);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  });
});
// post new note when request received
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);

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
    res.status(400).json('Error in adding note');
  }
});
// route for deleting note by id
notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  
  const noteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.note_id !== noteId);

    fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 4), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(`Note deleted successfully 🚀`);
    });
  });
});

module.exports = notes;