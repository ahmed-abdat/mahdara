import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../config/firebase';
import { collection , getDocs,} from "firebase/firestore";



export const fetchCategory = createAsyncThunk(
  'firebase/fetchCategory',
  async () => {
    const categoryRef = collection(db, 'category');
    const querySnapshot = await getDocs(categoryRef);
    const category = [];
    querySnapshot.forEach((doc) => {
      const categoryData = { ...doc.data(), id: doc.id };
      category.push(categoryData);
    });
    return category;
  }
);




const firebaseSlice = createSlice({
  name: 'category',
  initialState: {
    category : [],
  },
  reducers: {

    addCategory : (state, action)=> {
        state.category.push(action.payload)
    }
   
  },
  extraReducers: {
    [fetchCategory.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchCategory.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.category = action.payload;
    },
    [fetchCategory.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  }
  
  
  
});

export const {addCategory} = firebaseSlice.actions

export default firebaseSlice.reducer;
