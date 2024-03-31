import commentModel from "../models/comment.js"

const getComment = async(req, res) => {
    try {
        const comments = await commentModel.find({});
        return res.status(200).json(comments)
    } catch (error) {
        return res.status(500).json({message : '댓글 조회 실패'})
    }
}

const createComment = async(req, res) => {
    const {info} = req.body;
    try {
        await commentModel.create(info);
        return res.status(200).json({message : '댓글 작성 완료'})
    } catch (error) {
        return res.status(500).json({message : '댓글 작성 실패'})
    }
}

const createReplyComment = async(req, res) => {
    const {info} = req.body;
    try {
        await commentModel.create(info);
        return res.status(200).json({message : '댓글 작성 완료'})
    } catch (error) {
        return res.status(500).json({message : '답글 작성 실패'})
    }
}

const modifyComment = async(req, res) => {
    const {info} = req.body;
    try {
        const findComment = await commentModel.findOne({'writer._id' : info.writer._id}, {_id: info.selectedCommentId});
        console.log(findComment);
        if(!findComment) return res.status(404).json({message : '댓글 찾기 실패'})
        findComment.content = info.content;
        findComment.save();
        return res.status(200).json({message : '댓글 작성 완료'})
    } catch (error) {
        return res.status(500).json({message : '댓글 수정 실패'})
    }
}

const deleteComment = async(req, res) => {
    const {info} = req.body;
    try {
        const findComment = await commentModel.findOne({'writer._id' : info.writer._id}, {_id: info.selectedCommentId})
        const findChildReplyCommentList = await commentModel.find({rootCommentId : info.selectedCommentId})
        if(!findComment) {
           return res.status(404).json({message : '해당 댓글 찾기 실패'}) 
        }
        if (findChildReplyCommentList.length > 0) {
            await commentModel.deleteMany({ rootCommentId: info.selectedCommentId });
            findComment.deleteOne();
            return res.status(200).json({ message: '부모 댓글과 자식 댓글 모두 삭제 완료' });
        } 
        else {
            findComment.deleteOne();
            return res.status(200).json({ message: '부모 댓글 삭제 완료' });
        }
    } catch (error) {
        return res.status(500).json({message : '해당 댓글 삭제 실패'})
    }
}

const deleteReplyComment = async(req, res) => {
    const {info} = req.body;
    try {
        const findComment = await commentModel.findOne({'writer._id' : info.writer._id}, {_id: info.selectedCommentId})
        if(!findComment) return res.status(404).json({message : '댓글 찾기 실패'})
        findComment.deleteOne();
        return res.status(200).json({message : '해당 답글 삭제 완료'})
    } catch (error) {
        return res.status(500).json({message : '해당 답글 삭제 실패'})
    }
}

export {getComment, createComment, createReplyComment, modifyComment, deleteComment, deleteReplyComment}