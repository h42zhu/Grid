import {ACTIONS} from '../constants/Constants'
import {createTree} from '../util/ViewUtil'
import {requestData, receiveData} from '../util/FetchUtil'
import _ from 'lodash'


function buildVTree(data, portlist, hier, cols) {
    var fdata = data.filter(item => _.includes(portlist, item['port_id']))

    return ({
        type: ACTIONS.BUILDVTREE,
        portlist: portlist,
        hier: hier,
        vtree: createTree(fdata, portlist, hier, cols)

    })

}

function editCell(pos, ndata, odata) {
    return ({
        type: ACTIONS.EDITCELL,
        comp: 'grid',
        pos: pos,
        data: ndata,
        odata: odata,
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


export {buildVTree, editCell, fetchData}
