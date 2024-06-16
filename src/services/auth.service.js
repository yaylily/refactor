import {
  ACCESS_TOKEN_EXPIRES_IN,
  HASH_SALT_ROUNDS,
} from '../constants/auth.constant.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { HttpError } from '../errors/http.error.js';

export class AuthService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  signUp = async (email, password, name) => {
    const existedUser = await this.usersRepository.findByEmail(email);

    // 이메일이 중복된 경우
    if (existedUser) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }

    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);
    const user = await this.usersRepository.createUser(
      email,
      hashedPassword,
      name,
    );

    user.hashedPassword = undefined;

    return { data: user };
  };

  signIn = async (email, password) => {
    const user = await this.usersRepository.findByEmail(email);

    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);

    if (!isPasswordMatched) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    const payload = { id: user.id };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    return accessToken;
  };

  requireAccessToken = async (req, res, next) => {
    try {
      // 인증 정보 파싱
      const authorization = req.headers.authorization;

      // Authorization이 없는 경우
      if (!authorization) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
        });
      }

      // JWT 표준 인증 형태와 일치하지 않는 경우
      const [type, accessToken] = authorization.split(' ');

      if (type !== 'Bearer') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE,
        });
      }

      // AccessToken이 없는 경우
      if (!accessToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
        });
      }

      let payload;
      try {
        payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      } catch (error) {
        // AccessToken의 유효기한이 지난 경우
        if (error.name === 'TokenExpiredError') {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            status: HTTP_STATUS.UNAUTHORIZED,
            message: MESSAGES.AUTH.COMMON.JWT.EXPIRED,
          });
        }
        // 그 밖의 AccessToken 검증에 실패한 경우
        else {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            status: HTTP_STATUS.UNAUTHORIZED,
            message: MESSAGES.AUTH.COMMON.JWT.INVALID,
          });
        }
      }

      // Payload에 담긴 사용자 ID와 일치하는 사용자가 없는 경우
      const { id } = payload;
      const user = await this.usersRepository.findById(id);

      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.NO_USER,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}
