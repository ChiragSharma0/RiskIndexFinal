import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";

const Example = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setModalOpen(true)} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Modal
      </button>

      <ModalWrapper isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold">This is a modal!</h2>
        <p>Any content can go here.</p>
      </ModalWrapper>
    </div>
  );
};

export default Example;
