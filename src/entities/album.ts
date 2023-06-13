import { Photo } from "./photo";

export class Album {
  constructor(
    public albumId: string,
    public name: string | null,
    public location: string | null,
    public createdAt: Date,
    public isUnlocked: boolean,
    public cover: string,
    public photos: Photo[]
  ) {}
}
