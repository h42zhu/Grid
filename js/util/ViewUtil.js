import {ACTIONS, COLMAP} from '../constants/Constants'
import _ from 'lodash'



// input: list of portdata obj
// output: Vtree
function createTree(data, portlist, hier, cols, label='Grand', accum='') {
    let total = calcTotal(data, portlist, cols)

    if (hier.length == 0) {
        return {
          label : label,
          total : total,
          uid : accum,
          children: mergeDataRow(data, cols)
        }
    } else if (label=='Grand') {
        return {
          label : "",
          total : total,
          uid : "grand",
          children : applyHierarchy(_.groupBy(data, item=>item[hier[0]]),
                                    portlist, hier.slice(1), cols, accum)
        }
    } else {
        return {
          label : label,
          total : total,
          uid : accum,
          children : applyHierarchy(_.groupBy(data, item=>item[hier[0]]),
                                    portlist, hier.slice(1), cols, accum)
        }
    }

}

// takes grouped data obj => returns a list of vtree
function applyHierarchy(data, portlist, hier, cols, accum) {
    var vTreeList = [], prop
    for (prop in data) {
        vTreeList.push(createTree(data[prop], portlist, hier, cols, prop, accum + '_' + prop))
    }
    return vTreeList
}

// output: a list of cell objects
function mergeDataRow(data, cols) {
    var rows = [], i, j, idx, obj
    for (i=0; i<data.length; i=i+1) {
        idx = _.findIndex(rows, item=>item['uid'] == data[i]['security_id'])

        obj = {'port_id' : data[i]['port_id']}
        for (j=0; j<cols.length; j=j+1) {
            obj[cols[j]] = data[i][COLMAP[cols[j]]]
        }

        if (idx >= 0) {
            rows[idx]['rowdata'].push(obj)
        } else {
            rows.push({
                uid: data[i]['security_id'],
                label: data[i]['security_name'],
                rowdata: [obj]
            })
        }
    }
    return rows
}


function calcTotal(data, portlist, cols) {
    var totals = [], i, j, idx, obj

    function totalItem(port, cols) {
        var obj = {port_id: port}
        for (var k=0; k<cols.length; k=k+1) {
            obj[cols[k]] = 0.0
        }
        return obj
    }

    totals = portlist.map(port => totalItem(port, cols))

    for (i=0; i<data.length; i=i+1) {
        idx = _.findIndex(totals, item=>item['port_id'] == data[i]['port_id'])
        if (idx >= 0) {
            for (j=0; j<cols.length; j=j+1) {
                totals[idx][cols[j]] = totals[idx][cols[j]] + data[i][COLMAP[cols[j]]]
            }
        }
    }
    return totals
}


export {createTree}
