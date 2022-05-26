import { Exclude } from 'class-transformer';

export class AboutDto {
  id: number;

  @Exclude()
  userId: number;

  constructor(partial: Partial<AboutDto>) {
    Object.assign(this, partial);
  }
}
