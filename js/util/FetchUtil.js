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



export {requestData, receiveData}
