const express = require('express');
const router = express.Router();
const {
  setMonthlyIncomeTarget,
  getMonthlyIncomeSummary,
} = require('../controllers/incomeTargetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.put('/targets/monthly', setMonthlyIncomeTarget);
router.get('/targets/monthly', getMonthlyIncomeSummary);

module.exports = router;
