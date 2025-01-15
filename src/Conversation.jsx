import React, { useEffect, useState } from 'react';
import { Select, Button, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactMarkdown from 'react-markdown';

export default function Conversation(props) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [currentModel, setCurrentModel] = useState();

    useEffect(() => {
        const fetchMessages = async () => {
            if (props.id) {
                const messages = await getConversation();
                if (Array.isArray(messages)) {
                    setMessages(messages);
                }
            }
        };
        fetchMessages();
    }, [props.id]);
    const models = {
        'openai': [
            { value: 'gpt-4o', label: 'gpt-4o' },
            { value: 'o1-mini', label: 'o1-mini' },
            { value: 'o1-preview', label: 'o1-preview' },
        ],
        'deepseek': [
            { value: 'deepseek-chat', label: 'deepseek-chat' }
        ]
    }

    const createConversation = async (message) => {
        console.log(currentModel);
        try {
            const response = await fetch("http://142.188.81.183:3000/chat/" + props.api + "/conversations/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: currentModel,
                    message: message
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            let data = await response.json();
            data = data.response;
            return data.messages;

        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const getResponse = async (message) => {
        try {
            const response = await fetch("http://142.188.81.183:3000/chat/" + props.api + "/conversations/response", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: props.id,
                    model: currentModel,
                    message: message
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const conv = await getConversation();
            return conv;
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const getConversation = async () => {
        try {
            const response = await fetch("http://142.188.81.183:3000/chat/" + props.api + "/conversations/" + props.id);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            let data = await response.json();
            data = data.response;
            setCurrentModel(data.model);
            return data.messages;
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    }
    

    const handleSend = () => {
        if (input.trim()) {
            setButtonDisabled(true);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'user', content: input.trim() },
                { role: 'assistant', content: <Spin style={{ paddingTop: '10px' }}/> }
            ]);
            setInput('');

            const fetchResponse = (messages.length === 0 
                ? createConversation(input.trim()) 
                : getResponse(input.trim())
            );

            fetchResponse
                .then((result) => {
                    setMessages(result);
                })
                .finally(() => {
                    setButtonDisabled(false);
                    props.refresh();
                });
        }
    };

    function renderContent(content) {
        if (typeof content === "string") {
            return <ReactMarkdown>{content}</ReactMarkdown>
        } else {
            return <div>{content}</div>;
        }
    }

    return (
        <div 
            style={{
                padding: 24,
                margin: 0,
                background: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Select
                style={{ marginBottom: '20px', width: '10%' }}
                options={ models[props.api] }
                value={ currentModel }
                onChange={(value) => setCurrentModel(value)}
            />
            <div 
                style={{
                maxWidth: '100%',
                minHeight: '500px',
                overflowWrap: 'break-word',
                overflowY: 'auto',
                marginBottom: '20px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: 'white',
                }}
            >
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        style={{ overflowWrap: 'break-word', marginBottom: '8px', wordBreak: 'break-all', }}
                    >
                        <b>{message.role}:</b>
                        {renderContent(message.content)}
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
                    disabled={buttonDisabled}
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