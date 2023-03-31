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

// получаем 1 статью
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; // вытаскиваем ID статьи которую будем искать

    // нам нужно найти статью и увеличить количество просмотров на 1
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }, // передаем что будем изменять на 1
      },
      {
        returnDocument: "after", // после обновления вернем актуальный документ
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Не удалось вернуть статью" });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc);
      }
    );
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
