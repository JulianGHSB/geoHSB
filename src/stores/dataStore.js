import create from 'zustand/vanilla'

export const dataStore = create((set) => ({
    data: [],
    set: (data) => set(state => ({ data: data })),
    add: (elem) => set(state => ({ data: [...state.data, elem] })),
    remove: () => set({ data: [] })
}))
