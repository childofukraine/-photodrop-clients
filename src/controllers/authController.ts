import { RequestHandler } from "express";
import { Twilio } from "twilio";
import Boom from "@hapi/boom";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { RefreshTokensRequest, SendOtpRequest, TypedResponse, VerifyOtpRequest } from "../types";
import { SessionRepository } from "../repositories/session";
import Session from "../entities/session";
import { createTokens } from "../libs/jwtGenerator";
import { UserRepository } from "../repositories/user";
import { User } from "../entities/user";
import { PDCSelfie } from "../db/schema";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = new Twilio(accountSid, authToken);

export class AuthController {
  static sendOtp: RequestHandler = async (
    req: SendOtpRequest,
    res: TypedResponse<{ message: string }>,
    next
  ) => {
    const { countryCode, phoneNumber } = req.body;
    console.log(countryCode);
    try {
      await client.verify.v2
        .services(serviceSid)
        .verifications.create({
          to: `+${countryCode}${phoneNumber}`,
          channel: "sms",
        })
        .catch((e) => next(e));

      res.status(200).json({ message: "OTP sent." });
    } catch (e) {
      next(e);
    }
  };

  static verifyOtp: RequestHandler = async (
    req: VerifyOtpRequest,
    res: TypedResponse<{
      accessToken: string;
      user: User;
      selfie?: PDCSelfie | null;
    }>,
    next
  ) => {
    const { countryCode, phoneNumber, otp } = req.body;
    const fullPhone = `${countryCode}${phoneNumber}`;

    try {
      await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: `+${countryCode}${phoneNumber}`,
          code: otp,
        })
        .then((r) => {
          if (!r.valid) throw Boom.badRequest("Invalid otp code.");
        })
        .catch(() => {
          throw Boom.badRequest("Invalid otp code.");
        });

      const user = await UserRepository.getUserByPhone(fullPhone);

      if (user) {
        const tokens = createTokens(user[0].pdc_client.clientId);
        const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
        const sessionExpireTimestamp = new Date(
          refreshTokenExpTime
        )
        const newSession = new Session(
          uuid(),
          user[0].pdc_client.clientId,
          tokens.refreshToken,
          sessionExpireTimestamp as unknown as Date
        );

        await SessionRepository.saveSession(newSession);

        res
          .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .json({
            accessToken: tokens.accessToken,
            user: user[0].pdc_client,
            selfie: user[0].pdc_selfies,
          });
      } else {
        const newUser = new User(uuid(), fullPhone);

        await UserRepository.saveUser(newUser);

        const tokens = createTokens(newUser.clientId);
        const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
        const sessionExpireTimestamp = new Date(
          refreshTokenExpTime
        )

        const newSession = new Session(
          uuid(),
          newUser.clientId,
          tokens.refreshToken,
          sessionExpireTimestamp as unknown as Date
        );

        await SessionRepository.saveSession(newSession);

        res
          .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .json({
            accessToken: tokens.accessToken,
            user: newUser,
          });
      }
    } catch (e) {
      next(e);
    }
  };


  static refresh: RequestHandler = async (
    req: RefreshTokensRequest,
    res: TypedResponse<{ accessToken: string }>,
    next,
  ) => {
    const { refreshToken } = req.cookies;
    const timeStamp = new Date(Date.now()).toJSON();

    try {
      const session = await SessionRepository.getSessionByRefreshToken(
        refreshToken,
      );

      if (!session) throw Boom.badRequest("Invalid refresh token.");

      if (
        Date.parse(timeStamp) >=
        Date.parse(session[0].expiresIn as unknown as string)
      ) {
        await SessionRepository.deleteSessionById(session[0].sessionId);
        throw Boom.unauthorized("Session is expired, please log-in.");
      }

      const newTokens = createTokens(session[0].clientId);
      const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
      const sessionExpireTimestamp = new Date(
        refreshTokenExpTime,
      )
      const newSession = new Session(
        session[0].sessionId,
        session[0].clientId,
        newTokens.refreshToken,
        sessionExpireTimestamp as unknown as Date,
      );

      await SessionRepository.updateSessionById(
        newSession,
        newSession.sessionId,
      );

      res
        .cookie("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .json({ accessToken: newTokens.accessToken });
    } catch (e) {
      next(e);
    }
  };
}
