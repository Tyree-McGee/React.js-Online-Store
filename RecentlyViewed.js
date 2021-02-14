import React from 'react';
import axios from 'axios';
const ReactDOM = require('react-dom');
const ScrollArea = require('react-scrollbar');

export default class RecentlyViewed extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            viewedItems: '',
            buttonClicked: false
        }
        this.buttonHandler = this.buttonHandler.bind(this);
    }

    async loadItems(){
        const headers ={
            'Authorization': `Bearer: ${this.props.jwt}`,
            withCredentials: true,
            crossOrigin: true,
        }
        const response = await axios.get(`http://localhost:8080/StoreItem/Recent?num=10`,{headers
        });
        const itemList = response.data;
        const cartResItems = [];
        itemList.forEach(item => {
            cartResItems.push(<li>Name:{item.name}</li>)
        })
        await this.setState({viewedItems: cartResItems})
    }

    async buttonHandler(){
        await this.setState({buttonClicked: !this.state.buttonClicked})
        if(this.state.buttonClicked){
            await this.loadItems();
        }

    }

    showItems(){
        if(this.state.buttonClicked){
            return(
                <div>
                    {this.state.viewedItems}
                </div>
            )
        }
    }


    render(){
        return(
            <div>
                <button onClick={this.buttonHandler}>Recently Viewed Items</button>
                {this.showItems()}
            </div>

        )
    }
}