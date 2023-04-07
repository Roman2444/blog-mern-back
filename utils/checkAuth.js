import jwt from "jsonwebtoken";

export default (req, res, next) => {
  // необходимо спарсить токен и расшифровать
  // проверяем есть токен или нет, удаляем "Bearer" в начале токена
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");

      req.userId = decoded._id;
      next();
    } catch (err) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
