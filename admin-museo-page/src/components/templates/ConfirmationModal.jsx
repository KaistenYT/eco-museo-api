import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ConfirmationModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar' 
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        {cancelText}
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        {confirmText}
      </Button>
    </Modal.Footer>
  </Modal>
)

export default ConfirmationModal