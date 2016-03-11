import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import DndContainer from './DndContainer'


class HierContainer extends React.Component {

    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onRemove = this.onRemove.bind(this)
        this.onReorder = this.onReorder.bind(this)
    }

    componentWillMount () {
        const {allHier, selectedHier} = this.props
        let selectList = {}
        for (var i=0; i<allHier.length; i=i+1) {
            let hier = allHier[i]
            let selected = _.includes(selectedHier, hier['value'])
            selectList[allHier[i].value] = selected
        }

        this.setState({
            selectedHier: selectList,
            orderedSelectedHier: selectedHier
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.orderedSelectedHier != nextState.orderedSelectedHier) {
            return false
        }
        return true
    }

    onChange (e) {
        let newSelectedHier = _.assign({}, this.state.selectedHier)
        newSelectedHier[e.target.value] = true
        this.setState({
            selectedHier: newSelectedHier
        })
    }

    onReorder (newList) {
        this.setState({
            orderedSelectedHier: newList
        })
    }

    onRemove (value, newList) {
        let newSelectedHier = _.assign({}, this.state.selectedHier)
        newSelectedHier[value] = false
        this.setState({
            selectedHier: newSelectedHier,
            orderedSelectedHier: newList
        })
    }

    render () {

        const allHier = this.props.allHier
        const selectedHier = this.state.selectedHier
        let options = allHier.map((item, i) =>
            (<option
                key={i}
                value={item.value}> {item.text}
            </option>))


        return (
            <div>
                <Input
                    type="select"
                    label="Select Hierachy"
                    onChange={this.onChange}
                    multiple>
                    {options}

                </Input>
                <DndContainer
                    cards={selectedHier}
                    onRemove={this.onRemove}
                    onReorder={this.onReorder}
                />
            </div>
        )
    }
}


export default HierContainer
