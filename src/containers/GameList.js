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

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
// const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

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
      next: "http://localhost:8000/api/search/?q=&page=2",
      search: "",
      prev: "",
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
        this.setState({ games: updated_games, next: res.data.next })
      })
      .then(res => {
        this.setState({ loading: false})
      })
  }

  isRowLoaded = ({ index }) => !!this.loadedRowsMap[index]

  renderItem = ({ style, index, key }) => {
    let btnStyle = "btn btn-success pad-r"

    let btn         = vw > 500 ? btnStyle   : 'col-1 btn btn-success pad-mobile'
    let text        = vw > 500 ? 'text'     : 'xs-text'
    let gameImg     = vw > 500 ? ''         : 'col-4'
    let priceOffset = vw > 500 ? 'offset-1' : 'offset-0' 

    const { games } = this.state
    const game = games[index]

    let gameTitle = (vw > 500 || game.title.length <= 28) ? game.title : 
      game.title.slice(0,28).split(" ").slice(0, -1).join(" ")+"..."

    return (
      <div style={style} key={key}>
      <div className="row game" key={key}
        
      >
        <button className={`${btn}`} id={game.id} onClick={() => this.toggle(game.id) }>
          <div className='plus'>+</div>
        </button>
        { console.log(vw) }
        <img className={`offset-0 ${gameImg}`} alt=""
            height= {vw > 500 ? "55" : '45' }
            src={ vw > 500 ? 
              `https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/capsule_184x69.jpg` :
              `https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/capsule_sm_120.jpg`
            } 
        />
        <div className={`offset-0 col-md-5 col-sm-4 col-4 game-title ${text}`}>
          {/* {game.title} */}
          {gameTitle}
        </div>
        <div className={`${priceOffset} col-md-3 col-sm-3 col-2 game-price ${text}`}>
          ${game.base_price}</div>
      </div>
      <div className='row divider'></div>
      </div>
    )
  }



  componentDidMount() {
    // console.log('Component mounted\n', localStorage.getItem('userId'))
    window.scrollTo(0,0)
    axios
      .get('http://localhost:8000/api/search/?q=')
      .then( res => {this.setState({ 
        games: res.data.results.filter(game => !game.users.includes(+localStorage.getItem('userId'))),
        activeItem: {
          ...this.state.activeItem,
          user: (localStorage.getItem('userId') === undefined ? 1 : +localStorage.getItem('userId'))
        },

      }) } )
      .catch( err => console.log(err) )
    this.timer = null;
  }

  UNSAFE_componentWillReceiveProps() {
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
      .post(`http://localhost:8000/api/wishlistitems/`, item)
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
      activeItem: { ...this.state.activeItem, game: new_id }
    }) 
    console.log(this.state)
  }

  dynamicSearch = (value, page=1) => {
    this.loadedRowsMap = {}
    axios.get(`http://localhost:8000/api/search/?q=${value}&page=${page}`)
      .then(res => {
        let { results, next } = res.data
        let updated_games = results.filter(
          game => !game.users.includes(+localStorage.getItem('userId'))
        )
        updated_games = +page > 1 ? this.state.games.concat(updated_games) : updated_games
        this.setState({
          games: updated_games,
          next: next,
          search: value,
          prev: this.state.search,
        })
        if (updated_games.length < 30 && next) { 
          page = next.split("?")[1].split("&")[0].split("=")[1]
          this.dynamicSearch(value, page)
        }
      })
  }

  render() {
    const { games } = this.state;
    const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
      <VList
        height={height} 
        isScrolling={isScrolling} 
        onScroll={onChildScroll}
        scrollTop={scrollTop} 
        onRowsRendered={onRowsRendered} 
        width={width}

        searchTerm={this.state.search}
        searchCleared={!this.state.search && !!this.state.prev}

        autoHeight
        rowHeight={77}
        overscanRowCount={5}
        rowCount={games.length}
        rowRenderer={this.renderItem}
      />
    );


    const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
      <AutoSizer disableHeight >
        {({ width }) => vlist({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) }
      </AutoSizer>
    );
    const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
      <InfiniteLoader isRowLoaded={this.isRowLoaded} loadMoreRows={this.handleInfiniteLoad} rowCount={games.length}>
        { ({ onRowsRendered }) => autoSize({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) }
      </InfiniteLoader>
    )

    return (
      <div className="App background">
        <h1>Recommended Steam Games</h1>
        <div className="container">
          <button onClick={() => {console.log(this.state.games)}}>Test</button>
          <Search 
            list="games" 
            placeholder="Type to filter..." 
            onChange = { e => {
                let { value } = e.target
                clearTimeout(this.timer)
                this.timer = setTimeout(() => this.dynamicSearch(value), 400)
              }
            }
            enterButton 
          />
          <div className="row">
            <div className="offset-md-1 col-md-10 col-sm-12 col-xs-12">
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