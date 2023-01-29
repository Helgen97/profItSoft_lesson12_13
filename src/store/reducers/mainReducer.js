import { combineReducers } from "redux";
import exampleReducer from "./exampleReducer";

const mainReducer = combineReducers({
    examples: exampleReducer,
});

export default mainReducer;