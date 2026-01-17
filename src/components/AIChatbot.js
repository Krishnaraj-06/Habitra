import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse } from '../services/openai';
import '../styles/AIChatbot.css';

const AIChatbot = ({ userProfile, metrics, habits }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hi ${userProfile.fullName}! I'm your personal habit analyst. I can help you understand your patterns, optimize your routines, and provide insights based on your data. What would you like to know?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPersonalizedResponse = (userMessage, userContext) => {
    const message = userMessage.toLowerCase().trim();
    
    // Handle greetings naturally
    if (message.match(/^(hi|hello|hey+|hii+|heyy+|sup|what's up|wassup)$/)) {
      return `Hey ${userContext.userProfile.fullName}! How can I help you today? I can analyze your habit patterns, explain your metrics, or give you personalized recommendations based on your data.`;
    }
    
    if (message.match(/^(how are you|how's it going|what's up)$/)) {
      return `I'm doing great, thanks for asking ${userContext.userProfile.fullName}! I'm here to help you understand your habit data and optimize your routines. What would you like to explore?`;
    }
    
    if (message.match(/^(thanks|thank you|thx)$/)) {
      return `You're welcome ${userContext.userProfile.fullName}! Feel free to ask me anything about your habits, stress patterns, or performance trends.`;
    }

    const completedHabits = userContext.habits.filter(h => h.completed);
    const incompleteHabits = userContext.habits.filter(h => !h.completed);
    const totalHabits = userContext.habits.length;
    
    if (totalHabits === 0) {
      return `${userContext.userProfile.fullName}, I notice you haven't added any habits yet. Would you like me to suggest some habits based on your ${userContext.userProfile.habitIntensity} intensity level and ${userContext.userProfile.activeTime} preference?`;
    }

    const completionRate = Math.round((completedHabits.length / totalHabits) * 100);
    const bestHabit = userContext.habits.reduce((best, current) => 
      current.streak > (best?.streak || 0) ? current : best, null);
    const strugglingHabit = userContext.habits.reduce((worst, current) => 
      current.streak < (worst?.streak || Infinity) ? current : worst, null);

    if (message.includes('stress') || message.includes('burnout')) {
      return `${userContext.userProfile.fullName}, looking at your stress patterns: Your ${userContext.userProfile.stressSensitivity} stress sensitivity combined with ${userContext.userProfile.habitIntensity} intensity shows your current ${userContext.metrics.stress} stress level is ${userContext.metrics.stress === 'Low' ? 'well-managed' : 'elevated'}. ${incompleteHabits.length > 0 ? `Today's incomplete habits (${incompleteHabits.map(h => h.name).join(', ')}) might be contributing to pressure.` : 'Your completed habits today suggest good stress management.'}`;
    }
    
    if (message.includes('discipline') || message.includes('score')) {
      return `${userContext.userProfile.fullName}, your discipline analysis: Current score of ${userContext.metrics.discipline}/10 reflects your ${userContext.userProfile.habitIntensity} approach. ${bestHabit ? `Your strongest habit ${bestHabit.name} (${bestHabit.streak} day streak) shows what you're capable of.` : ''} ${strugglingHabit && strugglingHabit.streak < 7 ? `${strugglingHabit.name} at ${strugglingHabit.streak} days needs more focus.` : ''}`;
    }
    
    if (message.includes('consistency') || message.includes('improve')) {
      return `${userContext.userProfile.fullName}, consistency breakdown: ${userContext.metrics.consistency}% over ${userContext.metrics.streak} days with your ${userContext.userProfile.activeTime} timing preference. Today you're at ${completionRate}% completion. ${incompleteHabits.length > 0 ? `Focus on ${incompleteHabits[0].name} next - it fits your ${userContext.userProfile.dailyAvailability} schedule.` : 'Excellent work completing all habits today!'}`;
    }
    
    if (message.includes('habit') || message.includes('focus') || message.includes('what') || message.includes('should')) {
      if (incompleteHabits.length > 0) {
        return `${userContext.userProfile.fullName}, here's what I recommend: You have ${incompleteHabits.length} habits left today. Start with ${incompleteHabits[0].name} (${incompleteHabits[0].streak} day streak) since your ${userContext.userProfile.activeTime} energy is best for this type of activity.`;
      } else {
        return `${userContext.userProfile.fullName}, amazing! You've completed all ${totalHabits} habits today. ${bestHabit ? `${bestHabit.name} is clearly working well with ${bestHabit.streak} days.` : ''} With ${userContext.metrics.consistency}% consistency, you're ${userContext.metrics.consistency > 85 ? 'ready for new challenges' : 'building solid foundations'}.`;
      }
    }
    
    // Default helpful response
    return `${userContext.userProfile.fullName}, I can help you with several things: analyze your ${userContext.metrics.consistency}% consistency, explain your ${userContext.metrics.discipline}/10 discipline score, review your ${completionRate}% completion rate today, or suggest optimizations for your ${userContext.userProfile.activeTime} routine. What interests you most?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    const userContext = {
      userProfile,
      metrics,
      habits
    };

    setTimeout(() => {
      const personalizedResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: getPersonalizedResponse(currentMessage, userContext)
      };
      
      setMessages(prev => [...prev, personalizedResponse]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chatbot">
      <div className="chat-header">
        <h3>AI Analysis Assistant</h3>
        <p>Your personal habit analyst</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content}
            </div>
            {message.type === 'ai' && (
              <div className="message-label">AI Analysis</div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai">
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="message-label">AI Analysis</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Say hi or ask about your habits..."
          rows="2"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="send-button"
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;