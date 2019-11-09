const express = require("express");
const morgan = require("morgan");

const app = express();

// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan("dev"));

//This is the final request handlers
app.get("/", (req, res) => {
  res.send("Hello Express!!");
});

app.get("/pizza", (req, res) => {
  res.send("This is the pizza page");
});

app.get("/pizza/pepperoni", (req, res) => {
  res.send("Your pizza is on the way!");
});

app.get("/burgers", (req, res) => {
  res.send("We have juicy cheese burgers!");
});

app.get("/echo", (req, res) => {
  const responseText = `Here are some details of your request:
  Base URL: ${req.baseUrl}
  Host: ${req.hostname}
  Path: ${req.path}
`;
  res.send(responseText);
});

app.get("/queryViewer", (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get("/greetings", (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if (!name) {
    //3. name was not provided
    return res.status(400).send("Please provide a name");
  }

  if (!race) {
    //3. race was not provided
    return res.status(400).send("Please provide a race");
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response
  res.send(greeting);
});

// Assignment

// Question 1

app.get("/sum", (req, res) => {
  // Get the 2 query params
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  const c = a + b;
  let stringFormat = `The sum of a and b is ${c}`;
  res.send(stringFormat);
});

// Question 2

app.get("/cipher", (req, res) => {
  const text = req.query.text;
  const shift = req.query.shift;

  // validation: both values are required, shift must be a number
  if (!text) {
    return res.status(400).send("text is required");
  }

  if (!shift) {
    return res.status(400).send("shift is required");
  }

  const numShift = parseFloat(shift);

  if (Number.isNaN(numShift)) {
    return res.status(400).send("shift must be a number");
  }

  const base = "A".charCodeAt(0); // get char code
  const max = "Z".charCodeAt(0);

  const caesarEncrypt = text
    .toUpperCase()
    .split("")
    .map(char => {
      // map each original char to a converted char
      const code = char.charCodeAt(0); //get the char code

      // if it is not one of the 26 letters ignore it
      if (code < base || code > max) {
        return char;
      }

      // otherwise convert it
      // get the distance from A
      let diff = code - base;
      diff = diff + numShift;

      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26;

      // convert back to a character
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join(""); // construct a String from the array

  // Return the response
  res.status(200).send(caesarEncrypt);
});

// Question 3
app.get("/lotto", (req, res) => {
  const userArr = req.query.arr;

  // query validation
  if (userArr.length > 6) {
    return res.status(400).send("Array can only have 6 numbers");
  }

  for (i = 0; i < userArr.length; i++) {
    if (userArr[i] > 20 || userArr[i] < 1) {
      return res
        .status(400)
        .send("numbers should be between 1 and 20 inclusive");
    }
  }

  const uniqueArr = new Set(userArr);
  if (uniqueArr.has(uniqueArr.length) !== false) {
    return res.status(400).send("Array can only can only have unique numbers");
  }

  // function to get a random number between 1 and 20

  const getNewArr = () => {
    let randomArray = [];
    for (i = 0; i <= 6; i++) {
      let randomNumber = Math.floor(Math.random(1) * Math.floor(20));
      if (randomArray.includes(randomNumber) !== true) {
        randomArray.push(randomNumber);
      }
    }
    return randomArray;
  };

  // compare the two arrays
  const generatedArray = getNewArr();
  console.log(generatedArray);

  const compareArrays = () => {
    let matchedNum = [];
    for (i = 0; i < userArr.length; i++) {
      if (generatedArray.includes(userArr[i]) === true) {
        matchedNum.push(userArr[i]);
      }
      return matchedNum;
    }
  };
  const finalArr = compareArrays();

  // Responses
  if (finalArr.length < 4) {
    res.send("Sorry, you lose");
  }

  if (finalArr.length === 4) {
    res.send("Congratulations, you win a free ticket");
  }

  if (finalArr.length === 5) {
    res.send("Congratulations! You win $100!");
  }

  if (finalArr.length === 6) {
    res.send("Wow! Unbelievable! You could have won the mega millions!");
  }
});

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});
