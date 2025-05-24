import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedEvent: null,
  showEventDetails: false,
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
      state.showEventDetails = true;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.showEventDetails = false;
    },
  },
});

export const { setSelectedEvent, clearSelectedEvent } = eventSlice.actions;

export default eventSlice.reducer;
