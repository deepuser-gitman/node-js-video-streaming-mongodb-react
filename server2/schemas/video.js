const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const videoSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    fileId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    },
    name:{
        type:mongoose.Schema.Types.String,
        require:true,
    },
    thumbnailId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
    }
});
const Video = mongoose.model('Video',videoSchema);
module.exports = Video;
