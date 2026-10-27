/**
 * SVG filters that give Chromium-based browsers real "liquid glass" refraction
 * (backdrop-filter: url(#…)). The displacement map is a soft rounded-rect lens:
 * neutral grey in the centre, red/green gradients towards the edges bend the
 * backdrop like the rim of a glass lens. Other browsers ignore it and keep the
 * frosted blur glass defined in globals.css.
 */
const map = (inset: number, blur: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="r" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/></linearGradient>
        <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>
      </defs>
      <rect width="400" height="400" fill="#000"/>
      <rect width="400" height="400" fill="url(#r)"/>
      <rect width="400" height="400" fill="url(#g)" style="mix-blend-mode:screen"/>
      <rect x="${inset}" y="${inset}" width="${400 - inset * 2}" height="${400 - inset * 2}" rx="${inset * 2}" fill="rgb(128,128,0)" filter="url(#b)"/>
    </svg>`,
  )}`;

export function GlassFilters() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} focusable="false">
      <defs>
        <filter id="lg-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB" primitiveUnits="objectBoundingBox">
          <feImage href={map(26, 14)} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="0.05" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.002" />
        </filter>
        <filter id="lg-refract-strong" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB" primitiveUnits="objectBoundingBox">
          <feImage href={map(40, 22)} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="0.09" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.001" />
        </filter>
      </defs>
    </svg>
  );
}
