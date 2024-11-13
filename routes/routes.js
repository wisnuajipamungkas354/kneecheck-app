import express from 'express';
import mysql from 'mysql';
const router = express.Router();

const connection = mysql.createConnection({
  host: '34.127.21.55',
  user: 'root',
  database: 'knee_db',
  password: 'knee123'

})
router.get('/', (req, res) => {
  res.send('Welcome to KneeCheck App');
});

router.get('/pasien', (req, res) => {
  const query = "select * from pasien;";
  connection.query(query, (err, rows, field) => {
    if(err){
      res.status(500).send({message: err.sqlMessage});
    }else{
      res.send(rows);npm
    }
  })
})

router.get('/about', (req, res) => {
  res.send('This is about pages');
});

export default router;