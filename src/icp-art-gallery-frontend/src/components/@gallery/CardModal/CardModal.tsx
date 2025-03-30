import '../../../index.scss';
import './style.scss';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import React from 'react';
import { Principal } from '@dfinity/principal';
import { useNftInteractions } from '../../../hooks/galery/use-nft-interactions';
import { CardProps } from '../../../interfaces';
import useModal from '../../../hooks/modal/use-modal';
import ErrorModal from '../../ErrorModal';
import { useAuth } from '../../../context/@wallet-login/AuthContext';

interface CardModalProps {
  children: CardProps;
  onClose: () => void;
}

const formatDate = (timestamp: bigint) => {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleString();
};

export const CardModal: React.FC<CardModalProps> = ({ children, onClose }) => {
  const { principal } = useAuth();
  const { likeNft, dislikeNft } = useNftInteractions();
  const { isOpen: isErrorOpen, open: openError, close: closeError } = useModal();

  const handleLike = () => {
    if (!principal) {
      openError();
      return;
    }
    likeNft(children.id);
  };

  const handleDislike = () => {
    if (!principal) {
      openError();
      return;
    }
    dislikeNft(children.id);
  };

  return (
    <>
      <div className="glass modal-glass w-[960px] rounded-lg overflow-hidden p-6 relative grid grid-cols-[60%_auto] grid-rows-[auto_auto_auto] gap-x-4">
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

        <div className="modal-description col-start-2 row-end-2 pt-5">
          <p>{children.description ?? '.no_description_provided.'}</p>
          <div className="mt-4 text-sm text-white/70">
            <p>
              <strong>Created at:</strong> {formatDate(children.created_at)}
            </p>
            <p>
              <strong>Author:</strong>{' '}
              {children.owner instanceof Principal ? children.owner.toText() : children.owner}
            </p>
            <p>
              <strong>Likes:</strong> {children.likes.toString()}
            </p>
            <p>
              <strong>Dislikes:</strong> {children.dislikes.toString()}
            </p>
          </div>
        </div>

        <div className="modal-title col-start-1 row-start-2 self-start mt-[10px]">
          {children.name ? <span>{children.name}</span> : <span>.untitled</span>}
        </div>

        <div className="col-start-2 row-start-2 flex items-center justify-end gap-4 self-center mt-[10px]">
          <button className="card-btn modal-btn" onClick={handleLike} type="button">
            <ThumbsUp size={20} />
          </button>
          <button className="card-btn modal-btn" onClick={handleDislike} type="button">
            <ThumbsDown size={20} />
          </button>
        </div>
      </div>

      {isErrorOpen ? (
        <ErrorModal message=".please_connect_your_wallet" onClose={closeError} />
      ) : null}
    </>
  );
};

export default CardModal;
