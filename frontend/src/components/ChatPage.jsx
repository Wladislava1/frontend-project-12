import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentToken, selectCurrentUser, setCredentials } from '../slices/AuthSlice.js';
import { setChannels, addChannel, removeChannel, selectChannels } from '../slices/ChannelsSlice.js';
import { setMessages, addMessage, selectMessages } from '../slices/MessagesSlice.js';
import { io } from 'socket.io-client';
import axios from 'axios';
import { AddChannelModal } from './ModalWindowAddChannel.jsx';
import DeleteChannelModal from './ModalWindowDelete.jsx';
import RenameChannelModal from './ModalWindowRenameChannel.jsx';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { useRollbar } from '@rollbar/react';

export const ChatPage = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const channels = useSelector(selectChannels);
  const messages = useSelector(selectMessages);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [menuChannelId, setMenuChannelId] = useState(null);
  const dispatch = useDispatch();
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);
  const [renameModalShow, setRenameModalShow] = useState(false);
  const [channelToRename, setChannelToRename] = useState(null);
  const { t } = useTranslation();
  const rollbar = useRollbar();
  leoProfanity.loadDictionary('ru');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuChannelId(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        rollbar.error('Error fetching chat data', error);
      }
    };

    if (token) {
      fetchChatData();
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(setCredentials({ user: null, token: null }));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const openRenameModal = (channel) => {
    setChannelToRename(channel);
    setRenameModalShow(true);
  };

  const handleOpenModal = () => {
    setModalShow(true);
  };
  const handleRenameChannel = async (newName) => {
    if (!channelToRename) return;
  
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const cleanName = leoProfanity.clean(newName);
      const response = await axios.patch(`/api/v1/channels/${channelToRename.id}`, { name: cleanName }, config);
  
      dispatch(setChannels(
        channels.map(ch => ch.id === channelToRename.id ? response.data : ch)
      ));
  
      setRenameModalShow(false);
      setChannelToRename(null);
      toast.success(t('channels.renamed'));
    } catch (error) {
      rollbar.error('Error renaming channel', error);
      toast.error(t('channels.error'));
    }
  };

  const handleAddChannel = async (channelName) => {
    try {
      const cleanName = leoProfanity.clean(channelName.trim());
      const newChannelData = { name: cleanName, removable: true };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('/api/v1/channels', newChannelData, config);
      dispatch(addChannel(response.data));
      setSelectedChannelId(response.data.id);
      setModalShow(false); 
      toast.success(t('channels.created'));
    } catch (error) {
      rollbar.error('Error adding channel', error);
      toast.error(t('channels.error'));
    }
  };

  const handleDeleteChannel = async () => {
    if (!channelToDelete) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/v1/channels/${channelToDelete}`, config);

      dispatch(removeChannel(channelToDelete));
      if (selectedChannelId === channelToDelete) {
        const updatedChannels = channels.filter(ch => ch.id !== channelToDelete);
        setSelectedChannelId(updatedChannels.length > 0 ? updatedChannels[0].id : null);
      }
      setDeleteModalShow(false);
      setChannelToDelete(null);
      toast.success(t('channels.deleted'));
    } catch (error) {
      rollbar.error('Error deleting channel', error);
      toast.error(t('channels.error'));
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
          body: leoProfanity.clean(newMessage.trim()),
          channelId: selectedChannelId,
          username: user.username,
        },
        config
      );
      setNewMessage('');
    } catch (error) {
      rollbar.error('Error sending message', error);
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
          <Link className="navbar-brand">
            Hexlet Chat
          </Link>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            {t('navbar.logout')}
          </button>
        </div>
      </nav>
      {!isConnected && (
        <div className='alert alert-danger' role='alert'>
          {t('connection.lost')}
        </div>
      )}

      <div className="container h-100 my-4 overflow-hidden rounded shadow vh-100">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('channels.title')}</b>
              <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleOpenModal} aria-label={t('channels.addChannelAriaLabel')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                </svg>
                <span className="visually-hidden">+</span>
              </button>
              <AddChannelModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                existingChannels={channels.map((ch) => ch.name)}
                onAddChannel={handleAddChannel}
              />
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels.map((channel) => (
                <li key={channel.id} className="nav-item w-100">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className={`w-100 rounded-0 text-start btn text-truncate ${
                        channel.id === selectedChannelId ? 'btn-secondary' : ''
                      }`}
                      onClick={() => setSelectedChannelId(channel.id)}
                    >
                      <span># </span>{channel.name}
                    </button>
                    {channel.removable && (
                    <div className="position-relative">
                      <button
                        type="button"
                        className={`flex-grow-0 dropdown-toggle dropdown-toggle-split btn rounded-0 ${
                        channel.id === selectedChannelId ? 'btn-secondary' : 'btn-light'}`}
                        aria-label={`Управление каналом ${channel.name}`}
                        onClick={() => setMenuChannelId(menuChannelId === channel.id ? null : channel.id)}
                      >
                        <span className="visually-hidden">{t('channels.manageChannelAriaLabel')}</span>
                      </button>

                      {menuChannelId === channel.id && (
                        <div 
                          ref={menuRef}
                          className="position-absolute bg-white border rounded shadow-sm end-0"
                          style={{ top: '100%', zIndex: 1000 }}
                        >
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              setChannelToDelete(channel.id);
                              setDeleteModalShow(true);       
                              setMenuChannelId(null);         
                            }}
                          >
                            {t('channels.delete')}
                          </button>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              openRenameModal(channel);
                              setMenuChannelId(null);
                            }}
                          >
                            {t('channels.rename')}
                          </button>
                        </div>
                      )}
                    </div>
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
                <span className="text-muted">{t('messages.messageCount', { count: filteredMessages.length })}</span>
              </div>
              <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="text-break mb-2">
                    <b>{msg.username}</b>: {msg.body}
                  </div>
                ))}
              </div>
              <div className="mt-auto px-5 py-3">
                <form onSubmit={handleSendMessage} noValidate className="py-1 border rounded-2">
                  <div className="input-group has-validation">
                    <input name="body" aria-label="Новое сообщение" placeholder={t('messages.newMessagePlaceholder')} className="border-0 p-0 ps-2 form-control"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={isSubmitting}/>
                    <button type="submit" className="btn btn-group-vertical" disabled={isSubmitting || !newMessage.trim()}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
                      </svg>
                      <span className="visually-hidden">{t('messages.send')}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteChannelModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        onConfirm={handleDeleteChannel}
      />
      <RenameChannelModal
        show={renameModalShow}
        onHide={() => setRenameModalShow(false)}
        onRenameChannel={handleRenameChannel}
        existingChannels={channels.map(ch => ch.name)}
        currentName={channelToRename?.name || ''}
      />
    </div>
  );
};