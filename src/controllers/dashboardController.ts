import { notFound } from "@hapi/boom";
import { RequestHandler } from "express";
import { Album } from "../entities/album";
import { getClientIdFromToken } from "../libs/getClientIdFromToken";
import AlbumRepository from "../repositories/album";
import { UserRepository } from "../repositories/user";
import { TypedResponse } from "../types";

export class DashboardController {
  static getAllAlbums: RequestHandler = async (
    req,
    res: TypedResponse<Album[]| null>,
    next
  ) => {
    // const clientId = getClientIdFromToken(
    //   req.header("Authorization")?.replace("Bearer ", "")!
    // );

    const clientId = "7e264b8e-5cc9-4ebe-b864-a4e848f6ed57";

    try {
      const user = await UserRepository.getUserById(clientId);
      if (!user) throw notFound();
      let { phone } = user[0].pdc_client;
      if (phone[0] === "+") phone = phone.slice(1);

      const albumsIds = await AlbumRepository.getAlbumsByPhone(phone);

      if (albumsIds) {
        const uniqAlbumsIds = [...new Set(albumsIds.map((a) => a.albumId))];
        uniqAlbumsIds.map((albumId) =>
          AlbumRepository.getUserAlbumByUserIdAndAlbumId(
            clientId,
            albumId
          ).then(async (query) => {
            if (!query) {
              await AlbumRepository.createRecordUserAlbum(clientId, albumId);
            }
          })
        );
      }

      const albumsWithPhotos =
        await AlbumRepository.getAllAlbumsWithPhotosByUserIdAndPhone(
          clientId,
          phone
        );

      const noAlbumsResult: any[] = []
      if (!albumsWithPhotos) {
        res.status(200).json(noAlbumsResult);
      }

      res.status(200).json(albumsWithPhotos);
    } catch (e) {
      next(e);
    }
  };

  static getAlbumById: RequestHandler = async (
    req,
    res: TypedResponse<Album>,
    next
  ) => {
    // const clientId = getClientIdFromToken(
    //     req.header("Authorization")?.replace("Bearer ", "")!
    //     );

    const clientId = "7e264b8e-5cc9-4ebe-b864-a4e848f6ed57";
    const { albumId } = req.params;

    try {
      const user = await UserRepository.getUserById(clientId);
      if (!user) throw notFound();
      let { phone } = user[0].pdc_client;
      if (phone[0] === "+") phone = phone.slice(1);

      const albumWithPhotos =
        await AlbumRepository.getAllAlbumWithPhotosByUserIdAndPhoneAndAlbumId(
          clientId,
          phone,
          albumId
        );

      if (!albumWithPhotos) throw notFound();

      res.status(200).json(albumWithPhotos);
    } catch (e) {
      next(e);
    }
  };
}
