import { useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const DeleteChannelModal = ({ show, onHide, onConfirm }) => {
  const { t } = useTranslation()
  useEffect(() => {
    if (!show) return

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onConfirm()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [show, onConfirm])

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('modals.deleteChannel.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">
          {t('modals.deleteChannel.confirmation')}
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onHide} className="me-2">
          {t('modals.deleteChannel.cancel')}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {t('modals.deleteChannel.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteChannelModal
