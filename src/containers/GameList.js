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

const BASE_URL = process.env.NODE_ENV === 'production' ? 'steam-sale-sniffer.herokuapp.com' : 'localhost:8000'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      modal: false,
      activeItem: { game: '', user: 1, target_price: "", purchased: false, },
      loading: false,
      hasMore: true,
      next: `http://${BASE_URL}/api/search/?q=&page=2`,
      search: "",
      prev: "",
      modalerror: false,
    }
  }
  loadedRowsMap = {}

  componentDidMount() {
    window.scrollTo(0,0)
    axios
      .get(`http://${BASE_URL}/api/search/?q=`)
      .then( res => { this.setState({ 
        games: res.data.results.filter(game => !game.users.includes(+localStorage.getItem('userId'))),
        activeItem: {
          ...this.state.activeItem,
          user: (localStorage.getItem('userId') === undefined ? 1 : +localStorage.getItem('userId')),
        },

      }) } )
      .catch( err => console.log(err) )
    this.timer = null;
    console.log(this.state.next)
  }

  handleInfiniteLoad = ({ startIndex, stopIndex }) => {
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

  toggle = (app_id) => { 
    let new_id = !this.state.modal ? app_id : ''
    this.setState({ 
      modal: !this.state.modal, 
      activeItem: { ...this.state.activeItem, game: new_id },
      modalerror: false,
    }) 
  }

  handleSubmit = (e, item) => {
    item = {
      ...item,
      target_price: parseFloat(item.target_price)
    }
    e.preventDefault()
    if (item.target_price) {
      axios
        .post(`http://${BASE_URL}/api/wishlistitems/`, item)
        .then(res => { console.log(item) })
        .catch(err => {console.log(item); console.log(err);})
      this.setState({ 
        games: this.state.games.filter(game => game.id !== item.game)
      })
      this.toggle()
    } else {
      this.setState({ modalerror: true })
      console.log( this.state.modalerror)
    }
  }

  dynamicSearch = (value, page=1) => {
    this.loadedRowsMap = {}
    axios.get(`http://${BASE_URL}/api/search/?q=${value}&page=${page}`)
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

  renderItem = ({ style, index, key }) => {

    let btn    = "col-sm-0 btn btn-success btn-pad"
    let imgSrc = (id) => `https://steamcdn-a.akamaihd.net/steam/apps/${id}/capsule_184x69.jpg`

    const { games } = this.state
    const game      = games[index]

    let gameTitle = (vw > 500 || game.title.length <= 35) ? game.title : 
      game.title.slice(0,35).split(" ").slice(0, -1).join(" ")+"..."

    let steamUrl = `https://store.steampowered.com/app/${game.steam_id}/`

    return (
      <div style={style} key={key}>
        <div className="row game" key={key}>
          <button className={btn} id={game.id} onClick={() => this.toggle(game.id) }>
            <div className='plus'>+</div>
          </button>
          <img className='game-img' alt={game.title} height={55} width={149} src={imgSrc(game.steam_id)} />
          <div className={`col-lg-5 col-md-4 col-3 game-title text`}>
            <a href={steamUrl}>{gameTitle}</a>
          </div>
          <div className={`col-sm-2 col-1 game-price text`} id='price1'>
            ${game.curr_price}
          </div>
          <div className={`col-2 game-price text`} id='price2'>
            ${game.base_price}
          </div>
        </div>
        <div className='row divider'></div>
      </div>
    )
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
    )

    return (
      <div className="App background">
        <h1>Recommended Steam Games</h1>
        <div className="container">
          <div className="row">
            <div className="offset-lg-1 col-lg-10 col-12">
              <Search 
                className="searchbar"
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
            </div>
        </div>
          <div className="row">
            <div className="offset-lg-1 col-lg-10 col-12">
              {games.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
            </div>
          </div>
        </div>
        { this.state.modal ? (
          <CustomModal 
            activeItem={this.state.activeItem} 
            toggle={this.toggle} 
            onSave={this.handleSubmit} 
            error={this.state.modalerror}
            is_unauthenticated={!this.props.token}
          />
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
