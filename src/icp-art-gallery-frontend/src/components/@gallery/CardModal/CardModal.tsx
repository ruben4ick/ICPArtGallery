import '../../../index.scss';
import './style.scss';
import CardProps from '../interfaces/card-props';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import React from 'react';

interface CardModalProps {
  children: CardProps;
  onClose: () => void;
}

// TODO: hook for like
// TODO: hook for dislike
// TODO: hook for details

export const CardModal: React.FC<CardModalProps> = ({ children, onClose }) => {
  return (
    <div className="glass modal-glass w-[960px] rounded-lg overflow-hidden p-6 relative grid grid-cols-[60%_auto] grid-rows-[auto_auto] gap-4">
      <button
        aria-label="Close modal"
        className="card-btn modal-btn modal-close-btn absolute top-2 right-2 text-white p-2 hover:bg-white/10 transition z-10"
        onClick={onClose}
        type="button"
      >
        <X size={24} />
      </button>
      <img
        alt="card img"
        className="w-full h-auto object-cover rounded-lg col-start-1 row-start-1"
        src={children.imageLink}
      />
      {/*TODO: for description or some other text*/}
      <div className="modal-description col-start-2 row-end-2 pt-5">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus distinctio doloremque
          est illum incidunt nisi sequi sint, vitae. Animi, beatae doloremque ea ex fuga fugiat nisi
          porro temporibus tenetur vel.
        </p>
      </div>
      <div className="modal-title col-start-1 row-start-2 self-start mt-[10px]">
        {children.name ? <span>{children.name}</span> : <span>.untitled</span>}
      </div>
      <div className="col-start-2 row-start-2 flex items-center justify-end gap-4 self-center mt-[10px]">
        <button className="card-btn modal-btn" type="button">
          <ThumbsUp size={20} />
        </button>
        <span className="like-percent modal-like-percent">
          {children.like_percentage !== null ? `${children.like_percentage}%` : '_null'}
        </span>
        <button className="card-btn modal-btn" type="button">
          <ThumbsDown size={20} />
        </button>
      </div>
    </div>
  );
};

export default CardModal;
