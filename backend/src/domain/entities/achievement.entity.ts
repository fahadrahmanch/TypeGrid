export class AchievementEntity {
  private _id?: string;
  private _title: string;
  private _description: string;
  private _imageUrl: string;
  private _minWpm?: number;
  private _minAccuracy?: number;
  private _minGame?: number;
  private _xp: number;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(data: {
    _id?: string;
    title: string;
    description: string;
    imageUrl: string;
    minWpm?: number;
    minAccuracy?: number;
    minGame?: number;
    xp: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = data._id;
    this._title = data.title;
    this._description = data.description;
    this._imageUrl = data.imageUrl;
    this._minWpm = data.minWpm;
    this._minAccuracy = data.minAccuracy;
    this._minGame = data.minGame;
    this._xp = data.xp;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // Getters
  get id(): string | undefined { return this._id; }
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get imageUrl(): string { return this._imageUrl; }
  get minWpm(): number | undefined { return this._minWpm; }
  get minAccuracy(): number | undefined { return this._minAccuracy; }
  get minGame(): number | undefined { return this._minGame; }
  get xp(): number { return this._xp; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  // Encapsulated update method
  update(data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    minWpm?: number;
    minAccuracy?: number;
    minGame?: number;
    xp?: number;
  }): void {
    if (data.title !== undefined) this._title = data.title;
    if (data.description !== undefined) this._description = data.description;
    if (data.imageUrl !== undefined) this._imageUrl = data.imageUrl;
    if (data.minWpm !== undefined) this._minWpm = data.minWpm;
    if (data.minAccuracy !== undefined) this._minAccuracy = data.minAccuracy;
    if (data.minGame !== undefined) this._minGame = data.minGame;
    if (data.xp !== undefined) this._xp = data.xp;
  }

  toObject() {
    return {
      _id: this.id,
      title: this.title,
      description: this.description,
      imageUrl: this.imageUrl,
      minWpm: this.minWpm,
      minAccuracy: this.minAccuracy,
      minGame: this.minGame,
      xp: this.xp,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
