
const express = require('express');
const cors = require('cors')
const mysql = require('mysql')
const app = express();

app.use(cors())
const pool = mysql.createPool({
  host: 'localhost',
  user: 'test_uesr',
  password: '20231105',
  database: 'score',
  port: 3306
})

app.get('/api/data', (req, res) => {
  // 从数据库中获取数据
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database: ', err);
      res.status(500).json({ error: 'Error connecting to database' });
      return;
    }
    connection.query('SELECT * FROM STUDENT_SCORE', (err, results) => {
      connection.release();
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }
      // 将数据作为JSON格式响应给前端
      res.json(results);
    })
  })
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});