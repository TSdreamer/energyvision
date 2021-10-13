export const menuQuery = /* groq */ `
  *[_type == "siteMenu" && _lang == $lang][0] {
	"subMenus": group[]{
  	"id": _key,
    "topLevelLink": {
      label,
      "isStatic": coalesce(isStatic, false),
      "isDisabled": coalesce(isDisabled, false),
  		"link": reference-> {
        "type": _type,
        "slug": slug.current,
      },
      "href": url,
      "staticUrl": staticUrl,
    },
    "groups": group[]{
      "id": _key,
      label,   
      "links": links[]{
          label,
          "isStatic": coalesce(isStatic, false),
         "id": _key,
         "link": route-> {
            "type": _type,
           "slug": slug.current,
         },
         
         "staticUrl": staticUrl,
       }
    },
	}
}
`
