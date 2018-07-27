import * as type from './type';

export const authResolver = (user) => ({
  type: type.ISLOGIN,
  user
})

export const httpRequest = (category) => ({
  type: type.REQUEST,
  category
})