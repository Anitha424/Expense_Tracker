import { motion } from 'framer-motion';
import { Edit2, Trash2, Coins, ArrowDownRight } from 'lucide-react';
import { formatINR } from '../utils/currency';

const TransactionTable = ({ transactions, deleteTransaction, onEditTransaction }) => {
  const handleEdit = (transaction) => {
    if (onEditTransaction) {
      onEditTransaction(transaction);
    }
  };

  const handleDelete = (id) => {
    console.log('🔘 TransactionTable handleDelete called with ID:', id);
    console.log('🔘 deleteTransaction prop exists:', !!deleteTransaction);
    if (deleteTransaction) {
      deleteTransaction(id);
    } else {
      console.error('❌ deleteTransaction prop is not defined!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-700 bg-slate-900/60 backdrop-blur-lg overflow-hidden shadow-lg shadow-slate-950/40"
    >
      <div className="p-6 border-b border-slate-700">
        <h3 className="text-xl font-semibold text-slate-100">Recent Transactions</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                const transactionId = transaction._id || transaction.id;
                console.log(`📊 Rendering transaction ${index}:`, { 
                  _id: transaction._id, 
                  id: transaction.id, 
                  transactionId,
                  description: transaction.description 
                });

                return (
                <motion.tr
                  key={transactionId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.005 }}
                  className="border-b border-slate-700/80 transition duration-300 hover:bg-slate-800/60"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-300">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-100">
                    {transaction.title}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1.5 text-xs font-medium rounded-full border border-emerald-700/40 bg-emerald-500/10 text-emerald-300">
                      {transaction.category}
                    </span>
                  </td>
                  <td className={`px-6 py-5 whitespace-nowrap text-sm text-right font-semibold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatINR(transaction.amount)}
                    {index === 0 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7, x: 10 }}
                        animate={{ opacity: 1, scale: [1, 1.15, 1], x: 0 }}
                        transition={{ duration: 0.9 }}
                        className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                          transaction.type === 'income'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {transaction.type === 'income' ? <Coins size={11} className="mr-1" /> : <ArrowDownRight size={11} className="mr-1" />}
                        NEW
                      </motion.span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                      transaction.type === 'income' 
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' 
                        : 'border-red-500/40 bg-red-500/15 text-red-300'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(transaction)}
                        className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-300 transition-colors"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(transactionId)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No transactions found. Add your first transaction to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TransactionTable;
