const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
  console.log('Express server is working');
});
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'thesecretgarden',
});

db.connect((err) => {
  if (err) {
    console.log('There was an error connecting to the database', err);
  } else {
    console.log('Database connection successful');
  }
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  const queryUsers = 'SELECT * FROM users WHERE email = ?';
  db.query(queryUsers, [email], (err, results) => {
    if (err) {
      console.log('Error when trying to register:' + err);
      res.status(500).send('Server error');
    } else if (results.length > 0) {
      res.json({
        status: 1,
        message: 'This email already exists, please choose another one',
      });
    } else {
      const insert = 'INSERT INTO users (name,email,password) VALUES (?,?,?)';
      db.query(insert, [name, email, password], (err) => {
        if (err) {
          console.log('Error while registering', +err);
          res.status(500).send('Server error');
        } else {
          res.json({
            status: 2,
            message: 'Registration successfully completed',
          });
        }
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM Users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.log('Query error' + err);
      res.status(500).send('Server error');
    } else if (results.length < 1) {
      res.status(401).send('Incorrect email or password');
    } else {
      let user = {
        id: results[0].id,
        email: results[0].email,
        name: results[0].name,
      };
      res.json({ message: 'Successful login', user });
    }
  });
});

app.post('/api/dashboard/items', (req, res) => {
  const { name, author, description, user_id } = req.body;

  // Execute a inserção dos dados no banco de dados.
  const insertQuery =
    'INSERT INTO Items (name, author, description, user_id) VALUES (?, ?, ?, ?)';

  db.query(
    insertQuery,
    [name, author, description, user_id],
    (err, response) => {
      if (err) {
        console.log('Erro ao inserir dados no banco de dados:', err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        console.log('Dados inseridos com sucesso no banco de dados.');
        res.json({ message: 'Dados do formulário enviados com sucesso', id: response.insertId});
      }
    }
  );
});

app.patch('/api/dashboard/items/:id', (req, res) => {
 // write method that update the item based on the item id
  const { name, author, description, user_id } = req.body;

  const updateQuery =
    'UPDATE Items SET name = ?, author = ?, description = ?, user_id = ? WHERE id = ?';

  db.query(
    updateQuery,
    [name, author, description, user_id, req.params.id],
    (err) => {
      if (err) {
        console.log('Erro ao atualizar dados no banco de dados:', err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        console.log('Dados atualizados com sucesso no banco de dados.');
        res.json({ message: 'Dados do formulário atualizados com sucesso' });
      }
    }
  );
});



app.get('/api/dashboard/items/:userId', (req, res) => {
  // write method that recover all the items from the database based on the userId
  // todo: check if user cookie is valid and token is the same as the logged user

  const query = 'SELECT * FROM Items where user_id = ?';

  db.query(query, req.params.userId, (err, results) => {
    if (err) {
      console.log('Erro ao recuperar dados do banco de dados:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      console.log('Dados recuperados com sucesso do banco de dados.');
      res.json({ items: results });
    }
  });
});

app.delete('/api/dashboard/items/:id', (req, res) => {
  // write method that delete the item based on the item id
  const deleteQuery = 'DELETE FROM Items WHERE id = ?';

  db.query(deleteQuery, req.params.id, (err) => {
    if (err) {
      console.log('Erro ao deletar dados do banco de dados:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      console.log('Dados deletados com sucesso do banco de dados.');
      res.json({ message: 'Dados do formulário deletados com sucesso' });
    }
  });
});

