import '../../index.scss';
import './style.scss';
import React, {FC} from "react";
import {UploadCloud, X} from "lucide-react";

interface AddNftModalProps {
    onSubmit: () => void;
    onClose: () => void;
}

export const AddNftModal: FC<AddNftModalProps> = ({onSubmit, onClose}) => {
    return (
        <div className="glass modal-glass w-[960px] rounded-lg flex flex-col">
            <button
                aria-label="Close modal"
                className="card-btn modal-btn modal-close-btn absolute top-2 right-2 text-white p-2 hover:bg-white/10 transition z-10"
                onClick={onClose}
                type="button">
                <X size={24}/>
            </button>
            <div className="flex flex-col mx-[6%] mt-[8%] mb-[6%] gap-3">
                <input
                    className="modal-text-input p-3 rounded-lg"
                    placeholder=".title"
                    type="text"
                />
                <textarea
                    className="modal-text-input p-3 rounded-lg outline-none min-h-[120px]"
                    placeholder=".description"
                />
                {/*add onClick={handleDropZoneClick}*/}
                <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg p-6 cursor-pointer hover:bg-white/5 transition">
                    <UploadCloud className="text-white/80" size={32}/>
                    <p className="mt-2 text-white/80">.upload_your_masterpiece</p>
                    {/*add ref={}*/}
                    <input
                        accept="image/*"
                        hidden
                        type="file"
                    />
                </div>
                <button className="card-btn modal-btn" onClick={onSubmit} type="button">
                    .submit
                </button>
            </div>
        </div>
    )
}

export default AddNftModal;
