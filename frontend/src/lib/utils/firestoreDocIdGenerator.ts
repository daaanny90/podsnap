export const generateDocId = (str: string) => {
  return str.replace(/[^A-Z0-9]+/ig, "_").toLowerCase()
}