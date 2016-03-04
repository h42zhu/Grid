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
        const {uid, data, action, pos, style} = this.props
        var cellContent, cellDiv, cellNode

        if (style && style.editable) {
            cellDiv = (
            <div>
                <input type='text' value={this.state.data} style={this.state.style}
                    onKeyDown={this.onKeyDown}
                    onClick={this.handleClick}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}/>
            </div>)
        } else if (style && !style.header){
            cellDiv = (
                <div style={this.state.style} onClick={this.handleClick}>{data}</div>
            )
        } else {
            cellDiv = (
                <div onClick={this.handleClick}>{data}</div>
            )
        }

        // use different table tags for header vs data cells
        if (style && style.header)  {

            if (style.colspan) {
                cellNode = (<th colSpan={style.colspan}>{cellDiv}</th>)
            } else {
                cellNode = (<th>{cellDiv}</th>)
            }


        } else {
            cellNode = (
                <td>
                    {cellDiv}
                </td>
            )
        }

        return cellNode
    }
}

export {CellComponent}
