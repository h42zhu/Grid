import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'

import {fetchData} from '../util/FetchUtil'
import {editCell, buildVTree} from '../actions/GridActions'
import {ACTIONS, COLMAP} from '../constants/Constants'
import {RowComponent} from './RowComponent'


function RowPopulate(rowMeta, portlist, cols, data, action) {
    var row = [{
                uid: rowMeta.uid,
                data: rowMeta.label,
                style: {editable: false}
              }]
    var i, j, idx

    if (rowMeta.type == 'superheader') {
        for (i=0;i<data.length; i=i+1) {
            row.push({
                uid: rowMeta.uid + '_' + data[i]['port_id'].toString(),
                data: data[i]['port_name'],
                style: {editable: false, colspan: cols.length, header: true}
            })
        }

    } else if (rowMeta.type == 'header') {
        row = row.concat(portlist.map(port => cols.map(
            col => ({
                uid: port.toString() + "_" + col,
                data: col,
                style: {header: true}})
            )).reduce((arr1, arr2) => arr1.concat(arr2)))
    } else if (rowMeta.type == 'label') {
        for (i=0;i<portlist.length; i=i+1) {
            for (j=0; j<cols.length; j=j+1) {
                row.push({
                  uid: rowMeta.uid + '_' + portlist[i].toString() + '_' + cols[j],
                  data: "",
                  style: {editable: false}
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
                  data: idx>=0 && data[idx][cols[j]]? data[idx][cols[j]]: "",
                  action: action,
                  pos: {hier: rowMeta.hier, sec_id: rowMeta.uid, port_id: portlist[i], col: cols[j]},
                  style: {editable: rowMeta.type == 'data'
                          && _.includes(COLMAP.edit ,cols[j])? true:false}
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
        rowMeta = {type: 'superheader', uid: 'superheader', label: ""}
        rows.push(RowPopulate(rowMeta, portlist, cols, superHeader))
        rowMeta = {type: 'header', uid: 'header', label: meta.current_date}
        rows.push(RowPopulate(rowMeta, portlist, cols))
        return rows
    }

    recursiveRender(vtree, portlist, cols, position=[], action=null) {
        var rows = [], i, rowMeta

        if (vtree.children) {
            if (vtree.label !== "") {
                rowMeta = {type: 'label', uid: vtree.uid, label: vtree.label}
                rows.push(RowPopulate(rowMeta, portlist, cols))
            }
            for (i=0; i<vtree.children.length; i=i+1){
                rows = rows.concat(this.recursiveRender(vtree.children[i],
                                  portlist, cols, position.concat([i]), action))
            }
            rowMeta = {type: 'total', uid: 'total_' + vtree.uid, label: 'Total ' + vtree.label}
            rows.push(RowPopulate(rowMeta, portlist, cols, vtree.total))
        } else if (vtree.rowdata) {
            rowMeta = {type: 'data', uid: vtree.uid, label: vtree.label, hier: position}
            rows.push(RowPopulate(rowMeta, portlist, cols, vtree.rowdata, action))
        }
        return rows
    }

    componentWillMount () {
        const dispatch = this.props.dispatch
        dispatch(fetchData('/api/port_data'))
    }

    componentWillReceiveProps(nextProps) {
        const {vtree, data, portlist, isFetching, meta, dispatch, hier, cols, changelist} = nextProps
        if (!isFetching && _.isEmpty(vtree) && data.length > 0) {
            dispatch(buildVTree(data, portlist, hier, cols))
        }

        if (vtree && changelist.length > 0) {this.forceUpdate()}
        console.log(nextProps)
    }

    render () {
        const {vtree, data, portlist, isFetching, meta, dispatch, cols} = this.props
        let boundActionCreators = bindActionCreators(editCell, dispatch)
        var dataRows = [], headerRows = []
        if (!isFetching && portlist.length > 0 && !_.isEmpty(vtree)) {
            dataRows = this.recursiveRender(vtree, portlist, cols, [], boundActionCreators)
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


function select(state) {
    return {
        data: state.grid.data,
        vtree: state.grid.vtree,
        isFetching: state.grid.isFetching,
        changelist: state.grid.changelist,
        meta: state.grid.meta,
        hier: state.panel.heir,
        portlist: state.panel.portSelected,
        cols: state.panel.cols
    }
}

//
export default connect(select)(GridComponent)
