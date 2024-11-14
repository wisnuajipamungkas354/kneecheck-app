import express from 'express';
import { registerPasien, getAllPasien, deletePasien } from '../controllers/registerController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to KneeCheck App');
});


router.get('/pasien', getAllPasien );
router.delete('/pasien/:id', deletePasien );
router.post('/register/pasien', registerPasien );

router.get('/about', (req, res) => {
  res.send('This is about pages');
});

export default router;