import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slicer.js'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})