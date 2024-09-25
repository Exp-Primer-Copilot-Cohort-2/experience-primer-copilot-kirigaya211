// Create web server
// Create a new comment
// Get all comments
// Get a comment by ID
// Update a comment by ID
// Delete a comment by ID

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const mongoose = require('mongoose');

router.get('/comments', (req, res) => {
    Comment.find().select('content').exec().then(comments => {
        res.status(200).json(comments);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/comments', (req, res) => {
    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        content: req.body.content
    });

    comment.save().then(result => {
        res.status(201).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.get('/comments/:commentId', (req, res) => {
    const id = req.params.commentId;
    Comment.findById(id).select('content').exec().then(comment => {
        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }
        res.status(200).json(comment);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/comments/:commentId', (req, res) => {
    const id = req.params.commentId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Comment.update({ _id: id }, { $set: updateOps }).exec().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/comments/:commentId', (req, res) => {
    const id = req.params.commentId;
    Comment.remove({ _id: id }).exec().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;