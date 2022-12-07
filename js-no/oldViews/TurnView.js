import { UserPlayerView } from './UserPlayerView.js'
import { MachinePlayerView } from './MachinePlayerView.js'
import { UserUiView } from './UserUiView.js'
import {Dom} from "../utils/Dom.js";

export class TurnView {
  #turn

  #column

  constructor(turn) {
    this.#turn = turn
    document.getElementById('turnColor').innerHTML = this.#turn.getActivePlayer().getColor().toString()
    document.getElementById('turnColor').style.color = this.#turn.getActivePlayer().getColor().toString()
    document.querySelectorAll('th').forEach((thElement)=>{
      thElement.style.setProperty('--th-background-color', this.#turn.getActivePlayer().getColor().toString())
    })
  }

  dropToken(column) {
    this.#column = column
    this.#turn.getActivePlayer().accept(this)
    UserUiView.getInstance().drawTokenOnBoard()
    this.#checkBoardStatusAndContinue()
  }

  visitUserPlayer(userPlayer) {
    new UserPlayerView(userPlayer).dropToken(this.#column)
  }

  visitMachinePlayer(machinePlayer) {
    new MachinePlayerView(machinePlayer).dropToken()
  }

  #checkBoardStatusAndContinue() {
    if (UserUiView.getInstance().isFinished()) {
      UserUiView.getInstance().resultActions(
          this.#turn.getActivePlayer().getColor().toString()
      )
    } else {
      this.machinePlayHandler()
    }
  }

  machinePlayHandler() {
    if (
      this.#turn.getNumOfPlayers() === 0 ||
      this.#turn.getNumOfPlayers() === 1 &&
        this.#turn.getActivePlayer().getColor().toString() === 'Yellow'
    ) {
      setTimeout(() => this.dropToken(), 300)
    }
  }

  changeTurn() {
    this.#turn.next()
    UserUiView.getInstance().setTurnMessages(
      this.#turn.getActivePlayer().getColor().toString()
    )
  }
}
