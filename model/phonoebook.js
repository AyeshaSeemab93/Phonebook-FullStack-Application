//connecting to database + all database tasks

require('dotenv').config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(result=>{
    console.log("Successfully connected to database.", url)
  })
  .catch(error=>{
    console.log("unable to connect to databse.", error.message)
  })

  const phonebookSchema = new mongoose.Schema({
    name:{
      type: String,
      minLength: 3,
      required: true
    },
    number: String
  })

  const Phonebook = mongoose.model('phonebook', phonebookSchema);


  phonebookSchema.set('toJSON',{
    transform: (document, returnedObject) =>{
      returnedObject.id = document._id.toString();
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  module.exports = Phonebook