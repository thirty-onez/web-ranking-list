
const express = require('express');
const cors = require('cors')
const mysql = require('mysql')
const app = express();
const bodyParser = require('body-parser')

app.use(cors())
const pool = mysql.createPool({
  host: 'localhost',
  user: 'test_uesr',
  password: '20231105',
  database: 'score',
  port: 3306
})

app.use(bodyParser.json())
app.post('/submitData', (req, res) => {
  const name = req.body.name
  const id = req.body.id
  const score1 = req.body.score1
  const score2 = req.body.score2
  const score3 = req.body.score3
  const score4 = req.body.score4
  const sum_score = Number(score1) + Number(score2) + Number(score3) + Number(score4)

  pool.query('INSERT INTO STUDENT_SCORE VALUES(?,?,?,?,?,?,?)', [name, id, score1, score2, score3, score4, sum_score], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: '数据存储失败' })
    } else {
      res.json({ message: '数据存储成功' })
    }
  })
})

app.put('/updateData', (req, res) => {
  const id = req.body.id;
  const score1 = req.body.score1
  const score2 = req.body.score2
  const score3 = req.body.score3
  const score4 = req.body.score4
  const sum_score = parseInt(score1) + parseInt(score2) + parseInt(score3) + parseInt(score4)
  console.log(sum_score)
  console.log(1)

  // 在 MySQL 中更新数据
  pool.query('UPDATE STUDENT_SCORE SET SCORE1 = ?, SCORE2 = ?, SCORE3 = ?, SCORE4 = ?,SUM_SCORE = ? WHERE id = ?', [score1, score2, score3, score4, sum_score, id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: '数据更新失败' });
    } else {
      res.json({ message: '数据更新成功' });
    }
  });
});

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