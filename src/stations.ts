import type { Station } from './types'

/**
 * Route (5 Stopps, Escher Str. 30 → Gneisenaustr. 17, Köln-Nippes):
 *   St. Joseph · Lutherkirche · Café Wölkchen · Wilhelmplatz · Haus Schnackertz
 */
export const stations: Station[] = [
  {
    id: 'st-joseph',
    title: 'Der stille Wächter',
    locationName: 'St. Joseph Kirche',
    lat: 50.9572581,
    lng: 6.9447206,
    radiusMeters: 60,
    story:
      'Kurz nach dem Start führt der Weg an einer Kirche vorbei, die einem stillen Handwerker gewidmet ist.',
    riddle:
      'Der Namenspatron dieser Kirche war im Neuen Testament Zimmermann und Ehemann einer besonderen Frau. Wie hieß seine Frau?',
    hint: 'Sie gilt als Mutter Jesu.',
    answer: 'MARIA',
    badge: 'Werkzeug',
  },
  {
    id: 'lutherkirche',
    title: 'Die 95 Thesen',
    locationName: 'Lutherkirche',
    lat: 50.9617061,
    lng: 6.9490506,
    radiusMeters: 60,
    story:
      'Diese Kirche trägt den Namen eines Mannes, der die Kirche für immer verändert hat.',
    riddle:
      'Er schlug 1517 seine 95 Thesen an die Tür der Wittenberger Schlosskirche und löste damit die Reformation aus. Wie lautet sein Vorname?',
    hint: 'Auch eine Rose ist nach ihm benannt.',
    answer: 'MARTIN',
    badge: 'Feder',
  },
  {
    id: 'cafe-woelkchen',
    title: 'Etwas Flauschiges',
    locationName: 'Café Wölkchen',
    lat: 50.9624790,
    lng: 6.9511988,
    radiusMeters: 50,
    story:
      'Der Name dieses Cafés erinnert an etwas Weiches, das hoch am Himmel schwebt.',
    riddle:
      'Wonach ist dieses Café benannt — ein flauschiges Gebilde, das man bei schönem Wetter am Himmel sieht?',
    hint: 'Verkleinerungsform von etwas, das vor Regen warnt.',
    answer: 'WOLKE',
    badge: 'Wölkchen',
  },
  {
    id: 'wilhelmplatz',
    title: 'Der letzte Kaiser',
    locationName: 'Wilhelmplatz',
    lat: 50.9631139,
    lng: 6.9523664,
    radiusMeters: 60,
    story:
      'Dieser Platz trägt den Namen eines deutschen Monarchen, dessen Herrschaft mit dem Ende des Kaiserreichs 1918 endete.',
    riddle:
      'Wie lautet der Vorname des letzten deutschen Kaisers, der von 1888 bis 1918 regierte?',
    hint: 'Er dankte nach dem Ersten Weltkrieg ab und ging ins Exil.',
    answer: 'WILHELM',
    badge: 'Krone',
  },
  {
    id: 'haus-schnackertz',
    title: 'Kölsche Tradition',
    locationName: 'Haus Schnackertz',
    lat: 50.9643172,
    lng: 6.9561485,
    radiusMeters: 50,
    story:
      'Fast am Ziel wartet ein Traditionshaus, das echtes Kölsch ausschenkt — das Bier, das nur im Kölner Raum so heißen darf.',
    riddle:
      'Wie heißt das schlanke, 0,2-Liter-Glas, aus dem Kölsch traditionell serviert wird?',
    hint: 'Es ist deutlich schmaler als ein normales Bierglas.',
    answer: 'STANGE',
    badge: 'Glas',
  },
]
