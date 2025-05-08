
import React from 'react';

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-xs w-full">
        <p className="text-lg text-gray-700 mb-4">{message}</p>
        <div className="flex justify-between">
          <button 
            onClick={onConfirm}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Confirm
          </button>
          <button 
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
