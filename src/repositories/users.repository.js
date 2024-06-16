export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findByEmail = async (email) => {
    return this.prisma.user.findUnique({ where: { email } });
  };

  createUser = async (email, hashedPassword, name) => {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  };

  findById = async (id) => {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  };
}
