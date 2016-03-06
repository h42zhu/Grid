import React from 'react'
import ReactDOM from 'react-dom'
import {CellComponent} from './CellComponent'


class RowComponent extends React.Component {

    constructor (props) {
        super(props)
    }

    componentWillReceiveProps(nextProps) {
        this.forceUpdate()
    }



    render() {
        const {uid, cells} = this.props
        var cellsList = [],
            i, ckey, val, style

        for (i = 0; i < cells.length; i = i + 1) {

            cellsList.push(<CellComponent
                            key={cells[i].uid}
                            uid={cells[i].uid}
                            data={cells[i].data}
                            style={cells[i].style}
                            meta={cells[i].meta}
                            pos={cells[i].pos}
                            action={cells[i].action}
                            />);
        }

        return (<tr>{cellsList}</tr>);
    }
}

export {RowComponent}
