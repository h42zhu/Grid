import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import DndContainer from './DndContainer'


class HierContainer extends React.Component {

    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    componentWillMount () {
        const {allHier, selectedHier} = this.props

        let orderedSelectedList = selectedHier.map(
            item => _.filter(allHier, 'value', item)[0]
        )
        this.setState({
            orderedSelectedHier: orderedSelectedList
        })
    }

    onChange (e) {
        let newOrderedSelectedHier = this.state.orderedSelectedHier.slice(0)
        let idx = _.findIndex(newOrderedSelectedHier,
                item=>item['value']==e.target.value)
        if (idx < 0) {
            let allHier = this.props.allHier
            idx = _.findIndex(allHier, item=>item['value']==e.target.value)
            newOrderedSelectedHier.push(allHier[idx])
            this.setState({
                orderedSelectedHier: newOrderedSelectedHier
            })
        }
    }

    onUpdate (newList) {
        this.setState({
            orderedSelectedHier: newList
        })
    }

    render () {

        const allHier = this.props.allHier
        const orderedSelectedHier = this.state.orderedSelectedHier
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
                    cards={orderedSelectedHier}
                    onUpdate={this.onUpdate}
                />
            </div>
        )
    }
}


export default HierContainer
