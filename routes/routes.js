import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to KneeCheck App');
});

router.get('/pasien', (req, res) => {
  const query = "select * from pasien;";
  connection.query(query, (err, rows, field) => {
    if(err){
      res.status(500).send({message: err.sqlMessage});
    }else{
      res.json(rows);
    }
  })
})

router.get('/about', (req, res) => {
  res.send('This is about pages');
});

export default router;