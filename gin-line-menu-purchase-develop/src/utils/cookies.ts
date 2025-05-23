export const getCookies = () => {
  const { cookie } = document
  if (!cookie) return null
  return cookie
    .split(';')
    .map(cookieString => cookieString.trim().split('='))
    .reduce((acc: any, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
}

export const getCookie = (key: string) => {
  const cookies = getCookies()
  if (!cookies) return ''

  return cookies[key] ?? ''
}

export const setCookie = (key: string, value: string, expires: string = '') => {
  let cookie = `${key}=${value};`
  cookie += 'path=/;'
  cookie += `domain=${window.location.hostname};`
  if (expires) {
    cookie += `expires=${expires}`
  }
  document.cookie = cookie
}
