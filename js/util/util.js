import CONSTS from '../constants/constants'
import lodash from 'lodash'

// header columns to display
function preprocessPortList(portListMap) {
    var portList = []
    for (var port in portListMap) {
        portList.push({port_id: port, name: portListMap[port].name, nav: portListMap[port].nav})
    }
    return portList
}

// given two json style objects, merge into one
function styleMerge(st1, st2) {
    var newStyle = {}, prop 
    for (prop in st1) {newStyle[prop] = st1[prop]}
    for (prop in st2) {
        if (prop in newStyle && prop === 'editable') {
            newStyle[prop] = newStyle[prop] && st2[prop]
        } else {
            newStyle[prop] = st2[prop]
        }
        
    }
    return (newStyle)
}

// merge changelist values to the data
function applyChangelist(data, changelist) {
    var key, arrkey, col, port_id, sec_id, i, j
    for (i = 0; i < changelist.length; i = i + 1) {
        key = changelist[i].key
        arrkey = key.split("_")
        col = arrkey[0]
        port_id = arrkey[1]
        sec_id = arrkey[2]
        
        for (j = 0; j < data.length; j = j + 1) {
            if (data[j][0] == port_id && data[j][1] == sec_id) {
                data[j][CONSTS.INDEXMAP[col]] = parseInt(changelist[i].data)
            }
        }
        
    }
    
    return data
}

// equavalent to
// select {col} from data where port_id = port_id and {some custome logic in cond}
function gridQuery (data, portFilter, cond={}) {
    var result = [], port = [], i
    for (i = 0; i < data.length; i = i + 1) {
        port = data[i]['port'].filter(item => item['port_id'] in portFilter)
        if (port.length > 0) {
            result.push(data[i])
            result[result.length-1]['port'] = port
        }
    }
    
    if (cond.changelist) {
        result = applyChangelist(result, cond.changelist)
    }
    
    return result
}

// sub
function calcSubTotal (subtotal, port) {


    return colData.reduce((curr, acc) => curr + acc, 0)
}


// returns a list of objects
function rowPopulate (data, portlist, header, rowstyle) {
    if (!data || !portlist || lodash.isEmpty(data)) {
        return []
    }

    var row = [{'key': data['secid'], 'data': data['sec_name'],
               'style': {'editable': false, 'width': '300px'}}],
        port_id, j, k, found
        
    for (port_id in portlist) {
        found = false
        for (j = 0; j < data['port'].length; j = j + 1) {
            if (data['port'][j]['port_id'] == parseInt(port_id)) {
                found = true
                
                for (k = 0; k < header.length; k = k + 1) {
                    row.push({
                        'key': header[k].col + '_' + port_id + '_' + data['secid'].toString(),
                        'data': data['port'][j][header[k].col],
                        'style': styleMerge(rowstyle, header[k].style)
                    })
                }
                break;
            }
        }
        
        if (!found) {
            for (k = 0; k < header.length; k = k + 1) {
                row.push({
                    'key': header[k].col + '_' + port_id + '_' + data['secid'].toString(),
                    'data': '',
                    'style': styleMerge(rowstyle, header[k].style)})
                
            }
        }
    }
    return (row)
}


const secInfo = ['sec_name', 'asset_class', 'region', 'sec_class', 'currency']

// given a nested array, return an array of object
function arrayToTree(data) {
    var dataObj = [], secId, i, j, idx
    
    for (i=0; i < data.length; i=i+1) {
        secId = data[i][1]
        
        idx = lodash.findIndex(dataObj, item => item.secid == secId)
        
        if (idx >= 0) {
            dataObj[idx]['port'].push({
                'port_id': data[i][0],
                'cur': data[i][CONSTS.INDEXMAP['cur']],
                'trg': data[i][CONSTS.INDEXMAP['trg']],
                'bmk': data[i][CONSTS.INDEXMAP['bmk']]
                })
        } else {
            dataObj.push({'secid': secId})
            for (j=0; j < secInfo.length; j=j+1) {
                dataObj[dataObj.length-1][secInfo[j]] = data[i][CONSTS.INDEXMAP[secInfo[j]]]
            }
            dataObj[dataObj.length-1]['port'] = [{'port_id': data[i][0],
                                       'cur': data[i][CONSTS.INDEXMAP['cur']],
                                       'trg': data[i][CONSTS.INDEXMAP['trg']],
                                       'bmk': data[i][CONSTS.INDEXMAP['bmk']]
                                      }]
        }
        
    }
    return dataObj
}


