import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot, BookOpen } from 'lucide-react';
import { Message } from './MessageItem';
import { Button } from '@/components/ui/button';
import ReferenceModal from './ReferenceModal';

interface TypingMessageProps {
  message: Message;
  onComplete: () => void;
  typingSpeed?: number;
}

const TypingMessage: React.FC<TypingMessageProps> = ({ 
  message, 
  onComplete,
  typingSpeed = 10 // milliseconds per character
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  
  useEffect(() => {
    if (isComplete) return;
    
    if (displayedContent.length < message.content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(message.content.substring(0, displayedContent.length + 1));
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      onComplete();
    }
  }, [displayedContent, message.content, isComplete, onComplete, typingSpeed]);
  
  return (
    <div className="py-6 flex animate-fade-in bg-slate-50/80 dark:bg-slate-900/30">
      <div className="w-full max-w-3xl mx-auto flex gap-4 px-4 sm:px-6">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
            <Bot size={16} />
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="prose prose-slate dark:prose-invert max-w-none break-words">
            <p className="whitespace-pre-line">{displayedContent}</p>
            
            {isComplete && message.referenceChunks && message.referenceChunks.length > 0 && (
              <div className="mt-3 flex">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs flex items-center gap-1.5 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => setShowReferences(true)}
                >
                  <BookOpen size={14} />
                  <span>View Sources ({message.referenceChunks.length})</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {message.referenceChunks && (
        <ReferenceModal 
          isOpen={showReferences} 
          onClose={() => setShowReferences(false)} 
          chunks={message.referenceChunks} 
        />
      )}
    </div>
  );
};

export default TypingMessage; 