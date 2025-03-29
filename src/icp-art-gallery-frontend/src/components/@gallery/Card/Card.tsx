import '../../../index.scss';
import './style.scss';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import React from 'react';
import CardModal from '../CardModal/CardModal';
import useModal from '../../../hooks/modal/use-modal';
import { CardProps } from '../../../interfaces';

// TODO: hook for like
// TODO: hook for dislike
// TODO: hook for details

export const Card: React.FC<{ children: CardProps }> = ({ children }) => {
  const { isOpen: isCardOpen, open: openCard, close: closeCard } = useModal();

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
        <button
          className="card-btn details-btn mt-[16px] mb-[4%] mx-[4%]"
          onClick={openCard}
          type="button"
        >
          .details
        </button>
      </div>

      {isCardOpen ? (
        <div className="fixed w-full h-full flex items-center justify-center inset-0 z-99">
          <CardModal onClose={closeCard}>{children}</CardModal>
        </div>
      ) : null}
    </>
  );
};

export default Card;
