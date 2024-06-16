import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class ResumesController {
  constructor(resumesService) {
    this.resumesService = resumesService;
  }

  createResume = async (req, res, next) => {
    try {
      const user = req.user;
      const { title, content } = req.body;
      const authorId = user.id;

      const resume = await this.resumesService.createResume(
        authorId,
        title,
        content,
      );

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESUMES.CREATE.SUCCEED,
        resume,
      });
    } catch (error) {
      next(error);
    }
  };

  getResumes = async (req, res, next) => {
    try {
      const user = req.user;
      const authorId = user.id;

      const resumes = await this.resumesService.findAllResumes(authorId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
        resumes,
      });
    } catch (error) {
      next(error);
    }
  };

  getResumeById = async (req, res, next) => {
    try {
      const user = req.user;
      const authorId = user.id;

      const { id } = req.params;

      const resume = await this.resumesService.findResumeById(id, authorId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
        resume,
      });
    } catch (error) {
      next(error);
    }
  };

  updateResume = async (req, res, next) => {
    try {
      const user = req.user;
      const authorId = user.id;

      const { id } = req.params;
      const { title, content } = req.body;

      const resume = await this.resumesService.updateResume(
        id,
        authorId,
        title,
        content,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.SUCCEED,
        resume,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteResume = async (req, res, next) => {
    try {
      const user = req.user;
      const authorId = user.id;

      const { id } = req.params;

      const resume = await this.resumesService.deleteResume(id, authorId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.DELETE.SUCCEED,
        data: { id: resume.id },
      });
    } catch (error) {
      next(error);
    }
  };
}
