import { useState } from 'react'

export default function Login({ onLogin }) {
  const [loginRole, setLoginRole] = useState('user')
  const [customerId, setCustomerId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!customerId.trim() || !password) {
      setError('Please enter your ID and password.')
      return
    }
    if (loginRole === 'admin' &&
        (customerId.trim() !== 'admin' || password !== 'admin123')) {
      setError('Invalid demo administrator ID or password.')
      return
    }
    setError('')
    onLogin(loginRole, customerId.trim())
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <a className="brand login-brand" href="/" aria-label="NovaBank home">
          <span className="brand-mark">N</span> NovaBank
        </a>
        <p className="eyebrow">WELCOME TO NOVABANK</p>
        <h1>Banking made simple.</h1>
        <p className="muted">Sign in to manage your money securely.</p>
        <div className="role-switch" aria-label="Choose account type">
          <button type="button" className={loginRole === 'user' ? 'selected' : ''} onClick={() => { setLoginRole('user'); setError('') }}>
            Customer
          </button>
          <button type="button" className={loginRole === 'admin' ? 'selected' : ''} onClick={() => { setLoginRole('admin'); setError('') }}>
            Administrator
          </button>
        </div>
        <form onSubmit={submit}>
          <label htmlFor="customer-id">Customer ID</label>
          <input id="customer-id" autoComplete="username" value={customerId} onChange={(event) => setCustomerId(event.target.value)} placeholder={loginRole === 'admin' ? 'admin' : 'Enter your customer ID'} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
          {error && <p className="form-message error" role="alert">{error}</p>}
          <button className="primary-button full-width" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <p className="demo-note">Demo only. Customer sign-in accepts any non-empty ID and password. Admin: <strong>admin / admin123</strong>.</p>
      </section>
      <aside className="login-aside">
        <div className="aside-content">
          <span className="eyebrow light">YOUR MONEY, YOUR WAY</span>
          <h2>Everyday banking, with a little more ease.</h2>
          <p>Keep track of your accounts, move money, and stay on top of what matters.</p>
          <div className="aside-decoration" aria-hidden="true">₹</div>
        </div>
        <span className="aside-footer">NovaBank Online · A front-end demonstration</span>
      </aside>
    </main>
  )
}
