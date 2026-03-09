/** Resolve o caminho de um asset da pasta public/ para qualquer base URL (dev ou GitHub Pages) */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
