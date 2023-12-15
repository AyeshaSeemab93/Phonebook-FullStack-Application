//putting data into links/in place of http
const express = require('express');
const app = express();
 const morgan = require('morgan')
const cors = require('cors')

const mongoose = require('mongoose')//communication with mongoDB database
require('dotenv').config(); //use .env variable
//data rec in put/post req is in json.this part convert json string to JS object
app.use(express.json());
app.use(cors()); //to connect differnet ports of front and backend
//to show static content in frontend files(index.html)
app.use(express.static('dist'));
const Phonebook =require('./model/phonoebook');

//middlewares
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

const unknownEndpoint = (req, res)=>{
  res.status(400).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}



let persons = [
  // { 
  //   "id": 1,
  //   "name": "Arto Hellas", 
  //   "number": "040-123456"
  // }
]

app.get('/api/persons/', (req,res)=>{
  console.log('request to show all phonebook');
  Phonebook.find({})
  .then(entries=>{
    res.json(entries);
  })
  .catch(error=>{
    console.log("Could not fetch data from database")
    res.status(500).send({eror: 'internal server error'});
  })
})

app.get('/api/persons/:id', (req,res, next)=>{
  Phonebook.findById(req.params.id)
    .then(person=>{
      if(person){
        console.log("person found in database")
      res.json(person)
      }else{
        res.status(404).end()
      } 
    })
    .catch(error=> next(error))
})


app.get('/info',async (req, res, next)=>{
  console.log('In Info Page')
  const requestTime = new Date().toString();
  const NumOfEntries = await Phonebook.countDocuments();
    res.send(`
        <p>Phonebook has info for ${NumOfEntries} people.</p>
        <p>${requestTime}</p>
    `);
})

app.delete('/api/persons/:id', (req, res)=>{
  const id = req.params.id;
  Phonebook.findByIdAndDelete(id)
          .then(deletedEntry=> res.status(204).end())
          .catch(error => next(error))
})

//test by using postman or post_person.rest
app.post('/api/persons',(req, res, next)=>{
  const body = req.body;
  console.log(body)
  //remove bec we have added these directly in schema
  // if(!body.name){
  //   return res.status(400).json({error: 'Name is missing'})
  // }
  const person = new Phonebook({
      name: body.name,
      number: body.number
    })
    console.log(person);
  person.save()
        .then(savedPerson =>{
          console.log(`${savedPerson.name} has been saved successfully in database`)
          res.json(savedPerson)
        })
        .catch(error=>{
          next(error)
          // console.log("could not save in database", error.message);
          // res.status(500).json({ error: 'Internal Server Error' });
        })
})

app.put('/api/persons/:id', (req, res, next)=>{
  console.log('req to udate the phone number in database');
  const body = req.body;
  const UpdatedEntry = {
    name: body.name,
    number: body.number
  }
  Phonebook
      .findByIdAndUpdate(req.params.id,UpdatedEntry, 
        {new: true, runValidators: true, context: 'query'} )
      .then(dbUpdatedEntry=> {
        console.log('updated in database')
        res.json(dbUpdatedEntry)})
      .catch(error=>next(error))
})


app.use(unknownEndpoint);
app.use(errorHandler);
//start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
});

