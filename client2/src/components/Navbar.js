import React from 'react';
import {Link,withRouter} from 'react-router-dom';
const Navbar = (props) => {
    // setTimeout(()=>{
    //     props.history.push('/about');
    // },2000);
    const {home,upload} = props;
    let homeLink;
    if(home) {
        homeLink = (
            <li className="Li"><Link to="/">Home</Link></li>
        );
    }
    let uploadLink;
    if(upload) {
        uploadLink = (
            <li className="Li"><Link to="/upload">Upload</Link></li>
        )
    }
    return (
        <nav className="nav-wrapper red darken-3">
            <div className="container">
                
                <Link to="/" className="brand-logo text-capitalize">U-Tonnel</Link>
                
                <ul className="right hide-on-med-and-down Main-header">
                    {homeLink}
                    {uploadLink}
                    {/* <li><Link to="/">Home</Link></li> */}
                    {/* <li><Link to="/about">About</Link></li> */}
                    {/* <li><NavLink to="/player/:id">Contact</NavLink></li> */}
                    {/* <li><Link to="/upload">Upload</Link></li> */}
                </ul>
            </div>
        </nav>
    )
}

export default withRouter(Navbar);