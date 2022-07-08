const express = require("express"),
bodyParser = require("body-parser"),
uuid = require("uuid");

const app = express ();
app.use(express.static("public"));
app.use(bodyParser.json());


let users = [
    {
        id: 1,
        name: 'Jessica Drake',
        favoriteMovie: []
      },
      {
        id: 2,
        name: 'Ben Cohen',
        favoriteMovie: ["Pulp Fiction"]
      },
      {
        id: 3,
        name: 'Lisa Downing',
        favoriteMovie: ["Harry Potter, Notting Hill"]
      }
];

let movies = [
    {
     "Title": "Forrest Gump",
     "Description": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
     "Genre": {
        "Name": "Drama",
        "Description" : "The drama genre features stories with high stakes and a lot of conflicts. They're plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters."
     },
     "Director": {
        "Name": "Robert Zemeckis",
        "Bio": "A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert's earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies. Again, these films incorporate stunning effects. Robert has proved he can work a serious story around great effects.",
        "Birth": 1951
     },
     "ImageURL": "https://www.imdb.com/title/tt0109830/mediaviewer/rm535942913?ref_=ttmi_mi_all_sf_1",
     "Featured": true
    },

    {
        "Title": "Pulp Fiction",
        "Description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        "Genre": {
           "Name": "Crime",
           "Description" : "Crime film is a genre that revolves around the action of a criminal mastermind. A Crime film will often revolve around the criminal himself, chronicling his rise and fall. Some Crime films will have a storyline that follows the criminal's victim, yet others follow the person in pursuit of the criminal."
        },
        "Director": {
           "Name": "Quentin Tarantino",
           "Bio": " Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old. ",
           "Birth": 1963
        },
        "ImageURL": "https://www.imdb.com/title/tt0110912/mediaviewer/rm3998665728?ref_=ttmi_mi_all_sf_1",
        "Featured": true
       },

       {
        "Title": "Lucky Number Sleven",
        "Description": " A case of mistaken identity lands Slevin into the middle of a war being plotted by two of the city's most rival crime bosses. Under constant surveillance by Detective Brikowski and assassin Goodkat, he must get them before they get him.",
        "Genre": {
           "Name": " Crime",
           "Description" : "Crime film is a genre that revolves around the action of a criminal mastermind. A Crime film will often revolve around the criminal himself, chronicling his rise and fall. Some Crime films will have a storyline that follows the criminal's victim, yet others follow the person in pursuit of the criminal."
        },
        "Director": {
           "Name": "Paul McGuigan",
           "Bio": " Paul McGuigan was born on September 19, 1963 in Bellshill, Scotland. He is a director and producer, known for Lucky Number Slevin (2006), Wicker Park (2004) and Victor Frankenstein (2015). He is married to Natasha Noramly. They have one child. He was previously married to Elisabeth McGuigan",
           "Birth": 1963
        },
        "ImageURL": "https://www.imdb.com/title/tt0425210/mediaviewer/rm4226324736?ref_=ttmi_mi_all_sf_10",
        "Featured": true
       },

       {
        "Title": "Stranger Things",
        "Description": "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
        "Genre": {
           "Name": " Fantasy ",
           "Description" : "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap."
        },
        "Director": {
           "Name": "Duffner Brothers",
           "Bio": "Matt Duffer is a producer and writer, known for Stranger Things (2016), Wayward Pines (2015) and We All Fall Down (2005). Ross Duffer is a producer and writer, known for Stranger Things (2016), Wayward Pines (2015) and We All Fall Down (2005).",
           "Birth": 1984
        },
        "ImageURL": "https://www.imdb.com/title/tt4574334/mediaviewer/rm213980161?ref_=ttmi_mi_all_sf_1",
        "Featured": false
       },

       {
        "Title": "Enders Game",
        "Description": "Young Ender Wiggin is recruited by the International Military to lead the fight against the Formics, an insectoid alien race who had previously tried to invade Earth and had inflicted heavy losses on humankind.",
        "Genre": {
           "Name": "Adventure",
           "Description" : "A common theme of adventure films is of characters leaving their home or place of comfort and going to fulfill a goal, embarking on travels, quests, treasure hunts, heroic journeys; and explorations or searches for the unknown."
        },
        "Director": {
           "Name": "Gavin Hood",
           "Bio": "Gavin Hood was born on May 12, 1963 in Johannesburg, South Africa. He is an actor and director, known for Official Secrets (2019), Tsotsi (2005) and Eye in the Sky (2015). He was previously married to Janine Eser.",
           "Birth": 1963
        },
        "ImageURL": "https://www.imdb.com/title/tt1731141/mediaviewer/rm2541935872?ref_=ttmi_mi_all_sf_1",
        "Featured": true
       },

       {
        "Title": "Adams Apples",
        "Description": "A neo-Nazi sentenced to community service at a church clashes with the blindly devoted minister.",
        "Genre": {
           "Name": "Comedy",
           "Description" : "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement."
        },
        "Director": {
           "Name": "Anders Thomas Jensen",
           "Bio": "Anders Thomas Jensen was born on 6th April 1972 in Frederiksværk on Sjælland in Denmark to Carl Benny Jensen and Kirsten Jensen (born Sørensen). He attended the high school in Frederiksværk from 1988 to 1991.",
           "Birth": 1972
        },
        "ImageURL": "https://www.imdb.com/title/tt0418455/mediaviewer/rm1322064897?ref_=ttmi_mi_all_pos_1",
        "Featured": true
       },

       {
        "Title": "Notting Hill",
        "Description": "The life of a simple bookshop owner changes when he meets the most famous film star in the world.",
        "Genre": {
           "Name": "Romance",
           "Description" : "Romance films or movies involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters. Typically their journey through dating, courtship or marriage is featured."
        },
        "Director": {
           "Name": "Roger Michell",
           "Bio": "Roger Michell was born on June 5, 1956 in Pretoria, South Africa. He was a director and producer, known for Notting Hill (1999), Venus (2006) and Enduring Love (2004). He was married to Anna Maxwell Martin and Kate Buffery. He died on September 22, 2021.",
           "Birth": 1956
        },
        "ImageURL": "https://www.imdb.com/title/tt0125439/mediaviewer/rm1324314112?ref_=ttmi_mi_all_sf_1",
        "Featured": true
       },

       {
        "Title": "You do not mess with the Zohan",
        "Description": "An Israeli Special Forces Soldier fakes his death so he can re-emerge in New York City as a hair stylist.",
        "Genre": {
           "Name": "Action",
           "Description" : "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        "Director": {
           "Name": "Dennis Dugan",
           "Bio": "Dennis Barton Dugan is an American film director, actor, comedian and screenwriter from Wheaton, Illinois who directed several films featuring Adam Sandler including Happy Gilmore, Big Daddy, Jack & Jill, Grown Ups, I Now Pronounce You Chuck & Larry and You Don't Mess With the Zohan. He also directed Beverly Hills Ninja and The Benchwarmers.",
           "Birth": 1946
        },
        "ImageURL": "https://www.imdb.com/title/tt0960144/mediaviewer/rm32223232?ref_=ttmi_mi_all_sf_2",
        "Featured": true
       },

       {
        "Title": "Harry Potter and the Sorcerer's Stone",
        "Description": "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
        "Genre": {
           "Name": "Adventure",
           "Description" : "A common theme of adventure films is of characters leaving their home or place of comfort and going to fulfill a goal, embarking on travels, quests, treasure hunts, heroic journeys; and explorations or searches for the unknown."
        },
        "Director": {
           "Name": "Chris Columbus",
           "Bio": "Born in Pennsylvania and raised in Ohio, Chris Columbus was first inspired to make movies after seeing 'The Godfather' at age 15. After enrolling at NYU film school, he sold his first screenplay (never produced) while a sophomore there. After graduation Columbus tried to sell his fourth script, 'Gremlins', with no success, until Steven Spielberg optioned it;",
           "Birth": 1958
        },
        "ImageURL": "https://www.imdb.com/title/tt0241527/mediaviewer/rm2113437952?ref_=ttmi_mi_all_sf_5",
        "Featured": true
       },
   
       {
        "Title": "The Matrix",
        "Description": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        "Genre": {
           "Name": "Action",
           "Description" : "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        "Director": {
           "Name": "Lana Wachowski",
           "Bio": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
           "Birth": 1965
        },
        "ImageURL": "https://www.imdb.com/title/tt0133093/mediaviewer/rm2182645504?ref_=ttmi_mi_all_sf_3",
        "Featured": true
       },
]

