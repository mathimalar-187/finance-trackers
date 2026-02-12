document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    
    // Setup role-based access
    setupRoleBasedAccess();
    const transactionForm = document.getElementById('add-transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const balanceEl = document.getElementById('balance');

    let transactions = [];
    let editingTransactionId = null;

    // --- Functions ---

    // Format date to DD.MM.YYYY
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    // Fetch all transactions from the server
    async function fetchTransactions() {
        try {
            const userType = sessionStorage.getItem('userType');
            const userId = sessionStorage.getItem('userId') || '1';
            
            // Only manager sees all transactions, others see only their own
            const url = (userType === 'manager') 
                ? 'api/get_transactions.php?all=1' 
                : `api/get_transactions.php?user_id=${userId}`;
                
            const res = await fetch(url);
            if (!res.ok) throw new Error('Network response was not ok');
            transactions = await res.json();
            updateDOM();
        } catch (error) {
            console.error('Error fetching transactions:', error);
            transactionList.innerHTML = '<tr><td colspan="5">Could not load transactions.</td></tr>';
        }
    }

    // Add or update a transaction
    async function addTransaction(e) {
        e.preventDefault();

        const formData = new FormData(transactionForm);
        
        // Add user ID from session storage
        const userId = sessionStorage.getItem('userId') || '1';
        formData.append('user_id', userId);
        
        // If editing, add the transaction ID to form data
        if (editingTransactionId) {
            formData.append('id', editingTransactionId);
        }

        try {
            const endpoint = editingTransactionId ? 'api/update_transaction.php' : 'api/add_transaction.php';
            const res = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();

            if (result.success) {
                if (editingTransactionId) {
                    // Update existing transaction in array
                    const index = transactions.findIndex(t => t.id == editingTransactionId);
                    if (index !== -1) {
                        transactions[index] = result.data;
                    }
                    editingTransactionId = null;
                } else {
                    // Add new transaction to the beginning of our array
                    transactions.unshift(result.data);
                }
                updateDOM();
                resetForm();
            } else {
                alert('Error saving transaction: ' + result.message);
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            alert('An error occurred while saving the transaction.');
        }
    }
    
    // Reset form and editing state
    function resetForm() {
        transactionForm.reset();
        editingTransactionId = null;
        const submitBtn = transactionForm.querySelector('button[type="submit"]');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        submitBtn.textContent = 'Add Transaction';
        cancelBtn.style.display = 'none';
    }

    // Edit a transaction
    function editTransaction(id) {
        const transaction = transactions.find(t => t.id == id);
        if (!transaction) return;
        
        // Set editing mode
        editingTransactionId = id;
        
        // Populate form with transaction data
        document.getElementById('date').value = transaction.date;
        document.getElementById('description').value = transaction.description;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('type').value = transaction.type;
        
        // Change button text and show cancel button
        const submitBtn = transactionForm.querySelector('button[type="submit"]');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        submitBtn.textContent = 'Update Transaction';
        cancelBtn.style.display = 'block';
        
        // Scroll to form
        transactionForm.scrollIntoView({ behavior: 'smooth' });
    }

    // Delete a transaction
    async function deleteTransaction(id) {
        // Validate and sanitize ID
        const sanitizedId = parseInt(id, 10);
        if (!sanitizedId || sanitizedId <= 0) {
            alert('Invalid transaction ID');
            return;
        }

        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        const formData = new FormData();
        formData.append('id', sanitizedId);

        try {
            const res = await fetch('/api/delete_transaction.php', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const result = await res.json();

            if (result.success) {
                transactions = transactions.filter(t => t.id !== sanitizedId);
                updateDOM();
            } else {
                const errorMsg = typeof result.message === 'string' ? result.message : 'Unknown error';
                alert('Error deleting transaction: ' + errorMsg);
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('An error occurred while deleting the transaction.');
        }
    }

    // Update table headers based on user role
    function updateTableHeaders() {
        const userType = sessionStorage.getItem('userType');
        const tableHead = document.querySelector('#history-section thead tr');
        
        if (userType === 'manager') {
            // Add username column if not exists
            if (!tableHead.querySelector('.username-header')) {
                const usernameHeader = document.createElement('th');
                usernameHeader.textContent = 'User';
                usernameHeader.className = 'username-header';
                tableHead.insertBefore(usernameHeader, tableHead.lastElementChild);
            }
        }
    }

    // Pagination variables
    let currentPage = 0;
    const itemsPerPage = 5;

    // Update the summary and transaction list
    function updateDOM() {
        currentPage = 0; // Reset pagination
        updateSummary();
        renderTransactionList();
    }

    // Update the summary cards
    function updateSummary() {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + parseFloat(t.amount), 0);
        
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + parseFloat(t.amount), 0);

        const balance = income - expenses;

        totalIncomeEl.textContent = `${income.toFixed(1)}`;
        totalExpensesEl.textContent = `${expenses.toFixed(1)}`;
        balanceEl.textContent = `${balance.toFixed(1)}`;
    }

    // Render the transaction list in the table with pagination
    function renderTransactionList() {
        transactionList.innerHTML = '';
        const userType = sessionStorage.getItem('userType');
        const showUsername = userType === 'manager';

        if (transactions.length === 0) {
            const colspan = showUsername ? '6' : '5';
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.setAttribute('colspan', colspan);
            noDataCell.textContent = 'No transactions found.';
            noDataRow.appendChild(noDataCell);
            transactionList.appendChild(noDataRow);
            return;
        }

        // Calculate items to show for current page
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = transactions.slice(startIndex, endIndex);
        const totalPages = Math.ceil(transactions.length / itemsPerPage);

        itemsToShow.forEach(t => {
            const row = document.createElement('tr');
            row.classList.add(t.type);
            
            // Create cells safely
            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(t.date);
            
            const descCell = document.createElement('td');
            descCell.textContent = t.description || '';
            
            const amountCell = document.createElement('td');
            amountCell.textContent = parseFloat(t.amount || 0).toFixed(2);
            
            const typeCell = document.createElement('td');
            const typeText = (t.type || '').toString();
            typeCell.textContent = typeText.charAt(0).toUpperCase() + typeText.slice(1);
            
            row.appendChild(dateCell);
            row.appendChild(descCell);
            row.appendChild(amountCell);
            row.appendChild(typeCell);
            
            if (showUsername) {
                const usernameCell = document.createElement('td');
                usernameCell.textContent = t.username || 'Unknown';
                row.appendChild(usernameCell);
            }
            
            const actionCell = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.setAttribute('data-id', t.id);
            editBtn.textContent = 'Edit';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.setAttribute('data-id', t.id);
            deleteBtn.textContent = 'Delete';
            
            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);
            
            transactionList.appendChild(row);
        });

        // Add pagination controls
        if (totalPages > 1) {
            const colspan = showUsername ? '6' : '5';
            const paginationRow = document.createElement('tr');
            const paginationCell = document.createElement('td');
            paginationCell.setAttribute('colspan', colspan);
            paginationCell.style.textAlign = 'center';
            paginationCell.style.padding = '1rem';
            
            const pageSpan = document.createElement('span');
            pageSpan.style.marginRight = '1rem';
            pageSpan.textContent = `Page ${currentPage + 1} of ${totalPages}`;
            
            const nextBtn = document.createElement('button');
            nextBtn.id = 'next-btn';
            nextBtn.className = 'btn';
            nextBtn.textContent = 'Next';
            nextBtn.disabled = currentPage === totalPages - 1;
            
            paginationCell.appendChild(pageSpan);
            paginationCell.appendChild(nextBtn);
            paginationRow.appendChild(paginationCell);
            transactionList.appendChild(paginationRow);
        }
    }

    // Navigate to next page
    function nextPage() {
        const totalPages = Math.ceil(transactions.length / itemsPerPage);
        if (currentPage < totalPages - 1) {
            currentPage++;
            renderTransactionList();
        }
    }

    // Navigate to previous page
    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
            renderTransactionList();
        }
    }


    // --- Event Listeners ---
    
    transactionForm.addEventListener('submit', addTransaction);
    
    // Cancel edit button
    document.getElementById('cancel-edit-btn').addEventListener('click', resetForm);

    // Use event delegation for edit, delete, and pagination buttons
    transactionList.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        
        if (target.classList.contains('delete-btn')) {
            const id = target.getAttribute('data-id');
            if (id) deleteTransaction(id);
        } else if (target.classList.contains('edit-btn')) {
            const id = target.getAttribute('data-id');
            if (id && typeof editTransaction === 'function') editTransaction(id);
        } else if (target.id === 'next-btn') {
            nextPage();
        }
    });

    // --- Authentication Functions ---
    
    function checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
    }
    
    function setupRoleBasedAccess() {
        const userType = sessionStorage.getItem('userType');
        const userRoleEl = document.getElementById('user-role');
        const summarySection = document.getElementById('summary-section');
        const historySection = document.getElementById('history-section');
        const addTransactionSection = document.getElementById('add-transaction-section');
        const transactionForm = document.querySelector('.transaction-form');
        
        if (!userRoleEl) return;
        
        switch (userType) {
            case 'manager':
                userRoleEl.textContent = 'Manager User';
                break;
            default:
                userRoleEl.textContent = 'Access Denied';
                if (summarySection) summarySection.classList.add('hidden');
                if (historySection) historySection.classList.add('hidden');
                if (transactionForm) transactionForm.classList.add('hidden');
        }
        
        updateTableHeaders();
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.clear();
                window.location.href = 'login.html';
            });
        }
    }

    // --- Initial Load ---
    const userType = sessionStorage.getItem('userType');
    if (userType === 'manager' && typeof fetchTransactions === 'function') {
        fetchTransactions();
    }
});