import { useState } from 'react'
import { Button, Input, Layout, Menu, Space } from 'antd'
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import TextArea from 'antd/es/input/TextArea';

function App() {
  const [currentAPI, setCurrentAPI] = useState('openai');
  const [currentConversation, setCurrentConversation] = useState('c1')
  const items = [
    {
      label: 'ChatGPT',
      key: 'openai',
    },
    {
      label: 'deepseek',
      key: 'deepseek',
    }
  ];
  const conversations = [
    {
      label: 'conversation 1',
      key: 'c1',
    },
    {
      label: 'conversation 2',
      key: 'c2',
    },
    {
      label: 'conversation 3',
      key: 'c3',
    }
  ];
  const onAPIMenuClick = (e) => {
    console.log('click ', e);
    setCurrentAPI(e.key);
  };
  const onConversationsMenuClick = (e) => {
    console.log('click ', e);
    setCurrentConversation(e.key);
  };

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      // 更新聊天记录
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'You', content: input.trim() },
      ]);
      // 清空输入框内容
      setInput('');
    }
  };

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
        }}
      >
        <b 
          style={{
            fontSize: "20px",
            fontStyle: "bold",
            color: "white",
            marginRight: '30px'
          }}
        >My AI Chat</b>
        <Menu style={{ minWidth: "800px" }} onClick={onAPIMenuClick} selectedKeys={[currentAPI]} mode="horizontal" items={items} theme="dark" />
      </Header>
      <Layout>
        <Sider>
          <Menu style={{ minHeight: "875px" }} onClick={onConversationsMenuClick} selectedKeys={[currentConversation]} mode="inline" items={conversations} />
        </Sider>
        <Layout>
          <Content>
            <div style={{
              padding: 24,
              margin: 0,
              background: 'white',
              minHeight: '100%', 
              display: 'flex',
              flexDirection: 'column'
            }}>
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
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <b>{message.sender}:</b> {message.content}
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 5 }} 
                style={{ fontSize: '20px' }}>
                placeholder="Type your message..."
                </TextArea>
                <Button 
                onClick={handleSend} // 点击事件绑定
                type="primary" 
                style={{ fontSize: '20px', height: '40px', marginLeft: '20px' }}>
                  Send
                  </Button>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App
