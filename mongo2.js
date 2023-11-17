// code for storing single note to db...mongo.js
//code for storing multiple notes to db ...mongo2.js
//code for fetching data from db ...mongo3.js
const { mongoose } = require('mongoose');

// Asking for password
if (process.argv.length < 3) {
  console.log('Give password as argument');
  process.exit();
}

const password = process.argv[2];
const url = `mongodb+srv://Ayesha:${password}@cluster0.ekh6jf2.mongodb.net/NotesApplication?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);

// Connect Mongoose library (local) to MongoDB
mongoose.connect(url);

const notesSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', notesSchema);

const notesArray = [
  { content: 'HTML is easy', important: false },
  { content: 'Its a fullstrack course', important: false },
  { content: 'Helsinki Business College', important: false },
  { content: 'Koodauskoulutus', important: false },
];

 //create and save each note
function addNote(content, important) {
  const note = new Note({
    content,
    important,
  });

  return note.save().then(result => {
    console.log('Note saved:', result);
  });
}

// Using Promise.all to wait for all notes to be saved before closing the connection
const promiseArray = notesArray.map(note => addNote(note.content, note.important));
Promise.all(promiseArray)
  .then(() => {
    console.log('All notes saved successfully');
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error saving notes:', error);
    mongoose.connection.close();
  });
