import React from 'react'
import { Panel, Button } from 'react-bootstrap';
import _ from 'lodash'

class NavComponent extends React.Component {

    constructor (props) {
        super(props)
    }

    componentWillMount () {

    }


    render () {
        return (
          <Panel>
              <Button>Toggle Portfolio</Button>
              <Button>Configure Grid</Button>
              <Button>Tactical Weights</Button>
          </Panel>
        )
    }
}

export {NavComponent}
