import PostModel from "../models/Post.js";

// получаем все статьи
export const getAll = async (req, res) => {
  try {
    // populate("user").exec() чтобы получить данные о привязанном пользователе статьи
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

// получаем статью по ID
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId).populate("user").exec();
    if (!post) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    // обновление количества просмотров
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить статью" });
  }
};

// создаем статью
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};
