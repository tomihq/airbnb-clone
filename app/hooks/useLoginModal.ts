import { create } from 'zustand';

/* Zustand para utilizar una gestion de estados pequeñas, rapida y escalable */ 

interface LoginModalStore {
    isOpen: boolean;
    onOpen: () => void; 
    onClose: () => void; 
}

const useLoginModal = create<LoginModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))

export default useLoginModal;