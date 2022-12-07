import { Board } from '../../models/Board.js'
import { Turn } from '../../models/Turn.js'
import { Game } from '../../models/Game.js'
import { Dom } from '../../js-no/utils/Dom.js'
import { Coordinate } from '../../types/Coordinate.js'
import { UserPlayer } from "../../models/UserPlayer.js";

class BoardView {#
    board# tableElement
    constructor(board) {
        this.#board = board
    }

    build() {
        this.#tableElement = document.createElement('table')
        this.#tableElement.id = 'connect4Board'

        let tableHeadElement = document.createElement('tr')
        tableHeadElement.id = 'controls'
        this.#tableElement.append(tableHeadElement)

        for (let i = 0; i < Coordinate.NUMBER_COLUMNS; i++) {
            let newHeadCol = document.createElement('th')
            newHeadCol.id = `Column-${i}-Control`
            tableHeadElement.append(newHeadCol)
        }

        for (let row = Coordinate.NUMBER_ROWS; row > 0; row--) {
            let rowElement = document.createElement('tr')
            rowElement.id = `${row - 1}`
            this.#tableElement.append(rowElement)

            for (let column = 0; column < Coordinate.NUMBER_COLUMNS; column++) {
                let newCol = document.createElement('td')
                newCol.id = `${row - 1}-${column}`
                rowElement.append(newCol)
            }
        }
        document.getElementById('board').append(this.#tableElement)
    }
    setControls(callback) {
        document.querySelectorAll('th').forEach((headElement, key) => {
            headElement.addEventListener('click', () => {
                callback(key)
            })
        })
    }
    removeControls(callback) {
        let tableHeadElement = document.createElement('tr')
        tableHeadElement.id = 'controls'
        for (let i = 0; i < Coordinate.NUMBER_COLUMNS; i++) {
            let newHeadCol = document.createElement('th')
            newHeadCol.id = `Column-${i}-Control`
            tableHeadElement.append(newHeadCol)
        }
        document.getElementById('controls').replaceWith(tableHeadElement)
    }

    getBoard() {
        return this.#board;
    }
}

class TurnView {

    #
    turn
    constructor(turn) {
        this.#turn = turn
    }

    dropToken(column) {
        console.log('drop from turn ' + column)
    }

    getTurn() {
        return this.#turn;
    }
}

export class GameView {#
    game# boardView# turnView

    constructor() {
        this.#startNewGame(1)
            //TODO
    }


    askPlayers() {
        // Renderizamos el HTML (botones) para que el usuario indique si es user-user o user-pc o pc-pc
    }

    startGame(numOfPlayers) {
        // Disparado por los evento de los botones de 'askPlayers'

        this.#boardView = new BoardView(new Board());
        this.#turnView = new TurnView(new Turn(this.#boardView.getBoard(), numOfPlayers));
        this.#game = new Game(this.#boardView.getBoard(), this.#turnView.getTurn());

    }

    play() {
        this.#turnView.getTurn().getActivePlayer().dropToken()
    }

    dropToken(column) {
        this.#turnView.dropToken(column)
        this.#game.next()
        if (this.#game.getActivePlayer().constructor.name !== UserPlayer.name) {
            setTimeout(() => this.dropToken(), 300)
        }

    }

    #
    startNewGame(numOfPlayers) {
        let board = new Board()
        let turn = new Turn(board, numOfPlayers)
        this.#game = new Game(board, turn)
        this.#boardView = new BoardView(board)
        this.#turnView = new TurnView(turn)
        this.#boardView.build()
        this.#boardView.setControls(this.dropToken.bind(this))
            //this.#boardView.removeControls()
            //this.#turnView.initTurn()
            //console.log(this.#game.getActivePlayer().constructor.name+' / '+ UserPlayer.name)
    }
}

window.onload = () => {
    new GameView()
}