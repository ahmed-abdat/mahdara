import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../config/firebase';
import { collection , getDocs, orderBy, query} from "firebase/firestore";

export const fetchFirebaseData = createAsyncThunk(
  'firebase/fetchData',
  async () => {
    const studentsRef = collection(db,'students');
    const q = query(studentsRef , orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      const studentData = {...doc.data(), id: doc.id};
      data.push(studentData);
    });
    return data;
  }
);






const firebaseSlice = createSlice({
  name: 'firebase',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    input : '',
    connection : navigator.onLine,
    filterData : [],
    curentStudentUpdateIndex : null,
  },
  reducers: {
    addUser: (state, actions) => {
      state.data.push(actions.payload)
      state.data.sort((a, b) => a.createdDate < b.createdDate ? 1 : -1)
    },
    deleteUser: (state, action) => {
      state.data = state.data.filter((user) => +user.uid !== +action.payload.uid);
    },
    updateUser: (state, action) => {
      const { id, user } = action.payload;
      const index = state.data.findIndex((u) => u.id === id);
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...user,
        };
      }
      state.data.sort((a, b) => a.createdDate < b.createdDate ? 1 : -1)
    },
    deleteAllUsers : (state) => {
      state.data = []
    }
    ,
    filterUser : (state, action) => {
     state.input = action.payload
    },
    filtereData : (state, action) => {
      state.filterData = action.payload
    }
    ,
    updateConnectionStatus : (state,action) => {
      state.connection = action.payload
    },
    UpdateStudentCurentIndex : (state, action) => {
      state.curentStudentUpdateIndex = action.payload
    }
  },
  extraReducers: {
    [fetchFirebaseData.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchFirebaseData.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    [fetchFirebaseData.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    }
  }
  
  
  
});

export const {addUser , deleteUser , updateUser ,  filterUser , updateConnectionStatus , deleteAllUsers , filtereData , UpdateStudentCurentIndex} = firebaseSlice.actions

export default firebaseSlice.reducer;
