import { create } from 'zustand';

/* Zustand para utilizar una gestion de estados pequeñas, rapida y escalable */ 

interface RegisterModalStore {
    isOpen: boolean;
    onOpen: () => void; 
    onClose: () => void; 
}

const useRegisterModal = create<RegisterModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))

export default useRegisterModal;