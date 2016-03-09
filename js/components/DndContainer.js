import React from 'react'
import update from 'react/lib/update'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import DropCard from './DropComponent'

const style = {
    width: 200
};

@DragDropContext(HTML5Backend)
class DndContainer extends React.Component {

    constructor(props) {
        super(props)
        this.moveCard = this.moveCard.bind(this)
    }

    componentWillMount () {
        this.setState({
            cards: [{id: 1, text: 'Asset Class', name: 'asset_class'},
                    {id: 2, text: 'Region', name: 'region'}]
        })
    }

    moveCard(dragIndex, hoverIndex) {
        const cards = this.state.cards;
        const dragCard = cards[dragIndex];

        this.setState(update(this.state, {
            cards: {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard]
              ]
            }
          }))
    }

    render() {
        const cards = this.state.cards;
        const style = {
            borderRadius: 5,
            borderStyle: 'solid',
            borderColor: '#000000',
            padding: 5,
            width: 160,
            height: 300
        }
        return (
            <div style={style}>
              {cards.map((card, i) => {
                return (
                  <DropCard
                        key={card.id}
                        index={i}
                        id={card.id}
                        text={card.text}
                        moveCard={this.moveCard} />
                )
              })}
            </div>
        )
    }
}

export default DndContainer
