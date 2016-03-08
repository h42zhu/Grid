import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Tabs, Tab } from 'react-bootstrap';

import { GridComponent } from '../components/GridComponent'
import { NavComponent } from '../components/NavComponent'
import * as GridActions from '../actions/GridActions'


class GridApp extends React.Component {

  constructor (props) {
      super(props)
  }



  render() {
    const {data, vtree, isFetching, changelist, meta, hier, portlist, cols,
           actions, dispMode} = this.props

    return (
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title="Main">
          <div>
            <NavComponent
              portlist={portlist}
              cols={cols}
              meta={meta}
            />
            <GridComponent
              data={data}
              vtree={vtree}
              isFetching={isFetching}
              changelist={changelist}
              meta={meta}
              hier={hier}
              portlist={portlist}
              cols={cols}
              actions={actions}
              dispMode={dispMode}
            />
          </div>
        </Tab>
        <Tab eventKey={2} title="Trading">Placeholder</Tab>
        <Tab eventKey={3} title="Metrics">Placeholder</Tab>
      </Tabs>

    )
  }

}


function selectProps(state) {
    return {
        data: state.grid.data,
        vtree: state.grid.vtree,
        isFetching: state.grid.isFetching,
        changelist: state.grid.changelist,
        meta: state.grid.meta,
        hier: state.panel.heir,
        portlist: state.panel.portSelected,
        cols: state.panel.cols,
        dispMode: state.panel.dispMode
    }
}

function selectActions(dispatch) {
    return {
        actions: bindActionCreators(GridActions, dispatch)
    }
}

//
export default connect(selectProps, selectActions)(GridApp)
