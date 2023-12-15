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
//adding custom validators
  const phonebookSchema = new mongoose.Schema({
    name:{
      type: String,
      minLength: 3,
      required: true
    },
    number:{
      type: String,
      required: ['Phone number required!'],
      validate: {
        validator: function(phoneNum){
          //logic of number 09-1234556 and 040-22334455
          const phoneNumberRegex = /^(?:\d{2,3}-\d{7,}|\d{2,3}\d{7,})$/;
          return phoneNumberRegex.test(phoneNum); //check the number matches the logic
        },
        message: (props)=> `${props.value} is not a valid number. Min length: 8, Format: 09-1234556 OR 040-22334455`
      }
    }
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