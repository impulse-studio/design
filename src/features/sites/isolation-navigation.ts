const reloadMarker = "digit:site-isolation-reload"

type IsolationBrowser = {
  crossOriginIsolated: boolean
  isSecureContext: boolean
  href: string
  readMarker: () => string | null
  writeMarker: (href: string) => void
  clearMarker: () => void
  replace: (href: string) => void
}

export const createSiteIsolationGuard = () => {
  let unavailableForDocument = false

  return (browser: IsolationBrowser) => {
    if (browser.crossOriginIsolated) {
      browser.clearMarker()
      unavailableForDocument = false
      return false
    }
    if (!browser.isSecureContext || unavailableForDocument) return false
    if (browser.readMarker() === browser.href) {
      browser.clearMarker()
      unavailableForDocument = true
      return false
    }
    browser.writeMarker(browser.href)
    browser.replace(browser.href)
    return true
  }
}

const guardSiteIsolation = createSiteIsolationGuard()

export const reloadSiteEditorForIsolation = () => {
  if (typeof window === "undefined") return false
  return guardSiteIsolation({
    crossOriginIsolated: window.crossOriginIsolated,
    isSecureContext: window.isSecureContext,
    href: window.location.href,
    readMarker: () => window.sessionStorage.getItem(reloadMarker),
    writeMarker: (href) => window.sessionStorage.setItem(reloadMarker, href),
    clearMarker: () => window.sessionStorage.removeItem(reloadMarker),
    replace: (href) => window.location.replace(href),
  })
}
