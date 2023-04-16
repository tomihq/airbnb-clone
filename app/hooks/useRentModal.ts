import { create } from 'zustand';

/* Zustand para utilizar una gestion de estados pequeñas, rapida y escalable */ 

interface RentModalStore {
    isOpen: boolean;
    onOpen: () => void; 
    onClose: () => void; 
}

const useRentModal = create<RentModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))

export default useRentModal;