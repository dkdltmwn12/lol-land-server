import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    writer: {
        type : Object,  
    },
    content: {
        type : String,
    },
    postId : {
        type : String,
    },
    rootCommentId: {
        type : String,
    },
    replyTo : {
        type : String,
    },

}, 
{
    timestamps : true
});

const commentModel = mongoose.model('Comment', commentSchema);

export default commentModel;