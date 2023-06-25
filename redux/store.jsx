import thunk from "redux-thunk";
import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import rootReducer from './reducers/index.reducer';

export default configureStore({reducer: rootReducer}, applyMiddleware(thunk));