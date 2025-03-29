import '../../index.scss';
import './style.scss';
import React, { FC, useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { createActor } from '../../actor';
import { useNfts } from '../../context/@nfts/NftProvider';

interface AddNftModalProps {
  onSubmit: () => void;
  onClose: () => void;
}

export const AddNftModal: FC<AddNftModalProps> = ({ onSubmit, onClose }) => {
  const { refetch } = useNfts();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !file) {
      alert('Please fill in all fields and upload an image');
      return;
    }

    const buffer = await file.arrayBuffer();
    const imageData = Array.from(new Uint8Array(buffer));
    const contentType = file.type;

    try {
      const actor = createActor();
      const id = await actor.mint_nft(title, description, imageData, contentType);
      console.log('NFT minted with ID:', id)
      await refetch(); 
      onSubmit();
    } catch (err) {
      console.error('Minting failed:', err);
    }
  };

  return (
      <div className="glass modal-glass w-[960px] rounded-lg flex flex-col">
        <button
            aria-label="Close modal"
            className="card-btn modal-btn modal-close-btn absolute top-2 right-2 text-white p-2 hover:bg-white/10 transition z-10"
            onClick={onClose}
            type="button"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col mx-[6%] mt-[8%] mb-[6%] gap-3">
          <input
              className="modal-text-input p-3 rounded-lg"
              placeholder=".title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
              className="modal-text-input p-3 rounded-lg outline-none min-h-[120px]"
              placeholder=".description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
          <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg p-6 cursor-pointer hover:bg-white/5 transition"
              onClick={handleDropZoneClick}
          >
            <UploadCloud className="text-white/80" size={32} />
            <p className="mt-2 text-white/80">
              {file ? file.name : '.upload_your_masterpiece'}
            </p>
            <input
                accept="image/*"
                hidden
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
          </div>
          <button className="card-btn modal-btn" onClick={handleSubmit} type="button">
            .submit
          </button>
        </div>
      </div>
  );
};

export default AddNftModal;
