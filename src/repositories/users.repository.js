import { prisma } from '../utils/prisma.util.js';

export class UsersRepository {
  findByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
  };

  createUser = async (email, hashedPassword, name) => {
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  };

  findById = async (id) => {
    return prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  };
}
