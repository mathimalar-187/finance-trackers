# Finance Tracker - Functions Documentation

## Overview
This document provides a comprehensive overview of all functions in the Personal Finance Tracker project, organized by file and functionality.

---

## JavaScript Functions

### auth.js - Authentication Functions

#### `redirectToLogin()`
- **Purpose**: Redirects users to login page if not authenticated
- **Parameters**: None
- **Returns**: None
- **Usage**: Automatically called on page load to check authentication status

#### `logout()`
- **Purpose**: Clears session storage and redirects to login page
- **Parameters**: None
- **Returns**: None
- **Usage**: Called when user clicks logout button

---

### js/script.js - Main Application Functions

#### Core Transaction Functions

##### `formatDate(dateString)`
- **Purpose**: Formats date string to DD.MM.YYYY format
- **Parameters**: 
  - `dateString` (string): Date string to format
- **Returns**: Formatted date string (DD.MM.YYYY)
- **Usage**: Used in transaction display

##### `fetchTransactions()`
- **Purpose**: Fetches all transactions from server based on user role
- **Parameters**: None
- **Returns**: Promise (async function)
- **Usage**: Loads transactions on page initialization
- **Role-based behavior**:
  - Admin/Manager/Superadmin: Fetches all transactions
  - Regular users: Fetches only their own transactions

##### `addTransaction(e)`
- **Purpose**: Adds new transaction or updates existing one
- **Parameters**: 
  - `e` (Event): Form submit event
- **Returns**: Promise (async function)
- **Usage**: Called on form submission
- **Features**: Handles both add and edit operations

##### `editTransaction(id)`
- **Purpose**: Populates form with transaction data for editing
- **Parameters**: 
  - `id` (number): Transaction ID to edit
- **Returns**: None
- **Usage**: Called when edit button is clicked

##### `deleteTransaction(id)`
- **Purpose**: Deletes a transaction after confirmation
- **Parameters**: 
  - `id` (number): Transaction ID to delete
- **Returns**: Promise (async function)
- **Usage**: Called when delete button is clicked
- **Features**: Includes confirmation dialog and input validation

##### `resetForm()`
- **Purpose**: Resets form to initial state and clears editing mode
- **Parameters**: None
- **Returns**: None
- **Usage**: Called after successful transaction operations or cancel

#### Display and UI Functions

##### `updateDOM()`
- **Purpose**: Updates both summary and transaction list
- **Parameters**: None
- **Returns**: None
- **Usage**: Called after data changes

##### `updateSummary()`
- **Purpose**: Calculates and displays income, expenses, and balance
- **Parameters**: None
- **Returns**: None
- **Usage**: Updates summary cards with current totals

##### `renderTransactionList()`
- **Purpose**: Renders transaction table with pagination
- **Parameters**: None
- **Returns**: None
- **Usage**: Displays transactions in table format
- **Features**: 
  - Pagination support
  - Role-based column display
  - Empty state handling

##### `updateTableHeaders()`
- **Purpose**: Updates table headers based on user role
- **Parameters**: None
- **Returns**: None
- **Usage**: Adds username column for admin/manager users

#### Pagination Functions

##### `nextPage()`
- **Purpose**: Navigates to next page of transactions
- **Parameters**: None
- **Returns**: None
- **Usage**: Called by pagination controls

##### `prevPage()`
- **Purpose**: Navigates to previous page of transactions
- **Parameters**: None
- **Returns**: None
- **Usage**: Called by pagination controls

#### Authentication and Access Control

##### `checkAuth()`
- **Purpose**: Verifies user authentication status
- **Parameters**: None
- **Returns**: None
- **Usage**: Called on page load to ensure user is logged in

##### `setupRoleBasedAccess()`
- **Purpose**: Configures UI based on user role
- **Parameters**: None
- **Returns**: None
- **Usage**: Hides/shows sections based on user permissions
- **Role behaviors**:
  - **Admin**: Can view all transactions, cannot add new ones
  - **Superadmin**: Can view all transactions, summary hidden
  - **File**: Only transaction form visible
  - **User**: Only transaction form visible
  - **Test**: All sections hidden

---

## PHP Backend Functions

### api/db.php - Database Connection

#### Database Configuration
- **Purpose**: Establishes PDO and MySQLi database connections
- **Features**: 
  - UTF-8 character set support
  - Error handling
  - Both PDO and MySQLi for compatibility

### api/add_transaction.php - Add Transaction API

#### Main Functionality
- **Purpose**: Adds new transaction to database
- **Method**: POST
- **Parameters**: 
  - `description` (string): Transaction description
  - `amount` (decimal): Transaction amount
  - `type` (enum): 'income' or 'expense'
  - `date` (date): Transaction date
  - `user_id` (int): User ID (defaults to 1)
- **Returns**: JSON response with success status and transaction data

### api/get_transactions.php - Fetch Transactions API

#### Main Functionality
- **Purpose**: Retrieves transactions based on user permissions
- **Method**: GET
- **Parameters**: 
  - `all` (optional): If set, returns all transactions with user info
  - `user_id` (optional): Returns transactions for specific user
