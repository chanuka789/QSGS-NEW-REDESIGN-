import { ImageResponse } from "next/og";
import { LOGO_FULL } from "@/lib/logo-paths";

export const runtime = "nodejs";

/** Branded 1200×630 social share card (Open Graph / Twitter) for every page. */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Quantity Surveying Global Solutions").slice(0, 120);
  const logo = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_FULL.viewBox}"><path fill="#046492" fill-rule="evenodd" d="${LOGO_FULL.d}"/></svg>`,
  ).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={420} height={104} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "40px 44px",
            borderRadius: 36,
            background: "#f5f7f9",
            border: "1.5px solid #e3e8ec",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#046492", fontWeight: 700, textTransform: "uppercase" }}>Remote Quantity Surveying</div>
          <div style={{ marginTop: 14, fontSize: title.length > 60 ? 48 : 60, lineHeight: 1.08, color: "#10242e", fontWeight: 700, letterSpacing: -1.5 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#33444d" }}>
          <span>qs-global-solutions.com</span>
          <span>Take-offs · BoQ · Tender documents</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } },
  );
}
