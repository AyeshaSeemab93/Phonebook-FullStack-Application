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


//start server
const port = 3000;
app.listen(port);
console.log('server is running on ', port);
