import CONSTS from '../constants/constants'
import { preprocessPortList } from '../util/util'

function paginate(id, direction) {
    
    return ({
        type: CONSTS.ACTIONS.PAGINATE,
        comp: 'grid',
        id: id,
        data: {
            direction: direction
        }
    })
}



function filterBy(id, filter) {
    
    return ({
        type: CONSTS.ACTIONS.FILTER,
        comp: 'grid',
        id: id,
        data: {
            filter: filter
        }
    })
}

function editCell(id, data) {
    return ({
        type: CONSTS.ACTIONS.EDITCELL,
        comp: 'grid',
        id: id,
        data: data
    })
}


function requestData(comp) {
    return ({
        type: CONSTS.ACTIONS.REQUESTDATA,
        comp: comp
    })
}

function receiveData(comp, data) {
    return ({
        type: CONSTS.ACTIONS.RECEIVEDATA,
        comp: comp,
        data: data.tree,
        meta: data.meta,
        portlist: preprocessPortList(data.meta.portListMap),
        header: [{col: 'cur', name: 'Cur', style: {editable: false}}, {col: 'trg', name: 'Trg', style: {editable: true}}, {col: 'bmk', name: 'Bmk', style: {editable: false}}]
    })
}


// thunk action creator for async data

function shouldFetchData ({grid}) {
  return (!grid.data || !grid.isFetching)
}

function fetchData (url, grid='grid') {
    return function (dispatch) {
        dispatch(requestData(grid))
    
        return fetch(url)
          .then(response => response.json())
          .then(json =>
            dispatch(receiveData(grid, json))
        )
    }
}

export { paginate, filterBy, editCell, fetchData }