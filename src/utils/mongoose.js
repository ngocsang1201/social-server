import Post from '../models/Post.js';
import User from '../models/User.js';

export async function getPostResponse(filter, params, user) {
  try {
    const { limit, page, sort, order, by } = params || {};

    const _limit = parseInt(limit) || 10;
    const _page = parseInt(page) || 1;
    const _sort = sort || 'createdAt';
    const _order = order || 'desc';

    const followingFilter = user && by === 'following' ? { authorId: { $in: user.following } } : {};

    const query = { ...filter, ...followingFilter };

    const data = await Post.find(query)
      .limit(_limit)
      .skip(_limit * (_page - 1))
      .sort({ [_sort]: _order })
      .lean();

    const count = await Post.countDocuments(query);

    const pagination = {
      limit: _limit,
      page: _page,
      totalRows: count,
    };

    return { data, pagination };
  } catch (error) {
    throw error;
  }
}

export async function mapFollowUserId(user) {
  try {
    for await (const key of ['following', 'followers']) {
      user[key] = (
        await Promise.all(
          user[key].map(async (id) => {
            return await User.findById(id).select('name').lean();
          })
        )
      ).reverse();
    }
  } catch (error) {
    throw error;
  }
}
