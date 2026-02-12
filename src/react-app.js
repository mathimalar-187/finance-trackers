const { useState, useEffect } = React;

function checkAuth() {
  if (!sessionStorage.getItem('isLoggedIn') && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function Header() {
  const userType = sessionStorage.getItem('userType') || 'user' || 'final';
  const username = sessionStorage.getItem('username') || 'User'|| 'final';

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
  };

  const handleCreateUser = () => {
    window.location.href = 'create-user.html';
  };

  return (
    <header>
      <h1><i className="fas fa-wallet"></i> Personal Finance Tracker</h1>
      <div className="user-info">
        <span style={{marginRight: '15px', fontWeight: '500', padding: '8px 15px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '20px'}}>
          {username} ({userType})
        </span>
        {(userType === 'admin' || userType === 'manager' || userType === 'final') && (
          <button onClick={handleCreateUser} className="btn" style={{marginRight: '10px'}}>
            Create User
          </button>
        )}
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>
    </header>
  );
}

function Summary({ transactions }) {
  const userType = sessionStorage.getItem('userType');
  
  // Hide summary for manager role
  if (userType === 'manager') {
    return null;
  }
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const balance = income - expenses;

  return (
    <section className="summary">
      <div className="card income-card">
        <h3><i className="fas fa-arrow-up"></i> Total Income</h3>
        <p>{income.toFixed(1)}</p>
      </div>
      <div className="card expense-card">
        <h3><i className="fas fa-arrow-down"></i> Total Expenses</h3>
        <p>{expenses.toFixed(1)}</p>
      </div>
      <div className="card balance-card">
        <h3><i className="fas fa-balance-scale"></i> Balance</h3>
        <p>{balance.toFixed(1)}</p>
      </div>
    </section>
  );
}

function TransactionForm({ onSubmit, editingTransaction, onCancel }) {
  const userType = sessionStorage.getItem('userType');
  
  // Only show form for user and final roles
  if (userType !== 'user' && userType !== 'final') {
    return null;
  }
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'income',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        type: editingTransaction.type,
        date: editingTransaction.date
      });
    } else {
      setFormData({
        amount: '',
        description: '',
        type: 'income',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editingTransaction) {
      setFormData({
        amount: '',
        description: '',
        type: 'income',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="transaction-form">
      <h2><i className="fas fa-plus-circle"></i> {editingTransaction ? 'Edit' : 'Add New'} Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount..."
            step="0.01"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description..."
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn">
            {editingTransaction ? 'Update' : 'Add'} Transaction
          </button>
          {editingTransaction && (
            <button type="button" onClick={onCancel} className="btn cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function TransactionHistory({ transactions, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const userType = sessionStorage.getItem('userType');
  
  // Hide edit/delete actions for user role
  const canEdit = userType !== 'user';

  return (
    <section className="transaction-history">
      <h2><i className="fas fa-history"></i> Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            {(userType === 'admin' || userType === 'manager' || userType === 'final') && <th>User</th>}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={(userType === 'admin' || userType === 'manager' || userType === 'final') ? '6' : '5'} style={{ textAlign: 'center', padding: '40px' }}>
                <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#ddd', display: 'block', marginBottom: '15px' }}></i>
                No transactions yet. Add your first transaction above!
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.description}</td>
                <td>{parseFloat(transaction.amount).toFixed(1)}</td>
                <td>
                  <span className={transaction.type}>
                    {transaction.type}
                  </span>
                </td>
                {(userType === 'admin' || userType === 'manager' || userType === 'final') && <td>{transaction.username || 'Unknown'}</td>}
                <td>
                  {canEdit ? (
                    <div className="action-btns">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="edit-btn"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="delete-btn"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ) : (
                    <span style={{color: '#999', fontSize: '0.9em'}}>View Only</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    if (checkAuth()) {
      fetchTransactions();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const userType = sessionStorage.getItem('userType');
      const userId = sessionStorage.getItem('userId') || '1';
      
      const url = (userType === 'admin' || userType === 'manager' || userType === 'final') 
        ? 'api/get_transactions.php?all=1' 
        : `api/get_transactions.php?user_id=${userId}`;
        
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const formData = new FormData();
      Object.keys(transactionData).forEach(key => {
        formData.append(key, transactionData[key]);
      });
      
      const userId = sessionStorage.getItem('userId') || '1';
      formData.append('user_id', userId);

      const endpoint = editingTransaction ? 'api/update_transaction.php' : 'api/add_transaction.php';
      if (editingTransaction) {
        formData.append('id', editingTransaction.id);
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      const result = await res.json();

      if (result.success) {
        if (editingTransaction) {
          setTransactions(prev => prev.map(t => 
            t.id === editingTransaction.id ? result.data : t
          ));
          setEditingTransaction(null);
        } else {
          setTransactions(prev => [result.data, ...prev]);
        }
      } else {
        alert('Error saving transaction: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('An error occurred while saving the transaction.');
    }
  };

  const deleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', id);

      const res = await fetch('api/delete_transaction.php', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();

      if (result.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else {
        alert('Error deleting transaction: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('An error occurred while deleting the transaction.');
    }
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="container">
      <Header />
      <Summary transactions={transactions} />
      <TransactionForm 
        onSubmit={addTransaction}
        editingTransaction={editingTransaction}
        onCancel={cancelEdit}
      />
      <TransactionHistory 
        transactions={transactions}
        onEdit={editTransaction}
        onDelete={deleteTransaction}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));