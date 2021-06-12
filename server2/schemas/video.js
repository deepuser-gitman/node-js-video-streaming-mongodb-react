const mongoose = require('mongoose');
//mongoose.connect("mongodb://root:root@localhost:27017/?authSource=nodedb&readPreference=primary&ssl=false", { useUnifiedTopology: true, useNewUrlParser: true })
    //.catch(e => console.log(e));
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