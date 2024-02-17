import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data, req) => {
	return data ? req.user[data] : req.user;
});
