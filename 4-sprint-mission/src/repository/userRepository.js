import prisma from "../lib/prisma.js";

async function save({ email, nickname, password }) {
  return prisma.user.create({
    data: {
      email,
      nickname,
      password,
    },
  });
}

async function findEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findId(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function update(id, updatedField) {
  return prisma.user.update({
    where: { id },
    data: updatedField,
  });
}

export default {
  save,
  findEmail,
  findId,
  update,
};
