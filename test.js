const express = require("express"),
bodyParser = ("body-parser"),
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

        // get single student
    app.get("/students", (req,res) => {
        res.json(student);
    })
        // get student name
    app.get("/students/:name", (req, res) => {
        res.json(students.find((student) =>
        {return student.name === req.params.name }));
});

        // adds data fro a new student to our list of students
    app.post("/students", (req, res) => {
        let newStudent = req.body;

        if(!newStudent.name) {
            const message ="Missing name is request body";
            res.status(400).send(newStudent);
        } else {
            newStudent.id = uuid.v4();
            student.push(newStudent);
            res.status(201).send(newStudent);
        }
});

    // delete a student from our list
    app.delete("/students/:id", (req, res) => {
        let student = student.find((student) => {
            return student.id === req.params.id 
        });
  
    if(student) {
        students = students.filter((obj) => {
            return obj.id !== req.params.id 
        });
        res.status(201).send("Student " + req.params.id + " was deleted.");
    }
});  

    // update the "grade" of a student by student name/class name
    app.put("/students/:name/:class/:grade", (req, res) => {
        let student = students.find((student) => {return student.name === req.params.name
    });

    if (student) {
        student.classes[req.params.class] = parseInt(req.rarams.grade);
        res.status(201).send("Student " + req.params.name + 
        " was assigned a grade of " + req.params.grade + " in " + req.params.class);
    } else {
         res.status(404).send("Student with the name " + req.params.name + " was not found.");
    }
});
        // gets the GPA of a student
    app.get("/students/:name/gpa", (req, res) => {
    let student = students.find((student) => {
        return student.name === req.params.name
    });
    if(student){
        let classesGrades = Object.values(student.classes);
        let sumOfGrades = 0;
        classesGrades.forEach(grade => {
            sumOfGrades = sumOfGrades + grade;
        });

        let gpa = sumOfGrades / classes.Grades.length;
        console.log(sumOfGrades);
        console.log(classesGrades.length);
        console.log(gpa);
        res.status(201).send(" " + gpa);
    } else {
        res.status(404).send("Student with the name " + req.params.name + " was not found.");
    }
});

app.listen(8080, () => {
    console.log("Your app is listening on port 8080"); 
})






