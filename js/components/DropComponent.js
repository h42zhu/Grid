import React, { PropTypes } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

import { ITEMTYPES } from '../constants/Constants'

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index
        }
    },
    endDrag(props, monitor) {
        const { id: droppedId, originalIndex } = monitor.getItem()
        const didDrop = monitor.didDrop()
        const dropResult = monitor.getDropResult()
        if (!didDrop) {
            //props.removeCard(monitor.getItem().id)
        }
    }
}

const cardTarget = {
    canDrop() {
        return false
    },

    hover(props, monitor) {
        const { id: draggedId } = monitor.getItem()
        const { id: overId } = props

        if (draggedId !== overId) {
            const { index: overIndex } = props.findCard(overId)
            props.moveCard(draggedId, overIndex)
        }
    }
}


@DropTarget(ITEMTYPES.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))

@DragSource(ITEMTYPES.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))

class DropCard extends React.Component {
    render() {
            const { text, isDragging, connectDragSource, connectDropTarget } = this.props
            const opacity = isDragging ? 0.2 : 1
            const style = {
                borderRadius: 5,
                borderStyle: 'groove',
                borderColor: '#3385ff',
                padding: 2,
                width: 140,
                height: 30,
                align: 'center',
                opacity: opacity
            }

      return connectDragSource(connectDropTarget(
          <div style={style}>
              {text}
          </div>
        ))
    }

}

export default DropCard
