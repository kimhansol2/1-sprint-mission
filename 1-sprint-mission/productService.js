import axios from "axios";

class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this._favoriteCount = favoriteCount;
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  set favoriteCount(values) {
    throw new Error("찜하기 수는 변경할 수 없습니다");
  }

  favorite() {
    this._favoriteCount += 1;
  }
}

class ElectonicProduct extends Product {
  constructor(name, description, price, tags, images, manufacturer) {
    super(name, description, price, tags, images);
    this.manufacturer = manufacturer;
  }
}

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/products",
  Timeout: 10000,
});

async function getProductList(page, pageSize, keyword) {
  let res;
  try {
    res = await instance.get("/", {
      params: { page, pageSize, keyword },
    });
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }

  return res.data;
}

async function getProduct(uid) {
  let res;
  try {
    res = await instance.get(`/${uid}`);
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.massage);
    }
  }

  return res.data;
}

async function createProduct(name, description, price, tags, images) {
  let res;
  try {
    res = await instance.post("/", { name, description, price, tags, images });
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }

  return res.data;
}

async function patchProduct(uid, name, description, price, tags, images) {
  let res;
  try {
    res = await instance.patch(`/${uid}`, {
      name,
      description,
      price,
      tags,
      images,
    });
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }

  return res.data;
}

async function deleteProduct(uid) {
  let res;
  try {
    res = await instance.delete(`/${uid}`);
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }

  return res.data;
}

const productlist = {
  Product,
  ElectonicProduct,
  getProduct,
  getProductList,
  createProduct,
  patchProduct,
  deleteProduct,
};

export default productlist;
