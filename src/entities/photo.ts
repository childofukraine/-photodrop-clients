export class Photo {
  constructor(
    public photoId: string,
    public url: string,
    public thumbnail: string,
    public createdAt: Date,
    public albumId: string
  ) {}
}
