export default class Selfie {
  constructor(
    public selfieId: string,
    public selfieUrl: string,
    public selfieThumbnail: string,
    public shiftX: number | null,
    public shiftY: number | null,
    public zoom: number | null,
    public width: number | null,
    public height: number | null
  ) {}
}
