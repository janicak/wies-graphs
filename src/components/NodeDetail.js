import { h, Component } from 'preact';

export default class Admin extends Component {
  render() {
    return (
      <div className="nodeContent"><h4>Node Content:</h4>
        <pre id="nodeContent"></pre>
      </div>
    )
  }
}
