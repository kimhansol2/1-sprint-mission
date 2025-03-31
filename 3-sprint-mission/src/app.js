import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product.js";
import articleRouter from "./routes/article.js";
import commentRouter from "./routes/comment.js";
import { Prisma } from "@prisma/client";
import multer from "multer";
import cors from "cors";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

const app = express();
dotenv.config();
app.use(express.json());
const upload = multer({ dest: "./uploads" });
app.use(cors());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/files", express.static("uploads"));

app.post("/files", upload.single("attachment"), (req, res) => {
  console.log(req.file);
  const path = `/files/${req.file.filename}`;
  res.json({ path });
});

app.use((e, req, res, next) => {
  console.log("Error handleing");
  console.log(e);
  if (
    e.name === "StructError" ||
    (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") ||
    e instanceof PrismaClientValidationError
  ) {
    console.log("Error code", e.code);
    res.status(400).send({ message: e.message });
  } else if (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2025"
  ) {
    res.status(404).send({ message: e.message });
  } else {
    res.status(500).send({ message: e.message });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
