import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
    writeType: {
        type: String,
    },
    queueType: {
        type: String,
    },
    microType: {
        type: Boolean
    },
    myPositionType: {
        type: String,
    },
    wantedPositionType: {
        type: String,
    },
    gameStyleType: {
        type: String,
    },
    title: {
        type: String,
    },
    name: {
        type: String,
    },
    contents: {
        type: String,
        maxlength: 80
    },
    tier: {
        type: Object
    }   
}, 
{
    timestamps : true
});

articleSchema.statics.create = function(payload) {
    const article = new this(payload);
    return article.save()
}

articleSchema.statics.findAll = function() {
    return this.find({});
}

const articleModel = mongoose.model('Article', articleSchema)

export default articleModel;
