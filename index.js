const express = require('express');
const app = express();

const phoneBook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
app.get('/', (req, res)=>{
  res.send('<h1>Welcome to home page</h1>')
})

app.get('/api/phonebook/', (req,res)=>{
  console.log('request to show all phonebook');
  res.json(phoneBook);
})
app.get('/api/phonebook/:id', (req,res)=>{
const id = Number(req.params.id)
const note = phoneBook.find(contact => contact.id === id);
if(!note){
  res.status(404).end();
}

return res.json(note)
})




//start server
const port = 3001;
app.listen(port);
console.log('server is running on ', port);
