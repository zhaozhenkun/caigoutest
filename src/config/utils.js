/* eslint-disable */

const encode = (str) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
  }))
}
const decode = (str) => {
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, encode(content))
}

/**
 * 获取localStorage
 */
export const getStore = (name) => {
  if (!name) return
  if (!window.localStorage.getItem(name)) return
  return JSON.parse(decode(window.localStorage.getItem(name)))
}

/**
 * 删除localStorage
 */
export const removeStore = (name) => {
  if (!name) return
  window.localStorage.removeItem(name)
}