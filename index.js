import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";

mongoose
  .connect(
    "mongodb+srv://user:wwwwww@admin.dewegae.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERROR", err));

const app = express();
app.use(express.json());

//авторизация
app.post("/auth/login", async (req, res) => {
  try {
    // проверяем есть ли емайл в базе
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
    // если все норм, то создаем токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d", //срок жизни 30 дней
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось авторизоваться" });
  }
});

// проверяем валидацию, если ошибки есть, то возвращаем их, иначе возвращаем success
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    console.log(req.body);
    //проверка на ошибки
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // шифруем пароль
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    // создаем пользователя в монгоДБ
    const user = await doc.save();

    // создаем токен jwt
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d", //срок жизни 30 дней
      }
    );

    // возвращаем информацию о пользователе и токен
    // passwordHash отделяем от др. свойств, чтобы не возвращать его
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось зарегистрироваться" });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
