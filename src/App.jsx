import { useEffect, useState } from 'react'
import { Button, Dropdown, Input, Layout, Menu, Space } from 'antd'
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import Conversation from './Conversation';

function App() {
  const [currentAPI, setCurrentAPI] = useState('openai');
  const [currentConversation, setCurrentConversation] = useState();
  const [conversations, setConversations] = useState([]);

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
  const fetchConversations = async () => {
    try {
      const response = await fetch("http://142.188.81.183:3000/chat/" + currentAPI + "/conversations");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      data = data.response;
      data = data.map(item => ({
        label: item.name,
        key: item._id
      }));
      setConversations(data);
      return data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const i = await fetchConversations();
      setCurrentConversation(i[0].key);
    };
  
    fetchData();
  }, [currentAPI]);

  const onAPIMenuClick = (e) => {
    setCurrentAPI(e.key);
  };
  const onConversationsMenuClick = (e) => {
    setCurrentConversation(e.key);
  };

  const newChat = () => {
    if (conversations.find(e=>e.key==='newChat')) {
      setCurrentConversation('newChat');
      return;
    }
    let nc = [
      ...conversations,
      {
        label: 'New chat',
        key: 'newChat'
      }
    ]
    setConversations(nc);
    setCurrentConversation('newChat');
  }

  const deleteChat = async () => {
    if (currentConversation === 'newChat') {
      let c = [...conversations];
      c.splice(c.indexOf({
        label: 'New chat',
        key: 'newChat'
      }));
    } else {
      await fetch("http://142.188.81.183:3000/chat/" + currentAPI + "/conversations/" + currentConversation, {
        method: 'DELETE',
      });
    }
    const i = await fetchConversations();
    setCurrentConversation(i[0].key);
  }

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
        <Sider style={{ backgroundColor: 'white' }}>
          <Button onClick={newChat} style={{ marginTop: '5px', marginBottom: '5px', marginRight: '5%', width: '50%' }} type='primary' >New Chat</Button>
          <Button onClick={deleteChat} style={{ marginTop: '5px', marginBottom: '5px', width: '45%' }} color='danger' variant='solid' >Delete Chat</Button>
          <Menu style={{ minHeight: "875px" }} onClick={onConversationsMenuClick} selectedKeys={[currentConversation]} mode="inline" items={conversations} />
        </Sider>
        <Layout>
          <Content style={{ backgroundColor: 'white' }}>
            <div style={{ height: '800px', backgroundColor: 'white' }}>
              <Conversation setId={setCurrentConversation} setAPI={setCurrentAPI} id={currentConversation} refresh={fetchConversations} api={currentAPI}/>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App
