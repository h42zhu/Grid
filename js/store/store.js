import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import GridReducers from '../reducers/GridReducers'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore)


function configureStore(initialState) {
  return createStoreWithMiddleware(GridReducers, initialState)
}

export default configureStore
