var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var connectDB = require("./service/connectHandle");
var appError = require("./service/appError");
var apiMessage = require("./service/apiMessage");

var authRouter = require("./routes/auth");
var uploadRouter = require("./routes/upload");
var indexRouter = require("./routes/index");
var postRouter = require("./routes/posts");
var userRouter = require("./routes/users");
var likeRouter = require("./routes/likes");
var commentRouter = require("./routes/comments");
var followRouter = require("./routes/follows");

var app = express();

// 程式出現重大錯誤時
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaughted Exception!!");
  console.error(err);
  process.exit(1);
});

// connect DB
connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/api", authRouter);
app.use("/api", uploadRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);
app.use("/api", likeRouter);
app.use("/api", commentRouter);
app.use("/api", followRouter);

// catch 404 找不到路由
app.use(function (req, res, next) {
  return next(appError(apiMessage.ROUTER_NOT_FOUND, next));
});

// 正式環境錯誤
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      message: err.message,
    });
  } else {
    // log 紀錄
    console.error("出現重大錯誤", err);
    // 送出罐頭預設訊息
    res.status(500).send({
      status: "error",
      message: "系統錯誤，請恰系統管理員!!",
    });
  }
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// 底層錯誤處理 dev開發 || prod正式
app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  // dev
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }
  // production
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = "資料欄位未填寫正確，請重新輸入";
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = "ＩＤ格式錯誤，請重新輸入";
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === "SyntaxError") {
    err.statusCode = 400;
    err.message = "語法不合法或代碼錯誤，請重新確認";
    err.isOperational = true;
    return resErrorProd(err, res);
  } else if (err.name === "ReferenceError") {
    err.statusCode = 400;
    err.message = "找不到參數數值，請重新確認";
    err.isOperational = true;
    return resErrorProd(err, res);
  }

  resErrorProd(err, res);
});

// promise 未捕捉到的 catch
process.on("unhandledRejection", (err, promise) => {
  console.error("!!未捕捉到的 rejection：", promise, "原因：", err);
});

module.exports = app;
