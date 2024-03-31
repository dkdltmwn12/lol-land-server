import mongoose from 'mongoose';

const patchNoteSchema = new mongoose.Schema({
    championName: {
        type : String,
    },
    itemName : {
        type : String,
    },
    championChangeSummary : {
        type : String,
    },
    championChangePurpose : {
        type : String,
    },
    itemChangePurpose : {
        type : String,
    },
    championImg: {
        type : String,
    },
    itemImg: {
        type : String,
    },
    abilityImg: {
        type : Object,
    },
    statTitle: {
        type : Object,
    },
    statValue : {
        type: Object,
    },
    itemValueChange : {
        type: Object
    },
    patchVersion : {
        type : String,
    }
})

const pacthNoteModel = mongoose.model('PatchNote', patchNoteSchema);

export default pacthNoteModel;