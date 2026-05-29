import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [automationName, setAutomationName] = useState('')
  const [automations, setAutomations] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)

      if (session) {
        fetchAutomations(session)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session) {
        fetchAutomations(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchAutomations = async (sessionData) => {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', sessionData.user.id)

    if (!error) {
      setAutomations(data)
    }
  }

  const createAutomation = async () => {
    const { error } = await supabase.from('automations').insert([
      {
        user_id: session.user.id,
        name: automationName,
        trigger_type: 'webhook',
        action_type: 'telegram',
      },
    ])

    if (!error) {
      setAutomationName('')
      fetchAutomations(session)
    }
  }

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    }
  }

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <div>
        <h1>Triggerly Dashboard</h1>

        <p>Welcome {session.user.email}</p>

        <button onClick={signOut}>Logout</button>

        <hr />

        <h2>Create Automation</h2>

        <input
          type="text"
          placeholder="Automation Name"
          value={automationName}
          onChange={(e) => setAutomationName(e.target.value)}
        />

        <button onClick={createAutomation}>
          Create
        </button>

        <hr />

        <h2>Your Automations</h2>

        {automations.map((automation) => (
          <div key={automation.id}>
            <h3>{automation.name}</h3>
            <p>Trigger: {automation.trigger_type}</p>
            <p>Action: {automation.action_type}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1>Triggerly</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={signIn}>Login</button>

      <button onClick={signUp}>Sign Up</button>
    </div>
  )
}

export default App