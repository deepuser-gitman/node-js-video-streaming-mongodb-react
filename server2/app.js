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
//const {db} = mongoose.connection;
const videos = [
    {
        id: 0,
        poster: '/video/0/poster',
        duration: '3 mins',
        name: 'Sample 1'
    },
    {
        id: 1,
        poster: '/video/1/poster',
        duration: '4 mins',
        name: 'Sample 2'
    },
    {
        id: 2,
        poster: '/video/2/poster',
        duration: '2 mins',
        name: 'Sample 3'
    },
];

const app = express();
/////////////////------Depricated-Used for testing-------------//////////////////
// app.get('/video', (req, res) => {
//     res.sendFile('assets/sample.mp4', { root: __dirname });
// });

app.use(cors());

// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));
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
        //console.log(docs)
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
    //const id = parseInt(req.params.id, 10);
    //res.json(videos[id]);
    Video.findById(new mongoose.mongo.ObjectId(req.params.id),callback= (err, doc) => {
        if (err) {
            console.log(err);
            res.json({});
        }
        if (!doc) {
            console.log('No doc!');
            res.json({});
        }
        //console.log(doc)
        res.json({
            id: doc._id,
            fileId: doc.fileId,
            thumbnailId: doc.thumbnailId,
            name: doc.name
        });
    })
});

// app.get('/video/:id', (req, res) => {
//     const path = `assets/${req.params.id}.mp4`;
//     const stat = fs.statSync(path);
//     const fileSize = stat.size;
//     const range = req.headers.range;
//     console.log(req.headers)
//     if (range) {

//         const parts = range.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1]
//             ? parseInt(parts[1], 10)
//             : fileSize - 1;
//         const chunksize = (end - start) + 1;
//         const file = fs.createReadStream(path, { start, end });
//         const head = {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': 'video/mp4',
//         };
//         res.writeHead(206, head);
//         console.log(head);
//         file.pipe(res);
//     } else {
//         const head = {
//             'Content-Length': fileSize,
//             'Content-Type': 'video/mp4',
//         };
//         console.log('not in range')
//         res.writeHead(200, head);
//         fs.createReadStream(path).pipe(res);
//     }
// });

// app.get('/video/:id', (req, res) => {
//     const db = mongoose.connection.db;
//     db.collection('videos.files').findOne({ filename: 'file_exam.mp4' }, (err, video) => {
//         console.log(err);
//         if (!video) {
//             console.log("No video uploaded!")
//             res.status(404).send("No video uploaded!"+err);
//             return;
//         }
//         const fileSize = video.length;
//         const range = req.headers.range;
//         let gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//             bucketName: 'videos'
//         });
//         let videoDownloadStream;
//         if (range) {
//             const parts = range.replace(/bytes=/, "").split("-");
//             const start = parseInt(parts[0], 10);
//             start = Number(range.replace(/\D/g, ""));
//             let end = parts[1]
//                 ? parseInt(parts[1], 10)
//                 : fileSize - 1;
//             console.log(req.headers)
//             console.log('start: '+start);
//             console.log('end:  '+end);
//             console.log('size: '+fileSize);
//             // if (end > fileSize-1)
//             //     end = fileSize-1
//                 //console.log('end:  '+end);
//             //end = 5248590-1
//             const chunksize = (end - start) + 1;
//             videoDownloadStream = gridFSBucket.openDownloadStreamByName('file_exam.mp4',{start,end});
//             const head = {
//                 'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//                 'Accept-Ranges': 'bytes',
//                 'Content-Length': chunksize,
//                 'Content-Type': 'video/mp4',
//                 // 'Access-Control-Allow-Origin': '*'
//             };
//             res.writeHead(206, head);
//             console.log(head)
//             videoDownloadStream.pipe(res)
//         } else {
//             const head = {
//                 'Content-Length': fileSize,
//                 'Content-Type': 'video/mp4',
//                 //'Access-Control-Allow-Origin': '*'
//             };
//             console.log('not in range')
//             res.writeHead(200, head);
//             videoDownloadStream = gridFSBucket.openDownloadStreamByName('file_exam.mp4');            
//             videoDownloadStream.pipe(res)
//         }

