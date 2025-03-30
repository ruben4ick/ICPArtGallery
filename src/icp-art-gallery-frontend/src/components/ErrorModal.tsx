import { FC } from 'react';
import { X } from 'lucide-react';
import Portal from './Portal';

interface ErrorModalProps {
    message: string;
    onClose: () => void;
}

const ErrorModal: FC<ErrorModalProps> = ({ message, onClose }) => {
    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                <div className="glass modal-glass w-[480px] rounded-lg p-6 relative">
                    <button
                        aria-label="Close modal"
                        className="card-btn modal-btn modal-close-btn absolute top-2 right-2 text-white p-2 hover:bg-white/10 transition z-10"
                        onClick={onClose}
                        type="button"
                    >
                        <X size={24} />
                    </button>
                    <div className="modal-text flex flex-col items-center justify-center mt-4">
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default ErrorModal;
