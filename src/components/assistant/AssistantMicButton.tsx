'use client'

import { useEffect } from 'react'
import { useSpeechRecognition } from '@/lib/voice-utils'
import { Mic, MicOff } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface AssistantMicButtonProps {
  disabled?: boolean
  onInterimChange?: (text: string) => void
}

export function AssistantMicButton({
  disabled = false,
  onInterimChange,
}: AssistantMicButtonProps) {
  const {
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition()

  useEffect(() => {
    if (isListening && interimTranscript && onInterimChange) {
      onInterimChange(interimTranscript)
    }
  }, [interimTranscript, isListening, onInterimChange])

  const handleClick = () => {
    if (isListening) {
      stopListening()
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
            'p-2 rounded-lg transition-all duration-200',
            isListening
              ? 'mic-recording'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación'}
        >
          <Mic className="w-5 h-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{isListening ? 'Detener' : 'Hablar'}</p>
      </TooltipContent>
    </Tooltip>
  )
}