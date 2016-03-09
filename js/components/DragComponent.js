import React, { PropTypes } from 'react'
import { DragSource } from 'react-dnd'

import { ITEMTYPES } from '../constants/Constants'

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            name: props.name
        }
    },

    endDrag(props, monitor) {
        const item = monitor.getItem()
        const dropResult = monitor.getDropResult()
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

@DragSource(ITEMTYPES.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))

class DragCard extends React.Component {

    render() {
        const { isDragging, connectDragSource, name } = this.props
        const opacity = isDragging ? 0.5 : 1
        return connectDragSource(
            <div style={{ opacity: opacity }}>
                {name}
            </div>
        )
    }
}

// Wrapped Component
export default DragCard
