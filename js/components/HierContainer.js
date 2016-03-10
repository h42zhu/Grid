import React from 'react'
import { Input } from 'react-bootstrap'
import _ from 'lodash'
import DndContainer from './DndContainer'

class HierContainer extends React.Component {

    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
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
            selectedHier: selectList
        })
    }

    onChange (e) {
        let newSelectedHier = _.assign({}, this.state.selectedHier)
        newSelectedHier[e.target.value] = true
        this.setState({
            selectedHier: newSelectedHier
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
                <DndContainer cards={selectedHier}/>
            </div>
        )
    }
}


export default HierContainer
