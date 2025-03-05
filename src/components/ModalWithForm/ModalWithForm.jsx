import "./ModalWithForm.css";

function ModalWithForm({children, buttonText, title, activeModal, onClose}) {

  return (
    <div  className={'modal ${activeModal === "add-garmant" && "modal__opened"}' }>
        <div className="modal__content">
            <h2 className="modal__title">{title}</h2>
            <button 
            onClick={onClose}
            type="button" 
            className="modal__close">
            Close
            </button>
            {children}
     <form className="modal__form">
        <button type="submit" className="modal__submit">
          {buttonText}
          </button>
      </form> 
       </div>
    </div>
  );
}

export default ModalWithForm;