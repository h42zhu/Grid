import React from 'react'
import update from 'react/lib/update'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import DropCard from './DropComponent'
import { ALLHEIRARCHY } from '../constants/Constants'

@DragDropContext(HTML5Backend)
class DndContainer extends React.Component {

    constructor(props) {
        super(props)
        this.moveCard = this.moveCard.bind(this)
        this.updateCards = this.updateCards.bind(this)
        this.removeCard = this.removeCard.bind(this)
    }

    updateCards(cards) {
        var cardlist = [], idx
        for (var key in cards) {
            if (cards[key]) {
                idx = _.findIndex(ALLHEIRARCHY, item => item['value'] == key)
                cardlist.push(ALLHEIRARCHY[idx])
            }
        }

        this.setState({
            cards: cardlist
        })
    }

    componentWillMount () {
        const cards = this.props.cards
        this.updateCards(cards)
    }

    componentWillReceiveProps(nextProps) {
        const cards = nextProps.cards
        this.updateCards(cards)
    }

    moveCard(dragIndex, hoverIndex) {
        const cards = this.state.cards
        const dragCard = cards[dragIndex]

        this.setState(update(this.state, {
            cards: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard]
                ]
            }
          }))
    }

    removeCard(value) {
        const cards = this.state.cards
        let idx = _.findIndex(cards, item => item['value'] == value)
    }

    render() {
        const cards = this.state.cards
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
                        key={i}
                        index={i}
                        id={i}
                        value={card.value}
                        text={card.text}
                        moveCard={this.moveCard} />
                )
              })}
            </div>
        )
    }
}

export default DndContainer
