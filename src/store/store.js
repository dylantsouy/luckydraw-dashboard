import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create((set) => ({
    showModal: false,
    modalText: '',
    modalLoading: false,
    noModalBtn: false,
    modalHandler: () => {},
    setModalHandler: (value) =>
        set(() => ({
            modalHandler: value.func,
            modalText: value.text,
            showModal: true,
        })),
    closeModal: () =>
        set(() => ({
            showModal: false,
            noModalBtn: false,
            modalText: '',
            modalLoading: false,
        })),
    setValue: (key, value) =>
        set(() => ({
            [key]: value,
        })),
}));

export const useStorageStore = create(
    persist(
        (set) => ({
            sidebarShow: 'open',
            setSidebarShow: (value) =>
                set(() => ({
                    sidebarShow: value,
                })),
        }),
        {
            name: 'sidebarShow',
            getStorage: () => localStorage,
        }
    )
);
