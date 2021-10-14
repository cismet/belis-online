import { createSlice } from "@reduxjs/toolkit";
// const LOCALSTORAGE_KEY = "@belis.app.team";
// const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || { id: -1, name: "-" }; //;

const slice = createSlice({
  name: "photoLightbox",
  initialState: { title: "", isVisible: false },
  reducers: {
    setVisible(state, action) {
      state.visible = action.payload;
      return state;
    },
    setIndex(state, action) {
      state.index = action.payload;
      return state;
    },
    setPhotoLightBoxData(state, action) {
      state.title = action.payload.title;
      state.index = action.payload.index;
      state.photourls = action.payload.photourls;
      state.captions = action.payload.captions;
      return state;
    },
  },
});

export default slice;

export const { setVisible, setPhotoLightBoxData, setIndex } = slice.actions;

export const isVisible = (state) => {
  return state.photoLightbox.visible;
};
export const getTitle = (state) => {
  return state.photoLightbox.title;
};
export const getIndex = (state) => {
  return state.photoLightbox.index;
};
export const getPhotoUrls = (state) => {
  return state.photoLightbox.photourls;
};
export const getCaptions = (state) => {
  return state.photoLightbox.captions;
};
