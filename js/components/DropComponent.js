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

        if (!didDrop) {
            props.moveCard(droppedId, originalIndex);
        }
    }
}

const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }

        // Time to actually perform the action
        props.moveCard(dragIndex, hoverIndex);

        // Note: mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
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
