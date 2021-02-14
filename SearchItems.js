import React from 'react';
import axios from 'axios';

export default class SearchItems extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            search: '',
            searchInfo: ''
        }
        this.searchHandler = this.searchHandler.bind(this);
        this.searchItem = this.searchItem.bind(this);
    }

    searchHandler(event){
        this.setState({search: event.target.value})
    }

    async searchItem(){
        try {
            const headers = {
                'Authorization': `Bearer: ${this.props.jwt}`
            }
            const response = await axios.get(`http://localhost:8080/StoreItem?query=${this.state.search}`,{headers});
            const item = response.data[0];
            this.setState({
                searchInfo: <div><b>Name:</b> {item.name} <b>Description:</b>
                    {item.description} <b>${item.price}</b></div>
            })
        }
        catch(e){
            console.log(e);
        }
    }

    render(){
        return(
            <div>
                <input placeholder="Search the Store" onBlur={this.searchHandler}></input>
                <button onClick={this.searchItem}>Search</button>
                {this.state.searchInfo}
            </div>
        )
    }
}