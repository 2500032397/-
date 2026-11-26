import { useState } from 'react'

function TransactionTable({ transactions, money }) {
  if (!transactions.length) return <p className="empty-state">No transactions to show.</p>
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Transaction</th><th>Date</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>{transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td><strong>{transaction.description}</strong><small>{transaction.id}</small></td>
            <td>{transaction.date}</td>
            <td><span className={`type ${transaction.type.toLowerCase()}`}>{transaction.type}</span></td>
            <td className={transaction.type === 'Credit' ? 'credit-amount' : ''}>{transaction.type === 'Credit' ? '+' : '−'}{money(transaction.amount)}</td>
            <td><span className={`status ${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

export default function UserDashboard({
  navigation, page, onNavigate, onLogout, customer, users, balance, currentBalance,
  transactions, loans, onTransfer, onPayBill, onApplyLoan, money,
}) {
  const [filter, setFilter] = useState('All Transactions')
  const [notice, setNotice] = useState('')
  const user = users.find((item) => item.id === customer)
  const customerName = user?.name || customer
  const shownTransactions = (page === 'dashboard' ? transactions.slice(0, 4) : transactions)
    .filter((transaction) => filter === 'All Transactions' || transaction.type === filter.slice(0, -1))

  const handleTransfer = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const result = onTransfer(data)
    setNotice(result)
    if (result.startsWith('Demo transfer')) event.currentTarget.reset()
  }
  const handleBill = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const result = onPayBill(data)
    setNotice(result)
    if (result.startsWith('Demo bill')) event.currentTarget.reset()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
          <span className="brand-mark">N</span> NovaBank
        </a>
        <div className="topbar-right"><span className="online-indicator">●</span> Secure online banking <span className="topbar-divider" /> <span className="avatar">{customerName.charAt(0).toUpperCase()}</span><strong>{customerName}</strong><button className="text-button" onClick={onLogout}>Sign out</button></div>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <p className="sidebar-label">MENU</p>
          <nav aria-label="Customer navigation">
            {navigation.map(([id, icon, label]) => (
              <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => { onNavigate(id); setNotice('') }}>
                <span className="nav-icon" aria-hidden="true">{icon}</span>{label}
              </button>
            ))}
          </nav>
          <div className="sidebar-help"><span>Need help?</span><p>Our team is here for you, every day.</p><a href="mailto:support@novabank.example">Contact support →</a></div>
        </aside>
        <main className="content">
          {notice && <p className={`notice ${notice.startsWith('Demo') ? 'success' : 'error'}`} role="status">{notice}</p>}
          {page === 'dashboard' && <>
            <PageHeading eyebrow="YOUR OVERVIEW" title={`Good day, ${customerName}`} description="Here's what's happening with your accounts today." />
            <div className="summary-grid">
              <SummaryCard label="Total savings" amount={money(balance)} icon="₹" tone="blue" detail="Savings account ···· 2397" />
              <SummaryCard label="Current account" amount={money(currentBalance)} icon="▣" tone="green" detail="Current account ···· 2401" />
              <SummaryCard label="Active accounts" amount="2" icon="↗" tone="gold" detail="All accounts in good standing" />
            </div>
            <section className="panel">
              <div className="panel-heading"><div><h2>Recent transactions</h2><p>Your latest account activity</p></div><button className="link-button" onClick={() => onNavigate('transactions')}>View all →</button></div>
              <TransactionTable transactions={transactions.slice(0, 4)} money={money} />
            </section>
            <div className="security-banner"><span className="shield">✓</span><div><strong>Your accounts are protected</strong><p>NovaBank will never ask you to share your password or OTP.</p></div></div>
          </>}
          {page === 'accounts' && <>
            <PageHeading eyebrow="YOUR MONEY" title="My accounts" description="Review the balances across your NovaBank accounts." />
            <div className="account-grid">
              <SummaryCard label="Savings account" amount={money(balance)} icon="₹" tone="blue" detail="Account number ···· 2397" />
              <SummaryCard label="Current account" amount={money(currentBalance)} icon="▣" tone="green" detail="Account number ···· 2401" />
            </div>
            <section className="panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Transactions across your accounts</p></div></div><TransactionTable transactions={transactions} money={money} /></section>
          </>}
          {page === 'transfer' && <><PageHeading eyebrow="MOVE MONEY" title="Transfer money" description="Send money to a beneficiary. Transfers are simulated in this demo." /><form className="panel form-panel" onSubmit={handleTransfer}>
            <h2>Beneficiary details</h2><p className="panel-subtitle">Enter the account details and amount to transfer.</p>
            <label>Beneficiary name<input name="beneficiary" required placeholder="Name on the account" /></label>
            <div className="form-row"><label>Account number<input name="accountNumber" inputMode="numeric" pattern="\d{9,18}" required placeholder="9–18 digits" /></label><label>IFSC code<input name="ifsc" required pattern="[A-Za-z]{4}0[A-Za-z0-9]{6}" placeholder="e.g. HDFC0001234" /></label></div>
            <label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" max={balance} required placeholder="0.00" /></label>
            <p className="available-balance">Available balance: <strong>{money(balance)}</strong></p><button className="primary-button" type="submit">Review transfer →</button>
          </form></>}
          {page === 'transactions' && <><PageHeading eyebrow="ACCOUNT ACTIVITY" title="Transactions" description="Review your recent credits and debits." />
            <section className="panel"><div className="panel-heading"><div><h2>All transactions</h2><p>{transactions.length} transactions</p></div><label className="filter-label">Filter<select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All Transactions</option><option>Credits</option><option>Debits</option></select></label></div><TransactionTable transactions={shownTransactions} money={money} /></section>
          </>}
          {page === 'bills' && <><PageHeading eyebrow="PAYMENTS" title="Bill payments" description="Pay a bill from your NovaBank account." /><form className="panel form-panel" onSubmit={handleBill}>
            <h2>Pay a bill</h2><p className="panel-subtitle">Select a category and provide your consumer number.</p>
            <label>Bill category<select name="category"><option>Electricity</option><option>Water</option><option>Internet</option><option>Mobile</option></select></label>
            <label>Consumer number<input name="consumerNumber" required placeholder="Enter consumer number" /></label>
            <label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" max={balance} required placeholder="0.00" /></label>
            <p className="available-balance">Available balance: <strong>{money(balance)}</strong></p><button className="primary-button" type="submit">Pay bill →</button>
          </form></>}
          {page === 'loans' && <><PageHeading eyebrow="BORROWING" title="Loans" description="Explore loan options and track your applications." />
            <div className="loan-options">{['Personal Loan', 'Education Loan', 'Home Loan'].map((type) => <article className="loan-card" key={type}><span className="loan-icon">↗</span><h2>{type}</h2><p>Flexible options designed around your needs.</p><button className="outline-button" onClick={() => setNotice(onApplyLoan(type))}>Apply now →</button></article>)}</div>
            <section className="panel"><div className="panel-heading"><div><h2>Your applications</h2><p>Application status at a glance</p></div></div>
              {loans.filter((loan) => loan.user === customerName || loan.user === customer).length ? <div className="table-wrap"><table><thead><tr><th>Application</th><th>Loan type</th><th>Amount</th><th>Status</th></tr></thead><tbody>{loans.filter((loan) => loan.user === customerName || loan.user === customer).map((loan) => <tr key={loan.id}><td><strong>{loan.id}</strong></td><td>{loan.type}</td><td>{loan.amount ? money(loan.amount) : 'To be assessed'}</td><td><span className={`status ${loan.status.toLowerCase()}`}>{loan.status}</span></td></tr>)}</tbody></table></div> : <p className="empty-state">You have no loan applications yet.</p>}
            </section>
          </>}
          {page === 'profile' && <><PageHeading eyebrow="ACCOUNT SETTINGS" title="Your profile" description="Your personal and account details." /><section className="panel profile-panel"><div className="profile-avatar">{customerName.charAt(0).toUpperCase()}</div><div className="profile-details"><h2>{customerName}</h2><p className="muted">Customer ID: {customer}</p><dl><div><dt>Email</dt><dd>{user?.email || 'Not provided'}</dd></div><div><dt>Account type</dt><dd>{user?.account || 'Savings'}</dd></div><div><dt>Account status</dt><dd><span className="status active">{user?.status || 'Active'}</span></dd></div></dl></div></section></>}
        </main>
      </div>
      <footer className="footer">© 2026 NovaBank · Demo banking interface</footer>
    </div>
  )
}

function PageHeading({ eyebrow, title, description }) {
  return <div className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
}

function SummaryCard({ label, amount, icon, tone, detail }) {
  return <article className="summary-card"><span className={`summary-icon ${tone}`}>{icon}</span><p className="summary-label">{label}</p><strong className="summary-amount">{amount}</strong><p className="summary-detail">{detail}</p></article>
}
