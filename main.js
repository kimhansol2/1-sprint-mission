import articlelist from "./articleService.js";
import productlist from "./productService.js";

//product 시작
const createproducts = await productlist.createProduct(
  "최고의",
  "삼성제품",
  30000,
  ["전자제품"],
  "https://example.com/image1"
);
let products = [];

console.log("프로덕트 생성", createproducts);

const uid = createproducts.id;

const getproducts = await productlist.getProduct(uid);
console.log("프로덕트 조회", getproducts);

const getproductList = await productlist.getProductList(1, 10, "삼성");
console.log("프로덕트 리스트 조회", getproductList);

getproductList.list.forEach((element) => {
  const Productclass = element.tags.some((tag) => tag.includes("전자제품"))
    ? productlist.ElectonicProduct
    : productlist.Product;

  const productinstance = new Productclass(
    element.name,
    element.desciption,
    element.price,
    element.tags,
    element.Images,
    element.favoriteCount,
    element instanceof productlist.ElectonicProduct
      ? element.manufacturer
      : undefined
  );
  products.push(productinstance);
});
console.log("프로덕트 특정 리스트 조회", products);

const patchproduct = await productlist.patchProduct(
  uid,
  "LG제품",
  "LG모니터",
  100000,
  ["최고"],
  "https://example.com/image2"
);
console.log("프로턱트 수정", patchproduct);

const deleteproduct = await productlist.deleteProduct(uid);
console.log("프로덕트 삭제", deleteproduct);

//아티클 시작
const createarticle = await articlelist.createArticle(
  "kim",
  "kim study",
  "https://example.com/image3"
);

console.log("아티클 생성", createarticle);

const userId = createarticle.id;

const getarticle = await articlelist.getArticle(userId);
console.log("아티클 조회", getarticle);

const getarticlelist = await articlelist.getArticleList(1, 10, "샘플");
console.log("아티클 리스트 조회", getarticlelist);

const articles = getarticlelist.list.map((element) => {
  const articleclass = new articlelist.Article(
    element.title,
    element.content,
    element.writer,
    element.likeCount
  );
  return articleclass;
});

console.log("특정 아티클", articles);

const patcharticle = await articlelist.patchArticle(
  userId,
  "요리교실",
  "백종원의 요리교실",
  "https://example.com/images/5"
);
console.log("아티클 수정", patcharticle);

const deletearticle = await articlelist.deleteArticle(userId);
console.log("아티클 삭제", deletearticle);
