import React, { Component } from 'react';
//import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: this.props.match.params.id,
            fileId: this.props.match.params.fileId,
            videoData: {}
        };
    }
    async componentDidMount() {
        try {
            const res = await fetch(`http://localhost:4000/video/${this.state.videoId}/data`);
            const data = await res.json();
            this.setState({ videoData: data });
            //console.log(this.state.videoData)
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div className="App">
                {/* <Header/> */}
                
                <header className="App-header">
                <Navbar home/>
                    <video controls muted autoPlay crossOrigin="anonymous">
                        <source src={`http://localhost:4000/video/${this.state.fileId}`} type="video/mp4"></source>
                        {/* <track label="English" kind="captions" srcLang="en" src={`http://localhost:4000/video/${this.state.videoId}/caption`} default></track> */}
                    </video>
                    <h1>{this.state.videoData.name}</h1>
                </header>
                <Footer/>
            </div>
        )
    }
}
