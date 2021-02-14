import React from 'react';
import axios from 'axios'
import UserCart from './UserCart'
import Store from "./Store";
import SearchItems from "./SearchItems";
import RecentlyViewed from "./RecentlyViewed";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            jwt: '',
            user: '',
            attemptedLogin: false,
            loginFail: false,
        }
        this.loginEventHandler = this.loginEventHandler.bind(this);
        this.emailInputHandler = this.emailInputHandler.bind(this);
        this.passwordInputHandler = this.passwordInputHandler.bind(this);
    }

    async loginEventHandler() {
        try {
            const loginBody = {
                email: this.state.email,
                password: this.state.password
            }
            this.setState({attemptedLogin: true});

            if (this.state.email === '' || this.state.email == null || this.state.password === '' || this.state.password == null) {
                return;
            }
            const response = await axios.post('http://localhost:8080/user/login', loginBody);
            this.setState({jwt: response.data.jwt, user: response.data.user});
        }
        catch(e){
            this.setState({loginFail: true})
            console.log(e);
        }

    }

    emailInputHandler(event){
        this.setState({email: event.target.value})
    }

    passwordInputHandler(event){
        this.setState({password: event.target.value})
    }

    welcomeUser(){
        if(this.state.user){
            return(
                <div>
                    <UserCart user={this.state.user} jwt={this.state.jwt}/>
                    <Store user={this.state.user} jwt={this.state.jwt}/>
                    <RecentlyViewed user={this.state.user} jwt={this.state.jwt}/>
                    <SearchItems jwt={this.state.jwt}/>
                </div>

            )
        }
    }

    getLoginForm(){
        if(!this.state.user){
            return(
                <div>
                    <input placeholder="Email Address" onBlur={this.emailInputHandler}></input>
                    <input type="password" placeholder="Password" onBlur={this.passwordInputHandler}></input>
                    <button onClick={this.loginEventHandler} id="Log">Log in </button>
                </div>
            )
        }
    }

    checkEmailLogin() {
        if ((this.state.email === '' || this.state.email === null) && this.state.attemptedLogin === true) {
            return (
                <div>Enter an Email!!</div>
            )
        }
    }
    checkPasswordLogin(){
        if((this.state.password === '' ||this.state.password === null) && this.state.attemptedLogin === true){
            return (
                <div>Enter a Password!!</div>
            )
        }
    }
    loginFail(){
        if(this.state.loginFail && !this.state.user){
            return(
                <div>Invalid Username or Password</div>
            )
        }
    }



    render(){
        return(
        <div className="Login">
            {this.getLoginForm()}
            {this.checkEmailLogin()}
            {this.checkPasswordLogin()}
            {this.loginFail()}
            {this.welcomeUser()}
        </div>
        )
    }

}
