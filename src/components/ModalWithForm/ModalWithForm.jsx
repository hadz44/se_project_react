import React from "react";
import "./ModalWithForm.css";
import { Modal } from "../Modal/Modal";

function ModalWithForm({ name, onClose, isOpen, ...props }) {
  return (
    <Modal name={name} onClose={onClose} isOpen={isOpen}>
      <h2 className='modal__title'>{props.title}</h2>
      <form onSubmit={props.onSubmit} className="modal__form">
        {props.children}
      </form>
    </Modal>
  );
}

export default ModalWithForm;
