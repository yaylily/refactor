import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  authService = new AuthService();
  //사용자 조회 API
  signUp = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      const userData = await this.authService.signUp(email, password, name);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        userData,
      });
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const accessToken = await this.authService.signIn(email, password);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  };
}
