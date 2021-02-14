import React from 'react';
import axios from 'axios';
const ReactDOM = require('react-dom');
const ScrollArea = require('react-scrollbar');

export default class Store extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            shopItems: '',
            itemAddedMessage: false,
            shopButtonClicked: false,
            itemInfo:''

        }
        this.loadShop = this.loadShop.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.shopClickHandler = this.shopClickHandler.bind(this);
        this.itemViewedHandler = this.itemViewedHandler.bind(this);
        this.hideDescription = this.hideDescription.bind(this);
    }

    async loadShop(){
        try{
            const headers ={
                'Authorization': `Bearer: ${this.props.jwt}`
            }
            const response = await axios.get(`http://localhost:8080/StoreItem/allInventory`,{headers});
            const itemList = response.data;
            const cartResItems = [];
            itemList.forEach(item => {
                cartResItems.push(<li><b>Name:</b> {item.name} <b>${item.price}</b>
                    <button value={item._id} onClick={this.addToCart}>Add to Cart</button>
                    <button value={item._id} onClick={this.itemViewedHandler}>View Item Info</button>
                </li>)
            })
            this.setState({shopItems: cartResItems})

        }
        catch(e){
            console.log(e);
        }

    }
    async itemViewedHandler(event){
        const headers ={
            'Authorization': `Bearer: ${this.props.jwt}`,
            'Access-Control-Allow-Origin' : true,
            withCredentials: true,
        }
        const response = await axios.get(`http://localhost:8080/StoreItem/${event.target.value}`,{headers});
        const item = response.data;
        const string = <div><b>Name:</b> {item.name} <b>Description:</b> {item.description} <b>${item.price}</b></div>;
        this.setState({itemInfo: string});
    }

    async addToCart(event){
        try{
            const itemIDEvent = event.target.value;
            const headers ={
                'Authorization': `Bearer: ${this.props.jwt}`
            }
            const userCart = await axios.get(`http://localhost:8080/user/${this.props.user._id}/cart`,{headers});
            const userCartId = userCart.data._id;
            await axios.post(`http://localhost:8080/cart/${userCartId}/cartItem`, {
                quantity: 1,
                itemId: itemIDEvent},{headers}
                );
            this.setState({itemAddedMessage: true})

        }
        catch(e){
            console.log(e)
        }
    }

    itemAddedMessage(){
        if(this.state.itemAddedMessage){
            setTimeout(this.turnOffMessage, 3000)
            return(
                <div>Item Added!</div>
            )
        }
    }
    turnOffMessage = () => {
        this.setState({itemAddedMessage: false});
    }

    initStore(){
        if(this.state.shopButtonClicked) {
            return (
                <div>
                    {this.state.shopItems}
                </div>

            )
        }
    }
    async shopClickHandler(event){
        this.setState({shopButtonClicked: !this.state.shopButtonClicked}) // Hide Store
        await this.loadShop();

    }

    description(){
        if(this.state.itemInfo !=='')
        return(
            <div>
                {this.state.itemInfo}
                <button onClick={this.hideDescription}>Hide Description</button>
            </div>
        )
    }

    async hideDescription(){
        await this.setState({itemInfo:''});
    }

    render(){
        return(
            <div>
            <button onClick={this.shopClickHandler}>Shop</button>
            {this.initStore()}
            {this.itemAddedMessage()}
            {this.description()}
            </div>
        )
    }
}