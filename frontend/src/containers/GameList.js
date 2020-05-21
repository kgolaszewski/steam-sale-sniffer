import React, { Component } from 'react';
import '../App.css';
import CustomModal from  '../components/Modal';
import axios from 'axios';
import { Input, Spin } from 'antd'

import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';

import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'

const { Search } = Input

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      modal: false,
      activeItem: {
        game: '', user: 1, target_price: "", purchased: false,
      },
      loading: false,
      hasMore: true,
      next: "http://localhost:8001/api/games/?page=2",
    }
  }

  loadedRowsMap = {}

  handleInfiniteLoad = ({ startIndex, stopIndex }) => {
    console.log("Handling infinite scroll...")
    let { next, games } = this.state 
    this.setState({ loading: true })

    for (let i = startIndex; i <= stopIndex; i++) { this.loadedRowsMap[i] = 1 } // 1: loading
    if (!next) { this.setState({ hasMore: false, loading: false}); return; }

    axios.get(next)
      .then(res => {
        let updated_games = [...games, ...res.data.results].filter(
          game => !game.users.includes(+localStorage.getItem('userId'))
        )
        this.setState({ games: updated_games, next: res.data.next})
      })
      .then(res => {
        this.setState({ loading: false})
      })
  }

  isRowLoaded = ({ index }) => !!this.loadedRowsMap[index]

  renderItem = ({ style, index, key }) => {
    let btnStyle = "btn btn-success pad-r"
    const { games } = this.state
    const game = games[index]
    return (
      <div style={style}>
      <div className="row game" key={key}
        
      >
        <button className={btnStyle} id={game.id} onClick={() => this.toggle(game.id) }>
          <div className='plus'>+</div>
        </button>
        <img className="offset-0" height="55" alt=""
          src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/capsule_184x69.jpg`} 
        />
        <div className="col-md-5 game-title text">{game.title}</div>
        <div className="offset-1 col-md-3 game-price text">${game.base_price}</div>
      </div>
      <div className='row divider'></div>
      </div>
    )
  }



  componentDidMount() {
    // console.log('Component mounted\n', localStorage.getItem('userId'))
    axios
      .get('http://localhost:8001/api/games')
      .then( res => {this.setState({ 
        games: res.data.results.filter(game => !game.users.includes(+localStorage.getItem('userId'))),
        activeItem: {
          ...this.state.activeItem,
          user: (localStorage.getItem('userId') === undefined ? 1 : +localStorage.getItem('userId'))
        },

      }) } )
      .catch( err => console.log(err) )
  }

  componentWillReceiveProps() {
    let userId = +localStorage.getItem('userId')
    console.log('Recieve props has identified userId: '+userId)
    this.setState({
      activeItem: {
        ...this.state.activeItem, 
        user: userId
      },
      games: this.state.games.filter(game => !game.users.includes(userId) )
    })
  }

  handleSubmit = (item) => {
    item = {
      ...item,
      target_price: parseFloat(item.target_price)
    }
    axios
      .post(`http://localhost:8001/api/wishlistitems/`, item)
      .then(res => { console.log(item) })
      .catch(err => {console.log(item); console.log(err);})
    this.setState({ 
      games: this.state.games.filter(game => game.id !== item.game)
    })
    this.toggle();
  }

  toggle = (app_id) => { 
    let new_id = !this.state.modal ? app_id : ''
    this.setState({ 
      modal: !this.state.modal, 
      activeItem: {
        ...this.state.activeItem, 
        game: new_id
      }
    }) 
    console.log(this.state)
  }

  dynamicSearch = (value) => {
    axios.get(`http://localhost:8001/api/search/?q=${value}`)
      .then(res => {
        let updated_games = [...res.data].filter(
          game => !game.users.includes(+localStorage.getItem('userId'))
        )
        console.log(updated_games)
        this.setState({
          games: updated_games,
          next: "http://localhost:8001/api/games/?page=2",
        })
      })
  }

  onChangeSearch = (e) => {
    let { value } = e.target
    axios.get(`http://localhost:8001/api/search/?q=${value}`)
      .then(res => {
        let updated_games = [...res.data].filter(
          game => !game.users.includes(+localStorage.getItem('userId'))
        )
        console.log(updated_games)
        this.setState({
          games: updated_games,
          next: "http://localhost:8001/api/games/?page=2",
        })
      })
  }

  render() {
    const { games } = this.state;
    const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
      <VList
        height={height} 
        isScrolling={isScrolling} 
        // onScroll={onChildScroll}
        scrollTop={scrollTop} 
        onRowsRendered={onRowsRendered} 
        width={width}

        autoHeight
        rowHeight={77}
        overscanRowCount={5}
        rowCount={games.length}
        rowRenderer={this.renderItem}
      />
    );


    const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
      <AutoSizer 
        disableHeight 
      >
        {({ width }) => vlist({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) }
      </AutoSizer>
    );
    const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
      <InfiniteLoader isRowLoaded={this.isRowLoaded} loadMoreRows={this.handleInfiniteLoad} rowCount={games.length}>
        { ({ onRowsRendered }) => autoSize({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) }
      </InfiniteLoader>
    );
    return (
      <div className="App background">
        <h1>Recommended Steam Games</h1>
        <div className="container">
          {/* <input type="text" list="games" /> */}
          {/* <Input list="games" onChange={this.dynamicSearch}/> */}
          <Search list="games" placeholder="" onSearch={value => this.dynamicSearch(value)} enterButton />
          <datalist id="games">
            {this.state.games.map(game => (<option>{game.title}</option> ))}
          </datalist>
          <div className="row">
            <div className="offset-1 col-md-10">
              {games.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
            </div>
          </div>
        </div>
        { this.state.modal ? (
          <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null }
        { this.state.loading && this.state.hasMore && (<div><Spin /></div>)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        token: state.auth.token,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
