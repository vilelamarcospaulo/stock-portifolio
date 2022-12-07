import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';

export const UserFromRequest = (
  data: unknown,
  ctx: ExecutionContext,
): AuthUserDto => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as AuthUserDto;

  return {
    userId: 1,
    name: 'John Doe',
    email: 'johndoe@foobar.com',
  };
};
export const User = createParamDecorator(UserFromRequest);