// CREATE
app.post("/users", (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send("Users need names!");
    }
});

// UPDATE
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if(user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send("No such user!");
    }
});

// CREATE
app.post("/users/:id/:movieTitle", (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if(user) {
        user.favoriteMovie.push(movieTitle);
        res.status(200).send("${movieTitle} has been added to user ${id}'s array");
    } else {
        res.status(400).send("No such user!")
    }
});

// DELETE
app.delete("/users/:id/:movieTitle", (req, res) => {
    const { id, movieTitle } = req.params; // pull from document

    let user = users.find( user => user.id == id); // check if user excists

    if(user) {
        user.favoriteMovie = user.favoriteMovie.filter( title => title !== movieTitle);
        res.status(200).send("${movieTitle} has been deleted from user ${id}'s array");
    } else {
        res.status(400).send("No such user!");
    }
});

// DELETE
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id); 

    if(user) {
       users = users.filter( user => user.id != id);
       // res.json(users);
        res.status(200).send("User ${id} has been deleted.");
    } else {
        res.status(400).send("No such user!");
    }
});

// READ
    app.get("/movies", (req, res) => {
        res.status(200).json(movies);
    });

app.get("/movies/:title", (req, res) => {
    // res.status(200).send("This is a movie.");
    // res.status(200).json(movies);


    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title ); // method find takes a function as an argument

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send("No such movie!");
    }
});

app.get("/movies/genre/:genreName", (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre; // want return the property Genre

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send("No such genre!");
    }
});

app.get("/movies/directors/:directorName", (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send("No such director!");
    }
});

    app.listen(8080, () => {
        console.log("Listening on port 8080");
});






