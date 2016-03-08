import _ from 'lodash'

import {ACTIONS} from '../constants/Constants'
import {VtreeMerge, VtreeCellUpdate} from '../util/ReduceUtil'


function GridActionHandler (state, action) {
    switch (action.type) {
      case ACTIONS.REQUESTDATA:
          return {
              isFetching: true,
              data: [],
              meta: [],
              changelist: [],
              vtree : {},
              portlist: []
          }
      case ACTIONS.EDITCELL:
          return {
              isFetching: false,
              data: state.data,
              meta: state.meta,
              changelist: state.changelist.concat([action.data]),
              vtree: VtreeCellUpdate(state.vtree, action.pos, action.data, action.odata),
              portlist: state.portlist
          }
      case ACTIONS.RECEIVEDATA:
          return {
            isFetching: false,
            data: action.data,
            meta: action.meta,
            changelist: [],
            vtree: {},
            portlist: action.meta.portlist.map(item => item['port_id'])
          }
      }

}

function GridReducer (state, action) {
    switch (action.type) {
        case ACTIONS.REQUESTDATA:
        case ACTIONS.EDITCELL:
        case ACTIONS.RECEIVEDATA:
            return _.assign({}, state,
                {[action.comp]: GridActionHandler(state[action.comp], action)})

        case ACTIONS.BUILDVTREE:
            return _.assign({}, state, VtreeMerge(state, action))
        default:
            return state

    }
}

export default GridReducer
