import React, { useState } from 'react';
import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';

export default function Conversation() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'You', content: input.trim() },
          ]);
          setInput('');
        }
      };
    return (
        <div 
            style={{
                padding: 24,
                margin: 0,
                background: 'white',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            >
            <div 
                style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '20px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                }}
            >
                {messages.map((message, index) => (
                <div 
                    key={index} 
                    style={{ marginBottom: '8px', overflowWrap: 'break-word' }}
                >
                    <b>{message.sender}:</b> {message.content}
                </div>
                ))}
            </div>
            
            <div 
                style={{
                display: 'flex',
                alignItems: 'center'
                }}
            >
                <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 5 }}
                style={{ fontSize: '20px' }}
                placeholder="Type your message..."
                />
                
                <Button 
                onClick={handleSend}
                type="primary" 
                style={{ fontSize: '20px', height: '40px', marginLeft: '20px' }}
                >
                Send
                </Button>
            </div>
        </div>
    )
}