- **Returns**: JSON array of transactions
- **Features**: Role-based data filtering

### api/update_transaction.php - Update Transaction API

#### Main Functionality
- **Purpose**: Updates existing transaction
- **Method**: POST
- **Parameters**: 
  - `id` (int): Transaction ID
  - `description` (string): Updated description
  - `amount` (decimal): Updated amount
  - `type` (enum): Updated type
  - `date` (date): Updated date
- **Returns**: JSON response with success status and updated data
- **Features**: Input validation and error handling

### api/delete_transaction.php - Delete Transaction API

#### Main Functionality
- **Purpose**: Deletes transaction from database
- **Method**: POST
- **Parameters**: 
  - `id` (int): Transaction ID to delete
- **Returns**: JSON response with success status

### api/login.php - User Authentication API

#### Main Functionality
- **Purpose**: Authenticates user credentials
- **Method**: POST
- **Parameters**: 
  - `username` (string): User's username
  - `password` (string): User's password
- **Returns**: JSON response with user data if successful
- **Features**: Plain text password comparison (for demo purposes)

### api/create_user.php - User Creation API

#### Main Functionality
- **Purpose**: Creates new user account
- **Method**: POST
- **Parameters**: 
  - `username` (string): Unique username
  - `email` (string): User's email
  - `password` (string): User's password
  - `role` (enum): User role ('admin', 'manager', 'user')
- **Returns**: JSON response with creation status
- **Features**: 
  - Input validation
  - Duplicate checking
  - Password hashing
  - Email format validation

---

## Setup and Initialization Functions

### setup-db.php - Database Setup

#### Main Functionality
- **Purpose**: Creates database tables and initial users
- **Features**: 
  - Drops existing tables
  - Creates users and transactions tables
  - Inserts default users with hashed passwords
  - Provides login credentials

### init.php - User Initialization

#### Main Functionality
- **Purpose**: Resets users table with default accounts
- **Features**: 
  - Clears existing users
  - Creates admin, manager, and user accounts
  - Uses proper password hashing

---

## User Roles and Permissions

### Role Definitions

#### Admin
- **Access**: View all transactions
- **Restrictions**: Cannot add new transactions
- **UI**: Transaction form hidden

#### Manager
- **Access**: View all transactions, create users
- **Restrictions**: None
- **UI**: Full access with create user button

#### Superadmin
- **Access**: View all transactions
- **Restrictions**: Summary section hidden
- **UI**: History only

#### User
- **Access**: Add transactions only
- **Restrictions**: Cannot view summary or history
- **UI**: Only transaction form visible

#### File
- **Access**: Add transactions only
- **Restrictions**: History and summary hidden
- **UI**: Only transaction form visible

#### Test
- **Access**: None
- **Restrictions**: All sections hidden
- **UI**: Minimal interface

---

## Event Handlers and Listeners

### Form Events
- **Transaction Form Submit**: Calls `addTransaction()`
- **Cancel Edit Button**: Calls `resetForm()`

### Button Events (Event Delegation)
- **Edit Button**: Calls `editTransaction(id)`
- **Delete Button**: Calls `deleteTransaction(id)`
- **Next Page Button**: Calls `nextPage()`
- **Logout Button**: Calls `logout()`

### Page Load Events
- **DOMContentLoaded**: Initializes authentication and role-based access
- **Authentication Check**: Redirects to login if not authenticated
- **Data Loading**: Fetches transactions for authorized users

---

## Data Flow

### Transaction Management Flow
1. **Add**: Form → `addTransaction()` → API → Database → UI Update
2. **Edit**: Button → `editTransaction()` → Form Population → Update → API
3. **Delete**: Button → Confirmation → `deleteTransaction()` → API → UI Update
4. **View**: Page Load → `fetchTransactions()` → API → `renderTransactionList()`

### Authentication Flow
1. **Login**: Credentials → API → Session Storage → Role Setup
2. **Access Control**: Role Check → UI Configuration → Feature Availability
3. **Logout**: Clear Session → Redirect to Login

---

## Security Features

### Input Validation
- **Client-side**: Form validation, type checking
- **Server-side**: Parameter validation, SQL injection prevention
- **Data Sanitization**: Input cleaning and type conversion

### Access Control
- **Role-based permissions**: Different access levels per user type
- **Session management**: Authentication state tracking
- **API protection**: Method validation and error handling

---

## Error Handling

### JavaScript Error Handling
- **Network errors**: Fetch API error catching
- **Validation errors**: Form input validation
- **User feedback**: Alert messages for errors

### PHP Error Handling
- **Database errors**: PDO exception handling
- **Input validation**: Parameter checking and sanitization
- **HTTP responses**: Proper status codes and error messages

---

## Performance Features

### Pagination
- **Client-side pagination**: Reduces DOM load
- **Configurable page size**: Currently set to 5 items per page
- **Navigation controls**: Next/Previous page functionality

### Efficient Data Loading
- **Role-based queries**: Only fetch necessary data
- **Minimal DOM updates**: Targeted element updates
- **Event delegation**: Efficient event handling for dynamic content