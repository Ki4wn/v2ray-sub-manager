import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  console.log(req.headers)
  res.json({ success: true, data: req.headers });
});
export default router;