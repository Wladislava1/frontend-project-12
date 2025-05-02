import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteChannelModal = ({ show, onHide, onConfirm }) => {
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onConfirm]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onHide} className="me-2">
          Отменить
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;
