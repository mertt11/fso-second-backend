const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

morgan.token("req-body", (req) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Maryy Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const currentTime = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> <br/> ${currentTime} (Eastern European Standart Time)`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const max = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return max + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const check = persons.some((p) => p.name === body.name);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "num or name missing",
    });
  }
  if (check) {
    return response.status(400).json({
      error: "name already exists",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
