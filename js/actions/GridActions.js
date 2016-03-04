import {ACTIONS} from '../constants/Constants'
import {createTree} from '../util/ViewUtil'
import _ from 'lodash'


function buildVTree(data, portlist, hier, cols) {
    var fdata = data.filter(item => _.includes(portlist, item['port_id']))

    return ({
        type: ACTIONS.BUILDVTREE,
        portlist: portlist,
        hier: hier,
        vtree: createTree(fdata, hier, cols)

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


export {buildVTree, editCell}
