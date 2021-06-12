import React from 'react';
import Navbar from './Navbar';
//import $ from 'jquery';
import axios from 'axios'
// const ImageThumb = ({ image }) => {
//     return <img src={URL.createObjectURL(image)} alt={image.name} />;
//   };
const Upload = (props) => {
    const [file, setFile] = React.useState("");
    var [fileName, setFileName] = React.useState("");
    const handleUpload = (e) => {
        e.preventDefault();
        const serverAddr = "http://localhost:4000/upload";
        const data = new FormData();
        data.append('file', file);
        data.append('fileName', fileName);
        axios.post(serverAddr, data)
            .then(function (response) {
                console.log('file uploaded')
            })
            .catch(function (error) {
                console.log(error);
            });
        // $.ajax({
        //     type:'post',
        //     url:serverAddr,
        //     data:{
        //         file:file,
        //         fileName:fileName
        //     },
        //     processData: false, contentType: false,
        //     enctype:"multipart/form-data"
        // }).fail(( jqXHR, textStatus )=> {
        //     console.log( "Request failed: " + textStatus );
        //     });
        // console.log({
        //     file:file,
        //     fileName:fileName
        // });
        //console.log(file);
    }
    const handleChange = (e) => {
        setFile(e.target.files[0]);
        // console.log(file.name);
        // if (fileName === '')
        //     fileName = file.name
        //fileName = file.name
        // document.getElementById('fileName').value = file.name;
    }
    const handleName = (e) => {
        //fileName = e.target.value
        setFileName(e.target.value);
        //console.log(fileName);
    }
    return (
        <div className="App App-header">
            <Navbar home />
            <div className="container">
                <form onSubmit={handleUpload}>
                    <label htmlFor="name">File name: </label>
                    <div className="form-group">
                        <input type="text" id="fileName" className="form-control" onChange={handleName} required={true} />
                    </div>
                    <div className="form-group">
                        <input type="file" accept="video/mp4" onChange={handleChange} className="form-control btn-lg" name="Upload" required={true} /><br />
                    </div>
                    <input type="submit" className="btn btn-info" value="Submit" /><br />
                    {/* {file && <ImageThumb image={file} />} */}
                </form>
            </div>
        </div>
    )
}
export default Upload;