import React, { Component } from 'react';
import '../App.css';
import CustomModal from  '../components/Modal';
import axios from 'axios';

import { withRouter } from 'react-router-dom'
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
    axios
      .get('http://localhost:8001/api/games')
      .then( res => {this.setState({games: res.data}); console.log(res.data)} )
      .catch( err => console.log(err) )
  }

  handleSubmit = (item) => {
    this.toggle();
    item = {
      ...item,
      target_price: parseFloat(item.target_price)
    }
      axios
        .post(`http://localhost:8001/api/wishlistitems/`, item)
        .then(res => console.log(item))
        .catch(err => {console.log(item); console.log(err);})
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
              <div className="row game">
                <button className="btn btn-success pad-r" id={"hello"+game.id} 
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
