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
const unknownEndpoint = (req, res)=>{
  res.status(400).send({error: 'unknown endpoint'})
}

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
  // { 
  //   "id": 1,
  //   "name": "Arto Hellas", 
  //   "number": "040-123456"
  // }
]

// function AddNumbers(name, number){
//   const entry = new Phonebook({
//     name,
//     number
//   })
//   entry.save()
//     .then(result=>{
//       console.log(`${result.name} with number ${result.number} has been saved in database`)
//       res.json(result)
//     })
//     .catch(error=>{
//       console.log("Could not save phoneNumber");
//       console.log(error.message);
//     } )
// }
// const promiseArray = persons.map(person => AddNumbers(person.name, person.number))
// Promise.all(promiseArray)
// .then(()=>{
//   console.log("All numbers saved");
// })



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

app.get('/api/persons/:id', (req,res)=>{
const id = Number(req.params.id);
Phonebook.findById(id)
  .then(person=>{
    console.log('person found', person)
    res.json(person)
  })
  .catch(error=>{
  console.log("Could not find the person",error.message)
  })

})

app.get('/info',async (req, res)=>{
  console.log('In Info Page')
  const requestTime = new Date().toString();
  const NumOfEntries = await Phonebook.countDocuments();
    res.send(`
        <p>Phonebook has info for ${NumOfEntries} people.</p>
        <p>${requestTime}</p>
    `);
})

app.delete('/api/persons/:id', (req, res)=>{
  const id = Number(req.params.id)
  persons = persons.filter(person=> person.id !== id)
  res.status(204).end()
})


//test by using postman or post_person.rest
app.post('/api/persons',async (req, res)=>{
const body = req.body;
console.log(body)
if(!body.name){
  return res.status(400).json({error: 'Name is missing'})
}
//WILL DO LATER IN COURSE
//  const duplicatedName =await Phonebook.findOne({name: body.name})

// if(duplicatedName){
//     return res.status(404).json({error: 'Name must be unique'})
//   }
  const person = new Phonebook({
    name: body.name,
    number: body.number
  })
  await person.save()
      .then(savedPerson =>{
        console.log(`${savedPerson.name} has been saved successfully in database`)
        res.json(savedPerson)
      })
      .catch(error=>{
        console.log("could not save in database", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      })
})

app.use(unknownEndpoint);
//start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
});

