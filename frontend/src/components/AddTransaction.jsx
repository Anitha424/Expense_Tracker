import AddTransactionForm from './AddTransactionForm';

// Compatibility wrapper so screens can import AddTransaction without changing behavior.
function AddTransaction(props) {
  return <AddTransactionForm {...props} />;
}

export default AddTransaction;
