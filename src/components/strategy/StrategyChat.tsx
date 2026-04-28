'use client';

import * as React from 'react';
import { Send, Loader2, Trash2 } from 'lucide-react';
import { StrategyData, StrategyChatMessage } from '@/lib/strategy-types';
import { Button } from '@/components/ui/button';
import { StrategyMessage } from './StrategyMessage';
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
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

      <div className="bg-card border rounded-lg p-3 space-y-3 max-h-64 overflow-y-auto">
        {chatHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Pregunta sobre tu estrategia de negocio...
          </p>
        ) : (
          <>
            {chatHistory.map((message, index) => (
              <StrategyMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="¿Cuánto puedo gastar?"
          disabled={isLoading}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {showDeleteConfirm && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm">¿Eliminar conversación?</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteChat}
            >
              Eliminar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
