import { HttpError } from '../errors/http.error';

export class ResumesService {
  constructor(resumesRepository) {
    this.resumesRepository = resumesRepository;
  }

  createResume = async ({ authorId, title, content }) => {
    const createdResume = await this.resumesRepository.createResume(
      authorId,
      title,
      content,
    );
    return createdResume;
  };

  findAllResumes = async (authorId, sort) => {
    const resumes = await this.resumesRepository.findAllResumes(authorId, sort);

    return resumes;
  };

  findResumeById = async (id, authorId) => {
    const resume = await this.resumesRepository.findResumeById({
      id,
      authorId,
      includeAuthor: true,
    });

    if (!resume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    return resume;
  };

  updateResume = async (id, authorId, title, content) => {
    let existedResume = await this.resumesRepository.findResumeById(
      id,
      authorId,
    );
    if (!existedResume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    const updatedResume = await this.resumesRepository.updateResume(
      id,
      authorId,
      title,
      content,
    );

    return updatedResume;
  };

  deleteResume = async (id, authorId) => {
    let existedResume = await this.resumesRepository.findResumeById(
      id,
      authorId,
    );
    if (!existedResume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    const deletedResume = await this.resumesRepository.deleteResume(
      id,
      authorId,
    );

    if (!deletedResume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }

    return deletedResume;
  };
}
