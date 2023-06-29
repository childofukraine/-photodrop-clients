"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const boom_1 = require("@hapi/boom");
const dotenv_1 = __importDefault(require("dotenv"));
const album_1 = __importDefault(require("../repositories/album"));
dotenv_1.default.config();
const { STRIPE_SECRET_KEY, REDIRECT_URL, REDIRECT_FE_URL } = process.env;
const stripe = new stripe_1.default(STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
class PayController {
}
exports.default = PayController;
_a = PayController;
PayController.createPaymentForAlbum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const clientId = getClientIdFromToken(
    //   req.header("Authorization")?.replace("Bearer ", "")!,
    // );
    const clientId = "7e264b8e-5cc9-4ebe-b864-a4e848f6ed57";
    const { albumId } = req.params;
    try {
        const album = yield album_1.default.getAlbumByAlbumIdAndUserId(albumId, clientId);
        if (!album)
            throw (0, boom_1.notFound)();
        const product = yield stripe.products.create({
            name: album.name,
        });
        const price = yield stripe.prices.create({
            currency: "usd",
            unit_amount: 500,
            product: product.id,
        });
        const paymentLink = yield stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
            after_completion: {
                type: "redirect",
                redirect: {
                    url: `${REDIRECT_URL}/album/confirm-payment/${albumId}/${clientId}`,
                },
            },
        });
        res.status(200).json(paymentLink.url);
    }
    catch (e) {
        next(e);
    }
});
PayController.confirmPaymentForAlbum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId, clientId } = req.params;
    try {
        yield album_1.default.updateAlbumStateByAlbumIdAndUserId(albumId, clientId);
        res.status(303).redirect(`${REDIRECT_FE_URL}`);
    }
    catch (e) {
        next(e);
    }
});
