// create an express app
const express = require("express");
const {urlencoded} = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 4000
const { Pool } = require('pg');
const {connectionString} = require("pg/lib/defaults");
var pool;
pool = new Pool ({
  connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}
});

// use the express-static middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
});

//add rectangles
app.post('/ADD_REC', async(req,res) => {

  const nameRec = req.body.RectangleName;
  const widthRec = req.body.RectangleWidth;
  const heightRec = req.body.RectangleHeight;

  try{
    const NewRec = await pool.query(`Insert into rectangles values ('${nameRec}',${widthRec},${heightRec})`);
    res.send("Inserted");
  }
  catch(err){
    console.error(err);
  }
});

//delete rectangles
/*
app.get('/views/pages/delNameRectangle.html', async (req, res) => {
  const NAME = req.body.RectangleName;
  try {
    const newRec = await pool.query(`delete from rec where name=${NAME}`);
    res.send("Deleted from database");
  }
  catch(err) {
    console.log(err);
  }
});
*/
//display rectangles...
app.get("/views/pages/displayRectangle.ejs", function (req, res) {
  var getRecQuery = `SELECT * FROM rectangles`;
  pool.query(getRecQuery, (error,result) => {
    if(error)
      res.send(error);
    var results = {'rows': result.rows};
    res.render('pages/displayRectangle',results);
  })
});

app.get('/database', (req, res) => {
  var getUsersQuery = 'SELECT * from rectangles';
  pool.query(getUsersQuery, (error, result)=>{
    if(error) {
      res.end(error);
    }
    var results = {'rows' : result.rows};
    res.render('pages/displayRectangle', results);
  })
})
//deleting rectangles post methods
app.post('/delete_HEIGHT', async(req,res) => {
  const h = req.body.RectangleHeight;
  try {
    const newRec = await pool.query(`delete from rectangles where height=${h}`);
    res.send("Deleted using height");
  }
  catch(err) {
    console.log(err);
  }
});
app.post('/delete_WIDTH', async(req,res) => {
  const W = req.body.RectangleWidth;
  try {
    const newRec = await pool.query(`delete from rectangles where width=${W}`);
    res.send("Deleted using width");
  }
  catch(err) {
    console.log(err);
  }
});
app.post('/delete_NAME', async(req,res) => {
  const h = req.body.RectangleName;
  try {
    const newRec = await pool.query(`delete from rectangles where name='${h}'`);
    res.send("Deleted using Name");
  }
  catch(err) {
    console.log(err);
  }
});
// start the server listening for requests
app.listen(process.env.PORT || 5000 , () => console.log("Server is running..."));