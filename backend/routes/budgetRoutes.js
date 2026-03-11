const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { setMonthlyBudget, getMonthlyBudgetSummary } = require('../controllers/budgetController');

const router = express.Router();

router.use(protect);
router.route('/monthly').get(getMonthlyBudgetSummary).put(setMonthlyBudget);

module.exports = router;
