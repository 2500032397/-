function AdminDashboard({ navigation, page, onNavigate, onLogout, users, loans, onDeleteUser, onUpdateLoan, money }) {
  const pendingLoans = loans.filter((loan) => loan.status === 'Pending')
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); onNavigate('adminDashboard') }}><span className="brand-mark">N</span> NovaBank</a>
        <div className="topbar-right"><span className="admin-badge">ADMIN</span><span className="avatar">A</span><strong>Administrator</strong><button className="text-button" onClick={onLogout}>Sign out</button></div>
      </header>
      <div className="workspace">
        <aside className="sidebar"><p className="sidebar-label">ADMINISTRATION</p><nav aria-label="Administrator navigation">{navigation.map(([id, icon, label]) => <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => onNavigate(id)}><span className="nav-icon" aria-hidden="true">{icon}</span>{label}</button>)}</nav><div className="sidebar-help"><span>Administrator access</span><p>Manage customer accounts and loan requests.</p></div></aside>
        <main className="content">
          <div className="page-heading"><p className="eyebrow">ADMINISTRATION</p><h1>{page === 'users' ? 'Manage users' : page === 'adminLoans' ? 'Loan approvals' : 'Admin dashboard'}</h1><p>Monitor customers and review banking activity.</p></div>
          {page === 'adminDashboard' && <>
            <div className="summary-grid">
              <SummaryCard label="Total customers" amount={users.length} icon="♙" tone="blue" detail="Registered NovaBank users" />
              <SummaryCard label="Pending loan approvals" amount={pendingLoans.length} icon="▣" tone="gold" detail="Applications awaiting review" />
              <SummaryCard label="Active accounts" amount={users.filter((user) => user.status === 'Active').length} icon="✓" tone="green" detail="Accounts in good standing" />
            </div>
            <LoanTable loans={pendingLoans.slice(0, 4)} onUpdateLoan={onUpdateLoan} money={money} />
            <UsersTable users={users.slice(0, 4)} onDeleteUser={onDeleteUser} />
          </>}
          {page === 'users' && <UsersTable users={users} onDeleteUser={onDeleteUser} />}
          {page === 'adminLoans' && <LoanTable loans={loans} onUpdateLoan={onUpdateLoan} money={money} />}
        </main>
      </div>
      <footer className="footer">© 2026 NovaBank · Admin demonstration</footer>
    </div>
  )
}

function SummaryCard({ label, amount, icon, tone, detail }) {
  return <article className="summary-card"><span className={`summary-icon ${tone}`}>{icon}</span><p className="summary-label">{label}</p><strong className="summary-amount">{amount}</strong><p className="summary-detail">{detail}</p></article>
}

function UsersTable({ users, onDeleteUser }) {
  return <section className="panel"><div className="panel-heading"><div><h2>Customers</h2><p>{users.length} accounts</p></div></div>{users.length ? <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Customer ID</th><th>Account</th><th>Status</th><th>Action</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><small>{user.email}</small></td><td>{user.id}</td><td>{user.account}</td><td><span className={`status ${user.status.toLowerCase()}`}>{user.status}</span></td><td><button className="danger-button" onClick={() => onDeleteUser(user.id)}>Delete</button></td></tr>)}</tbody></table></div> : <p className="empty-state">No customer accounts found.</p>}</section>
}

function LoanTable({ loans, onUpdateLoan, money }) {
  return <section className="panel"><div className="panel-heading"><div><h2>Loan applications</h2><p>Review and update application status</p></div></div>{loans.length ? <div className="table-wrap"><table><thead><tr><th>Application</th><th>Customer</th><th>Loan type</th><th>Amount</th><th>Status</th><th>Review</th></tr></thead><tbody>{loans.map((loan) => <tr key={loan.id}><td><strong>{loan.id}</strong></td><td>{loan.user}</td><td>{loan.type}</td><td>{loan.amount ? money(loan.amount) : 'To be assessed'}</td><td><span className={`status ${loan.status.toLowerCase()}`}>{loan.status}</span></td><td>{loan.status === 'Pending' ? <div className="action-group"><button className="approve-button" onClick={() => onUpdateLoan(loan.id, 'Approved')}>Approve</button><button className="danger-button" onClick={() => onUpdateLoan(loan.id, 'Rejected')}>Reject</button></div> : '—'}</td></tr>)}</tbody></table></div> : <p className="empty-state">No loan applications found.</p>}</section>
}

export default AdminDashboard
