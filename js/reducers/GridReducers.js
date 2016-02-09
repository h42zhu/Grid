import { paginate, filterBy, editCell, requestData, receiveData } from '../actions/GridActions'
import CONSTS from '../constants/constants'
import { mergeChangeList } from '../util/util'



function handlePanelActions(state, action) {

}


function handleGridActions (state, action) {
  switch (action.type) {
    case CONSTS.ACTIONS.REQUESTDATA:
      return {isFetching: true}
    
    case CONSTS.ACTIONS.RECEIVEDATA:
      return {
        isFetching: false,
        data: action.data,
        meta: action.meta,
        portlist: action.portlist,
        header: action.header,
        hierarchy: action.hierarchy,
        changelist: []
      }

    case CONSTS.ACTIONS.PAGINATE:
      return state
    
    case CONSTS.ACTIONS.EDITCELL:
      return mergeChangeList(state, {key: action.id, data: action.data})
    
    default:
      return state
  }
}


function GridReducers (state, action) {
  switch (action.type) {
    case CONSTS.ACTIONS.PAGINATE:
    case CONSTS.ACTIONS.RECEIVEDATA:
    case CONSTS.ACTIONS.REQUESTDATA:
      return Object.assign({}, state,
        {[action.comp]: handleGridActions(state[action.comp], action)})
    
    case CONSTS.ACTIONS.EDITCELL:
      return Object.assign({}, state,
        {[action.comp]: handleGridActions(state[action.comp], action)})
                           
    default:
      return state
  }
}

export default GridReducers