import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";


import uiReducer from "./reducers/ui";
import restaurantReducer from "./reducers/restaurant";
import restaurantAdminReducer from "./reducers/restaurantAdmin";

const rootReducer = combineReducers({
  ui: uiReducer,
  restaurant: restaurantReducer,
  restaurantAdmin: restaurantAdminReducer
});

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;