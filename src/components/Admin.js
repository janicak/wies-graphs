import { h, Component } from 'preact';

export default class Admin extends Component {
  savePositions(){
    const data = { edges: edges.get(), nodes: nodes.get() }
    console.log(JSON.stringify(data))
  }
  render() {
    return (
      <button
        style="visibility: hidden; display: none;"
        id="save-positions"
        type="button"
        onclick={this.savePositions}>
          Save Positions
      </button>
    )
  }
}
