const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const thumbsupply = require('thumbsupply');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const Video = require('./schemas/video');

const url = 'mongodb://localhost:27017/videos?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }).catch(e => console.log(e));

const app = express();

app.use(cors());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/videos', (req, res) => {
    // res.json(videos)
    const videos = Video.find((err, docs) => {
        if (err) {
            console.log(err);
            res.json({});
        }
        if (!docs) {
            console.log('No docs!');
            res.json({});
        }        
        res.json(docs.map(video => {
            return ({
                id: video._id,
                fileId: video.fileId,
                thumbnailId: video.thumbnailId,
                name: video.name
            });
        }))
    })
});

app.get('/video/:id/data', (req, res) => {    
    Video.findById(new mongoose.mongo.ObjectId(req.params.id),callback= (err, doc) => {
        if (err) {
            console.log(err);
            res.json({});
        }
        if (!doc) {
            console.log('No doc!');
            res.json({});
        }        
        res.json({
            id: doc._id,
            fileId: doc.fileId,
            thumbnailId: doc.thumbnailId,
            name: doc.name
        });
    })
});

app.get('/video/:id', (req, res) => {
    const db = mongoose.connection.db;
    const range = req.headers.range;    
    db.collection('videos.files').findOne({ _id: new mongoose.mongo.ObjectId(req.params.id) }, (err, video) => {        
        if (!video) {
            console.log(req.params.id);
            console.log("No video uploaded!")
            res.status(404).send("No video uploaded!" + err);
            return;
        }
        const videoSize = video.length;
        let start = 0;
        if (range)
            start = Number(range.replace(/\D/g, ""));
        const end = videoSize - 1;

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        
        res.writeHead(206, headers);
        
        let gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'videos'
        });
        const downloadStream = gridFSBucket.openDownloadStream(new mongoose.mongo.ObjectId(req.params.id), {
            start
        });
        downloadStream.pipe(res);

    });
});

app.get('/video/:id/poster', (req, res) => {
    const db = mongoose.connection.db;
    const range = req.headers.range;
    db.collection('images.files').findOne({ _id: new mongoose.mongo.ObjectId(req.params.id) }, (err, image) => {        
        if (!image) {
            console.log("No image uploaded!")
            res.status(404).send("No image uploaded!" + err);
            return;
        }
        const imageSize = image.length;
        let start = 0;
        if (range)
            start = Number(range.replace(/\D/g, ""));
        const end = imageSize - 1;

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${imageSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "image/png",
        };
        
        res.writeHead(206, headers);      
        let gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'images'
        });
        const downloadStream = gridFSBucket.openDownloadStream(new mongoose.mongo.ObjectId(req.params.id), {
            start
        });
        downloadStream.pipe(res);

    });
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'videos'
    });
    let videoUploadStream = gridFSBucket.openUploadStream(req.body.fileName);
    videoUploadStream.write(fs.readFileSync(req.files.file.tempFilePath), err => console.log(err));
    videoUploadStream.end();

    var gridFSBucketThm = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images'
    });
    let thumbUploadStream = gridFSBucketThm.openUploadStream(req.body.fileName);
    thumbsupply.generateThumbnail(req.files.file.tempFilePath, { mimetype: "video/mp4" }).then((thm) => { thumbUploadStream.write(fs.readFileSync(thm), err => console.log(err)); console.log(thm) }).then(() => {
        thumbUploadStream.end();
    });
    const video = new Video({
        userId: videoUploadStream.id,
        fileId: videoUploadStream.id,
        name: req.body.fileName,
        thumbnailId: thumbUploadStream.id
    });
    video.save();

});

app.listen(4000, () => {
    console.log('Listening on port 4000!')
});

