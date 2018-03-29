import { h, Component } from 'preact';

class Key extends Component {
  render({items}) {
    return(
      <div className="key">
        { Object.keys(items).map((itemName) => {
            const i = items[itemName];
            return(
              <span style={`color: ${i.color};`} className="key-item" key={itemName}>
                <i className={i.iconClassName} />:
                  {itemName}
              </span>
            )
          })
        }
      </div>
    )
  }
}

export default Key;
