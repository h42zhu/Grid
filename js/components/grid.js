import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'
import Row from './row'
import CONSTS from '../constants/constants'
import { paginate, filterBy, editCell, fetchData } from '../actions/GridActions'
import { preprocessData } from '../util/util'


class GridComponent extends React.Component {
    constructor (props) {
        super(props)
        
    }
    
    componentWillMount () {
        const dispatch = this.props.dispatch
        this.setState({data: this.props.data})
        dispatch(fetchData('/api/port_data'))
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }
    
    render () {
        const {data, isFetching, portlist, meta, header, dispatch } = this.props
        
        var headerRows = [],
            rows = [], dataArr, i, rkey,
            headerData = [{key: "-2", data: "", style: {header: true}}],
            superHeaderData = [{key: "-1", data: "", style: {header: true}}]
            
        
        // Main Grid once the data finishes fetching
        if (!isFetching && data.length > 0) {
            // to pass action creators to child components that are unaware of redux store
            let boundActionCreators = bindActionCreators(editCell, dispatch)
            
            if (portlist.length > 0) {
                rkey = 'superheader'
                superHeaderData = superHeaderData.concat(portlist.map(port =>
                    ({
                        key: port['port_id'],
                        data: port['name'],
                        style: {header: true, colspan: 3}
                    })))
                
                headerRows.push(<Row
                                    key={rkey}
                                    cells={superHeaderData}
                                    actions={{}}
                                />)
                
                rkey = 'header'
                headerData = headerData.concat(portlist.map(port => header.map(
                    h => ({
                        key: port.port_id.toString() + "_" + h.col,
                        data: h.name,
                        style: {header: true}})
                )).reduce((arr1, arr2) => arr1.concat(arr2)))
                    
                headerRows.push(<Row
                                    key={rkey}
                                    cells={headerData}
                                    actions={{}}
                                />)
            }

            
            
            for (i = 0; i < data.length; i = i + 1) {
                rows.push(
                    <Row
                        key={i}
                        cells={data[i]}
                        actions={boundActionCreators}
                    />
                )
            }
            
        }
        
        return (
            <div>
            {isFetching &&
                <h2>Loading...</h2>
            }
            {!isFetching && 
                <table tabIndex="0">
                    <thead>
                        {headerRows}
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            }
            </div>
        );

    }
}

/*
GridComponent.propTypes = {
    dispatch: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    portlist: PropTypes.array.isRequired,
    meta: PropTypes.array.isRequired,
    header: PropTypes.array.isRequired
}
*/

function select(state) {
  return {
    data: preprocessData(state.grid.data, state.grid.portlist, {header: state.grid.header}, state.grid.changelist),
    isFetching: state.grid.isFetching,
    portlist: state.grid.portlist,
    meta: state.grid.meta,
    header: state.grid.header
  }
}

// 
export default connect(select)(GridComponent)
