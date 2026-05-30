
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
    if (!automationName) return

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
    } else {
      alert('Signup successful!')
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
      <div className="min-h-screen bg-black text-white p-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-5xl font-bold">
                Triggerly Dashboard
              </h1>

              <p className="text-gray-400 mt-3">
                Welcome {session.user.email}
              </p>
            </div>

            <button
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl mb-10 shadow-lg">
            <h2 className="text-2xl font-semibold mb-5">
              Create Automation
            </h2>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Automation Name"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
              />

              <button
                onClick={createAutomation}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold"
              >
                Create
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Your Automations
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  className="bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800"
                >
                  <h3 className="text-2xl font-bold mb-4">
                    {automation.name}
                  </h3>

                  <div className="space-y-2 text-gray-300">
                    <p>
                      Trigger:
                      <span className="text-white ml-2">
                        {automation.trigger_type}
                      </span>
                    </p>

                    <p>
                      Action:
                      <span className="text-white ml-2">
                        {automation.action_type}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="bg-zinc-900 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        
        <h1 className="text-5xl font-bold text-white text-center mb-3">
          Triggerly
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Micro-Automation SaaS
        </p>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none"
          />

          <button
            onClick={signIn}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Login
          </button>

          <button
            onClick={signUp}
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-semibold"
          >
            Sign Up
          </button>
        </div>

      </div>
    </div>
  )
}

export default App
