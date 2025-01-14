import { useState } from 'react'
import { Button, Input, Layout, Menu, Space } from 'antd'
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import TextArea from 'antd/es/input/TextArea';
import Conversation from './Conversation';

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
            <Conversation/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App
