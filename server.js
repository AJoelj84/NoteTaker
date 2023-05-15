const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', api);

app.use(express.static('public'));

app.get('/', (req, res)=>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res)=>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// added get route for notes by id
app.get('/notes/:id', (req, res) => {
    const noteId = req.params.id;
  });
  

app.listen(PORT, ()=>
    console.log(`Listening at http://localhost:${PORT}`)
);