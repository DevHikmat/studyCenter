import { createSlice } from "@reduxjs/toolkit"

interface StudentState {
    studentList: any[],
    isChange: boolean,
}

const initialState: StudentState = {
    studentList: [],
    isChange: false,
}

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudentToStore: (state, action) => {
        state.studentList = action.payload;
    },
    studentChanged: (state) => {
      state.isChange = !state.isChange;
    }
  },
})

export const { setStudentToStore, studentChanged } = studentSlice.actions
export default studentSlice.reducer
