import React, { useState, useRef, useEffect } from 'react';

// SVG Icons as components
const MessageCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const LoaderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

export default function AlgorithmChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your algorithm tutor 🤖. Ask me about sorting, searching, graphs, DP, greedy, or anything else!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ API key not configured. Please add REACT_APP_OPENROUTER_API_KEY to your .env file."
        }
      ]);
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "AlgoBot"
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b:free",
            messages: [
              {
                role: "system",
                content:
                  "You are an algorithm tutor. Format responses using ONLY these elements:\n\n" +
                  "- Plain text with line breaks for sections\n" +
                  "- Emojis as section markers (like 📌 💡 ⏱️)\n" +
                  "- Bullet points with • for lists\n" +
                  "- Indented text (4 spaces) for code/examples\n" +
                  "- NO bold (**text**), NO code blocks (```), NO markdown headers\n\n" +
                  "STRUCTURE (use emojis as headers):\n" +
                  "1. 📌 Brief Overview (1-2 sentences)\n" +
                  "2. 💡 How It Works (3-4 bullets)\n" +
                  "3. 🔍 Example (show 2-3 steps, indented with 4 spaces)\n" +
                  "4. ⏱️ Complexity (bullet points)\n" +
                  "5. ✅ When to Use (1-2 scenarios)\n" +
                  "6. ❓ End with one follow-up question\n\n" +
                  "EXAMPLE FORMAT:\n\n" +
                  "📌 Quick Sort\n" +
                  "A divide-and-conquer algorithm that picks a pivot and partitions around it.\n\n" +
                  "💡 How It Works\n" +
                  "• Choose a pivot element\n" +
                  "• Partition: smaller left, larger right\n" +
                  "• Recursively sort both sides\n" +
                  "• Combine results\n\n" +
                  "🔍 Example\n" +
                  "    [7, 2, 1, 6] → pivot=6\n" +
                  "    [2, 1] 6 [7]\n" +
                  "    [1, 2] 6 [7]\n\n" +
                  "⏱️ Complexity\n" +
                  "• Time: O(n log n) average, O(n²) worst\n" +
                  "• Space: O(log n) for recursion\n\n" +
                  "✅ When to Use\n" +
                  "• Large datasets\n" +
                  "• When average-case performance matters\n\n" +
                  "❓ Want to see how pivot selection affects speed?\n\n" +
                  "Keep responses under 200 words. Use simple, clean formatting."
              },
              ...messages.map((m) => ({
                role: m.role,
                content: m.content
              })),
              userMessage
            ]
          })
        }
      );

      const data = await response.json();

      if (data?.choices && data.choices[0]) {
        let botContent = data.choices[0].message.content;

        if (botContent.split(" ").length > 140) {
          botContent =
            botContent.split(" ").slice(0, 140).join(" ") +
            "... (Want a deeper explanation?)";
        }

        const assistantMessage = {
          role: "assistant",
          content: botContent
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Try again? 😕"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

 const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleHoverStart = (e) => {
    e.currentTarget.style.transform = 'scale(1.1)';
  };

  const handleHoverEnd = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  const handleCloseHoverStart = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
  };

  const handleCloseHoverEnd = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#4F46E5';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#D1D5DB';
  };

  const handleSendHoverStart = (e) => {
    if (!loading && input.trim()) {
      e.currentTarget.style.backgroundColor = '#4338CA';
    }
  };

  const handleSendHoverEnd = (e) => {
    if (!loading && input.trim()) {
      e.currentTarget.style.backgroundColor = '#4F46E5';
    }
  };

  const styles = {
    floatingButton: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: '#4F46E5',
      color: 'white',
      padding: '16px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      zIndex: 1000,
    },
    onlineIndicator: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '12px',
      height: '12px',
      backgroundColor: '#4ADE80',
      borderRadius: '50%',
      border: '2px solid white',
    },
    chatWindow: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '384px',
      height: '600px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out',
    },
    header: {
      background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
      borderRadius: '16px 16px 0 0',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    botIconContainer: {
      backgroundColor: 'white',
      padding: '8px',
      borderRadius: '8px',
    },
    headerTitle: {
      color: 'white',
      fontWeight: 600,
      fontSize: '18px',
      margin: 0,
    },
    onlineStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    onlineDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#4ADE80',
      borderRadius: '50%',
      animation: 'pulse 2s infinite',
    },
    onlineText: {
      color: 'white',
      fontSize: '12px',
      opacity: 0.9,
    },
    closeButton: {
      color: 'white',
      backgroundColor: 'rgba(255,255,255,0.1)',
      border: 'none',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      backgroundColor: '#F9FAFB',
    },
    messageWrapper: {
      display: 'flex',
      gap: '8px',
      marginBottom: '12px',
    },
    messageWrapperUser: {
      justifyContent: 'flex-end',
    },
    messageWrapperAssistant: {
      justifyContent: 'flex-start',
    },
    avatar: {
      padding: '6px',
      borderRadius: '50%',
      height: '28px',
      width: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: '4px',
    },
    avatarBot: {
      backgroundColor: '#4F46E5',
      color: 'white',
    },
    avatarUser: {
      backgroundColor: '#4F46E5',
      color: 'white',
    },
    messageBubble: {
      maxWidth: '80%',
      borderRadius: '16px',
      padding: '8px 12px',
    },
    messageBubbleUser: {
      backgroundColor: '#4F46E5',
      color: 'white',
      borderBottomRightRadius: '4px',
    },
    messageBubbleAssistant: {
      backgroundColor: 'white',
      color: '#1F2937',
      borderBottomLeftRadius: '4px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    messageText: {
      whiteSpace: 'pre-wrap',
      fontSize: '14px',
      lineHeight: '1.5',
      margin: 0,
    },
    inputContainer: {
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '0 0 16px 16px',
      borderTop: '1px solid #E5E7EB',
    },
    inputWrapper: {
      display: 'flex',
      gap: '8px',
    },
    input: {
      flex: 1,
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #D1D5DB',
      borderRadius: '12px',
      outline: 'none',
    },
    sendButton: {
      backgroundColor: '#4F46E5',
      color: 'white',
      border: 'none',
      padding: '8px',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s',
    },
    sendButtonDisabled: {
      backgroundColor: '#D1D5DB',
      cursor: 'not-allowed',
    },
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.floatingButton}
          onMouseOver={handleHoverStart}
          onMouseOut={handleHoverEnd}
          onFocus={handleHoverStart}
          onBlur={handleHoverEnd}
          aria-label="Open chat"
        >
          <MessageCircleIcon />
          <span style={styles.onlineIndicator}></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <div style={styles.botIconContainer}>
                <BotIcon />
              </div>
              <div>
                <h2 style={styles.headerTitle}>AlgoBot</h2>
                <div style={styles.onlineStatus}>
                  <span style={styles.onlineDot}></span>
                  <p style={styles.onlineText}>Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
              onMouseOver={handleCloseHoverStart}
              onMouseOut={handleCloseHoverEnd}
              onFocus={handleCloseHoverStart}
              onBlur={handleCloseHoverEnd}
              aria-label="Close chat"
            >
              <XIcon />
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.messageWrapper,
                  ...(msg.role === 'user' ? styles.messageWrapperUser : styles.messageWrapperAssistant)
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{...styles.avatar, ...styles.avatarBot}}>
                    <BotIcon />
                  </div>
                )}
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAssistant)
                  }}
                >
                  <p style={styles.messageText}>{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div style={{...styles.avatar, ...styles.avatarUser}}>
                    <UserIcon />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{...styles.messageWrapper, ...styles.messageWrapperAssistant}}>
                <div style={{...styles.avatar, ...styles.avatarBot}}>
                  <BotIcon />
                </div>
                <div style={{...styles.messageBubble, ...styles.messageBubbleAssistant}}>
                  <LoaderIcon />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about an algorithm..."
                style={styles.input}
                disabled={loading}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  ...styles.sendButton,
                  ...(loading || !input.trim() ? styles.sendButtonDisabled : {})
                }}
                onMouseOver={handleSendHoverStart}
                onMouseOut={handleSendHoverEnd}
                onFocus={handleSendHoverStart}
                onBlur={handleSendHoverEnd}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}