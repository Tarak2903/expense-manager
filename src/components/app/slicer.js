import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: [],
  },
  reducers: {
    setexpense: (state, action) => {
     
      if (Array.isArray(action.payload)) {
        state.value = action.payload; 
      } else {
        state.value.push(action.payload); 
      }
    },
  },
});

export const { setexpense } = counterSlice.actions;
export default counterSlice.reducer;
