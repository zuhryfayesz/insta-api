const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    post_user          : { type: String },
    post_user_pic      : { type: String },
    post_image         : { type: String },
    post_title         : { type: String },
    post_description   : { type: String },
    is_liked           : { type: Number  },
    post_like_count    : { type: Number  },
    post_comment_count : { type: Number  },
})


const Post = mongoose.model("Post", PostSchema);

module.exports = Post;