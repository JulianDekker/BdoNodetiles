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

            mapsizex: -1,
            mapsizey: -1,

        };

    }
    componentDidMount() {
        this.setState({ height: document.documentElement.clientHeight });
        this.setState({ width: document.documentElement.clientWidth });
        this.setState({
            rows: (document.documentElement.clientHeight/100),
            collumns: (document.documentElement.clientWidth/100)
        });
        this.checkZoom(this.state.zoom)
    }

    makeTiles = () => {
        let tiles = [];
        for (let row = 0; row < this.state.rowlimit; row++){
            if (row < this.state.rows){
                let children = [];
                const className = "row";
                for (let col = 0; col < this.state.collimit; col++){
                    if (col < this.state.collumns){
                        children.push(<Tile locationy={row+1+this.state.viewy} locationx={col+1+this.state.viewx} zoom={this.state.zoom} key={(row+1*col+1)} />)
                    }
                }
                tiles.push(<div className={className} key={row} onMouseDown={this.drag.bind(this)}
                                onMouseUp={this.drop.bind(this)} onWheel={this.zoom.bind(this)} sizex={this.state.mapsizex} sizey={this.state.mapsizey} >{children}</div>);
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
        //if ((this.state.viewx-difx) <= this.state.rowlimit && this.state.viewy-dify <= this.state.collimit && this.state.viewx-difx > -1 && this.state.viewy-dify > -1){
        if (this.state.viewx-difx > -1 && this.state.viewy-dify > -1){
            this.setState({
                viewx: this.state.viewx-difx,
                viewy: (this.state.viewy-dify),
            });
        }
    }

    checkZoom = (zoom) => {
        console.log('checkzoom', zoom);
        if (zoom === 4){
            this.setState({
                rowlimit: 12,
                collimit: 23,
                mapsizex: 2240,
                mapsizey: 1136,
            })
        }
        if (zoom === 3){
            this.setState({
                rowlimit: 23,
                collimit: 45,
                mapsizex: 4480,
                mapsizey: 2272,
            })
        }
        if (zoom === 2){
            this.setState({
                rowlimit: 35,
                collimit: 68,
                mapsizex: 6720,
                mapsizey: 3408,
            })
        }
        if (zoom === 1){
            this.setState({
                rowlimit: 90,
                collimit: 177,
                mapsizex: 17664,
                mapsizey: 8960,
            })
        }
    };

    returnsize(zoom){
        let sizes = [-1, -1];

        if (zoom === 4){
            sizes = [2240, 1136];
        }
        if (zoom === 3){
            sizes = [4480, 2272];
        }
        if (zoom === 2){
            sizes = [6720, 3408];
        }
        if (zoom === 1){
            sizes = [17664, 8960];
        }
        return sizes
    }

    translatepoints(x, y, size, pixelx=0, pixely=0){
        let xpixels = +x * 100 + pixelx;
        let ypixels = +y * 100 + pixely;
        return [xpixels / +size[0], ypixels / +size[1]]
    }

    pixeltoposition(point, size){
        let x = +point[0];
        let y = +point[1];
        return [Math.floor(size[0] * x /100), Math.floor(size[1] * y / 100), (size[0] * x /100-Math.floor(size[0] * x /100))*100,
            (size[1] * y / 100 - Math.floor(size[1] * y / 100))*100];
    }

    zoom(event){
        //console.log('mid', midx, midy);
        if (event.deltaY < 0){
            let midx = this.state.viewx + (Math.ceil(this.state.rows/4));
            let midy = this.state.viewy + (Math.ceil(this.state.collumns/4));
            let curzoom  = this.state.zoom-1;
            if (this.state.zoom > 1){
                this.checkZoom(curzoom);
                let sizeold = this.returnsize(this.state.zoom);
                let sizenew = this.returnsize(curzoom);
                this.setState({
                    zoom: curzoom,
                    viewx: this.pixeltoposition(this.translatepoints(midx, midy, sizeold), sizenew)[0],
                    viewy: this.pixeltoposition(this.translatepoints(midx, midy, sizeold), sizenew)[1],
                });

            }
        }
        else if (event.deltaY > 0){
            let midx = this.state.viewx;
            let midy = this.state.viewy;
            let curzoom = this.state.zoom+1;
            if (this.state.zoom < 4){
                this.checkZoom(curzoom);
                let sizeold = this.returnsize(this.state.zoom);
                let sizenew = this.returnsize(curzoom);
                this.setState({
                    zoom: curzoom,
                    viewx: this.pixeltoposition(this.translatepoints(midx, midy, sizeold), sizenew)[0],
                    viewy: this.pixeltoposition(this.translatepoints(midx, midy, sizeold), sizenew)[1],
                });

            }
        }
    }


    render(){
        console.log('render called', this.state.zoom);
        console.log(this.state.viewx + (Math.ceil(this.state.rows/4)), this.state.viewy + (Math.ceil(this.state.collumns/4)));
        return (
            <div className="test">
                {this.state.rows} {this.state.collumns}
                {this.makeTiles()}
            </div>
        );
    };
}

class Tile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tiletowers: [],
            locationx: -1,
            locationy: -1,
            sizex: -1,
            sizey: -1,
            ref: React.createRef()
        };
    }

    componentDidMount() {
        this.setState({
            locationy: this.props.locationy,
            locationx: this.props.locationx,
            sizex: this.props.sizex,
            sizey: this.props.sizey,
        });

    }

    translatepoints(x, y, size, pixelx=0, pixely=0){
        let xpixels = +x * 100 + pixelx;
        let ypixels = +y * 100 + pixely;
        return [xpixels / +size[0], ypixels / +size[1]]
    }

    pixeltoposition(point, size){
        let x = +point[0];
        let y = +point[1];
        return [Math.floor(size[0] * x /100), Math.floor(size[1] * y / 100), (size[0] * x /100-Math.floor(size[0] * x /100))*100,
            (size[1] * y / 100 - Math.floor(size[1] * y / 100))*100];
    }

    formatNumber = (number) => {
        if (number < 10){
            number = number.toString().padStart(2, 0)
        }
        return number.toString()
    };

    onCreateTower(event){
        let newtowers = this.state.tiletowers;
        //let elRect = this.state.ref. getBoundingClientRect();
        newtowers.push({
            'xloc': event.nativeEvent.offsetX,
            'yloc': event.nativeEvent.offsetY,
        });
        this.setState({
            tiletowers: newtowers
        });


        // let tower = [];
        // let remaining = this.pixeltoposition(this.translatepoints(this.props.locationx, this.props.locationy,
        //     [this.state.sizex, this.state.sizey]), [this.state.sizex, this.state.sizey])[0];
        // tower.push(<tower class='tower' locationx={remaining[2]} locationy={remaining[3]} />);
        // return tower
    }

    render(){
        let towers = [];
        if (this.state.tiletowers.length != 0){
            console.log(this.state.tiletowers);
        }
        for (var i = 0; i < this.state.tiletowers.length; i += 1) {
            towers.push(<Tower key={i} locationx={this.state.tiletowers[i].xloc} locationy={this.state.tiletowers[i].yloc} />);
        }

        const tileId = '_'+this.formatNumber(this.props.locationy)+'_'+this.formatNumber(this.props.locationx);
        const divStyle = {
            backgroundImage: 'url(/zoom_' + this.props.zoom + '/'+ tileId + '.png)',
            height: 100,
            width: 100,
            position: 'relative',
        };
        return (
            <div style={divStyle} onDoubleClick={this.onCreateTower.bind(this)} >{towers}</div>
        );
    };
}

class Tower extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            locationx: -1,
            locationy: -1,
            cannonrangeIsOn: false,
        };
    }

    componentDidMount() {
        this.setState({locationy: this.props.locationy, locationx: this.props.locationx});

    }

    render(){
        const divStyle = {
            position: 'absolute',
            top: this.props.locationy-50,
            left: this.props.locationx-15,
        };
        return (
            <div style={divStyle} className='tower' ></div>
        );
    };
}

export default App;