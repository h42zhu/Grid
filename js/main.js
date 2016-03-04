import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import GridComponent from './components/GridComponent'
import configureStore from './store/store'

// Define the initial state properties here
const initialState = {

    // Grid state
    grid: {
        data: [],
        meta: [],
        changelist: [],
        isFetching: false,
        vtree : {}
    },

    // Panel State
    panel: {
        heir: ["asset_class", "region"],
        cols: ["cur", "trg", "bmk"],
        portSelected: [5866, 3676]
    }
}

const store = configureStore(initialState)

ReactDOM.render(
    <Provider store={store}>
        <GridComponent/>
    </Provider>,
     document.getElementById('grid')

);
