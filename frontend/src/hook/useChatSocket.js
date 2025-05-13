import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { addMessage } from '../slices/MessagesSlice'

const useChatSocket = (dispatch, token) => {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!token) return

    const socket = io({
      auth: { token },
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message))
    })

    return () => {
      socket.disconnect()
    }
  }, [dispatch, token])

  const sendMessage = (message) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('newMessage', message)
    }
  }

  return { isConnected, sendMessage }
}

export default useChatSocket
