const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const post = await Post.create({
      title,
      content,
      category,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      author: req.user.id
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filter = category ? { category } : {};

  const posts = await Post.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(posts);
};

exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send();
  res.json(post);
};

exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send();

  if (post.author.toString() !== req.user.id) return res.sendStatus(403);

  Object.assign(post, req.body);
  await post.save();
  res.json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send();

  if (post.author.toString() !== req.user.id) return res.sendStatus(403);

  await post.remove();
  res.sendStatus(200);
};
