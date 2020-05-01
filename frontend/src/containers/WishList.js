import React, { Component } from 'react';
import '../App.css';
import CustomModal from  '../components/Modal';
import axios from 'axios';

// import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'

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
            <h1>My Wishlist</h1>
            <div className="container">
            <div className="row">
                <div className="offset-2 col-md-8">
                { this.state.wishlistitems.map(item => {
                    let { game } = item
                    return (
                    <div className="row game" key={game.id}>
                        <img className="offset-0" height="55" alt=""
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/capsule_184x69.jpg`} 
                        />
                        <div className="col-md-5 game-title text">{game.title}</div>
                        <div className="col-md-2 game-price text">${item.target_price}</div>
                        <div className="col-md-2 game-price text">${game.curr_price}</div>
                    </div>
                    )
                })}
                </div>
            </div>
            </div>
            {/* { this.state.modal ? (
            <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
            ) : null } */}
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
