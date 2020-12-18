const express=require('express');
const app=express();
const cors = require('cors');
const env=require('dotenv');
let mysql = require('mysql');
const path = require('path');



// Config dotev
env.config();
// app.use(cors());
app.use(express.json());
app.use('/public',express.static(path.join(__dirname,'src/uploads')));








app.listen(process.env.PORT,()=>{
    console.log(`serveur écoute sur le port ${process.env.PORT}`);
 });

 let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pfa'
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    } 
    console.log('Connected to the MySQL server.');
});



app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST']
}));

//routes
const authRoutes=require('./src/routes/auth');
const hopitalRoutes=require('./src/routes/hopital');

app.use('/api',authRoutes);
app.use('/api',hopitalRoutes);





















