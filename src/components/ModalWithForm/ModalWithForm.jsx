import React from "react";
import "./ModalWithForm.css";
import closeIcon from "../../assets/close-light.png";

function ModalWithForm({
  children,
  title,
  activeModal,
  isOpen,
  onClose,
  onSubmit,
}) {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content-form">
        <h2 className="modal__title">{title}</h2>
        <button className="modal__close" type="button" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        <form onSubmit={onSubmit} className="modal__form">
          {children}
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
