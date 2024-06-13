import { ResumesRepository } from '../repositories/resumes.repository.js';

export class ResumesService {
  resumesRepository = new ResumesRepository();

  createResume = async (authorId, title, content) => {
    const createdResume = await this.resumesRepository.createResume(
      authorId,
      title,
      content,
    );
    return createdResume;
  };

  findAllResumes = async (authorId) => {
    const resumes = await this.resumesRepository.findAllResumes(authorId);
    return resumes;
  };

  findResumeById = async (id, authorId) => {
    const resume = await this.resumesRepository.findResumeById(id, authorId);
    return resume;
  };

  updateResume = async (id, authorId, title, content) => {
    const updatedResume = await this.resumesRepository.updateResume(
      id,
      authorId,
      title,
      content,
    );
    return updatedResume;
  };

  deleteResume = async (id, authorId) => {
    const deletedResume = await this.resumesRepository.deleteResume(
      id,
      authorId,
    );
    return deletedResume;
  };
}
