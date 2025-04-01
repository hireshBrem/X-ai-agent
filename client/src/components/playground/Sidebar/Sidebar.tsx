'use client'
import { Button } from '@/components/ui/button'
import useChatActions from '@/hooks/useChatActions'
import { usePlaygroundStore } from '@/store'
import { motion } from 'framer-motion'
import { useState, useEffect, ChangeEvent } from 'react'
import Icon from '@/components/ui/icon'
import Sessions from './Sessions'
import { toast } from 'sonner'
import { useQueryState } from 'nuqs'
import { Skeleton } from '@/components/ui/skeleton'

// CSS class for hiding scrollbars
const scrollbarHideStyles = {
  // For Firefox
  scrollbarWidth: 'none' as 'none',
  // For IE/Edge
  msOverflowStyle: 'none' as 'none',
  // Custom class will handle WebKit (Chrome/Safari) in the className
};

// Simple Input component instead of importing
const Input = ({
  type = "text",
  value,
  onChange,
  className,
  placeholder
}: {
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full rounded-md border px-3 py-2 text-sm ${className || ''}`}
      placeholder={placeholder}
    />
  )
}

const EnvVarInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text",
  placeholder,
  href
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  type?: "text" | "password";
  placeholder?: string;
  href?: string;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isValueVisible, setIsValueVisible] = useState(false)
  const inputType = type === "password" && !isPasswordVisible ? "password" : "text"
  const shouldHideValue = (type !== "password" && !isValueVisible) || (type === "password" && !isPasswordVisible)
  
  // Display masked value or actual value based on visibility state
  const displayValue = shouldHideValue && value ? 
    value.replace(/./g, '•') : 
    value
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs underline text-muted">
            {label}
          </a>
        )}
        {!href && (
          <label className="text-xs font-medium uppercase text-muted">{label}</label>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => type === "password" ? setIsPasswordVisible(!isPasswordVisible) : setIsValueVisible(!isValueVisible)}
          className="h-6 p-0 text-xs text-muted"
        >
          <Icon 
            type={shouldHideValue ? "check" : "x"} 
            size="xxs" 
            className="mr-1" 
          />
          {shouldHideValue ? "Show" : "Hide"}
        </Button>
      </div>
      <Input
        type={type === "password" ? inputType : "text"}
        value={type === "password" ? value : displayValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-xl border border-primary/15 bg-accent text-xs"
        placeholder={placeholder}
      />
    </div>
  )
}

const AgentControls = () => {
    // Environment variables state
    const [openAIKey, setOpenAIKey] = useState(process.env.NEXT_PUBLIC_OPENAI_API_KEY || '')
    const [browserbaseKey, setBrowserbaseKey] = useState(process.env.NEXT_PUBLIC_BROWSERBASE_API_KEY || '')
    const [browserbaseProjectId, setBrowserbaseProjectId] = useState(process.env.NEXT_PUBLIC_BROWSERBASE_PROJECT_ID || '')
    const [contextId, setContextId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const contextId = localStorage.getItem('context_id')
        console.log('Context ID: ', contextId)
        if (contextId) {
        setContextId(contextId)
        }
    }, [])
        
    // Handler for running the agent
    const handleLogin = async () => {
        // Validate environment variables
        if (!openAIKey) {
        toast.error('Please enter your OpenAI API key')
        return
        }
        
        if (!browserbaseKey || !browserbaseProjectId) {
        toast.error('Please enter your Browserbase credentials')
        return
        }

        if (!email) {
        toast.error('Please enter your email or username')
        return
        }

        if (!password) {
        toast.error('Please enter your password')
        return
        }

        // Store browserbase key in localStorage
        localStorage.setItem('browserbase_key', browserbaseKey.trim())

        try {
        setIsLoading(true)
        
        // Create Context
        if (!contextId) {
            await handleCreateContext()
        }
        console.log('Context ID: ', contextId)

        // POST to endpoint with openAIKey, browserbaseKey, browserbaseProjectId
        const session = await fetch('http://localhost:8000/api/login-x', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                openai_key: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
                browserbase_key: process.env.NEXT_PUBLIC_BROWSERBASE_API_KEY,
                browserbase_project_id: process.env.NEXT_PUBLIC_BROWSERBASE_PROJECT_ID,
                contextId: contextId,
                email: email,
                password: password
            })
        }).then(res => res.json())

        console.log('Session: ', session)

        // Create a session object with messages field
        const sessionWithMessages = {
        ...session,
        browserbase_key: browserbaseKey.trim(), // Store browserbase key in session
        messages: [
            {
            role: 'system',
            content: 'Browser agent session started',
            created_at: Math.floor(Date.now() / 1000)
            }
        ]
        };

        // Append session to 'sessions' local storage
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
        localStorage.setItem('sessions', JSON.stringify([...sessions, sessionWithMessages]))

        toast.success('Agent run initiated successfully!')
        } catch (error) {
        console.error('Error running agent:', error)
        toast.error('Failed to run agent. Please try again.')
        } finally {
        setIsLoading(false)
        }
    }

    const handleRunAgent = async () => {

         // Validate environment variables
         if (!openAIKey) {
            toast.error('Please enter your OpenAI API key')
            return
        }
        
        if (!browserbaseKey || !browserbaseProjectId) {
        toast.error('Please enter your Browserbase credentials')
        return
        }

        if (!contextId) {
        toast.error('Please create a context first')
        return
        }

        try {
        setIsLoading(true)
        
        // POST to endpoint with openAIKey, browserbaseKey, browserbaseProjectId
        const session = await fetch('http://localhost:8000/api/run-agent', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                openai_key: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
                browserbase_key: process.env.NEXT_PUBLIC_BROWSERBASE_API_KEY,
                browserbase_project_id: process.env.NEXT_PUBLIC_BROWSERBASE_PROJECT_ID,
                contextId: contextId
            })
        }).then(res => res.json())

        console.log('Session: ', session)

        // Create a session object with messages field
        const sessionWithMessages = {
        ...session,
        browserbase_key: browserbaseKey.trim(), // Store browserbase key in session
        messages: [
            {
            role: 'system',
            content: 'Browser agent session started',
            created_at: Math.floor(Date.now() / 1000)
            }
        ]
        };

        // Append session to 'sessions' local storage
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
        localStorage.setItem('sessions', JSON.stringify([...sessions, sessionWithMessages]))

        toast.success('Agent run initiated successfully!')
        } catch (error) {
        console.error('Error running agent:', error)
        toast.error('Failed to run agent. Please try again.')
        } finally {
        setIsLoading(false)
        }

    }

    const handleCreateContext = async () => {
        const context = await fetch('http://localhost:3000/api/context', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        }).then(res => res.json())

        let contextId = context.contextId

        // Store contextId in localStorage
        localStorage.setItem('context_id', contextId)
        setContextId(contextId)
        console.log('Context ID: ', contextId)
    }
    
    return (
    <div className="space-y-6">

        <h1 className='text-xs text-muted'> Context ID: {contextId ? contextId : 'Not created. Login to create it automatically.'}</h1>
        <div className="border-t border-gray-300 my-4 w-full" />

        {/* Login Credentials */}
        <div className="space-y-4">
            <div className="text-sm font-medium">Login Credentials</div>
            
            <EnvVarInput
              label="Email or Username"
              value={email}
              onChange={setEmail}
              type="text"
              placeholder="Enter your email or username"
            />
            
            <EnvVarInput
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="Enter your password"
            />
        </div>

      {/* Login Button */}
      <Button
        onClick={handleLogin}
        disabled={isLoading}
        size="lg"
        className="h-9 w-full rounded-xl bg-gray-900 text-xs text-white font-medium hover:bg-gray-900/80"
      >
        <span className="uppercase text-white">Login</span>
      </Button>

      {/* Divider */}
      <div className="border-t border-gray-300 my-4 w-full" />

      {/* Run Agent Button */}
      <Button
        onClick={handleRunAgent}
        disabled={isLoading}
        size="lg"
        className="h-9 w-full rounded-xl bg-gray-900 text-xs text-white font-medium hover:bg-gray-900/80"
      >
        <span className="uppercase text-white">Run Agent</span>
      </Button>

      <div className="border-t border-gray-300 my-4 w-full" />

      {/* Environment Variables */}
      <div className="space-y-4 mt-5">
        <div className="text-sm font-medium">Environment Variables</div>
        
        <EnvVarInput
          label="OpenAI API Key"
          value={openAIKey}
          onChange={setOpenAIKey}
          type="password"
          placeholder="sk-..."
          href="https://platform.openai.com/api-keys"
        />

        <EnvVarInput
          label="Browserbase Project ID"
          value={browserbaseProjectId}
          onChange={setBrowserbaseProjectId}
          type="text"
          placeholder="Enter your Browserbase project ID"
          href="https://www.browserbase.com/settings"
        />

        <EnvVarInput
          label="Browserbase API Key"
          value={browserbaseKey}
          onChange={setBrowserbaseKey}
          type="password"
          placeholder="Enter your Browserbase API key"
          href="https://www.browserbase.com/settings"
        />

      </div>
    </div>
  )
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.aside
      className="relative flex h-screen shrink-0 grow-0 flex-col overflow-hidden px-4 py-3 font-dmmono text-gray-900 border-r border-gray-200"
      initial={{ width: '18rem' }}
      animate={{ width: isCollapsed ? '2.5rem' : '18rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-3 top-3 z-10 p-1 text-gray-900"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        type="button"
        whileTap={{ scale: 0.95 }}
      >
        <Icon
          type="sheet"
          size="xs"
          color='#111827'
          className={`transform rounded-sm text-gray-900 bg-gray-900 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
        />
      </motion.button>
      <motion.div
        className="w-full space-y-6 overflow-y-auto pr-2 scrollbar-hide"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          visibility: isCollapsed ? 'hidden' : 'visible',
          transitionProperty: 'visibility',
          transitionDelay: isCollapsed ? '0.3s' : '0s'
        }}
      >
        <div className="mt-10"></div>
        <AgentControls />
        <div className="border-t border-gray-300 my-4 w-full" />
        <Sessions />
        <div className="h-4" />
      </motion.div>
    </motion.aside>
  )
}

export default Sidebar
