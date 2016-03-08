import React from 'react'
import { Panel, Button, Modal, closeButton} from 'react-bootstrap';

class NavComponent extends React.Component {

    constructor (props) {
        super(props)
        this.showTogglePortfolio = this.showTogglePortfolio.bind(this)
        this.showConfigureGrid = this.showConfigureGrid.bind(this)
        this.closeTogglePortfolio = this.closeTogglePortfolio.bind(this)
        this.closeConfigureGrid = this.closeConfigureGrid.bind(this)
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

    render () {
        return (
            <div>
                <Panel>
                    <Button onClick={this.showTogglePortfolio}>Toggle Portfolio</Button>
                    <Button onClick={this.showConfigureGrid}>Configure Grid</Button>
                    <Button>Tactical Weights</Button>
                </Panel>

                <Modal show={this.state.showPortSelect} onHide={this.closeTogglePortfolio}>
                    <Modal.Header closeButton>
                        <Button bsStyle="primary">Refresh</Button>
                    </Modal.Header>

                    <Modal.Body>

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
                        <Button onClick={this.closeConfigureGrid}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>

        )
    }
}

export {NavComponent}
