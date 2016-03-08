import React from 'react'
import { Panel, Button, Modal, closeButton} from 'react-bootstrap'
import { FilterListComponent } from './FilterListComponent'
import { COMPREFS } from '../constants/Constants'

class NavComponent extends React.Component {

    constructor (props) {
        super(props)
        this.showTogglePortfolio = this.showTogglePortfolio.bind(this)
        this.showConfigureGrid = this.showConfigureGrid.bind(this)
        this.closeTogglePortfolio = this.closeTogglePortfolio.bind(this)
        this.closeConfigureGrid = this.closeConfigureGrid.bind(this)
        this.onRefreshPortlist = this.onRefreshPortlist.bind(this)
    }

    componentWillMount () {
        this.setState({
            showPortSelect: false,
            showConfigGrid: false,
        })
    }


    showTogglePortfolio() {
        this.setState({
            showPortSelect: true
        })
    }

    closeTogglePortfolio() {
        this.setState({
            showPortSelect: false
        })
    }

    showConfigureGrid() {
        this.setState({
            showConfigGrid: true
        })
    }

    closeConfigureGrid() {
        this.setState({
            showConfigGrid: false
        })
    }

    onRefreshPortlist() {

        const {data, dispMode, hier, cols, actions} = this.props
        let portSelected = this.refs[COMPREFS.TOGGLEPORTFOLIO].state.checkedlist
        let portlist = []
        for (var prop in portSelected) {
            if (portSelected[prop]) { portlist.push(parseInt(prop)) }
        }
        this.setState({
            showPortSelect: false
        })

        actions.buildVTree(data, portlist, hier, cols, dispMode)
    }

    render () {
        const {portlist, cols, meta} = this.props
        return (
            <div>
                <Panel>
                    <Button onClick={this.showTogglePortfolio}>Toggle Portfolio</Button>
                    <Button onClick={this.showConfigureGrid}>Configure Grid</Button>
                    <Button>Tactical Weights</Button>
                </Panel>

                <Modal show={this.state.showPortSelect} onHide={this.closeTogglePortfolio}>
                    <Modal.Header closeButton>
                        <Button
                          bsStyle="primary"
                          onClick={this.onRefreshPortlist}>
                          Refresh
                        </Button>
                    </Modal.Header>

                    <Modal.Body>
                        <FilterListComponent
                            ref={COMPREFS.TOGGLEPORTFOLIO}
                            portlist={portlist}
                            meta={meta}
                        />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.closeTogglePortfolio}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showConfigGrid} onHide={this.closeConfigureGrid}>
                    <Modal.Header closeButton>
                        <Button bsStyle="primary">Refresh</Button>
                    </Modal.Header>

                    <Modal.Body>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.closeConfigureGrid}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

            </div>

        )
    }
}

export {NavComponent}
