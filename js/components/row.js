import React from 'react'
import ReactDOM from 'react-dom'
import CellComponent from './cell'


class Row extends React.Component {
    
    constructor (props) {
        super(props)
    }
    
    render() {
        var cells = this.props.cells,
            actions = this.props.actions,
            cellsList = [],
            i, ckey, val, style
        
        for (i = 0; i < cells.length; i = i + 1) {
            
            cellsList.push(<CellComponent
                            key={cells[i].key}
                            cellkey={cells[i].key}
                            value={cells[i].data}
                            style={cells[i].style}
                            actions={actions}
                            />);
        }

        return (<tr>{cellsList}</tr>);
    }
}


export default Row