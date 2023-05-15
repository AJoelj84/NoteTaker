let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};



const getNoteById = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });













const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const saveNote = (note) => {
    if (note.id) {
      // Existing note, perform update
      return fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
    } else {
      // New note, perform creation
      return fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
    }
  };
  

  const renderActiveNote = () => {
    show(saveNoteBtn);
  
    if (activeNote.id) {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = '';
      noteText.value = '';
    }
  };
  

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  e.stopPropagation();
  const note = e.target.parentElement;
  const noteId = note.dataset.noteId;
  deleteNoteById(noteId)
    .then(() => {
      if (activeNote.id === noteId) {
        activeNote = {};
        renderActiveNote();
      }
      getAndRenderNotes();
    })
    .catch((error) => {
      console.error(error);
      // Handle error here
    });
};



const deleteNoteById = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });


// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  const note = e.target.parentElement;
  const noteId = JSON.parse(note.getAttribute('data-note')).note_id;
  getNoteById(noteId)
    .then((response) => response.json())
    .then((data) => {
      activeNote = data;
      renderActiveNote();
    })
    .catch((error) => {
      console.error(error);
      // Handle error here
    });
};


// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.innerHTML = ''; // Clear the note list container
  }

  let noteListItems = [];

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.noteId = note.note_id; // Use 'note_id' instead of 'id'

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList.append(note));
  }
};


  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true, noteId) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    liEl.dataset.noteId = noteId; // Set the note ID as a dataset attribute

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title, true, note.note_id);
    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note)); // Append note items to the list
  }


// Rest of the code...


// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
