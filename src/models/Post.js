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
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    author: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      username: String,
      avatar: String,
      bio: String,
    },
    hashtags: {
      type: [String],
      default: [],
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

export default mongoose.model('Post', postSchema);
