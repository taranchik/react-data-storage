import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';
import { createStore } from "redux";
import { Provider } from "react-redux"
import { rootReducer } from "./redux/rootReducer"


const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));