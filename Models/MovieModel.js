const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const MovieSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    movieTitle:{
        type:String,
        required:true
    },
    movieCategory:{
        type:Array,
        required:true
    },
    movieDescription:{
        type:String,
        required:true
    },
    thumbnailLink:{
        type:String,
        required:true 
    },
    movieLink:{
        type:String,
        required:true
    },
    movieTrending: {
        type: Boolean,
        default: false
    }

})

MovieSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Movie',MovieSchema)