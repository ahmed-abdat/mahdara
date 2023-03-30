import { createSlice } from "@reduxjs/toolkit";

// Create the async thunk
const initialState = { value : true }




const closeNavBar = createSlice({
  name : 'sidebar',
  initialState : initialState,
  reducers : {
    close : (state )=> {
        state.value = !state.value 
    }
  }
});
export const {close  } = closeNavBar.actions

export default closeNavBar.reducer;
