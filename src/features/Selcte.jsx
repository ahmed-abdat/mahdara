import { createSlice } from "@reduxjs/toolkit";

// Create the async thunk
const initialState = {
  allMonths: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
  currentMonth: new Date().getMonth() ,

  currentCategory: { value: "", label: "الكل" },
  status: [
    { value: "", label: "الجميع" },
    { value: "paid", label: "تم الدفع" },
    { value: "unpaid", label: "لم يتم الدفع" },
  ],
  currentStatus: { value: "", label: "الجميع" },
};

const selecte = createSlice({
  name: "slecte",
  initialState,
  reducers: {
    setCurentMont: (state, action) => {
      state.currentMonth = action.payload;
    },
    setCurentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    setCurentStatus: (state, action) => {
      state.currentStatus = action.payload;
    },
  },
});
export const { setCurentMont, setCurentCategory, setCurentStatus } =
  selecte.actions;

export default selecte.reducer;
