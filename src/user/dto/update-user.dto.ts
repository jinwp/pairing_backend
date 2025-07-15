import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
<<<<<<< HEAD
    love?: number;
=======
  love?: number;
>>>>>>> 20d1df791f0c7eaabe59f3535628c275a6669ea2
}
