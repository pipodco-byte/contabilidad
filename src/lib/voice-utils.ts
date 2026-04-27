'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechRecognitionReturn {
  transcript: string
  interimTranscript: string
  isListening: boolean
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'es-CO'

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interim = ''

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interim += result[0].transcript
          }
        }

        setTranscript(finalTranscript || interim)
        setInterimTranscript(interim)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('[Voice] Recognition error:', event.error)
        setIsListening(false)
        setInterimTranscript('')
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setInterimTranscript('')
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognitionRef.current && isSupported) {
      setTranscript('')
      setInterimTranscript('')
      setIsListening(true)
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('[Voice] Start error:', err)
        setIsListening(false)
      }
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setInterimTranscript('')
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}