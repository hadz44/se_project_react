import React, { useState } from "react";
import "./ModalWithForm.css";

function ModalWithForm({children, buttonText, title, activeModal, closeModal,escClose, submit
}) {
const [imageSrc, setImageSrc] = useState('');

const handlesubmit = (evt) => {
    preventDefault(evt);
    console.log("image added:", imageSrc);
}

  return(
    <div  className={`modal ${activeModal === "add-garmant" && "modal__opened"}` }>
        <div className="modal__content">
            <h2 className="modal__title">{title}</h2>
            <button 
            onClick={closeModal}
            type="button" 
            className="modal__close">
            </button>
     <form className="modal__form" onSubmit={handlesubmit}>
      {children}
        <button type="submit" className="modal__submit">
          {buttonText}
          </button>
      </form> 
       </div>
    </div>
  )
}

export default ModalWithForm;