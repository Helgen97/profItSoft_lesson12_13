import React from "react";
import Calculator from "./containers/Calculator";
import store from './store/store';
import { Provider } from "react-redux";

const App = () => {
    return <Provider store={store}>
        <Calculator />
    </Provider>
}

export default App;