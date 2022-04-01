export const newsroomQuery = /* groq */ `
  *[_type == "newsroom"  && _lang == $lang][0] {
    "documentTitle": seo.documentTitle,
    "metaDescription": seo.metaDescription,
    openGraphImage,
    title,
    ingress,
    backgroundImage
    }
 `