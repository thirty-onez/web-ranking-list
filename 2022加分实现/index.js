
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


  pool.query('UPDATE STUDENT_SCORE SET SCORE1 = ?, SCORE2 = ?, SCORE3 = ?, SCORE4 = ?,SUM_SCORE = ? WHERE id = ?', [score1, score2, score3, score4, sum_score, id], (error, results) => {
    if (error) {
      console.error(error)
      res.status(500).json({ message: '数据更新失败' })
    } else {
      res.json({ message: '数据更新成功' })
    }
  })
})

app.get('/api/data', (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error)
      res.status(500).json({ error: '数据库连接失败' })
      return
    }
    connection.query('SELECT * FROM STUDENT_SCORE', (error, results) => {
      connection.release();
      if (error) {
        console.error(error)
        res.status(500).json({ error: '数据获取失败' })
        return
      }
      res.json(results)
    })
  })
})

app.post('/register', (req, res) => {
  const id = req.body.id
  const password = req.body.password
  console.log(id)
  console.log(password)
  pool.query('INSERT INTO USER VALUES(?,?)', [id, password], (error, results) => {
    if (error) {
      console.error(error)
      res.status(500).send('数据插入失败')
    } else {
      res.send('数据插入成功')
    }
  })
})

app.post('/login', (req, res) => {
  const id = req.body.id
  const password = req.body.password
  pool.query(`SELECT PASSWORD FROM USER WHERE ID=${id}`, (error, results) => {
    if (error) {
      console.error(error)
      res.status(500).send('服务器内部错误')
    }
    if (results.length > 0) {
      const passwordFromDB = results[0].PASSWORD
      // console.log(results[0])
      if (passwordFromDB == password) {
        res.send('密码一致')
      } else {
        res.send('密码不一致')
      }
    } else {
      res.send('未找到对应的ID')
    }
  })
});

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})