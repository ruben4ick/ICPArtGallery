import '../../index.scss';
import './style.scss';
import useModal from "../../hooks/modal/use-modal";
import AddNftModal from "./AddNftModal";
import Portal from "../Portal";

export const AddNft = () => {
    const { isOpen: isAddNftOpen, open: openAddNft, close: closeAddNft } = useModal();

    return (
        <>
            <button className='head-text cursor-pointer' onClick={ openAddNft } type='button'>.add_nft</button>
            {
                isAddNftOpen ? <Portal>
                        <div className="fixed w-full h-full flex items-center justify-center inset-0 z-111">
                            <AddNftModal onClose={closeAddNft} onSubmit={closeAddNft}/>
                        </div>
                    </Portal> : null
            }
        </>
    );
}
