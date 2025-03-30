'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import React, { useState } from 'react'
import Icon from '@/components/ui/icon'
import { IconType } from '@/components/ui/icon'

interface ActionButtonProps {
  href: string
  variant?: 'primary' | 'secondary'
  text: string
  icon?: IconType
}

const ActionButton = ({ href, variant = 'secondary', text, icon }: ActionButtonProps) => {
  const baseStyles =
    'px-4 py-2 text-sm transition-all duration-200 font-dmmono tracking-tight flex items-center gap-2'
  const variantStyles = {
    primary: 'border border-border hover:bg-neutral-800 rounded-xl bg-gray-900 text-white hover:scale-105',
    secondary: 'border border-border rounded-xl hover:scale-105 text-black bg-gray-400'
  }

  return (
    <Link
      href={href}
      target="_blank"
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {icon && <Icon className={variant === 'primary' ? 'text-white' : 'text-black'} type={icon} size="xs" />}
      {text}
    </Link>
  )
}

const StepCard = ({ number, title, description }: { number: number, title: string, description: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * number }}
      className="flex gap-4 bg-background-secondary/50 p-4 rounded-xl border border-border hover:bg-background-secondary/80 transition-colors"
    >
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white text-sm font-medium">
        {number}
      </div>
      <div className="flex flex-col text-left">
        <h3 className="font-medium text-base ">{title}</h3>
        <p className="text-muted text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

const ChatBlankState = () => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  // Animation variants for the icon
  const iconVariants: Variants = {
    initial: { y: 0 },
    hover: {
      y: -8,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 10,
        mass: 0.5
      }
    },
    exit: {
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        mass: 0.6
      }
    }
  }

  // Animation variants for the tooltip
  const tooltipVariants: Variants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <section
      className="flex min-h-[80vh] w-full flex-col items-center justify-center text-center font-geist relative overflow-hidden"
      aria-label="Welcome message"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background-secondary/10 to-transparent z-0"></div>
      
      <div className="flex max-w-3xl flex-col gap-y-10 z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4"
        >
          
          <h1 className="text-3xl font-[600] tracking-tight">
            <div className="flex items-center justify-center gap-x-2 font-medium">
              <span className="flex items-center font-[600]">
                Interact with tweets 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" className="inline-block m-2 p-1 rounded-md text-white bg-black h-10 w-10">
                  <path fill="white" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg> 
                using AI agents.
              </span>
            </div>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <ActionButton
            href='https://github.com/hireshBrem/X-Browser-Agent'
            variant='primary'
            text='GITHUB REPO'
            icon='download'
          />
            
          <ActionButton
            href='https://x.com/hiresh_b'
            text="VISIT BUILDER'S PROFILE"
            variant='secondary'
            icon='xai'
          />

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className='flex flex-col gap-6'
        >
          <h2 className='text-xl font-[600]'>Getting Started</h2>
          
          <div className='flex flex-col gap-3'>
            <StepCard 
              number={1} 
              title="Login to Twitter" 
              description="Open a new tab and login to Twitter."
            />
            <StepCard 
              number={2} 
              title="Configure Environment" 
              description="Install dependencies and set up your environment variables for Twitter integration"
            />
            
            <StepCard 
              number={3} 
              title="Run the Agent" 
              description="Click the 'Run Agent' button to start the agent."
            />
            
            <StepCard 
              number={4} 
              title="Wait for Results" 
              description="Let the agent interact with tweets."
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ChatBlankState
