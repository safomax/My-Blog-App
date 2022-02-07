import React from "react";
import '../../modal.css';

 const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
      <button className="close-modal-button" type="button" onClick={handleClose}>
          X
        </button>
        {children}
        
      </section>
    </div>
  );
};

export {Modal};