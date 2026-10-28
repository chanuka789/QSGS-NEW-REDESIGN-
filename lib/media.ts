/**
 * Website images. Files live in the Railway bucket under `images/` and are served
 * through `/media/<file>` (see app/media/[...key]/route.ts). Names follow
 * `qsgs-<sector>-<nn>.webp`. To replace an image, upload a file with the same name.
 */
export type Sector =
  | "residential"
  | "commercial"
  | "mixed-use"
  | "hospitality"
  | "healthcare"
  | "educational"
  | "cultural"
  | "recreational"
  | "infrastructure"
  | "expressways"
  | "landscape";

export type MediaItem = { file: string; sector: Sector; title: string; alt: string };

export const sectorLabel: Record<Sector, string> = {
  residential: "Residential",
  commercial: "Commercial",
  "mixed-use": "Mixed-Use",
  hospitality: "Hotels & Resorts",
  healthcare: "Healthcare",
  educational: "Educational",
  cultural: "Cultural",
  recreational: "Recreational",
  infrastructure: "Infrastructure",
  expressways: "Expressways",
  landscape: "Landscape",
};

export const mediaItems: MediaItem[] = [
  { file: "qsgs-commercial-01.webp", sector: "commercial", title: "Office pavilion entrance", alt: "Stone-clad office pavilion entrance with olive trees" },
  { file: "qsgs-commercial-02.webp", sector: "commercial", title: "Twin glass office towers", alt: "Twin glass office towers with a landscaped forecourt" },
  { file: "qsgs-infrastructure-01.webp", sector: "infrastructure", title: "Waterfront promenade", alt: "Curving waterfront promenade lined with palms" },
  { file: "qsgs-residential-01.webp", sector: "residential", title: "Residential courtyard", alt: "Residential courtyard with a reflecting pool and olive trees" },
  { file: "qsgs-mixed-use-02.webp", sector: "mixed-use", title: "Marina residences and waterfront dining", alt: "Marina residences with yachts, palm trees and a waterfront restaurant at golden hour" },
  { file: "qsgs-mixed-use-01.webp", sector: "mixed-use", title: "Marina mixed-use district", alt: "Mixed-use marina district with apartments and waterfront dining" },
  { file: "qsgs-recreational-01.webp", sector: "recreational", title: "Clubhouse pavilion", alt: "Low clubhouse pavilion with a deep canopy and gardens" },
  { file: "qsgs-infrastructure-02.webp", sector: "infrastructure", title: "Canal arch bridge", alt: "Arched pedestrian bridge over a landscaped canal" },
  { file: "qsgs-residential-02.webp", sector: "residential", title: "Terraced residences", alt: "Terraced residential blocks with planted balconies" },
  { file: "qsgs-commercial-03.webp", sector: "commercial", title: "Commercial frontage", alt: "Commercial building with a mashrabiya screen and glazed frontage" },
  { file: "qsgs-hospitality-01.webp", sector: "hospitality", title: "Desert resort", alt: "Desert resort with pavilions and pools at sunset" },
  { file: "qsgs-expressways-01.webp", sector: "expressways", title: "Expressway interchange", alt: "Expressway interchange with landscaped verges" },
  { file: "qsgs-cultural-01.webp", sector: "cultural", title: "Mosque and courtyard", alt: "Contemporary mosque with dome, minaret and courtyard" },
  { file: "qsgs-infrastructure-03.webp", sector: "infrastructure", title: "Transit station canopy", alt: "Transit station with a sculpted steel canopy" },
  { file: "qsgs-hospitality-02.webp", sector: "hospitality", title: "Hotel lobby", alt: "Hotel lobby lounge with stone walls and timber ceiling" },
  { file: "qsgs-residential-03.webp", sector: "residential", title: "Canal-side residences", alt: "Low-rise residences along a landscaped canal" },
  { file: "qsgs-residential-04.webp", sector: "residential", title: "Coastal residences", alt: "Curved coastal residential building above the sea" },
  { file: "qsgs-residential-05.webp", sector: "residential", title: "Contemporary villa", alt: "Contemporary stone villa with palm trees" },
  { file: "qsgs-residential-06.webp", sector: "residential", title: "Hillside villa", alt: "Terraced hillside villa with an infinity pool" },
  { file: "qsgs-hospitality-03.webp", sector: "hospitality", title: "Desert lodge walkway", alt: "Desert lodge walkway with water features and screens" },
  { file: "qsgs-educational-01.webp", sector: "educational", title: "Library and learning centre", alt: "Stone library building with a glazed reading hall" },
  { file: "qsgs-hospitality-04.webp", sector: "hospitality", title: "Hotel tower", alt: "Hotel tower with a stone porte-cochère" },
  { file: "qsgs-residential-07.webp", sector: "residential", title: "Waterfront residential tower", alt: "Residential tower with planted balconies by the sea" },
  { file: "qsgs-commercial-04.webp", sector: "commercial", title: "Retail promenade", alt: "Shaded retail promenade with stone colonnade" },
  { file: "qsgs-commercial-05.webp", sector: "commercial", title: "Office campus", alt: "Office campus with landscaped courtyards, aerial view" },
  { file: "qsgs-commercial-06.webp", sector: "commercial", title: "Office building", alt: "Office building with a stone grid facade and planters" },
  { file: "qsgs-cultural-02.webp", sector: "cultural", title: "Museum and gallery", alt: "Museum with tall stone arches and a reflecting pool" },
  { file: "qsgs-hospitality-05.webp", sector: "hospitality", title: "Coastal resort", alt: "Coastal resort terrace with infinity pool and sea view" },
  { file: "qsgs-hospitality-06.webp", sector: "hospitality", title: "Desert villa resort", alt: "Desert resort villa with pool and lounge" },
  { file: "qsgs-healthcare-01.webp", sector: "healthcare", title: "Healthcare campus", alt: "Healthcare campus courtyard with date palms" },
  { file: "qsgs-residential-08.webp", sector: "residential", title: "Courtyard villa", alt: "Courtyard villa with olive tree and reflecting pool" },
  { file: "qsgs-residential-09.webp", sector: "residential", title: "Seafront villa", alt: "Seafront villa with pool terrace" },
  { file: "qsgs-landscape-01.webp", sector: "landscape", title: "Community garden walk", alt: "Landscaped community walk with a water rill" },
  { file: "qsgs-residential-10.webp", sector: "residential", title: "Villa street frontage", alt: "Two-storey stone villa with timber screens" },
  { file: "qsgs-residential-11.webp", sector: "residential", title: "Twin residential towers", alt: "Twin residential towers with a podium by the water" },
  { file: "qsgs-commercial-07.webp", sector: "commercial", title: "Commercial office tower", alt: "Commercial office tower with stone fins" },
  { file: "qsgs-landscape-02.webp", sector: "landscape", title: "Residential boulevard", alt: "Residential boulevard with palms and planters" },
  { file: "qsgs-residential-12.webp", sector: "residential", title: "Curved residential tower", alt: "Curved residential tower on the waterfront" },
  { file: "qsgs-residential-13.webp", sector: "residential", title: "Harbour residences", alt: "Harbour-front residences with curved balconies" },
  { file: "qsgs-hospitality-07.webp", sector: "hospitality", title: "Cliff-top villa", alt: "Cliff-top villa with an infinity pool over the sea" },
  { file: "qsgs-commercial-08.webp", sector: "commercial", title: "Office courtyard", alt: "Office courtyard with olive trees and glazing" },
];

/** Home hero: photographic render + its depth map (R depth · G water · B foliage). */
export const heroMedia = {
  file: "qsgs-mixed-use-02.webp",
  depth: "qsgs-mixed-use-02-depth.png",
  /** R sky · G windows · B warm lights · A wet ground — used to relight the scene. */
  mask: "qsgs-mixed-use-02-mask.png",
  alt: "Marina residences with yachts, palm trees and a waterfront restaurant at golden hour",
};

const byFile = new Map(mediaItems.map((m) => [m.file, m]));

/** Public URL for a bucket image. */
export const mediaUrl = (file: string) => `/media/${file}`;

/** Image record by file name (throws early in development if a name is mistyped). */
export function img(file: string) {
  const m = byFile.get(file);
  if (!m) throw new Error(`Unknown media file: ${file}`);
  return { ...m, src: mediaUrl(file) };
}
