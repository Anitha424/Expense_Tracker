const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} = require('../controllers/recurringController');

const router = express.Router();

router.use(protect);
router.route('/').get(getRecurringTransactions).post(createRecurringTransaction);
router.route('/:id').put(updateRecurringTransaction).delete(deleteRecurringTransaction);

module.exports = router;
