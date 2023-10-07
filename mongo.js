const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const personName = process.argv[3];
const personNumber = process.argv[4];

const url = `mongodb+srv://fso98:${password}@clustermert.fcx0hqs.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: `${personName}`,
  number: `${personNumber}`,
});

if (personName === undefined && personNumber === undefined) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((prson) => {
      console.log(`${prson.name} ${prson.number}`);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then(() => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });
}