function applyHierarchyHelper(data, hierarchy) {
    var prop
    if (!hierarchy || hierarchy.length == 0) {
        return data
    } else {
        for (prop in data) {
            data[prop] = applyHierarchy(data[prop], hierarchy)
        }
        return data
    }
}


function applyHierarchy(data, hierarchy) {
    
    if (hierarchy.length == 0 && typeof data == 'object') {
        return data
    } else if (hierarchy.length == 0 && data instanceof Array) {
        return lodash.groupBy(data, item=>item['sec_class'])
    }
    else {
        return applyHierarchyHelper(lodash.groupBy(data, item=>item[hierarchy[0]]), hierarchy.slice(1))
    }
}


// param: data = raw data from sql
function preprocessData(data, portlist=[], config={header:[], hierarchy:[]}, changelist) {
    var processedData,
        header = config.header, hierachry = config.hierarchy, i, j
    
    if (!data || !portlist || !config || !header
        || portlist.length == 0 || header.length == 0) {
        return []
    }
    
    let portFilter = portlist.reduce(function(obj, port) {
                        obj[port.port_id] = null
                        return obj}, {})
    
    // filtered port_data
    let portData = applyHierarchy(gridQuery(data, portFilter), hierachry)

    processedData = recursiveRender(portData, header, portFilter, 'header')
    
    
    return processedData
}

function mergeTotalRow(data, total) {
    var i, idx, prop
    
    if (!data || !data.port) {
        return total
    }
    data = data.port
    for (i=0; i < data.length; i=i+1) {
        idx = lodash.findIndex(total, item => item['port_id'] == data[i]['port_id'])
        if (idx && idx >= 0) {
            for (prop in total[idx]) {
                if (prop != 'port_id') {
                    total[idx][prop] = total[idx][prop] + data[i][prop]
                }
            }
        } else {
            total.push(data[i])
        }
    }
    return total
}
// totalRow
// returns a list of objs representing the subtotal
function totalRow(data, total) {
    var prop, i
    if (data && data.port) {
        total = mergeTotalRow(data, total)
    } else if (data instanceof Array && data.length > 0) {
        for (i=0; i < data.length; i=i+1) {
            total = mergeTotalRow(data[i], total)
        }
    } else if (data && Object.keys(data).length > 0) {
        for (prop in data) {
            total = mergeTotalRow(totalRow(data[prop], total), total)
        }
    }
    
    return total
    
}


function recursiveRenderHelper (data, header, portlist) {
    var retArr = []
    for (var i = 0; i < data.length; i = i + 1) {
        retArr.push(rowPopulate(data[i], portlist, header, {editable: true}))
    }
    return retArr
}

// {'key': data['secid'], 'data': data['sec_name'],
//               'style': {'editable': false, 'width': '300px'}}

function recursiveRender (data, header, portlist, rid='') {
    var items = [], prop
    if (data instanceof Array && data.length > 0) {
        items = items.concat(recursiveRenderHelper(data, header, portlist))
    } else if (data && Object.keys(data).length > 0) {
        for (prop in data) {
            items.push(rowPopulate({'secid': rid + '_' + prop, 'sec_name': prop, 'port': []}, portlist, header, {editable: false}))
            items = items.concat(recursiveRender(data[prop], header, portlist, rid + '_' + prop))
            items.push(rowPopulate({'secid': rid + '_total_' + prop, 'sec_name': 'Total ' + prop, 'port': totalRow(data[prop], [])}, 
                                   portlist, header, {editable: false}))
        }
    }
    
    return items
}


function mergeChangeList(state, changeCell) {
    let found = false
    let nextState = Object.assign({}, state)
    let changelist = state.changelist
    for (var i = 0; i < changelist.length; i = i + 1) {
        if (changelist[i].key === changeCell.key) {
            changelist[i].date = changeCell.data
        }
    }
    if (!found) {
        changelist.push(changeCell)
    }
    
    nextState.changelist = changelist
    return nextState
}


export { preprocessPortList, preprocessData, mergeChangeList, arrayToTree }