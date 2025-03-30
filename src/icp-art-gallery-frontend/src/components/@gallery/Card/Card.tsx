import '../../../index.scss';
import './style.scss';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import React from 'react';
import CardModal from '../CardModal/CardModal';
import useModal from '../../../hooks/modal/use-modal';
import { CardProps } from '../../../interfaces';
import { useNftInteractions } from '../../../hooks/galery/use-nft-interactions';

export const Card: React.FC<{ children: CardProps }> = ({ children }) => {
  const { isOpen: isCardOpen, open: openCard, close: closeCard } = useModal();
  const { likeNft, dislikeNft } = useNftInteractions();

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
        <div className="flex items-center justify-between gap-4 mt-[8px] px-[4%]">
          <div className="flex items-center gap-1">
            <button className="card-btn" onClick={() => likeNft(children.id)} type="button">
              <ThumbsUp size={20} />
            </button>
            <span className="like-percent text-white mx-2">{children.likes.toString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="like-percent text-white mx-2">{children.dislikes.toString()}</span>
            <button className="card-btn" onClick={() => dislikeNft(children.id)} type="button">
              <ThumbsDown size={20} />
            </button>
          </div>
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
