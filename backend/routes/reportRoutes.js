const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMonthlyReport } = require('../controllers/reportController');

const router = express.Router();

router.use(protect);
router.get('/monthly', getMonthlyReport);

module.exports = router;
