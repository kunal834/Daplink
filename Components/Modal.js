'use client'
import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
    {/* ovelay  */}
      <div 
       
        className='fixed top-0 left-0 right-0 bottom-0 bg-transparent bg-opacity-50 z-50'
        onClick={onClose}
      />

      {/* popup box */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          zIndex: 1001
        }}
      >
          <button onClick={onClose} className='w-4'> <img src="/close.png" alt="" /></button>
        {children}
      
      </div>
    </>
  );
}
