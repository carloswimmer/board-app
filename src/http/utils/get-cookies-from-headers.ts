export function getCookiesFromHeaders(headers: HeadersInit) {
  const outgoingHeaders = new Headers()

  outgoingHeaders.set("Content-type", "application/json")

  const incomingHeaders = new Headers(headers)
  const cookies = incomingHeaders.get("cookie")

  if (cookies) {
    outgoingHeaders.set("cookie", cookies)
  }

  return outgoingHeaders
}
