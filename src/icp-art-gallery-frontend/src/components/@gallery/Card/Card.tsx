import '../../../index.scss';
import './style.scss';
import CardProps from '../interfaces/card-props';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import React, { useState } from 'react';
import CardModal from '../CardModal/CardModal';

// TODO: hook for like
// TODO: hook for dislike
// TODO: hook for details

export const Card: React.FC<{ children: CardProps }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="glass w-[380px] rounded-lg overflow-hidden flex flex-col">
        <img
          alt="card img"
          className="mt-[4%] mx-[4%] w-[92%] h-auto object-cover rounded-lg"
          src={children.imageLink}
        />
        <div className="title pl-[3%] mt-[10px]">
          {children.name ? <span>{children.name}</span> : <span>.untitled</span>}
        </div>
        {/*TODO: add hooks for likes and dislikes*/}
        <div className="flex items-center justify-between gap-4 mt-[8px]">
          <button className="card-btn mx-[4%]" type="button">
            <ThumbsUp size={20} />
          </button>
          <span className="like-percent">
            {children.like_percentage !== null ? `${children.like_percentage}%` : '_null'}
          </span>
          <button className="card-btn mx-[4%]" type="button">
            <ThumbsDown size={20} />
          </button>
        </div>
        {/*TODO: add hook for details*/}
        <button
          className="card-btn details-btn mt-[16px] mb-[4%] mx-[4%]"
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          .details
        </button>
      </div>

      {isModalOpen ? (
        <div className="fixed w-full h-full flex items-center justify-center inset-0 z-99">
          <CardModal onClose={() => setIsModalOpen(false)}>{children}</CardModal>
        </div>
      ) : null}
    </>
  );
};

export default Card;
