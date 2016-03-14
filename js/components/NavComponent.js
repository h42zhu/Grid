import React from 'react'
import { Panel, Button, Modal, closeButton, Accordion } from 'react-bootstrap'
import { FilterListComponent } from './FilterListComponent'
import { COMPREFS, ALLHEIRARCHY } from '../constants/Constants'
import DndContainer from './DndContainer'
import HierContainer from './HierContainer'

class NavComponent extends React.Component {

    constructor (props) {
        super(props)
        this.showTogglePortfolio = this.showTogglePortfolio.bind(this)
        this.showConfigureGrid = this.showConfigureGrid.bind(this)
        this.closeTogglePortfolio = this.closeTogglePortfolio.bind(this)
        this.closeConfigureGrid = this.closeConfigureGrid.bind(this)
        this.onRefreshPortlist = this.onRefreshPortlist.bind(this)
        this.onRefreshConfigGrid = this.onRefreshConfigGrid.bind(this)
        this.onChangeDispMode = this.onChangeDispMode.bind(this)
    }

    componentWillMount () {
        const dispMode = this.props.dispMode
        let checked = (dispMode=='percentage')
        this.setState({
            showPortSelect: false,
            showConfigGrid: false,
            showPercentage: checked
        })
    }


    showTogglePortfolio () {
        this.setState({
            showPortSelect: true
        })
    }

    closeTogglePortfolio () {
        this.setState({
            showPortSelect: false
        })
    }

    showConfigureGrid () {
        this.setState({
            showConfigGrid: true
        })
    }

    closeConfigureGrid () {
        this.setState({
            showConfigGrid: false
        })
    }

    onRefreshPortlist () {

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

    onRefreshConfigGrid () {
        const {data, dispMode, portlist, hier, cols, actions} = this.props
        let hierSelected = this.refs[COMPREFS.HIERARCHY].state.orderedSelectedHier
        this.setState({
            showConfigGrid: false
        })

        let newHier = hierSelected.map(item=>item.value)
        let newCols = cols
        actions.buildVTree(data, portlist, newHier, newCols, dispMode)
    }

    onChangeDispMode () {
        const actions = this.props.actions
        let newDispMode = this.state.showPercentage ? 'dollar': 'percentage'

        this.setState({
            showPercentage: !this.state.showPercentage
        })

        actions.toggleDisp(newDispMode)

    }


    render () {
        const {portlist, cols, meta, hier} = this.props
        return (
            <div>
                <Panel>
                    <Button onClick={this.showTogglePortfolio}>Toggle Portfolio</Button>
                    <Button onClick={this.showConfigureGrid}>Configure Grid</Button>
                    <Button>Tactical Weights</Button>
                    <label className="switch switch-flat" style={{top: 10}}>
                    	<input className="switch-input" type="checkbox"
                            checked={this.state.showPercentage} onChange={this.onChangeDispMode}/>
                    	<span className="switch-label" data-on="percentage" data-off="dollar"></span>
                    	<span className="switch-handle"></span>
                    </label>
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
                        <Button bsStyle="primary" onClick={this.onRefreshConfigGrid}>
                            Refresh
                        </Button>
                    </Modal.Header>

                    <Modal.Body>
                        <Accordion>
                            <Panel header="Hierarchy" eventKey="1">
                                <HierContainer
                                    ref={COMPREFS.HIERARCHY}
                                    allHier={ALLHEIRARCHY}
                                    selectedHier={hier}
                                />
                            </Panel>
                            <Panel header="Toggle Columns" eventKey="2">
                                Placeholder
                            </Panel>
                        </Accordion>
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
