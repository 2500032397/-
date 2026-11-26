import { useEffect, useState } from 'react'
import Login from './components/Login.jsx'
import UserDashboard from './components/UserDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import './App.css'

const initialUsers = [
  { id: '2500032397', name: 'Saishashank', email: 'saishashank@example.com', account: 'Savings', status: 'Active' },
  { id: '2500032401', name: 'Rahul', email: 'rahul@example.com', account: 'Current', status: 'Active' },
  { id: '2500032402', name: 'Priya', email: 'priya@example.com', account: 'Savings', status: 'Active' },
  { id: '2500032403', name: 'Arjun', email: 'arjun@example.com', account: 'Savings', status: 'Blocked' },
]

const initialLoans = [
  { id: 'LN1001', user: 'Saishashank', type: 'Education Loan', amount: 1000000, status: 'Pending' },
  { id: 'LN1002', user: 'Rahul', type: 'Personal Loan', amount: 500000, status: 'Pending' },
  { id: 'LN1003', user: 'Priya', type: 'Home Loan', amount: 5000000, status: 'Pending' },
]

const initialTransactions = [
  { id: 'TXN10234', description: 'Salary Credit', date: '27 Aug 2026', type: 'Credit', amount: 45000, status: 'Completed' },
  { id: 'TXN10233', description: 'Amazon Purchase', date: '28 Aug 2026', type: 'Debit', amount: 2499, status: 'Completed' },
  { id: 'TXN10232', description: 'Electricity Bill', date: '25 Aug 2026', type: 'Debit', amount: 1240, status: 'Completed' },
  { id: 'TXN10231', description: 'UPI Transfer', date: '24 Aug 2026', type: 'Debit', amount: 800, status: 'Pending' },
]

const userNavigation = [
  ['dashboard', '⌂', 'Dashboard'],
  ['accounts', '▣', 'My Accounts'],
  ['transfer', '↗', 'Transfer'],
  ['transactions', '▤', 'Transactions'],
  ['bills', '▧', 'Bill Payments'],
  ['loans', '⌂', 'Loans'],
  ['profile', '●', 'Profile'],
]

const adminNavigation = [
  ['adminDashboard', '▦', 'Dashboard'],
  ['users', '♙', 'Manage Users'],
  ['adminLoans', '▣', 'Loan Approvals'],
]

const money = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

function App() {
  const [role, setRole] = useState(() => localStorage.getItem('novaBankRole') || '')
  const [customer, setCustomer] = useState(() => localStorage.getItem('novaBankUser') || '')
  const [userPage, setUserPage] = useState('dashboard')
  const [adminPage, setAdminPage] = useState('adminDashboard')
  const [users, setUsers] = useState(initialUsers)
  const [loans, setLoans] = useState(initialLoans)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [balance, setBalance] = useState(125450)
  const [currentBalance] = useState(23300)

  useEffect(() => {
    if (role) localStorage.setItem('novaBankRole', role)
    else localStorage.removeItem('novaBankRole')
    if (role === 'user' && customer) localStorage.setItem('novaBankUser', customer)
  }, [role, customer])

  const logout = () => {
    localStorage.removeItem('novaBankRole')
    localStorage.removeItem('novaBankUser')
    setRole('')
    setCustomer('')
  }

  const recordDebit = (description, amount) => {
    setBalance((previous) => previous - amount)
    setTransactions((previous) => [{
      id: `TXN${Date.now()}`,
      description,
      date: new Date().toLocaleDateString('en-IN'),
      type: 'Debit',
      amount,
      status: 'Completed',
    }, ...previous])
  }

  const transferMoney = ({ beneficiary, accountNumber, ifsc, amount }) => {
    const value = Number(amount)
    if (!beneficiary.trim() || !/^\d{9,18}$/.test(accountNumber.trim()) ||
        !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifsc.trim())) {
      return 'Enter a beneficiary and valid demo account details.'
    }
    if (!Number.isFinite(value) || value <= 0) return 'Enter a valid amount.'
    if (value > balance) return 'Insufficient balance.'
    recordDebit(`Transfer to ${beneficiary.trim()}`, value)
    return `Demo transfer successful: ${money(value)} sent to ${beneficiary.trim()}.`
  }

  const payBill = ({ category, consumerNumber, amount }) => {
    const value = Number(amount)
    if (!consumerNumber.trim()) return 'Enter your consumer number.'
    if (!Number.isFinite(value) || value <= 0) return 'Enter a valid amount.'
    if (value > balance) return 'Insufficient balance.'
    recordDebit(`${category} Bill`, value)
    return 'Demo bill payment successful.'
  }

  const applyLoan = (type) => {
    setLoans((previous) => [...previous, {
      id: `LN${Date.now()}`,
      user: users.find((user) => user.id === customer)?.name || customer || 'Customer',
      type,
      amount: 0,
      status: 'Pending',
    }])
    return `${type} application submitted successfully.`
  }

  if (!role) {
    return <Login onLogin={(nextRole, customerId) => {
      setCustomer(customerId)
      setRole(nextRole)
    }} />
  }

  if (role === 'admin') {
    return (
      <AdminDashboard
        navigation={adminNavigation}
        page={adminPage}
        onNavigate={setAdminPage}
        onLogout={logout}
        users={users}
        loans={loans}
        onDeleteUser={(id) => {
          if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers((previous) => previous.filter((user) => user.id !== id))
          }
        }}
        onUpdateLoan={(id, status) => setLoans((previous) =>
          previous.map((loan) => loan.id === id ? { ...loan, status } : loan)
        )}
        money={money}
      />
    )
  }

  return (
    <UserDashboard
      navigation={userNavigation}
      page={userPage}
      onNavigate={setUserPage}
      onLogout={logout}
      customer={customer}
      users={users}
      balance={balance}
      currentBalance={currentBalance}
      transactions={transactions}
      loans={loans}
      onTransfer={transferMoney}
      onPayBill={payBill}
      onApplyLoan={applyLoan}
      money={money}
    />
  )
}

export default App
