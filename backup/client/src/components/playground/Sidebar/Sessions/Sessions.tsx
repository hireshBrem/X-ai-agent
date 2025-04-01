'use client'

import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { usePlaygroundStore } from '@/store'
import { useQueryState } from 'nuqs'
import SessionItem from './SessionItem'
import SessionBlankState from './SessionBlankState'
import useSessionLoader from '@/hooks/useSessionLoader'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { FC } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import useChatActions from '@/hooks/useChatActions'
import { PlaygroundChatMessage } from '@/types/playground'

interface SessionData {
  id: string;
  messages?: PlaygroundChatMessage[];
  [key: string]: any;
}

interface SkeletonListProps {
  skeletonCount: number
}

const SkeletonList: FC<SkeletonListProps> = ({ skeletonCount }) => {
  const skeletons = useMemo(
    () => Array.from({ length: skeletonCount }, (_, i) => i),
    [skeletonCount]
  )

  return skeletons.map((skeleton, index) => (
    <Skeleton
      key={skeleton}
      className={cn(
        'mb-1 h-11 rounded-lg px-3 py-2',
        index > 0 && 'bg-background-secondary'
      )}
    />
  ))
}

dayjs.extend(utc)

const formatDate = (
  timestamp: number,
  format: 'natural' | 'full' = 'full'
): string => {
  const date = dayjs.unix(timestamp).utc()
  return format === 'natural'
    ? date.format('HH:mm')
    : date.format('YYYY-MM-DD HH:mm:ss')
}

const Sessions = () => {
  const [sessionId, setSessionId] = useQueryState('session')
  const [isScrolling, setIsScrolling] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  )
  const { getSession, getSessions } = useSessionLoader()
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { isSessionsLoading, setMessages, messages } = usePlaygroundStore()
  const { clearChat, addMessage } = useChatActions()
  const prevMessagesLengthRef = useRef<number>(0);

  const [sessions, setSessions] = useState<SessionData[]>([])

  const handleScroll = () => {
    setIsScrolling(true)

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1500)
  }

  useEffect(() => {
    // Get sessions from local storage
    const sessionsData = localStorage.getItem('sessions')
    console.log('Sessions: ', sessionsData)
    if (sessionsData) {
        setSessions(JSON.parse(sessionsData))
    }else{
        // Create session array in local storage
        localStorage.setItem('sessions', JSON.stringify([]))
        setSessions([])
    }
  }, []) // Only run on mount

  // Effect to save messages to the current session
  useEffect(() => {
    // Only update if messages have changed (length or content)
    if (selectedSessionId && messages.length > 0 && prevMessagesLengthRef.current !== messages.length) {
      prevMessagesLengthRef.current = messages.length;
      
      // Get the latest sessions data directly from localStorage to avoid dependency on state
      const currentSessionsData = localStorage.getItem('sessions');
      if (currentSessionsData) {
        const currentSessions = JSON.parse(currentSessionsData) as SessionData[];
        const updatedSessions = currentSessions.map((session: SessionData) => {
          if (session.id === selectedSessionId) {
            return { ...session, messages };
          }
          return session;
        });
        
        localStorage.setItem('sessions', JSON.stringify(updatedSessions));
        // Avoid calling setSessions here to prevent re-renders
      }
    }
  }, [messages, selectedSessionId]);

  const handleDeleteSession = (index: number) => {
    const updatedSessions = sessions.filter((session, i) => i !== index);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
    
    // If the deleted session was selected, clear the chat
    const deletedSession = sessions[index];
    if (deletedSession && deletedSession.id === selectedSessionId) {
      clearChat();
      setSelectedSessionId(null);
    }
  }

  const handleSelectSession = (session: SessionData) => {
    // Load the session data into the chat area
    if (session && session.messages && Array.isArray(session.messages)) {
      setMessages(session.messages);
      setSelectedSessionId(session.id);
      setSessionId(session.id);
      prevMessagesLengthRef.current = session.messages.length;
    } else {
      // If no messages, initialize with a default welcome message
      const defaultMessage: PlaygroundChatMessage = {
        role: 'system',
        content: 'Browser agent session started',
        created_at: Math.floor(Date.now() / 1000)
      };
      
      // Update the session with default message
      const updatedSessions = sessions.map((s: SessionData) => {
        if (s.id === session.id) {
          return { ...s, messages: [defaultMessage] };
        }
        return s;
      });
      
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      
      // Update the chat area
      setMessages([defaultMessage]);
      setSelectedSessionId(session.id);
      setSessionId(session.id);
      prevMessagesLengthRef.current = 1;
    }
  }

  const refreshSessions = useCallback(() => {
    const sessionsData = localStorage.getItem('sessions')
    if (sessionsData) {
      setSessions(JSON.parse(sessionsData))
    }
  }, [])

  return (
    <div className="w-full">
      <div className="mb-2 w-full flex justify-between items-center">
        <span className="text-xs font-medium uppercase">Agent Sessions</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={refreshSessions}
          title="Refresh sessions"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div
        className={`h-[calc(100vh-345px)] overflow-y-auto font-geist transition-all duration-300 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:transition-opacity [&::-webkit-scrollbar]:duration-300 ${isScrolling ? '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-background [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:opacity-0' : '[&::-webkit-scrollbar]:opacity-100'}`}
        onScroll={handleScroll}
        onMouseOver={() => setIsScrolling(true)}
        onMouseLeave={handleScroll}
      >
        {sessions.length === 0 ? (
          <SessionBlankState />
        ) : (
          <div className="flex flex-col gap-y-1 pr-1">
            {
            sessions.length > 0 && [...sessions].reverse().map((session, index) => (   
            <div 
                className={`flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer ${selectedSessionId === session.id ? 'bg-gray-100' : ''}`} 
                key={session.id}
                onClick={() => handleSelectSession(session)}
            >
                <h1 className="text-xs truncate max-w-[80%]" title={session?.id}>
                    {session?.id ? session.id.substring(0, 10) + '...' : 'No ID'}
                </h1>
                <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(sessions.length - 1 - index);
                    }}
                    className="text-xs text-gray-500 hover:text-red-500"
                >
                    Delete
                </button>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sessions
