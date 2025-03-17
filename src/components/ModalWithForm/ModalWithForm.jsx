import React, { useState } from "react";
import "./ModalWithForm.css";

function ModalWithForm({children, buttonText, title, isOpen, closeModal, name}) {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    weather: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
  };

  const isValid = formData.name.length > 0 && formData.imageUrl.length > 0 && formData.weather.length > 0;

  return(
   <div className={`modal modal_type_${name} ${isOpen ? "modal_opened" : ""}`}>
        <div className="modal__content">
            <h2 className="modal__title">{title}</h2>
            <button 
            onClick={closeModal}
            type="button" 
            className="modal__close">
            </button>
     <form className="modal__form" onSubmit={handleSubmit}>
      <label htmlFor="name" className="modal__label">
        Name
        <input 
          type="text" 
          className="modal__input" 
          id="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </label>
      <label htmlFor="imageUrl" className="modal__label">
        Image
        <input 
          type="url"
          className="modal__input" 
          id="imageUrl"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleInputChange}
          required
        />
      </label>
      <fieldset className="modal__radio-buttons">
        <legend className="modal__legend">Select the weather type:</legend>
        <label className="modal__label modal__label_type_radio">
          <input
            type="radio"
            name="weather"
            value="hot"
            onChange={handleInputChange}
          />
          Hot
        </label>
        <label className="modal__label modal__label_type_radio">
          <input
            type="radio"
            name="weather"
            value="warm"
            onChange={handleInputChange}
          />
          Warm
        </label>
        <label className="modal__label modal__label_type_radio">
          <input
            type="radio"
            name="weather"
            value="cold"
            onChange={handleInputChange}
          />
          Cold
        </label>
      </fieldset>
        <button type="submit" className="modal__submit" disabled={!isValid}>
          {buttonText}
        </button>
      </form> 
       </div>
    </div>
  );
}

export default ModalWithForm;