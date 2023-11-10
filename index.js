const express = require('express');
const app = express();
const morgan = require('morgan')

app.use(express.json());

//app.use(morgan("combined"));

//app.use(morgan(':date[iso] :method :url :http-version :user-agent :status (:response-time ms)'));

app.use(morgan((tokens, req, res)=> {
  //conver the body boject to string first
  const requestBody = JSON.stringify(req.body)
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    requestBody,
  ].join(' ')
}));

let persons = [
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

//middleware function
// const requestLogger = (request, response, next)=>{
//   console.log('Method', request.method),
//   console.log('Path', request.path),
//   console.log('Body', request.body),
//   console.log('-------'),
//   next()
// }
// app.use(requestLogger);




app.get('/', (req, res)=>{
  res.send('<h1>Welcome to home page</h1>')
})

app.get('/api/persons/', (req,res)=>{
  console.log('request to show all phonebook');
  res.json(persons);
})
app.get('/api/persons/:id', (req,res)=>{
const id = Number(req.params.id)
const note = persons.find(contact => contact.id === id);
if(!note){
   return res.status(404).end();
}

return res.json(note)
})

app.get('/info',(req, res)=>{
  console.log('here in info')
  const requestTime = new Date().toString();
    res.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${requestTime}</p>
    `);
})

app.delete('/api/persons/:id', (req, res)=>{
  const id = Number(req.params.id)
  persons = persons.filter(person=> person.id !== id)
  res.status(204).end()
})
const generateId = ()=>{
  const newId = Math.floor(Math.random()*1000);
  console.log(newId)
  return newId
}

app.post('/api/persons', (req, res)=>{
const body = req.body;
console.log(body)
if(!body.name){
  return res.status(400).json({error: 'name is missing'})
}
if(!body.number){
  return res.status(400).json({error: 'number is missing'})
}

const duplicatedName = persons.find(person=>person.name ===body.name)
if(duplicatedName){
    return res.status(404).json({error: 'name must be unique'})
}
else{

const person = {
  id: generateId(),
  name: body.name,
  number: body.number
} 
  persons.concat(person)
  res.json(person)
}
})


//start server
const port = 3001;
app.listen(port);
console.log('server is running on ', port);
