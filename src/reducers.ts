import { globalReducer } from "./globalReducers";
import { pageReducer } from "./pages/pageReducers";

export const reducers = {
  ...globalReducer,
  ...pageReducer,
};
