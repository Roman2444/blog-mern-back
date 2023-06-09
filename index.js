import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://user:wwwwww@admin.dewegae.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERROR", err));

const app = express();
app.use(express.json());
app.use(cors());
// чтобы проверялись и отрабатывались гет-запросы в папке uploads
app.use("/uploads", express.static("uploads"));

// создаем хранилище, загружаемые файлы сохраняются в папку "upload",
// destrination возвращает путь данного файла
// filename перед сохранением объясняет как называть  загруженный файл
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// роут для загрузки файла
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//авторизация
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
// страница регистрации
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
// страници обо мне
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/tags", PostController.getLastTags);

// работа с постами
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
