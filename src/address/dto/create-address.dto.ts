import { User } from 'src/user/interfaces/user.interface';

export class CreateAddressDTO {
  readonly title: string;
  readonly address: string;
  readonly user: User;
  readonly created_at: Date;
}
