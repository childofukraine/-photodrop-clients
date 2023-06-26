import { RequestHandler } from "express";
import Stripe from "stripe";
import Boom, { notFound } from "@hapi/boom";
import dotenv from "dotenv";
import { TypedResponse } from "../types";
import { getClientIdFromToken } from "../libs/getClientIdFromToken";
import AlbumRepository from "../repositories/album";

dotenv.config();

const { STRIPE_SECRET_KEY, REDIRECT_URL, REDIRECT_FE_URL } = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export default class PayController {
  static createPaymentForAlbum: RequestHandler = async (
    req,
    res: TypedResponse<string>,
    next
  ) => {
    // const clientId = getClientIdFromToken(
    //   req.header("Authorization")?.replace("Bearer ", "")!,
    // );

    const clientId = "7e264b8e-5cc9-4ebe-b864-a4e848f6ed57";
    const { albumId } = req.params;

    try {
      const album = await AlbumRepository.getAlbumByAlbumIdAndUserId(
        albumId,
        clientId
      );

      if (!album) throw notFound();

      const product = await stripe.products.create({
        name: album.name!,
      });

      const price = await stripe.prices.create({
        currency: "usd",
        unit_amount: 500,
        product: product.id,
      });

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
          type: "redirect",
          redirect: {
            url: `${REDIRECT_URL}/album/confirm-payment/${albumId}/${clientId}`,
          },
        },
      });

      res.status(200).json(paymentLink.url);
    } catch (e) {
      next(e);
    }
  };

  static confirmPaymentForAlbum: RequestHandler = async (req, res, next) => {
    const { albumId, clientId } = req.params;
    try {
      await AlbumRepository.updateAlbumStateByAlbumIdAndUserId(
        albumId,
        clientId
      );

      res.status(303).redirect(`${REDIRECT_FE_URL}${albumId}`);
    } catch (e) {
      next(e);
    }
  };
}
