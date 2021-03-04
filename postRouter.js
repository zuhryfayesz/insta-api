const express = require("express");
const Post = require('./post')

const postRouter = express.Router();

postRouter.get('/', async (_, res) => {
    res.json(await Post.find({}));
})

module.exports = postRouter;