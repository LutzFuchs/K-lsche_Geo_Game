# Cartoon hero images — swap guide

Out of the box every screen ships an inline SVG illustration drawn in code (see `src/components/StationHero.tsx`). They're recognizable but stylized. If you want richer Midjourney / Imagen / DALL·E art on the day, you can drop bitmap files into `public/heroes/` and the app will use them with zero code changes.

> **Right now the slot is wired but the bitmap fallback is *off* by default — flip the constant in `src/components/StationHero.tsx` after dropping files.** See "Step 3" below.

---

## Step 1 · Generate the art

Use the prompts below. They're tuned for **landscape 1200×600** at modest detail so they render fast on phones in sunlight. Match aspect ratio exactly — anything taller crops the landmark out of frame.

Style anchors that should appear in **every** prompt to keep the seven heroes feeling like one set:

> *cartoon illustration, flat colors with subtle shading, rounded shapes, warm friendly mood, no text, no people, no logos, hand-drawn line work, slightly storybook, vibrant but not neon, bright daylight scene, golden-hour palette, 1200×600 wide aspect ratio, centered hero composition*

### Per-station prompt seeds

Paste the style block above + the station-specific seed:

**1 · Odeonsplatz** (`odeonsplatz`)
> "Cartoon illustration of the Feldherrnhalle in Munich, three large stone arches with proud lion statues at the base, sandstone facade, dawn peach sky with small fluffy clouds, sun cresting over the roofline, cobblestones in the foreground."

**2 · Theatinerkirche** (`theatinerkirche`)
> "Cartoon illustration of the Theatinerkirche München, bright canary-yellow baroque facade, twin bell towers with green copper domes, central larger dome, blue sky with one cloud, golden cross on top."

**3 · Hofgarten** (`hofgarten`)
> "Cartoon illustration of the Diana-Tempel pavilion at the center of the Hofgarten in Munich, octagonal columned rotunda with a copper-bronze dome, Diana statue silhouette on top, surrounded by green hedges and trees, sunny meadow palette, gravel path arcing into the foreground."

**4 · Residenz** (`residenz`)
> "Cartoon illustration of Munich's Residenz palace at twilight, long classical facade with arched gateway and triangular pediment, glowing yellow windows, deep blue-purple sky transitioning to warm orange near horizon, a golden royal crown floats above the entrance, scattered stars."

**5 · Platzl / Hofbräuhaus** (`platzl`)
> "Cartoon illustration of the Hofbräuhaus on Platzl in Munich, warm tan facade with red tile roof, the iconic round white HB sign in the middle, arched stone-lit windows, beer stein with foam in the foreground corner, cobblestone alley, late-afternoon golden light."

**6 · Viktualienmarkt** (`viktualienmarkt`)
> "Cartoon illustration of the Maibaum at Viktualienmarkt in Munich, tall white-and-blue spiral-striped maypole crowned with a green wreath and gold ornament, two flanking market stalls with blue-and-white striped awnings, baskets of red and yellow produce, friendly Bavarian sky-blue background."

**7 · Marienplatz** (`marienplatz`)
> "Cartoon illustration of Marienplatz with the Neues Rathaus tower at golden-hour sunset, dramatic dark silhouette of the gothic clock tower with glowing yellow clock face, smaller flanking facades, the Mariensäule column with the gold lion at its base in the foreground, warm peach-to-red sky, scattered stars beginning to appear."

### Welcome / lobby skyline (`munich-skyline`)
> "Cartoon illustration of the Munich skyline silhouetted at golden hour: Frauenkirche twin onion-dome towers on the left, Neues Rathaus clock tower in the center with a glowing gold clock face, Theatinerkirche dome on the right, soft purple silhouette hills behind, peach sky fading to pale blue, 2 small clouds, generous wide composition."

### Final podium (`final-crest`) — optional
> "Cartoon illustration of a heraldic gold Munich lion crest on a deep tomato-red banner background, simple, badge-like, with subtle starburst rays radiating from behind the lion, no text."

---

## Step 2 · Save the files

Save each result as a **WebP** (or PNG/JPEG) at exactly **1200×600**, named after the station id:

```
public/
└── heroes/
    ├── munich-skyline.webp
    ├── odeonsplatz.webp
    ├── theatinerkirche.webp
    ├── hofgarten.webp
    ├── residenz.webp
    ├── platzl.webp
    ├── viktualienmarkt.webp
    ├── marienplatz.webp
    └── final-crest.webp        # optional
```

WebP at quality 80 lands at ~70–120 KB per image. If you ship all 9 that's < 1 MB total — fine for an outdoor mobile event over LTE.

If you'd rather use PNG, optimize them first (`pngquant --quality=70-85 *.png`).

---

## Step 3 · Turn on the bitmap layer

Open `src/components/StationHero.tsx` and add a constant near the top:

```ts
const USE_BITMAP_HEROES = true
```

Then change the export to prefer the bitmap when present, falling back to the inline SVG:

```tsx
export function StationHero({ stationId }: { stationId: string }) {
  if (USE_BITMAP_HEROES) {
    return (
      <img
        src={`/heroes/${stationId}.webp`}
        alt=""
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover"
      />
    )
  }
  const Hero = HEROES[stationId] ?? Odeonsplatz
  return <Hero />
}
```

Same pattern for `MunichSkyline`. Build, redeploy. Done.

---

## Tips

- **Keep faces and people out** of the prompts. They date faster than buildings and the AI struggles with crowds at small scale.
- **Avoid text in the image.** The dark gradient overlay puts the German station title and badge text in front; another text layer underneath fights it.
- **Stay in daylight.** The hero sits behind a *Locked / Unlocked / Solved* card. Dark or moody illustrations make the card text harder to read in bright outdoor sun.
- **Test on a phone in sunlight** before the event. A scene that looks great on a calibrated monitor can wash out completely outdoors. If a particular hero is too pale, redo it with the prompt anchor *"saturated cartoon colors, high contrast"*.
- **Don't generate more than once per landmark.** If a participant tabs back and forth between stations, the same hero loading from cache feels intentional. Random variants per visit feels broken.
