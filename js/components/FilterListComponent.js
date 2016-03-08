import React from 'react'
import _ from 'lodash'
import { Button, Input } from 'react-bootstrap';


class FilterListComponent extends React.Component {

    constructor (props) {
        super(props)
        this.renderItem = this.renderItem.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleCheckAll = this.handleCheckAll.bind(this)
    }

    componentWillMount () {
        const { meta, portlist } = this.props
        let checkedlist = {}

        for (var i=0; i<meta.portlist.length; i=i+1) {
            let port = meta.portlist[i]
            let checked = _.includes(portlist, port['port_id'])
            checkedlist[port['port_id']] = checked
        }
        var checkevery = (_.values(checkedlist)).reduce((acc, cur)=> acc && cur)

        this.setState({
            checkall: checkevery,
            checkedlist: checkedlist
        })
    }

    handleChange (item) {
        var newCheckedlist = _.assign({}, this.state.checkedlist)
        newCheckedlist[item['port_id']] = !newCheckedlist[item['port_id']]
        var checkevery = (_.values(newCheckedlist)).reduce((acc, cur)=> acc && cur)

        this.setState({
            checkall: checkevery,
            checkedlist: newCheckedlist
        })
    }

    handleCheckAll () {
        var newCheckedlist = _.assign({}, this.state.checkedlist)
        if (this.state.checkall) {
            for (var prop in newCheckedlist){
                newCheckedlist[prop] = false
            }
            this.setState({
                checkall: false,
                checkedlist: newCheckedlist
            })
        } else {
            for (var prop in newCheckedlist){
                newCheckedlist[prop] = true
            }
            this.setState({
                checkall: true,
                checkedlist: newCheckedlist
            })
        }
    }

    renderItem (item) {
        return <li key={item.port_id}>
                    <Input
                        type="checkbox"
                        label={item.port_name}
                        checked={this.state.checkedlist[item['port_id']]}
                        onChange={this.handleChange.bind(this, item)}
                    />
                </li>
    }

    render () {
        const meta = this.props.meta
        var ports = meta.portlist.map(item => this.renderItem(item))

        return (
            <div><ul>
            <li>
              <Input
                  type="checkbox"
                  label="All"
                  checked={this.state.checkall}
                  onChange={this.handleCheckAll}
              /> <ul>
                {ports}
            </ul></li>
            </ul></div>)
    }

}

export { FilterListComponent }
