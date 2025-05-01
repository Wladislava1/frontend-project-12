import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../slices/AuthSlice.js';
import { setChannels, addChannel, removeChannel, selectChannels } from '../slices/ChannelsSlice.js';
import { setMessages, addMessage, selectMessages } from '../slices/MessagesSlice.js';
import { io } from 'socket.io-client';
import axios from 'axios';

export const ChatPage = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const channels = useSelector(selectChannels);
  const messages = useSelector(selectMessages);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const dispatch = useDispatch();

  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const socketConnection = io('http://localhost:5002');
    setSocket(socketConnection);

    socketConnection.on('newMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
    });
    socketConnection.on('connect', () => setIsConnected(true));
    socketConnection.on('disconnect', () => setIsConnected(false));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const channelsResponse = await axios.get('/api/v1/channels', config);
        dispatch(setChannels(channelsResponse.data));
        if (channelsResponse.data.length > 0) {
          setSelectedChannelId(channelsResponse.data[0].id);
        }

        const messagesResponse = await axios.get('/api/v1/messages', config);
        dispatch(setMessages(messagesResponse.data));
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    if (token) {
      fetchChatData();
    }
  }, [token, dispatch]);

  const handleAddChannel = async () => {
    try {
      const newChannelData = { name: 'Новый канал', removable: true };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('/api/v1/channels', newChannelData, config);
      dispatch(addChannel(response.data));
      setSelectedChannelId(response.data.id);
    } catch (error) {
      console.error('Ошибка при добавлении канала:', error);
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/v1/channels/${channelId}`, config);

      const updatedChannels = channels.filter((ch) => ch.id !== channelId);
      dispatch(removeChannel(channelId));

      if (selectedChannelId === channelId) {
        setSelectedChannelId(updatedChannels.length > 0 ? updatedChannels[0].id : null);
      }
    } catch (error) {
      console.error('Ошибка при удалении канала:', error);
    }
  };

  const filteredMessages = messages.filter(
    (msg) => msg.channelId === selectedChannelId
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        '/api/v1/messages',
        {
          body: newMessage.trim(),
          channelId: selectedChannelId,
          username: user.username,
        },
        config
      );
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('Token:', token);
  console.log('User:', user);

  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
          <button type="button" className="btn btn-primary">Выйти</button>
        </div>
      </nav>
      {!isConnected && (
        <div className='alert alert-danger' role='alert'>
          Потеряно соединение с сервером. Попробуйте снова позже.
        </div>
      )}

      <div className="container h-100 my-4 overflow-hidden rounded shadow vh-100">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>Каналы</b>
              <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleAddChannel} aria-label="add chanel">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                </svg>
                <span className="visually-hidden">+</span>
              </button>
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels.map((channel) => (
                <li key={channel.id} className="nav-item w-100">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className={`w-100 rounded-0 text-start btn ${
                        channel.id === selectedChannelId ? 'btn-secondary' : ''
                      }`}
                      onClick={() => setSelectedChannelId(channel.id)}
                    >
                      <span>#</span>{channel.name}
                    </button>
                    {channel.removable && channel.id === selectedChannelId && (
                      <button
                        type="button"
                        className="btn btn-secondary rounded-0"
                        aria-label={`Delete channel ${channel.name}`}
                        onClick={() => handleDeleteChannel(channel.id)}
                      >-</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0"><b> {channels.find((ch) => ch.id === selectedChannelId)?.name || ''}</b></p>
                <span className="text-muted">{filteredMessages.length} сообщение</span>
              </div>
              <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="text-break mb-2">
                    <b>{msg.username}</b>: {msg.body}
                  </div>
                ))}
              </div>
              <div className="mt-auto px-5 py-3">
                <form onSubmit={handleSendMessage} novalidate="" className="py-1 border rounded-2">
                  <div className="input-group has-validation">
                    <input name="body" aria-label="Новое сообщение" placeholder="Введите сообщение..." className="border-0 p-0 ps-2 form-control"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={isSubmitting}/>
                    <button type="submit" className="btn btn-group-vertical" disabled={isSubmitting || !newMessage.trim()}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
                      </svg>
                      <span className="visually-hidden">Отправить</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};