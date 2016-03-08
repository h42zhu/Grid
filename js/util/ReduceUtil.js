
import _ from 'lodash'

function VtreeMerge (state, action) {
    const {portlist, hier, vtree} = action
    var newState = _.assign({}, state)
    newState['grid']['vtree'] = vtree
    newState['grid']['portlist'] = portlist
    newState['panel']['heir'] = hier
    return newState
}

function VtreeCellUpdateHelper(rdata, port_id, col, data, odataFloat, method="overwrite") {
    var rObj, idx, newData
    idx = _.findIndex(rdata, item=>item['port_id'] == port_id)
    newData = rdata.slice(0)
    if (idx >= 0) {
        rObj = _.assign({}, rdata[idx])
        rObj[col] = method == "overwrite"? data :
                              parseFloat(rObj[col]) + data - odataFloat
        newData[idx] = rObj
    } else {
        rObj = {port_id: port_id}
        rObj[col] = data
        newData.push(rObj)
    }

    return newData
}


function VtreeCellUpdate (vtree, pos, data, odata) {
    var odataFloat, dataFloat, vTreeLevel, i, newVtree,

    newVtree = _.assign({}, vtree)
    vTreeLevel = newVtree
    dataFloat = data == ""? 0.0 : parseFloat(data)
    odataFloat = odata == ""? 0.0 : parseFloat(odata)
    for (i=0; i<pos.hier.length; i=i+1) {
        vTreeLevel.total = VtreeCellUpdateHelper(vTreeLevel.total, pos.port_id, pos.col, dataFloat, odataFloat, "delta")
        vTreeLevel = vTreeLevel.children[pos.hier[i]]
    }
    vTreeLevel.rowdata = VtreeCellUpdateHelper(vTreeLevel.rowdata, pos.port_id, pos.col, dataFloat, odataFloat, "overwrite")
    return newVtree
}

export {VtreeMerge, VtreeCellUpdate}
