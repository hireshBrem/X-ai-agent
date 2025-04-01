'use client'

import { usePlaygroundStore } from '@/store'
import Messages from './Messages'
import ScrollToBottom from '@/components/playground/ChatArea/ScrollToBottom'
import { StickToBottom } from 'use-stick-to-bottom'
import { useQueryState } from 'nuqs'
import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
// @ts-ignore
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'

const MessageArea = () => {
  const { messages } = usePlaygroundStore()
  const [sessionId] = useQueryState('session')
  const [copied, setCopied] = useState(false)
  const [browserbaseKey, setBrowserbaseKey] = useState(process.env.NEXT_PUBLIC_BROWSERBASE_API_KEY || '')
  const [isLoading, setIsLoading] = useState(false)
  const [replayEvents, setReplayEvents] = useState<any[] | null>(null)
  const [showReplay, setShowReplay] = useState(false)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)

  // More comprehensive cleanup function
  const closeReplay = useCallback(() => {
    // Set state
    setShowReplay(false)
    setReplayEvents(null)
    
    // Clean up player instance
    if (playerInstanceRef.current) {
      try {
        // Stop the player
        playerInstanceRef.current.pause()
        
        // Clean up DOM
        if (playerContainerRef.current) {
          while (playerContainerRef.current.firstChild) {
            playerContainerRef.current.removeChild(playerContainerRef.current.firstChild)
          }
        }
        
        // Reset the player reference
        playerInstanceRef.current = null
      } catch (error) {
        console.error("Error cleaning up player:", error)
      }
    }
    
    toast.success('Session replay closed')
  }, [])

  // Cleanup player instance on component unmount or when hiding
  useEffect(() => {
    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.pause()
        // Potentially more cleanup if needed by rrweb-player
      }
    }
  }, [])

  // Close replay player when session changes
  useEffect(() => {
    // If we have an active player and session changes, close the replay
    if (showReplay && playerInstanceRef.current) {
      closeReplay()
    }
  }, [sessionId, showReplay, closeReplay])

  const copyToClipboard = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId)
        .then(() => {
          setCopied(true)
          toast.success('Session ID copied to clipboard')
          setTimeout(() => setCopied(false), 2000)
        })
        .catch(() => {
          toast.error('Failed to copy to clipboard')
        })
    }
  }

  const fetchSessionRecording = async () => {
    if (!browserbaseKey) {
      toast.error('Browserbase API key is missing')
      return
    }
    if (!sessionId) {
      toast.error('Session ID is missing')
      return
    }

    setIsLoading(true)
    setShowReplay(false) // Hide previous replay if any
    setReplayEvents(null)
    
    if (playerInstanceRef.current) {
      playerInstanceRef.current.pause() // Pause existing player if any
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          browserbase_key: process.env.NEXT_PUBLIC_BROWSERBASE_API_KEY,
          session_id: sessionId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received rrweb events:", data)

      // Basic validation: Check if data is an array
      if (Array.isArray(data) && data.length > 0) {
        setReplayEvents(data)
        setShowReplay(true)
        toast.success('Session replay loaded')
      } else if (Array.isArray(data) && data.length === 0) {
        toast.info('No replay events found for this session.')
      } else {
        console.error('Invalid data format received:', data)
        toast.error('Failed to load replay: Invalid data format')
      }
    } catch (error) {
      console.error('Error fetching session recording:', error)
      toast.error('Error fetching session recording')
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to initialize the player when events are loaded and container is ready
  useEffect(() => {
    if (showReplay && replayEvents && playerContainerRef.current) {
      // Clear previous player instance if exists
      if (playerInstanceRef.current) {
        playerInstanceRef.current.pause()
        // Ensure the container is empty before creating a new player
        while (playerContainerRef.current.firstChild) {
          playerContainerRef.current.removeChild(playerContainerRef.current.firstChild)
        }
      }
      try {
        playerInstanceRef.current = new rrwebPlayer({
          target: playerContainerRef.current, // DOM element to mount the player
          props: {
            events: replayEvents,
            showController: true, // Show player controls
            autoPlay: true,
            width: 800, // Increased from 600
            height: 600, // Increased from 400
          },
        })
      } catch (error) {
        console.error("Failed to initialize rrweb player:", error)
        toast.error("Failed to initialize replay player.")
        setShowReplay(false)
        setReplayEvents(null)
      }
    } else if (!showReplay && playerInstanceRef.current) {
      // Cleanup when hiding
      playerInstanceRef.current.pause()
      
      // Additional cleanup for the DOM elements
      if (playerContainerRef.current) {
        while (playerContainerRef.current.firstChild) {
          playerContainerRef.current.removeChild(playerContainerRef.current.firstChild)
        }
      }
      
      // Reset the player reference
      playerInstanceRef.current = null
    }
  }, [showReplay, replayEvents])

  return (
    <div className="flex flex-col h-screen">
      {/* Session Header - Fixed at the top */}
      {sessionId && (
        <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 py-4 px-6">
          <div className="mx-auto w-full max-w-4xl flex items-center justify-between flex-wrap gap-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium uppercase text-gray-500">Session:</h3>
              <p className="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-xl truncate max-w-[250px] border border-primary/15" title={sessionId}>{sessionId}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={copyToClipboard}
                className="h-9 rounded-xl border border-primary/15 bg-accent text-xs px-3 py-2 text-gray-900 hover:bg-gray-200 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy ID'}
              </button>
              <button 
                onClick={fetchSessionRecording} 
                disabled={isLoading}
                className="h-9 rounded-xl bg-gray-900 text-xs text-white font-medium hover:bg-gray-900/80 px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading Replay...' : (showReplay ? 'Reload Replay' : 'Load Replay')}
              </button>
              {showReplay && (
                <button 
                  onClick={closeReplay}
                  className="h-9 rounded-xl bg-red-500 hover:bg-red-600 text-xs text-white font-medium px-3 py-2 transition-colors"
                >
                  Close Replay
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <StickToBottom
        className="relative mb-4 flex min-h-0 flex-grow flex-col"
        resize="smooth"
        initial="smooth"
      >
        <StickToBottom.Content className="flex flex-col">
          {/* Video Player Area - Centered in the middle */}
          <div className="flex-grow flex items-center justify-center h-full">
            {showReplay ? (
              <div className="w-full max-w-3xl px-4 py-8">
                <div ref={playerContainerRef} className="rrweb-player-container border rounded-lg overflow-hidden shadow-md"></div>
              </div>
            ) : (
              sessionId && !isLoading ? (
                <div className="text-center py-12 px-4">
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 max-w-xl mx-auto">
                    <div className="text-gray-400 mb-4 text-2xl font-medium">🖥️</div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Session Replay Available</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Click the "Load Replay" button to view the browser session recording.
                    </p>
                  </div>
                </div>
              ) : (
                !isLoading && <Messages messages={messages} />
              )
            )}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <div className="h-64 w-full max-w-xl mx-auto bg-gray-200 rounded-lg"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mt-4 mx-auto"></div>
                </div>
              </div>
            )}
          </div>
        </StickToBottom.Content>
        <ScrollToBottom />
      </StickToBottom>
    </div>
  )
}

export default MessageArea
