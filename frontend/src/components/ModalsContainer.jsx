import { useSelector, useDispatch } from 'react-redux'
import {
  selectAddChannelModal,
  selectRenameChannelModal,
  selectDeleteChannelModal,
  closeAddChannelModal,
  closeRenameChannelModal,
  closeDeleteChannelModal,
} from '../slices/ModalsSlice'

import AddChannelModal from './ModalWindowAddChannel'
import RenameChannelModal from './ModalWindowRenameChannel'
import DeleteChannelModal from './ModalWindowDelete'

const ModalsContainer = ({ channels, onAddChannel, onRenameChannel, onDeleteChannel }) => {
  const dispatch = useDispatch()

  const addChannelOpen = useSelector(selectAddChannelModal)
  const renameChannelId = useSelector(selectRenameChannelModal)
  const deleteChannelId = useSelector(selectDeleteChannelModal)

  const closeAdd = () => dispatch(closeAddChannelModal())
  const closeRename = () => dispatch(closeRenameChannelModal())
  const closeDelete = () => dispatch(closeDeleteChannelModal())

  return (
    <>
      {addChannelOpen && (
        <AddChannelModal
          show={addChannelOpen}
          onHide={closeAdd}
          existingChannels={channels.map(ch => ch.name)}
          onAddChannel={onAddChannel}
        />
      )}
      {renameChannelId && (
        <RenameChannelModal
          show={Boolean(renameChannelId)}
          onHide={closeRename}
          onRenameChannel={onRenameChannel}
          existingChannels={channels.map(ch => ch.name)}
          currentName={channels.find(ch => ch.id === renameChannelId)?.name || ''}
        />
      )}
      {deleteChannelId && (
        <DeleteChannelModal
          show={Boolean(deleteChannelId)}
          onHide={closeDelete}
          onConfirm={onDeleteChannel}
        />
      )}
    </>
  )
}

export default ModalsContainer
