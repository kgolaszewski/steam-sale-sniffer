import React, { Component } from 'react';
import '../App.css';
import CustomModal from  '../components/Modal';
import axios from 'axios';

import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      modal: false,
      activeItem: {
        game: '',
        user: 2,
        target_price: "",
      }
    }
  }

  componentDidMount() {
    console.log('Component mounted')
    console.log(localStorage.getItem('userId'))
    axios
      .get('http://localhost:8001/api/games')
      .then( res => {this.setState({ 
        games: res.data.filter(game => !game.users.includes(+localStorage.getItem('userId'))),
        activeItem: {
          ...this.state.activeItem,
          user: (localStorage.getItem('userId') === undefined ? 2 : localStorage.getItem('userId'))
        }
      }) } )
      .catch( err => console.log(err) )
  }

  componentWillReceiveProps() {
    let userId = localStorage.getItem('userId')
    console.log('Received props')
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

  render() {
    return (
      <div className="App background">
        <h1>Recommended Steam Games</h1>
        <div className="container">
          <div className="row">
            <div className="offset-2 col-md-8">
              { this.state.games.map(game => (
              <div className="row game" key={game.id}>
                <button className="btn btn-success pad-r" id={game.id} 
                  onClick={() => this.toggle(game.id) }
                >
                  <div className='plus'>+</div>
                </button>
                <img className="offset-0" height="55" alt=""
                  src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/capsule_184x69.jpg`} 
                />
                <div className="col-md-5 game-title text">{game.title}</div>
                <div className="offset-1 col-md-3 game-price text">${game.base_price}</div>
              </div>
              ))}
            </div>
          </div>
        </div>
        { this.state.modal ? (
          <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null }
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
