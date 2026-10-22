import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function Modal({ title, onClose, children, className = '' }) {
  const dialogRef = useRef(null);
  const closeHandlerRef = useRef(onClose);
  closeHandlerRef.current = onClose;

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    const dialogElement = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogElement.showModal();
    return () => {
      dialogElement.close();
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${className}`}
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        closeHandlerRef.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeHandlerRef.current();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <span className="eyebrow">RŌNIN / FIELD NOTES</span>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" />
          </button>
        </div>
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
