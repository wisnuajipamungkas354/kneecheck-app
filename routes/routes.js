import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to KneeCheck App');
});

router.get('/about', (req, res) => {
  res.send('This is about pages');
});

export default router;