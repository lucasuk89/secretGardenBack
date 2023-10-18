 const express = require('express');
 const bodyParser = require('body-parser');
 const mysql = require('mysql');
 const cors = require('cors');

 const app = express();

 app.use(bodyParser.urlencoded({extended:false}));
 app.use(bodyParser.json());
 app.use(cors());



 const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'thesecretgarden'
});


 db.connect(err=>{
    if(err){
        console.log("There was an error connecting to the database",err);
    }else{
        console.log('Database connection successful');
    }
 });

app.post('/api/register',(req,res)=>{
    const {name,email,password} = req.body;
    const queryUsers = "SELECT * FROM users WHERE email = ?";
    db.query(queryUsers,[email],(err,results)=>{
        if(err){
            console.log('Error when trying to register:'+err);
            res.status(500).send("Server error");
        }else if(results.length > 0){
            res.json({status:1,message:"This email already exists, please choose another one"});
        }else{
            const insert = "INSERT INTO users (name,email,password) VALUES (?,?,?)";
            db.query(insert,[name,email,password],(err)=>{
                if(err){
                    console.log("Error while registering",+err);
                    res.status(500).send("Server error");
                }else{
                    res.json({status:2, message:"Registration successfully completed"});
                }
            }) 
        }
    })
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  
    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.log("Query error" + err);
        res.status(500).send("Server error");
      } else if (results.length < 1) {
        res.status(401).send("Incorrect email or password");
      } else {
        res.json({ message: "Successful login", usuario: results[0] });
      }
    });
  });


  app.post('/api/dashboard', (req, res) => {
    const { name, image, description } = req.body;
  
    // Execute a inserção dos dados no banco de dados.
    const insertQuery = 'INSERT INTO Items (name, image, description) VALUES (?, ?, ?)';
  
    db.query(insertQuery, [name, image, description], (err, results) => {
      if (err) {
        console.log('Erro ao inserir dados no banco de dados:', err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        console.log('Dados inseridos com sucesso no banco de dados.');
        res.json({ message: 'Dados do formulário enviados com sucesso' });
      }
    });
  });
  
  

 app.listen(3000,()=>{
    console.log('Express server is working')
 })

