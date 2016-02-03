import CONSTS from '../constants/constants'

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
function gridQuery (data, portFilter, col='all', cond={}) {
    
    let portData = data.filter(item => item[0] in portFilter)
    
    if (cond.changelist) {
        portData = applyChangelist(portData, cond.changelist)
    }
    
    if (col != 'all' && CONSTS.INDEXMAP[col]) {
        portData = portData.map(item => item[CONSTS.INDEXMAP[col]])
    }
    
    return portData
}

function calcSubTotal (data, port_id, col, cond={}) {
    let portFileter = {}
    portFileter[port_id] = null
    let colData = gridQuery(data, portFileter, col, cond)

    return colData.reduce((curr, acc) => curr + acc, 0)
}


// 
function rowPopulate (data, portlist, header, rowstyle) {
    if (data.length == 0 || data[0].length == 0) {
        return []
    }
    var skey = data[0][1].toString()
    var row = [{'key': skey, 'data': data[0][3],
               'style': {'editable': false, 'width': '300px'}}],
        port_id, j, k, found
        
    for (var port_id in portlist) {
        found = false
        for (j = 0; j < data.length; j = j + 1) {
            if (data[j][0].toString() == port_id) {
                found = true
                
                for (k = 0; k < header.length; k = k + 1) {
                    row.push({
                        'key': header[k].col + '_' + port_id + '_' + skey,
                        'data': data[j][header[k].colIndex],
                        'style': styleMerge(rowstyle, header[k].style)
                    })
                }
                break;
            }
        }
        
        if (!found) {
            for (k = 0; k < header.length; k = k + 1) {
                row.push({
                    'key': header[k].col + '_' + port_id + '_' + skey,
                    'data': '',
                    'style': styleMerge(rowstyle, header[k].style)})
                
            }
        }
    }
    return (row)
}


function totalRowPopulate(data, portlist, header, rowstyle, cond={}) {
    if (data.length == 0 || data[0].length == 0) {
        return []
    }
    
    var totalType = Object.keys(cond).length === 0? 'grand': cond.key
    var skey = 'total_' + totalType
    var row = [{'key': skey, 'data': 'Grand Total',
               'style': {'editable': false, 'width': '300px'}}],
        port_id, k, totalVal
        
    for (port_id in portlist) {
        for (k = 0; k < header.length; k = k + 1) {
            totalVal = calcSubTotal(data, port_id, header[k].col, cond)
            row.push({
                'key': header[k].col + '_' + port_id + '_' + skey,
                'data': totalVal,
                'style': styleMerge(rowstyle, header[k].style)
            })
        }
    }
    
    return (row)
    
}

// param:
// data = raw data from sql
// hierarchy = array .. eg. ['asset class', 'region']
function preprocessData(data, portlist=[], config={header:[]}, changelist) {
    var processedData = [],
        header = config.header, secData
    
    if (!data || !portlist || !config || !header
        || portlist.length == 0 || header.length == 0) {
        return []
    }
    
    let portFilter = portlist.reduce(function(obj, port) {
                        obj[port.port_id] = null
                        return obj}, {})
    
    let portData = gridQuery(data, portFilter)
    
    let secList = portData.reduce(function(unique, sec) {
        if (unique.indexOf(sec[1]) < 0) {
            unique.push(sec[1])
        }
        return unique
    }, [])
    
    header = header.map(item => Object.assign(item, {colIndex: CONSTS.INDEXMAP[item.col]}))
    
    for (var i = 0; i < secList.length; i = i + 1){
        secData = portData.filter(item => item[1] == secList[i])
        processedData.push(rowPopulate(secData, portFilter, header, {editable: true}))
    }
    
    // add the grant total row
    processedData.push(totalRowPopulate(data, portFilter, header, {editable: false}, {key: 'grand', changelist: changelist}))
    
    return processedData
}


// all functions below deal with transforming of nested json objects into plain arrays
// may not need anymore
function fillEmpty (val, style, arrLength) {
    var row = [{'key': val, 'data': val, 'style': style}]
    for (var i = 0; i < arrLength; i = i + 1) {
        row.push({
            'key': val + "_" + i.toString(),
            'data': "",
            'style': style})
    }
    return (row)
}


/*

function recursiveRender (dataArr, retArr, meta) {
    for (var i = 0; i < dataArr.length; i = i + 1) {
        retArr = retArr.concat(recursiveRenderHelper(dataArr[i], meta))
    }
    return (retArr)
}


function recursiveRenderHelper (data, meta) {
    var items = [], rowLegnth, header
    if ('group_name' in data && 'children' in data) {
        // add header row
        rowLegnth = meta.port_list.length * meta.col.length
        header = fillEmpty(data.group_name, meta.rowstyle.headerrow ,rowLegnth)
        items.push(header)
        
        items = items.concat(recursiveRender(data.children, [], meta))
        // add total row
        items.push(rowPopulate(data.total_row, 'total_' + data.group_name, 'Total ' + data.group_name, meta, 'headerrow'))
        
    } else if ('security_id' in data) {
        items.push(rowPopulate(data.children, data.security_id, data.security_name, meta, 'datarow'))
    } else {
        return []
    }
    return items
}*/

//
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


export { preprocessPortList, preprocessData, mergeChangeList }