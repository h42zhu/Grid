import React from 'react'
import ReactDOM from 'react-dom'

class CellComponent extends React.Component {
    
    /*
     */
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
            data: this.props.value,
            style: this.props.style
        })
    }
    
    //shouldComponentUpdate () {
        
    //}
    
    componentWillReceiveProps () {
        // do this only for total cells
        if (this.props.cellkey.indexOf("total_") > 0) {
            
            this.setState({
                data: this.props.value,
                style: this.props.style
            })
        }
    }
    
    
    handleFocus (e) {
        let newStyle = Object.assign({}, this.state.style)
        newStyle['borderColor'] = 'blue'
        this.setState({data : e.target.value, style: newStyle})
    }
    
    handleBlur (e) {
        let newStyle = Object.assign({}, this.state.style)
        let key = this.props.cellkey
        let data = e.target.value === '' ? '': parseFloat(e.target.value)
        newStyle['borderColor'] = 'white'
        this.setState({data : data, style: newStyle})
        this.props.actions(key, e.target.value)
    }
    /*
     * Click handler for individual cell, ensuring navigation and selection
     * @param  {event} e
     */
    handleClick (e) {
        
        
    }
    
    handleChange (e) {
        let newStyle = Object.assign({}, this.state.style)
        newStyle['backgroundColor'] = 'grey'
        this.setState({data : e.target.value, style: newStyle})
    }

    /*
     */
    onKeyDown (e) {
        switch (e.keyCode) {
            case 13: // Enter
            case 9: // Tab
                break
        }
    }
    
    
    /*
     * React "render" method, rendering the individual cell
     */
    render () {
        var props = this.props,
            style = this.state.style,
            key = props.key,
            cellContent, cellDiv, cellNode;
        
        if (style && style.editable) {
            cellDiv = (
            <div>
                <input type='text' value={this.state.data} style={style}
                    onKeyDown={this.onKeyDown}
                    onClick={this.handleClick}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}/>
            </div>)
        } else if (style){
            cellDiv = (
                <div style={style}>{this.state.data}</div>
            )
        } else {
            cellDiv = (
                <div>{this.state.data}</div>
            )
        }
        
        if (style.header)  {
            
            if (style.colspan) {
                cellNode = (<th colSpan={style.colspan}>{cellDiv}</th>)
                
            } else {
                cellNode = (<th>{cellDiv}</th>)
            }
            
            
        } else {
            cellNode = (
                <td >
                    {cellDiv}
                </td>
            )
        }
        
        return (cellNode);
    }
}

export default CellComponent

