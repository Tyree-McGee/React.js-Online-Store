import React from 'react';
import axios from 'axios';

export default class UserCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: '',
            visibleCart: '',
            shopButtonClicked: false
        }
        this.populateCart = this.populateCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
        this.shopClickHandler = this.shopClickHandler.bind(this);
        this.sortCart = this.sortCart.bind(this);
    }
    async populateCart(){
        try{
            const headers ={
                'Authorization': `Bearer: ${this.props.jwt}`
            }
            const response = await axios.get(`http://localhost:8080/user/${this.props.user._id}/cart`,{headers})
            const cartItems = response.data.items;
            if(cartItems.length == 0){
                this.setState({cart: <div>Empty Cart!</div>});
                return;
            }
            const cartResItems = [];
            cartItems.forEach(item => {
                cartResItems.push(<li>{item.name} ${item.price} <button onClick={this.removeFromCart} value={item._id}>Remove from Cart</button></li>)
            })
            await this.setState({cart: ''});
            await this.setState({cart: cartResItems});
        }
        catch(e){
            console.log(e); //
        }
    }
    async removeFromCart(event){
        // Find User's Cart first
        const headers ={
            'Authorization': `Bearer: ${this.props.jwt}`
        }
        const response = await axios.get(`http://localhost:8080/user/${this.props.user._id}/cart`,{headers});
        const userCartId = response.data._id;
        await axios.delete(`http://localhost:8080/cart/${userCartId}/cartItem/${event.target.value}`,{headers});
        await this.populateCart();
    }
    showCart(){
        if(this.state.shopButtonClicked) {
            return (
                <div>
                    <button onClick={this.sortCart}>Sort by alphabetical order</button>
                    {this.state.cart}
                </div>
            )
        }
    }
    async sortCart(){
        const items = this.state.cart;

        const compare = (a,b) => {
            if(a.props.children[0] < b.props.children[0]){
                return -1
            }
            if(a.props.children[0] > b.props.children[0]){
                return 1;
            }
            return 0;
        }
        items.sort(compare);
        await this.setState({cart: ''});
        await this.setState({cart: items});

    }

    async shopClickHandler(){
        this.setState({shopButtonClicked: !this.state.shopButtonClicked});
        await this.populateCart()
    }

    render(){
        return(
            <div>
                Hello {this.props.user.firstName} {this.props.user.lastName}
                <button onClick={this.shopClickHandler} id=" cart">Show Cart</button>
                {this.showCart()}
            </div>
        )
    }
}
