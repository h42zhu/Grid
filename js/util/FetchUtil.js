import {ACTIONS} from '../constants/Constants'


function requestData(comp) {
    return ({
        type: ACTIONS.REQUESTDATA,
        comp: comp
    })
}


function receiveData(comp, data) {
    return ({
        type: ACTIONS.RECEIVEDATA,
        comp: comp,
        data: data.tree,
        meta: data.meta
    })
}


function fetchData (url, comp='grid') {
    return function (dispatch) {
        dispatch(requestData(comp))

        return fetch(url)
          .then(response => response.json())
          .then(json =>
            dispatch(receiveData(comp, json))
        )
    }
}

export {fetchData}
