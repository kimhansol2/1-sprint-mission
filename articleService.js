import axios from "axios";

class Article {
  constructor(title, content, writer = "", likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this._likeCount = likeCount;
    this.createdAt = new Date() + 9 * 60 * 60 * 1000;
  }
  get likeCount() {
    return this._likeCount;
  }

  set likeCount(values) {
    throw new Error("좋아요 수는 변경할 수 없습니다.");
  }

  like() {
    this._likeCount += 1;
  }
}

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/articles",
  Timeout: 10000,
});

function getArticleList(page = 1, pageSize = 10, keyword = "") {
  const result = `?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;

  return instance
    .get(result)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

function getArticle(uid) {
  const result = `/${uid}`;

  return instance
    .get(result)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

function createArticle(title, content, image) {
  return instance
    .post("/", { title, content, image })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

function patchArticle(uid, title, content, image) {
  return instance
    .patch(`/${uid}`, { title, content, image })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

function deleteArticle(uid) {
  const result = `/${uid}`;

  return instance
    .delete(result)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

const articlelist = {
  Article,
  getArticle,
  getArticleList,
  createArticle,
  patchArticle,
  deleteArticle,
};

export default articlelist;
