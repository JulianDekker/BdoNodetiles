import React from 'react';
//import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <TileContainer />
    </div>
  );
}

class TileContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberoftiles: -1,
            zoom: 2,
            height: -1,
            width: -1,
            rows: -1,
            collumns: -1,
            rowlimit: -1,
            collimit: -1,
        };

    }
    componentDidMount() {
        this.setState({ height: document.documentElement.clientHeight });
        this.setState({ width: document.documentElement.clientWidth });
        if (this.state.zoom === 3){
            this.setState({
                rows: (document.documentElement.clientHeight/122),
                collumns: (document.documentElement.clientWidth/241),
                rowlimit: 73,
                collimit: 73
            })
        }
        if (this.state.zoom === 2){
            this.setState({
                rows: (document.documentElement.clientHeight/230),
                collumns: (document.documentElement.clientWidth/420),
                rowlimit: 42,
                collimit: 42
            })
        }
    }

    makeTiles = () => {
        let tiles = [];
        for (let row = 0; row < this.state.rowlimit; row++){
            if (row < this.state.rows){
                let children = [];
                const className = "row";
                for (let col = 0; col < this.state.collimit; col++){
                    if (col < this.state.collumns){
                        children.push(<Tile locationx={row+1} locationy={col+1} zoom={this.state.zoom} key={(row+1*col+1)} />)
                    }
                }
                tiles.push(<div className={className} key={row} >{children}</div>);
            }
        }
        return tiles
    };

    render(){
        return (
            <div className="test">
               {this.state.rows} {this.state.collumns}
                {this.makeTiles()}
            </div>
        );
    };
}

export default App;

class Tile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            locationx: -1,
            locationy: -1,
            height: -1,
            width: -1,
        };

    }
    componentDidMount() {
        this.setState({locationx: this.props.locationx, locationy: this.props.locationy})
        this.setState({ height: document.documentElement.clientHeight });
        this.setState({ width: document.documentElement.clientWidth });
    }

    formatNumber = (number) => {
        if (number < 10){
            number = number.toString().padStart(2, 0)
        }
        return number.toString()
    };

    render(){
        const tileId = '_'+this.formatNumber(this.state.locationx)+'_'+this.formatNumber(this.state.locationy);
        const divStyle = {
            backgroundImage: 'url(/zoom_' + this.props.zoom + '/'+ tileId + '.png)',
            height: 230,
            width: 420,
        };
        return (
            <div className={this.visible} style={divStyle} >{ this.state.locationx }, { this.state.locationy }</div>
        );
    };
}