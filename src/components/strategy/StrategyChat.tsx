'use client';

import * as React from 'react';
import { Send, Loader2, Trash2 } from 'lucide-react';
import { StrategyData, StrategyChatMessage } from '@/lib/strategy-types';
import { Button } from '@/components/ui/button';
import { StrategyMessage } from './StrategyMessage';
import { StrategyVoiceButton } from './StrategyVoiceButton';
import { toast } from 'sonner';

interface StrategyChatProps {
  strategyData: StrategyData;
  chatHistory: StrategyChatMessage[];
  onAddMessage: (message: StrategyChatMessage) => void;
  onClearChat: () => void;
}

export function StrategyChat({
  strategyData,
  chatHistory,
  onAddMessage,
  onClearChat,
}: StrategyChatProps) {
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: isFirstLoad ? 'instant' : 'smooth'
      });
    }
    setIsFirstLoad(false);
  }, [chatHistory, isFirstLoad]);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: StrategyChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    onAddMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/strategy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          strategyData,
          history: chatHistory.slice(-10),
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();

      const assistantMessage: StrategyChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      onAddMessage(assistantMessage);
    } catch (error) {
      toast.error('Error al comunicarse con el advisor');
      const errorMessage: StrategyChatMessage = {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu pregunta. Intenta de nuevo.',
        timestamp: new Date().toISOString(),
      };
      onAddMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteChat = () => {
    onClearChat();
    setShowDeleteConfirm(false);
    toast.success('Chat eliminado');
  };

  const handleVoiceTranscript = (text: string) => {
    setInput(text);
  };

  const handleVoiceError = (error: string) => {
    switch (error) {
      case 'not-allowed':
        toast.error('Micrófono no disponible');
        break;
      case 'no-speech':
        toast.error('No detecté voz');
        break;
      case 'network':
        toast.error('Error de conexión');
        break;
      default:
        toast.error('Error con el micrófono');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="text-sm font-medium text-muted-foreground">Strategy Advisor</h3>
        {chatHistory.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-4">
        {chatHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            Pregunta sobre tu estrategia de negocio...
          </p>
        ) : (
          <>
            {chatHistory.map((message, index) => (
              <StrategyMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-end gap-2 rounded-2xl bg-muted/30 border border-border/20 p-2 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <StrategyVoiceButton
            disabled={isLoading}
            onTranscript={handleVoiceTranscript}
            onError={handleVoiceError}
          />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿Cuánto puedo gastar?"
            disabled={isLoading}
            rows={1}
            className="flex-1 px-3 py-2 min-h-[44px] max-h-40 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:opacity-50 transition-all resize-none overflow-y-auto"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-full h-9 w-9 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-popover border border-border rounded-xl p-6 max-w-sm mx-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-popover-foreground mb-2">
              ¿Eliminar conversación?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Se eliminará toda la conversación.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteChat}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
