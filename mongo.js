require('dotenv').config();
const mongoose = require("mongoose");

if(process.argv.length <3 || process.argv.length > 5){
  console.log("write 'node fileName name number' in the command line");
  process.exit();
}
const storedPassword = process.env.PASSWORD;
const password = process.argv[2];
if(password !== storedPassword){
console.log("Wrong password");
process.exit();
}

const url = `mongodb+srv://Ayesha:${password}@cluster0.ekh6jf2.mongodb.net/PhoneNumberBook?retryWrites=true&w=majority`
//connect to database
mongoose.set('strictQuery', false)
mongoose.connect(url)

//create scheme
const phoneBookSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String
})
//create model
const PhonebookEntry = mongoose.model('PhonebookEntry', phoneBookSchema)


//check if only giving file name and password? then retieve data from database
if(process.argv.length === 3){
  PhonebookEntry.find({})
    .then(resultArray=>{
      console.log("Phonebook: ")
      resultArray.forEach(entry=>console.log(`${entry.name} ${entry.phoneNumber}`))
      // resultArray.forEach(entry=>console.log(entry))
          mongoose.connection.close();
    })
    .catch(error=>{
      console.error("Error retrieving phonebook", error)
      mongoose.connection.close();

    })
}
else
{

  // Replace ""(REPRESENTED BY /-/g) with spaces(' ') in the name
  const name = process.argv[3].replace(/-/g, ' '); 
  const number = process.argv[process.argv.length - 1];

  //create data
  const entry = new PhonebookEntry({
    name: name,
    phoneNumber: number

  })
  //save to database and close connection
  entry.save()
      .then(result=>{
        console.log(`added ${name} number ${number} to phonebook`);
        
        mongoose.connection.close();
      })
      .catch(error=>{
        console.log("Could not save phoneNumber");
        console.log(error.message);
        mongoose.connection.close();
      } )

  }
//in terminal write:   node mongo.js password Heljä 12345-543
