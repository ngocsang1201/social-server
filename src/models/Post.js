import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    author: {
      type: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        username: String,
        avatar: String,
        bio: String,
      },
      require: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      slug: 'title',
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model('Post', postSchema);
