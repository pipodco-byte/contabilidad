'use client'

import { useSpeechRecognition } from '@/lib/voice-utils'
import { Mic, MicOff } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface AssistantMicButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function AssistantMicButton({ onTranscript, disabled = false }: AssistantMicButtonProps) {
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition()

  const handleClick = () => {
    if (isListening) {
      stopListening()
      if (transcript.trim()) {
        onTranscript(transcript.trim())
        resetTranscript()
      }
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled
            className="p-2 text-zinc-600 cursor-not-allowed"
            aria-label="Mic no disponible"
          >
            <MicOff className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Mic no disponible en este navegador</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            isListening
              ? "bg-rose-500/20 text-rose-400 animate-pulse"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isListening ? "Detener grabación" : "Iniciar grabación"}
        >
          {isListening ? (
            <Mic className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{isListening ? "Detener" : "Hablar"}</p>
      </TooltipContent>
    </Tooltip>
  )
}