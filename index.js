const express = require("express"),
bodyParser = require("body-parser"),
uuid = require("uuid");

const app = express;
app.use(bodyParser.json());


let student = [
    {
        id: 1,
        name: 'Jessica Drake',
        classes: {
          biology: 95,
          algebra: 92
        }
      },
      {
        id: 2,
        name: 'Ben Cohen',
        classes: {
          biology: 95,
          algebra: 92
        }
      },
      {
        id: 3,
        name: 'Lisa Downing',
        classes: {
          biology: 95,
          algebra: 92
        }
      }
];


/// MOVIE Task
// READ
app.get("/movies", (req,res) => {

})



app.listen(8080, () => {
    console.log("Your app is listening on port 8080"); 
});






