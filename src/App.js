import React from 'react';
//import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App" >
      <TileContainer />
    </div>
  );
}

class TileContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewx: 2,
            viewy: 2,
            zoom: 4,
            height: -1,
            width: -1,
            rows: -1,
            collumns: -1,
            rowlimit: -1,
            collimit: -1,

            fromx: 0,
            fromy: 0,
        };

    }
    componentDidMount() {
        this.setState({ height: document.documentElement.clientHeight });
        this.setState({ width: document.documentElement.clientWidth });
        this.setState({
            rows: (document.documentElement.clientHeight/100),
            collumns: (document.documentElement.clientWidth/100)
        });
        if (this.state.zoom === 4){
            this.setState({
                rowlimit: 12,
                collimit: 23
            })
        }
        if (this.state.zoom === 3){
            this.setState({
                rowlimit: 23,
                collimit: 45
            })
        }
        if (this.state.zoom === 2){
            this.setState({
                rowlimit: 35,
                collimit: 68
            })
        }
        if (this.state.zoom === 1){
            this.setState({
                rowlimit: 90,
                collimit: 177
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
                        console.log('tile', this.state.viewx, this.state.viewy);
                        children.push(<Tile locationy={row+1+this.state.viewy} locationx={col+1+this.state.viewx} zoom={this.state.zoom} key={(row+1*col+1)} />)
                    }
                }
                tiles.push(<div className={className} key={row} onMouseDown={this.drag.bind(this)}
                                onMouseUp={this.drop.bind(this)} onWheel={this.zoom.bind(this)}>{children}</div>);
            }
        }
        return tiles
    };

    drag(event) {
        event.preventDefault();
        this.setState({
            fromx: event.screenX,
            fromy: event.screenY,
        });
    }
    drop(event) {
        event.preventDefault();
        let difx = Math.round((event.screenX - this.state.fromx)/100);
        let dify = Math.round((event.screenY - this.state.fromy)/100);
        console.log(difx, dify);
        //if ((this.state.viewx-difx) <= this.state.rowlimit && this.state.viewy-dify <= this.state.collimit && this.state.viewx-difx > -1 && this.state.viewy-dify > -1){
        if (this.state.viewx-difx > -1 && this.state.viewy-dify > -1){
            this.setState({
                viewx: this.state.viewx-difx,
                viewy: (this.state.viewy-dify),
            });
        }
        console.log('log', this.state.viewx, this.state.viewy, this.state.collimit, this.state.rowlimit, this.state.zoom);
    }

    zoom(event){
        if (event.deltaY === -100){
            if (this.state.zoom > 1){
                this.setState({
                    zoom: this.state.zoom-1,
                    viewx: Math.round(this.state.viewx*3),
                    viewy: Math.round(this.state.viewy*3),
                });
            }
        }
        else if (event.deltaY === 100){
            if (this.state.zoom < 4){
                this.setState({
                    zoom: this.state.zoom+1,
                    viewx: Math.round(this.state.viewx/3),
                    viewy: Math.round(this.state.viewy/3),
                });
            }
        }
        console.log( this.state.zoom, event.deltaY)
    }


    render(){
        console.log('render called');
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
        };
    }

    componentDidMount() {
        this.setState({locationy: this.props.locationy, locationx: this.props.locationx});

    }

    formatNumber = (number) => {
        if (number < 10){
            number = number.toString().padStart(2, 0)
        }
        return number.toString()
    };

    render(){
        const tileId = '_'+this.formatNumber(this.props.locationy)+'_'+this.formatNumber(this.props.locationx);
        const divStyle = {
            backgroundImage: 'url(/zoom_' + this.props.zoom + '/'+ tileId + '.png)',
            height: 100,
            width: 100,
        };
        return (
            <div className={this.visible} style={divStyle} ></div>
        );
    };
}