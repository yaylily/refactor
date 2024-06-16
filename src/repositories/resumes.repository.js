import { prisma } from '../utils/prisma.util.js';

export class ResumesRepository {
  createResume = async (authorId, title, content) => {
    const createdResume = await prisma.resume.create({
      data: {
        authorId,
        title,
        content,
      },
    });
    return createdResume;
  };

  findAllResumes = async (authorId) => {
    let resumes = await prisma.resume.findMany({
      where: { authorId: +authorId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
    });

    resumes = resumes.map((resume) => {
      return {
        id: resume.id,
        authorName: resume.author.name,
        title: resume.title,
        content: resume.content,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });
    return resumes;
  };

  findResumeById = async (id, authorId) => {
    let resume = await prisma.resume.findUnique({
      where: { id: +id, authorId },
      include: { author: true },
    });
    resume = {
      id: resume.id,
      authorName: resume.author.name,
      title: resume.title,
      content: resume.content,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
    return resume;
  };

  updateResume = async (id, authorId, title, content) => {
    const updatedResume = await prisma.resume.update({
      where: { id: +id, authorId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });
    return updatedResume;
  };

  deleteResume = async (id, authorId) => {
    const deletedResume = await prisma.resume.delete({
      where: { id: +id, authorId },
    });
    return deletedResume;
  };
}
