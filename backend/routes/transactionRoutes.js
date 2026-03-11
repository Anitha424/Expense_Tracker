const express = require('express');
const {
  addTransaction,
  getTransactions,
  getRecentTransactions,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').post(addTransaction).get(getTransactions);
router.get('/recent', getRecentTransactions);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

module.exports = router;
