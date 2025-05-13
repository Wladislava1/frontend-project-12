import { useEffect, useState, useRef, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import leoProfanity from 'leo-profanity'
import {
  selectChannels,
  selectSelectedChannelId,
  setSelectedChannelId,
  setChannels,
  addChannel,
  removeChannel,
} from '../slices/ChannelsSlice'
import { setMessages, selectMessages } from '../slices/MessagesSlice'
import Navbar from './NavBar.jsx'
import useAuth from '../useAuth'
import { routes } from '../api/routes.js'
import useChatSocket from '../hook/useChatSocket.js'
import {
  selectRenameChannelModal,
  selectDeleteChannelModal,
  openAddChannelModal,
  closeAddChannelModal,
  openRenameChannelModal,
  closeRenameChannelModal,
  openDeleteChannelModal,
  closeDeleteChannelModal,
} from '../slices/ModalsSlice'
import ModalsContainer from './ModalsContainer.jsx'
import addSvg from '../assets/add.svg'
import arrowSvg from '../assets/ArrowRight.svg'
import RollbarContext from '../context/RollbarContext.js'

const ChatPage = () => {
  const menuRef = useRef(null)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const rollbar = useContext(RollbarContext)
  const channels = useSelector(selectChannels)
  const messages = useSelector(selectMessages)
  const renameChannelId = useSelector(selectRenameChannelModal)
  const deleteChannelId = useSelector(selectDeleteChannelModal)
  const selectedChannelId = useSelector(selectSelectedChannelId)
  const { handleLogout, token, user } = useAuth()
  const { isConnected, sendMessage } = useChatSocket(dispatch, token)
  const [menuChannelId, setMenuChannelId] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuChannelId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    const fetchChatData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const channelsResponse = await axios.get(routes.channels(), config)
        dispatch(setChannels(channelsResponse.data))

        const messagesResponse = await axios.get(routes.messages(), config)
        dispatch(setMessages(messagesResponse.data))
      }
      catch (error) {
        rollbar.error('Error fetching chat data', error)
      }
    }

    if (token) {
      fetchChatData()
    }
  }, [token, dispatch])

  const openRenameModal = (channelId) => {
    dispatch(openRenameChannelModal(channelId))
  }
  const closeRenameModal = () => {
    dispatch(closeRenameChannelModal())
  }

  const handleOpenAddChannelModal = () => {
    dispatch(openAddChannelModal())
  }
  const handleCloseAddChannelModal = () => {
    dispatch(closeAddChannelModal())
  }

  const openDeleteModal = (channelId) => {
    dispatch(openDeleteChannelModal(channelId))
  }
  const closeDeleteModal = () => {
    dispatch(closeDeleteChannelModal())
  }

  const handleSelectChannel = (channelId) => {
    dispatch(setSelectedChannelId(channelId))
  }

  const handleRenameChannel = async (newName) => {
    if (!renameChannelId) return

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const cleanName = leoProfanity.clean(newName)
      const response = await axios.patch(routes.channelById(renameChannelId), { name: cleanName }, config)

      dispatch(setChannels(
        channels.map(ch => (ch.id === renameChannelId ? response.data : ch)),
      ))

      closeRenameModal()
      toast.success(t('channels.renamed'))
    }
    catch (error) {
      rollbar.error('Error renaming channel', error)
      toast.error(t('channels.error'))
    }
  }

  const handleAddChannel = async (channelName) => {
    try {
      const cleanName = leoProfanity.clean(channelName.trim())
      const newChannelData = { name: cleanName, removable: true }
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(routes.channels(), newChannelData, config)
      dispatch(addChannel(response.data))
      handleCloseAddChannelModal()
      toast.success(t('channels.created'))
    }
    catch (error) {
      rollbar.error('Error adding channel', error)
      toast.error(t('channels.error'))
    }
  }

  const handleDeleteChannel = async () => {
    if (!deleteChannelId) return

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.delete(routes.channelById(deleteChannelId), config)

      dispatch(removeChannel(deleteChannelId))
      closeDeleteModal()
      toast.success(t('channels.deleted'))
    }
    catch (error) {
      rollbar.error('Error deleting channel', error)
      toast.error(t('channels.error'))
    }
  }

  const filteredMessages = messages.filter(
    msg => msg.channelId === selectedChannelId,
  )

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSubmitting(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const cleanMessage = leoProfanity.clean(newMessage.trim())
      console.log('Before:', newMessage)
      console.log('After:', cleanMessage)
      await axios.post(
        routes.messages(),
        {
          body: cleanMessage,
          channelId: selectedChannelId,
          username: user.username,
        },
        config,
      )
      sendMessage({ body: cleanMessage, channelId: selectedChannelId, username: user.username })
      setNewMessage('')
    }
    catch (error) {
      rollbar.error('Error sending message', error)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="d-flex flex-column h-100">
      <Navbar user={user} onLogout={handleLogout} t={t} />
      {!isConnected && (
        <div className="alert alert-danger" role="alert">
          {t('connection.lost')}
        </div>
      )}

      <div className="container h-100 my-4 overflow-hidden rounded shadow vh-100">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>
                {t('channels.title')}
              </b>
              <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleOpenAddChannelModal} aria-label={t('channels.addChannelAriaLabel')}>
                <img src={addSvg} alt={t('chatPage.add.alt')} width={25} height={25} />
                <span className="visually-hidden">
                  +
                </span>
              </button>
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels.map(channel => (
                <li key={channel.id} className="nav-item w-100">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className={`w-100 rounded-0 text-start btn text-truncate ${
                        channel.id === selectedChannelId ? 'btn-secondary' : ''
                      }`}
                      onClick={() => handleSelectChannel(channel.id)}
                    >
                      <span>
                        #
                        {' '}
                      </span>
                      {channel.name}
                    </button>
                    {channel.removable && (
                      <div className="position-relative">
                        <button
                          type="button"
                          className={`flex-grow-0 dropdown-toggle dropdown-toggle-split btn rounded-0 ${
                            channel.id === selectedChannelId ? 'btn-secondary' : 'btn-light'}`}
                          aria-label={t('channels.manageChannel')}
                          onClick={() => setMenuChannelId(
                            menuChannelId === channel.id ? null : channel.id,
                          )}
                        >
                          <span className="visually-hidden">
                            {t('channels.manageChannelAriaLabel')}
                          </span>
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
                                openDeleteModal(channel.id)
                                setMenuChannelId(null)
                              }}
                            >
                              {t('channels.delete')}
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                openRenameModal(channel.id)
                                setMenuChannelId(null)
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
                <p className="m-0">
                  <b>
                    {' '}
                    {channels.find(ch => ch.id === selectedChannelId)?.name || ''}
                  </b>
                </p>
                <span className="text-muted">
                  {t('messages.messageCount', { count: filteredMessages.length })}
                </span>
              </div>
              <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                {filteredMessages.map(msg => (
                  <div key={msg.id} className="text-break mb-2">
                    <b>
                      {msg.username}
                    </b>
                    :
                    {msg.body}
                  </div>
                ))}
              </div>
              <div className="mt-auto px-5 py-3">
                <form onSubmit={handleSendMessage} noValidate className="py-1 border rounded-2">
                  <div className="input-group has-validation">
                    <input
                      name="body"
                      aria-label={t('messages.new_message')}
                      placeholder={t('messages.newMessagePlaceholder')}
                      className="border-0 p-0 ps-2 form-control"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button type="submit" className="btn btn-group-vertical" disabled={isSubmitting || !newMessage.trim()}>
                      <img src={arrowSvg} alt={t('chatPage.send.alt')} width={20} height={20} />
                      <span className="visually-hidden">
                        {t('messages.send')}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalsContainer
        channels={channels}
        onAddChannel={handleAddChannel}
        onRenameChannel={handleRenameChannel}
        onDeleteChannel={handleDeleteChannel}
      />
    </div>
  )
}

export default ChatPage
