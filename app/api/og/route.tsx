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
          background: "linear-gradient(135deg,#f4f2ed 0%,#ebe8e1 55%,#e2ebee 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 9999, background: "radial-gradient(circle,#d7e9ef 0%,rgba(215,233,239,0) 70%)", display: "flex" }} />
        <div style={{ position: "absolute", left: 300, bottom: -220, width: 520, height: 520, borderRadius: 9999, background: "radial-gradient(circle,#efe3cf 0%,rgba(239,227,207,0) 70%)", display: "flex" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={420} height={104} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "40px 44px",
            borderRadius: 36,
            background: "rgba(251,250,247,0.7)",
            border: "1.5px solid rgba(255,255,255,0.9)",
            boxShadow: "0 30px 60px -30px rgba(4,100,146,0.35)",
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
