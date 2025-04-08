// const getDescription = async (page): Promise<string | null> => {
//   const description = await page.evaluate(() => {
//     const el =
//       document.querySelector('meta[property="og:description"]') ||
//       document.querySelector('meta[name="twitter:description"]') ||
//       document.querySelector('meta[name="description"]') ||
//       document.querySelector('meta[itemprop="description"]')
//     if (el && el.textContent) {
//       console.log(`Text content for: ${el.textContent} `)
//       return el.textContent
//     }
//     return null
//   })
//   return description
// }

// const getLogo = async (page): Promise<any> => {
//   const image = await page.evaluate(() => {
//     const logo =
//       document.querySelector('meta[property="og:logo"]') ||
//       document.querySelector('meta[name="twitter:image"]') ||
//       document.querySelector('meta[itemprop="logo"]') ||
//       document.querySelector('img[itemprop="logo"]')
//     if (logo && logo.textContent) {
//       return logo.textContent
//     } else if (logo && logo.src) {
//       return logo.src
//     }
//     const images = Array.from(document.getElementsByTagName('img'))
//     if (images[0] && images[0].src) {
//       return images[0].src
//     }
//     return undefined
//   })
//   return image
// }

// export { getDescription }
