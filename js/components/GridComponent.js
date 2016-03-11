import React from 'react'
import {ACTIONS, COLMAP, DEFSTYLE} from '../constants/Constants'
import {RowComponent} from './RowComponent'


function RowPopulate(rowMeta, portlist, cols, data, action, disp) {
    var row = [{
                uid: rowMeta.uid,
                data: rowMeta.label,
                meta: {editable: false},
                style: {width: 240, height: 25, paddingLeft: rowMeta.indent * 10}
              }]
    var i, j, idx

    if (rowMeta.type == 'superheader') {
        for (i=0; i<data.length; i=i+1) {
            row.push({
                uid: rowMeta.uid + '_' + data[i]['port_id'].toString(),
                data: data[i]['port_name'],
                meta: {editable: false, colspan: cols.length, header: true},
                style: DEFSTYLE.SUPERHEADER
            })
        }

    } else if (rowMeta.type == 'header') {
        row = row.concat(portlist.map(port => cols.map(
            col => ({
                uid: port.toString() + "_" + col,
                data: col,
                meta: {header: true},
                style: DEFSTYLE.HEADER
              })
        )).reduce((arr1, arr2) => arr1.concat(arr2)))

    } else if (rowMeta.type == 'label') {
        for (i=0; i<portlist.length; i=i+1) {
            for (j=0; j<cols.length; j=j+1) {
                row.push({
                  uid: rowMeta.uid + '_' + portlist[i].toString() + '_' + cols[j],
                  data: "",
                  meta: {editable: false},
                  style: DEFSTYLE.DATACELL
                })
            }
        }

    } else {
        for (i=0;i<portlist.length; i=i+1) {
            idx = _.findIndex(data, item=>item['port_id']==portlist[i])
            for (j=0; j<cols.length; j=j+1) {
                row.push({
                  uid: rowMeta.uid.toString() + '_' + portlist[i].toString()
                       + '_' + cols[j],
                  data: (idx>=0 && data[idx].hasOwnProperty([cols[j]]))?
                        data[idx][cols[j]]: "",
                  action: action,
                  pos: {hier: rowMeta.hier, sec_id: rowMeta.uid,
                        port_id: portlist[i], col: cols[j]},
                  meta: {
                            editable: rowMeta.type == 'data'
                                      && _.includes(COLMAP.edit ,cols[j]),
                            disp: disp

                        },
                  style: DEFSTYLE.DATACELL
                })
            }
        }
    }

    return <RowComponent
              key={rowMeta.uid}
              uid={rowMeta.uid}
              cells={row}
           />
}



class GridComponent extends React.Component {
    constructor (props) {
        super(props)
        this.recursiveRender = this.recursiveRender.bind(this)
        this.headersRender = this.headersRender.bind(this)
    }

    headersRender(meta, portlist, cols) {
        var rows = [], superHeader, rowMeta
        superHeader = meta.portlist.filter(item=>_.includes(portlist, item['port_id']))
        rowMeta = {type: 'superheader', uid: 'superheader', label: "", indent: 0}
        rows.push(RowPopulate(rowMeta, portlist, cols, superHeader))

        rowMeta = {type: 'header', uid: 'header', label: meta.current_date, indent: 0}
        rows.push(RowPopulate(rowMeta, portlist, cols))
        return rows
    }

    recursiveRender(vtree, portlist, cols, indent=0, position=[], action=null, disp=2) {
        var rows = [], i, rowMeta

        if (vtree.children) {
            if (vtree.label !== "") {
                rowMeta = {type: 'label', uid: vtree.uid, label: vtree.label, indent: indent}
                rows.push(RowPopulate(rowMeta, portlist, cols))
            }
            for (i=0; i<vtree.children.length; i=i+1){
                rows = rows.concat(this.recursiveRender(vtree.children[i],
                                  portlist, cols, indent+1, position.concat([i]), action))
            }
            rowMeta = {type: 'total', uid: 'total_' + vtree.uid,
                        label: 'Total ' + vtree.label, indent: indent}
            rows.push(RowPopulate(rowMeta, portlist, cols, vtree.total, null, disp))
        } else if (vtree.rowdata) {
            rowMeta = {type: 'data', uid: vtree.uid, label: vtree.label,
                        hier: position, indent: indent}
            rows.push(RowPopulate(rowMeta, portlist, cols, vtree.rowdata, action, disp))
        }
        return rows
    }

    componentWillMount () {
        const fetchAction = this.props.actions.fetchData
        fetchAction('/api/port_data')
    }

    componentWillReceiveProps(nextProps) {
        const {vtree, data, portlist, isFetching, meta, actions, hier, cols, changelist, dispMode} = nextProps
        if (!isFetching && _.isEmpty(vtree) && data.length > 0) {
            const buildVtreeAction = actions.buildVTree
            buildVtreeAction(data, portlist, hier, cols, dispMode)
        }

        if (vtree && changelist.length > 0) {
            this.forceUpdate()
        }
    }

    render () {
        const {vtree, data, portlist, isFetching, meta, cols, actions, dispMode} = this.props
        const editCellAction = actions.editCell
        var dataRows = [], headerRows = []
        var disp = dispMode == "percentage"? 2:0
        if (!isFetching && portlist.length > 0 && !_.isEmpty(vtree)) {
            dataRows = this.recursiveRender(vtree, portlist, cols, 0, [], editCellAction, disp)
            headerRows = this.headersRender(meta, portlist, cols)
        }


        return (
            <div>
              <table tabIndex="0">
                  <thead>
                      {headerRows}
                  </thead>
                  <tbody>
                      {dataRows}
                  </tbody>
              </table>
            </div>
        );
    }
}

export {GridComponent}