//     });
// });

app.get('/video/:id', (req, res) => {
    const db = mongoose.connection.db;
    const range = req.headers.range;
    //console.log(req.params.id)
    db.collection('videos.files').findOne({ _id: new mongoose.mongo.ObjectId(req.params.id) }, (err, video) => {
        //console.log(err);
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

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // Get the bucket and download stream from GridFS
        //const bucket = new mongodb.GridFSBucket(db);
        let gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'videos'
        });
        const downloadStream = gridFSBucket.openDownloadStream(new mongoose.mongo.ObjectId(req.params.id), {
            start
        });
        //console.log(req.headers)
        // Finally pipe video to response
        downloadStream.pipe(res);

    });
});

// app.get('/video/:id/caption', (req, res) => res.sendFile('assets/captions/sample.vtt', { root: __dirname }));

app.get('/video/:id/poster', (req, res) => {
    // thumbsupply.generateThumbnail(`assets/${req.params.id}.mp4`)
    //     .then(thumb => { console.log(fs.readFileSync(thumb)); res.sendFile(thumb) });
    const db = mongoose.connection.db;
    const range = req.headers.range;
    db.collection('images.files').findOne({ _id: new mongoose.mongo.ObjectId(req.params.id) }, (err, image) => {
        //console.log(err);
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

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // Get the bucket and download stream from GridFS
        //const bucket = new mongodb.GridFSBucket(db);
        let gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'images'
        });
        const downloadStream = gridFSBucket.openDownloadStream(new mongoose.mongo.ObjectId(req.params.id), {
            start
        });
        //console.log(req.headers)
        // Finally pipe video to response
        downloadStream.pipe(res);

    });
});

app.post('/upload', (req, res) => {
    //console.log('uploading');
    //console.log(req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
        //console.log(req.params)
        //console.log('No files were uploaded.');
        return res.status(400).send('No files were uploaded.');
    }
    var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'videos'
    });
    let videoUploadStream = gridFSBucket.openUploadStream(req.body.fileName);
    videoUploadStream.write(fs.readFileSync(req.files.file.tempFilePath), err => console.log(err));
    videoUploadStream.end();

    //console.log(videoUploadStream.id);
    var gridFSBucketThm = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'images'
    });
    let thumbUploadStream = gridFSBucketThm.openUploadStream(req.body.fileName);
    //let thumb;
    thumbsupply.generateThumbnail(req.files.file.tempFilePath, { mimetype: "video/mp4" }).then((thm) => { thumbUploadStream.write(fs.readFileSync(thm), err => console.log(err)); console.log(thm) }).then(() => {
        thumbUploadStream.end();
    });
    //fs.unlink(req.files.file.tempFilePath,(err)=>console.log(err));
    //console.log(thumbUploadStream.id);
    const video = new Video({
        userId: videoUploadStream.id,
        fileId: videoUploadStream.id,
        name: req.body.fileName,
        thumbnailId: thumbUploadStream.id
    });
    video.save();
    // mongodb.MongoClient.connect(url, function (error, client) {
    //     if (error) {
    //         res.json(error);
    //         return;
    //     }
    //     // connect to the videos database
    //     const db = client.db('videos');

    //     // Create GridFS bucket to upload a large file
    //     const bucket = new mongodb.GridFSBucket(db);
    //     // create upload stream using GridFS bucket
    //     //const videoUploadStream = bucket.openUploadStream('2.mp4');
    //     let sampleFile = req.files.file.data;
    //     //const bucket = new mongoose.mongo.GridFSBucket(db);
    //     let bfr = Buffer.from(sampleFile);
    //     console.log(req.body.fileName);
    //     const videoUploadStream = bucket.openUploadStream(req.body.fileName);
    //     videoUploadStream.write(bfr,(err)=>{
    //         console.log(err);
    //     })
    //     videoUploadStream.end();
    //     console.log( videoUploadStream.id);
    //     // .write(bfr, (err) => {
    //     //     console.log(err);
    //     // });
    //     // console.log(req.body);
    //     //console.log(bfr)
    //     //console.log('uploaded');
    // });
});

app.listen(4000, () => {
    console.log('Listening on port 4000!')
});

