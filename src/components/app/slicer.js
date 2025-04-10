import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: [],
    syncQueue: [],
  },
  reducers: {
    setexpense: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.value = action.payload; 
      } else {
        state.value.push(action.payload); 
      }
    },
  
    addToSyncQueue: (state, action) => {
      state.syncQueue.push(action.payload);
    },
    clearSyncQueue: (state) => {
      state.syncQueue = [];
    },
  },
});

export const { setexpense, addToSyncQueue, clearSyncQueue } = counterSlice.actions;
export default counterSlice.reducer;