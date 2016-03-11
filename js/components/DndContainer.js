import React from 'react'
import update from 'react/lib/update'
import { DragDropContext, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import _ from 'lodash'

import DropCard from './DropComponent'
import { ALLHEIRARCHY, ITEMTYPES } from '../constants/Constants'


const cardTarget = {
    drop() {result: "success"}
}

@DragDropContext(HTML5Backend)
@DropTarget(ITEMTYPES.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
class DndContainer extends React.Component {

    constructor(props) {
        super(props)
        this.moveCard = this.moveCard.bind(this)
        this.updateCards = this.updateCards.bind(this)
        this.findCard = this.findCard.bind(this)
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

    moveCard(id, atIndex) {
        const { card, index } = this.findCard(id)
        this.setState(update(this.state, {
        cards: {
            $splice: [
                [index, 1],
                [atIndex, 0, card]
            ]
        }
        }));
    }

    removeCard(id) {
        let cards = this.state.cards.slice(0)
        let idx = _.findIndex(cards, item=>item['id'] == id)
        cards = _.without(cards, cards[idx])
        this.setState({cards: cards})
    }

    findCard(id) {
        const cards = this.state.cards
        const card = cards.filter(c => c.id === id)[0]

        return {
            card,
            index: cards.indexOf(card)
        }
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
                        key={card.id}
                        id={card.id}
                        value={card.value}
                        text={card.text}
                        moveCard={this.moveCard}
                        findCard={this.findCard}
                        removeCard={this.removeCard}
                    />
                )
              })}
            </div>
        )
    }
}

export default DndContainer
