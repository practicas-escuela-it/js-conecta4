import { Game } from '../../../models/Game.js'
import { UserUiView } from './UserUiView.js'
import { TurnView } from './TurnView.js'
import { Event } from '../utils/Event.js'
import {BoardView} from "./BoardView.js";
import {Dom} from "../utils/Dom.js";
import {Coordinate} from "../../../types/Coordinate.js";

class GameView {
  #turnView
  #boardView

  constructor() {
    Event.setEventHandler(window, 'dropToken', (event) => {
      this.#turnView.dropToken(event.detail.column)
    })

    Event.setEventHandler(window, 'changeTurn', (event) => {
      this.#turnView.changeTurn()
    })
    this.drawGetNumberOfPlayers()
  }

  drawGetNumberOfPlayers(){
    let playerVsPlayer = document.createElement('button')
    playerVsPlayer.innerText = `Player\nVS\nPlayer`
    playerVsPlayer.addEventListener('click', ()=>{
      this.#startNewGame(2)
    })

    let playerVsMachine = document.createElement('button')
    playerVsMachine.innerText = `Player\nVS\nMachine`
    playerVsMachine.addEventListener('click', ()=>{
      this.#startNewGame(1)
    })

    let MachineVsMachine = document.createElement('button')
    MachineVsMachine.innerText = `Machine\nVS\nMachine`
    MachineVsMachine.addEventListener('click', ()=>{
      this.#startNewGame(0)
    })

    let modal = document.createElement('div')
    modal.id = 'dialogModal'

    modal.append(playerVsPlayer, playerVsMachine, MachineVsMachine)


    let modalContainer = document.createElement('div')
    modalContainer.id = 'modalContainer'
    modalContainer.classList.add('modalContainer')
    modalContainer.append(modal)

    document.body.append(modalContainer)

  }

  dropToken(column){
    this.#turnView.dropToken(column)
  }

  setGameControls() {
    for (let i = 0; i < Coordinate.NUMBER_COLUMNS; i++) {
      document.querySelectorAll('th').forEach((thElement)=>{
        thElement.addEventListener('click', ()=>{
          this.dropToken(i)
        })
      })

    }
  }
  #startNewGame(numOfPlayers) {
    document.getElementById('modalContainer').remove()
    let game = new Game(numOfPlayers)
    this.#boardView = new BoardView(game.getBoard())
    this.#boardView.build()
    this.#turnView = new TurnView(game.getTurn())
    this.setGameControls()

    if (numOfPlayers === 0) {
      this.#boardView.removeControls()
      setTimeout(() => this.dropToken(), 300)
    }

  }


}

window.onload = () => {
  let connect4 = new GameView()
}
