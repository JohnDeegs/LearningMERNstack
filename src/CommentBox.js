//CommentBox.js
import React, { Component } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import axios from 'axios';
import style from './style';

class CommentBox extends Component {
    constructor(props){
        super (props);
        this.state = {data: []};
        this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.handleCommentUpdate = this.handleCommentUpdate.bind(this);
        this.handleCommentDelete = this.handleCommentDelete.bind(this);
    }

    //get comments from server
    //it get the url passed in as a prop from index.js
    loadCommentsFromServer(){
        axios.get(this.props.url)
        .then(res => {
            this.setState({data: res.data});
        })
    }

    handleCommentSubmit(comment){
        //POST request
        let comments = this.state.data;
        comment.id = Date.now();
        let newComments = comments.concat([comment]);
        this.setState({data: newComments});
        axios.post(this.props.url, comment)
        .catch(err => {
            console.log(err);
            this.setState({data:comments});
        });
    }

    handleCommentDelete(id){
        axios.delete(`${this.props.url}/${id}`)
        .then(res => {
            console.log("Comment Delete");
        })
        .catch(err => {
            console.error(err);
        });        
    }

    handleCommentUpdate(id, comment){
        //sends comment id and new author || text to our api
        axios.put(`${this.props.url}/${id}`, comment)
        .catch(err => {
            console.log(err);
        })
    }

    componentDidMount() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }

    render(){
        return (
            <div style={style.commentBox}>
                <h2 style={style.title}>Comments</h2>
                <CommentList 
                onCommentDelete={this.handleCommentDelete}
                onCommentUpdate={this.handleCommentUpdate}
                data = {this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
}

export default CommentBox;