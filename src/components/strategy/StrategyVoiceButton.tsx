'use client';

import * as React from 'react';
import { Mic, Loader2, Check, X } from 'lucide-react';

type VoiceState = 'idle' | 'recording' | 'transcribing' | 'success' | 'error';

interface StrategyVoiceButtonProps {
  disabled?: boolean;
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
}

export function StrategyVoiceButton({ disabled, onTranscript, onError }: StrategyVoiceButtonProps) {
  const [state, setState] = React.useState<VoiceState>('idle');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionRef.current = new (SR as any)();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current || disabled) return;

    setState('recording');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((result: any) => result[0].transcript)
        .join('');

      if (event.results[event.results.length - 1].isFinal) {
        setState('transcribing');
        setTimeout(() => {
          setState('success');
          onTranscript(transcript);
          setTimeout(() => setState('idle'), 500);
        }, 300);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionRef.current.onerror = (event: any) => {
      setState('error');
      onError?.(event.error);
      setTimeout(() => setState('idle'), 1000);
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  const toggleRecording = () => {
    if (state === 'idle') {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'recording': return <Mic className="h-5 w-5" />;
      case 'transcribing': return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'success': return <Check className="h-5 w-5" />;
      case 'error': return <X className="h-5 w-5" />;
      default: return <Mic className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (state) {
      case 'recording':
        return 'text-primary-foreground bg-primary/20 animate-pulse scale-105';
      case 'transcribing':
        return 'text-indigo-500';
      case 'success':
        return 'text-emerald-500';
      case 'error':
        return 'text-rose-400';
      default:
        return 'text-muted-foreground hover:text-foreground';
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      disabled={disabled}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${getStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      title={state === 'idle' ? 'Grabar' : 'Detener'}
    >
      {getIcon()}
    </button>
  );
}