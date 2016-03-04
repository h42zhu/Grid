import _ from 'lodash'

import {ACTIONS} from '../constants/Constants'
import {VtreeMerge, VtreeCellUpdate} from '../util/ReduceUtil'



function GridActionHandler (state, action) {
    switch (action.type) {
      case ACTIONS.REQUESTDATA:
          return {isFetching: true,
                  data: [],
                  meta: [],
                  changelist: [],
                  vtree : {}
                }
      case ACTIONS.RECEIVEDATA:
          return {
            isFetching: false,
            data: action.data,
            meta: action.meta,
            changelist: [],
            vtree : {}
          }
      case ACTIONS.EDITCELL:
          return {
              isFetching: false,
              data: state.data,
              meta: state.meta,
              changelist: state.changelist.concat([action.data]),
              vtree: VtreeCellUpdate(state.vtree, action.pos, action.data, action.odata)
          }
      }
}

function GridReducer (state, action) {
    switch (action.type) {
        case ACTIONS.RECEIVEDATA:
        case ACTIONS.REQUESTDATA:
        case ACTIONS.EDITCELL:
            return _.assign({}, state,
                {[action.comp]: GridActionHandler(state[action.comp], action)})
        case ACTIONS.BUILDVTREE:
            return _.assign({}, state, VtreeMerge(state, action))
        default:
            return state

    }
}

export default GridReducer
