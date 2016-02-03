import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import GridComponent from './components/grid'
import configureStore from './store/store'
//import SidebarComponent from './components/sidebar'
import { paginate, filterBy, editCell, fetchData } from './actions/GridActions'


// Define the initial state properties here
const initialState = {
    
    // Grid state 
    grid: {
        portlist: [],
        header: [{col: 'cur', name: 'Cur', style: {editable: false}}, {col: 'trg', name: 'Trg', style: {editable: true}}, {col: 'bmk', name: 'Bmk', style: {editable: false}}],
        hierarchy: [],
        data: [],
        meta: [],
        changelist: [],
        isFetching: false
    },

    // Panel State
    panel: {
        
    }
}

const store = configureStore(initialState)

ReactDOM.render(
    <Provider store={store}>
        <GridComponent/>
    </Provider>,
     document.getElementById('grid')

);


