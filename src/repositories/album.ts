import { and, eq, like } from "drizzle-orm";
import database from "../db/database";
import {
  albumsTable,
  clientAlbumsTable,
  PDCAlbum,
  PDPAlbum,
  photosTable,
} from "../db/schema";
import { Album } from "../entities/album";
import { Photo } from "../entities/photo";
import { AlbumsIds } from "../types";

const { db } = database;

export default class AlbumRepository {
  static async getAlbumByAlbumIdAndUserId(
    albumId: string,
    userId: string
  ): Promise<PDPAlbum | null> {
    const album = await db
      .select()
      .from(clientAlbumsTable)
      .innerJoin(
        albumsTable,
        eq(albumsTable.albumId, clientAlbumsTable.albumId)
      )
      .where(
        and(
          eq(clientAlbumsTable.clientId, userId),
          eq(albumsTable.albumId, albumId)
        )
      );
    if (!album.length) return null;
    return album[0].pd_albums;
  }

  static async getAlbumsByPhone(phone: string): Promise<AlbumsIds[] | null> {
    const albums = await db
      .select({ albumId: albumsTable.albumId })
      .from(photosTable)
      .innerJoin(albumsTable, eq(photosTable.albumId, albumsTable.albumId))
      .where(like(photosTable.clients, `%${phone}%`));
    if (!albums.length) return null;
    return albums;
  }

  static async getUserAlbumByUserIdAndAlbumId(
    userId: string,
    albumId: string
  ): Promise<PDCAlbum[] | null> {
    const userAlbums = await db
      .select()
      .from(clientAlbumsTable)
      .where(
        and(
          eq(clientAlbumsTable.albumId, albumId),
          eq(clientAlbumsTable.clientId, userId)
        )
      );
    if (!userAlbums.length) return null;
    return userAlbums;
  }

  static async createRecordUserAlbum(
    userId: string,
    albumId: string
  ): Promise<void> {
    await db
      .insert(clientAlbumsTable)
      .values({ albumId: albumId, clientId: userId });
  }

  static async getAllAlbumsWithPhotosByUserIdAndPhone(
    userId: string,
    phone: string
  ): Promise<Album[] | null> {
    const mapped = new Map<string, Album>();
    const albumsWithPhotos = await db
      .select({
        albumId: clientAlbumsTable.albumId,
        name: albumsTable.name,
        location: albumsTable.location,
        createdAt: albumsTable.createdAt,
        isUnlocked: clientAlbumsTable.isUnlocked,
        photos: photosTable,
      })
      .from(clientAlbumsTable)
      .innerJoin(
        photosTable,
        eq(photosTable.albumId, clientAlbumsTable.albumId)
      )
      .innerJoin(
        albumsTable,
        eq(albumsTable.albumId, clientAlbumsTable.albumId)
      )
      .where(
        and(
          eq(clientAlbumsTable.clientId, userId),
          like(photosTable.clients, `%${phone}%`)
        )
      );

    if (!albumsWithPhotos.length) return null;

    const uniqAlbumsIds = [...new Set(albumsWithPhotos.map((a) => a.albumId))];
    const photos = albumsWithPhotos
      .map((p) => p.photos)
      .filter(
        (value, index, self) =>
          self.findIndex((m) => m.photoId === value.photoId) === index
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    uniqAlbumsIds.forEach((id) => {
      const albumInfo = albumsWithPhotos.find((album) => album.albumId === id);
      const sortedPhotosByAlbumId = photos.filter(
        (photo) => photo.albumId === id
      );
      const cover = sortedPhotosByAlbumId[0].unlockedThumbnailUrl;
      const preparedPhotos: Photo[] = [];

      if (albumInfo?.isUnlocked) {
        sortedPhotosByAlbumId.forEach((p) =>
          preparedPhotos.push(
            new Photo(
              p.photoId,
              p.unlockedPhotoUrl,
              p.unlockedThumbnailUrl,
              p.createdAt,
              p.albumId
            )
          )
        );
      } else {
        sortedPhotosByAlbumId.forEach((p) =>
          preparedPhotos.push(
            new Photo(
              p.photoId,
              p.lockedPhotoUrl,
              p.lockedThumbnailUrl,
              p.createdAt,
              p.albumId
            )
          )
        );
      }
      const preparedAlbum = new Album(
        albumInfo?.albumId!,
        albumInfo?.name!,
        albumInfo?.location!,
        albumInfo?.createdAt!,
        albumInfo?.isUnlocked!,
        cover,
        preparedPhotos
      );
      mapped.set(id, preparedAlbum);
    });
    return Array.from(mapped.values());
  }

  static async getAllAlbumWithPhotosByUserIdAndPhoneAndAlbumId(
    userId: string,
    phone: string,
    albumId: string
  ): Promise<Album | null> {
    const albumWithPhotos = await db
      .select({
        albumId: clientAlbumsTable.albumId,
        name: albumsTable.name,
        location: albumsTable.location,
        createdAt: albumsTable.createdAt,
        isUnlocked: clientAlbumsTable.isUnlocked,
        photos: photosTable,
      })
      .from(clientAlbumsTable)
      .innerJoin(
        photosTable,
        eq(photosTable.albumId, clientAlbumsTable.albumId)
      )
      .innerJoin(
        albumsTable,
        eq(albumsTable.albumId, clientAlbumsTable.albumId)
      )
      .where(
        and(
          eq(clientAlbumsTable.clientId, userId),
          like(photosTable.clients, `%${phone}%`),
          eq(albumsTable.albumId, albumId)
        )
      );

    if (!albumWithPhotos.length) return null;

    const photos = albumWithPhotos
      .map((p) => p.photos)
      .filter(
        (value, index, self) =>
          self.findIndex((m) => m.photoId === value.photoId) === index
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    const albumInfo = albumWithPhotos.find(
      (album) => album.albumId === albumId
    );

    const sortedPhotosByAlbumId = photos.filter(
      (photo) => photo.albumId === albumId
    );
    const cover = sortedPhotosByAlbumId[0].unlockedThumbnailUrl;
    const preparedPhotos: Photo[] = [];

    if (albumInfo?.isUnlocked) {
      sortedPhotosByAlbumId.forEach((p) =>
        preparedPhotos.push(
          new Photo(
            p.photoId,
            p.unlockedPhotoUrl,
            p.unlockedThumbnailUrl,
            p.createdAt,
            p.albumId
          )
        )
      );
    } else {
      sortedPhotosByAlbumId.forEach((p) =>
        preparedPhotos.push(
          new Photo(
            p.photoId,
            p.lockedPhotoUrl,
            p.lockedThumbnailUrl,
            p.createdAt,
            p.albumId
          )
        )
      );
    }
    const preparedAlbum = new Album(
      albumInfo?.albumId!,
      albumInfo?.name!,
      albumInfo?.location!,
      albumInfo?.createdAt!,
      albumInfo?.isUnlocked!,
      cover,
      preparedPhotos
    );

    return preparedAlbum;
  }
}
