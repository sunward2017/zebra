import Cookies from 'js-cookie'

const TokenKey = 'SESSION';

export function getToken() {
   return JSON.parse(unescape(Cookies.get(TokenKey)))
}  

export function setToken(session) {
  return Cookies.set(TokenKey, escape(session))
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

