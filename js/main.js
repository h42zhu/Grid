import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import GridApp from './container/GridApp'
import configureStore from './store/store'

// Define the initial state properties here
const initialState = {

    // Grid state
    grid: {
        data: [],
        meta: [],
        changelist: [],
        isFetching: false,
        vtree : {},
        portlist: []
    },

    // Panel State
    panel: {
        heir: ["asset_class", "region"],
        cols: ["cur", "trg", "bmk"],
        dispMode: "percentage"
    }
}

const store = configureStore(initialState)

ReactDOM.render(
    <Provider store={store}>
        <GridApp/>
    </Provider>,
     document.getElementById('grid')
);
