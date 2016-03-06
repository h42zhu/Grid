import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

class CellComponent extends React.Component {
    constructor (props) {
        super(props)
        // React components using ES6 classes no longer autobind this to non React methods
        // need to manually bind them in constructor
        this.onKeyDown = this.onKeyDown.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    componentWillMount () {
        this.setState({
            data: this.props.data,
            style: this.props.style
        })
    }

    componentWillReceiveProps () {
        this.setState({
            style: this.props.style
        })
    }

    handleFocus (e) {
        var style = _.assign({},this.props.style)
        // style['backgroundColor'] = "#00B1E1"
        this.setState({
            style: style
        })

    }

    handleClick (e) {

    }

    handleBlur (e) {
        var style = _.assign({}, this.props.style)
        const {action, pos} = this.props
        if (this.props.data != e.target.value) {
            style['backgroundColor'] = "#E9573F"
            this.setState({
                style: style
            })

            action(pos, e.target.value, this.props.data)
        } else {
            style['backgroundColor'] = "#ffffff"
            this.setState({
                style: style
            })
        }
    }

    handleChange (e) {

        this.setState({
            data : e.target.value
        })

    }

    onKeyDown (e) {

    }

    render () {
        const {uid, data, action, pos, style, meta} = this.props
        var cellContent, cellDiv, cellNode

        let decimalPlace = style.disp? style.disp: 2
        let dispData = isNaN(parseFloat(data))? data : parseFloat(data).toFixed(2)

        if (meta && meta.editable) {
            let inputStyle = {width: "100%", height: "100%"}
            cellDiv = (
            <div>
                <input type='text'
                    ref={this.props.uid}
                    value={this.state.data}
                    style={inputStyle}
                    defaultValue={data}
                    onClick={this.handleClick}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                />
            </div>)
        } else if (meta && !meta.header){
            cellDiv = (
                <div onClick={this.handleClick}>
                  {dispData}
                </div>
            )
        } else {
            cellDiv = (
                <div onClick={this.handleClick}>{dispData}</div>
            )
        }

        // use different table tags for header vs data cells
        if (meta && meta.header)  {

            if (meta.colspan) {
                cellNode = (<th colSpan={meta.colspan} style={this.state.style}>{cellDiv}</th>)
            } else {
                cellNode = (<th style={this.state.style}>{cellDiv}</th>)
            }


        } else {
            cellNode = (
                <td style={this.state.style}>
                    {cellDiv}
                </td>
            )
        }

        return cellNode
    }
}

export {CellComponent}
