import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import GridReducer from '../reducers/GridReducers'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore)


function configureStore(initialState) {
    return createStoreWithMiddleware(GridReducer, initialState)
}

export default configureStore
