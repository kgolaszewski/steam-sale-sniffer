// import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import '../App.css';
import CustomModal from  '../components/Modal';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        wishlistitems: [],
        modal: false,
        activeItem: {
            game: '',
            user: localStorage.getItem('userId'),
            target_price: "",
            id: '',
        }
        }
    }

    componentDidMount() {
        
        axios
            .get(`http://localhost:8001/api/wishlists/${this.state.activeItem.user}`)
            .then( res => {
                this.setState({wishlistitems: res.data})
                })
            .catch( err => console.log(err) )
    }

    toggle = (id, game) => { 
        let active_id = !this.state.modal ? id : ''
        let active_game = !this.state.modal ? game : ''
        this.setState({ 
            modal: !this.state.modal, 
            activeItem: {
                ...this.state.activeItem, 
                id: active_id,
                game: active_game,
        }
        }) 
        console.log(this.state)
    }

    handleEdit = (item) => {
        item = {
          ...item,
        //   target_price: parseFloat(item.target_price)
        }
        axios
          .put(`http://localhost:8001/api/wishlistitems/${item.id}/`, item)
          .then(res => { console.log(item) })
          .catch(err => { console.log('State of item during error'); console.log(item); console.log(err);})
        let updated_wishlist = this.state.wishlistitems.map(e => {
            if (e.id === item.id) {
                return {
                    ...e, 
                    target_price: item.target_price
                }
            } else { 
                return e
            }
        })
        this.setState({ 
          wishlistitems: updated_wishlist
        })
        this.toggle();
    }

    render() {
        return (
        <div className="App background">
            <h1>My Wishlist</h1>
            <div className="container">
            <div className="row">
                <div className="offset-2 col-md-8">
                { this.state.wishlistitems.map(item => {
                    let { game } = item
                    return (
                    <div>
                    <div className="row game" key={game.id}>
                        <button className="btn btn-success pad-r" id={game.id} 
                            onClick={() => this.toggle(item.id, game.id)}>
                            <FontAwesomeIcon icon={faEdit} size='1x' style={{color: '#fff'}}/>
                        </button>
                        <img className="offset-0" height="55" alt=""
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/capsule_184x69.jpg`} 
                        />
                        <div className="col-md-4 game-title text">{game.title}</div>
                        <div className="col-md-2 game-price text">${item.target_price}</div>
                        <div className="col-md-2 game-price text">${game.curr_price}</div>
                        {/* <div>{item.id}</div> */}
                    </div>
                    </div>
                    )
                })}
                </div>
            </div>
            </div>
            { this.state.modal ? (
            <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleEdit} />
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
