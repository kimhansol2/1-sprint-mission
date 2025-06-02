import * as s from "superstruct";
import isUuid from "is-uuid";

const uuid = s.define("Uuid", (value) => isUuid.v4(value));

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 50),
  content: s.string(),
});

const TAG = [
  "TSHIRT",
  "BLOUSE",
  "SHIRT",
  "JEANS",
  "DRESS",
  "COAT",
  "JACKET",
  "PANTS",
];

export const PatchArticle = s.partial(CreateArticle);

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 20),
  description: s.optional(s.string()),
  price: s.min(s.number(), 0),
  tags: s.enums(TAG),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 50),
  articleId: s.optional(uuid),
  productId: s.optional(uuid),
});

export const PatchComment = s.partial(CreateComment);
