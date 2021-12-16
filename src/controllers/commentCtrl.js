import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { io } from '../index.js';

const getByPostId = async (req, res) => {
	try {
		const { postId } = req.query;

		const commentList = await Comment.find({ postId }).sort({
			createdAt: 'desc',
		});

		res.send(commentList);
	} catch (error) {
		res.status(500).send(error);
	}
};

const create = async (req, res) => {
	try {
		if (!req.user)
			return res.status(401).send({ message: 'Invalid Authentication.' });

		const { _id, name, avatar } = req.user;

		const formData = req.body;
		const { postId } = formData;

		const post = await Post.findById(postId).lean();
		if (!post) return res.status(404).send({ message: 'Post not found' });

		const newComment = new Comment({
			...formData,
			user: {
				_id,
				name,
				avatar,
			},
		});
		await newComment.save();

		io.to(postId).emit('createComment', {
			comment: newComment._doc,
		});

		res.send(newComment._doc);
	} catch (error) {
		console.log('~ error', error);
		res.status(500).send(error);
	}
};

const remove = async (req, res) => {
	try {
		const { commentId } = req.params;

		if (!req.user)
			return res.status(401).send({ message: 'Invalid Authentication.' });

		const user = req.user;

		const comment = await Comment.findById(commentId).lean();
		if (!comment)
			return res.status(404).send({ message: 'Comment not found.' });

		if (user.role !== 'admin' && comment.userId !== user._id)
			return res
				.status(403)
				.send('You are not authorized to delete this comment');

		await Comment.deleteOne({ _id: commentId });

		io.to(comment.postId).emit('removeComment', { id: comment._id });

		res.send({ message: 'Comment deleted' });
	} catch (error) {
		res.status(500).send(error);
	}
};

const like = async (req, res) => {
	try {
		const { commentId } = req.params;

		if (!req.user)
			return res.status(401).send({ message: 'Invalid Authentication.' });

		const { _id: userId } = req.user;

		const comment = await Comment.findById(commentId).lean();
		if (!comment) return res.status(404).send({ message: 'Comment not found' });

		const isLiked = comment.likes.includes(userId);

		const update = isLiked
			? { $pull: { likes: userId } }
			: { $push: { likes: userId } };

		const updatedComment = await Comment.findByIdAndUpdate(commentId, update, {
			new: true,
		}).lean();

		res.send(updatedComment);
	} catch (error) {
		res.status(500).send(error);
	}
};

const commentCtrl = {
	getByPostId,
	create,
	remove,
	like,
};

export default commentCtrl;
