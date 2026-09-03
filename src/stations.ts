import type { Station } from './types'

/**
 * Route (5 Stopps, Escher Str. 30 → Gneisenaustr. 17, Köln-Nippes):
 *   St. Joseph · Radlager · Café Wölkchen · Wilhelmplatz · Haus Schnackertz · Ziel
 *
 * `locationHint` wird angezeigt, solange die Station noch NICHT erreicht ist.
 * `locationName` erscheint erst danach — Teams müssen den Ort selbst erraten.
 */
export const stations: Station[] = [
  {
    id: 'st-joseph',
    title: 'Der stille Wächter',
    locationName: 'St. Joseph Kirche',
    locationHint: 'Geht zur nächsten Kirche, die den Namen von Jesus Vater trägt',
    lat: 50.9572581,
    lng: 6.9447206,
    radiusMeters: 60,
    story:
      'Ihr steht vor einer Kirche im Herzen des Veedels. Bevor es weitergeht, verlangt der Ort ein Stück kölsche Lebensweisheit von euch.',
    riddle:
      'Sie wiegt rund 24 Tonnen, wurde 1923 in Apolda gegossen und ist bis heute die tontiefste freischwingende Glocke der Welt. Ihr Kölscher Spitzname lautet "decke Pitter". Wie heißt sie offiziell?',
    hint: 'Sie hängt im Südturm des Doms und läutet nur zu besonderen Anlässen.',
    answer: 'PETERSGLOCKE',
    badge: 'Kirchturm',
  },
  {
    id: 'radlager',
    title: 'Zwei Räder, ein Ziel',
    locationName: 'Radlager',
    locationHint: 'Wo bekommt man hier gute Zweiräder her?',
    lat: 50.9599843,
    lng: 6.9494099,
    radiusMeters: 50,
    story:
      'Zwischen Schläuchen, Sätteln und Speichen wartet die nächste Frage – natürlich mit kölschem Bezug zum Sport auf zwei Rädern.',
    riddle:
      'Dieses Kölner Traditions-Sportevent auf einer Steilkurven-Bahn findet seit 1911 fast jährlich in einer Kölner Arena statt – Radprofis fahren dabei sechs Tage und Nächte am Stück im Team gegeneinander. Wie heißt diese Veranstaltung?',
    hint: 'Der Name verrät schon, wie viele Tage sie dauert.',
    answer: 'SECHSTAGERENNEN',
    badge: 'Fahrrad',
  },
  {
    id: 'cafe-woelkchen',
    title: 'Etwas Flauschiges',
    locationName: 'Café Wölkchen',
    locationHint: 'Wo haben Henry und Niklas schon mal Geburtstag gefeiert?',
    lat: 50.9624790,
    lng: 6.9511988,
    radiusMeters: 50,
    story:
      'Bei Kaffee und Kuchen wartet ein Rätsel über eine besonders kölsche Tradition des gemeinsamen Feierns.',
    riddle:
      'Diese bekannteste Mitsing-Bewegung Kölns nahm Ende der 1990er in der Küche eines Nippeser Seelsorgers ihren Anfang und lässt bis heute ganze Konzertsäle gemeinsam Kölsche Lieder schmettern. Wie heißt sie (drei Wörter)?',
    hint: 'Wörtlich übersetzt: "Lasst uns singen".',
    answer: 'LOSS MER SINGE',
    badge: 'Wölkchen',
  },
  {
    id: 'wilhelmplatz',
    title: 'Marktplatz des Veedels',
    locationName: 'Wilhelmplatz',
    locationHint: 'Wo ist der Nippeser Markt?',
    lat: 50.9631139,
    lng: 6.9523664,
    radiusMeters: 60,
    story:
      'Mitten auf dem Platz, zwischen Marktständen und Kölschem Geplauder, wartet die nächste Frage zu eurem Standort.',
    riddle:
      'Ihr steht gerade in dem Kölner Stadtbezirk, der auch den Zoo, die Flora und den Stadtteil Riehl umfasst und nach seinem bevölkerungsreichsten Stadtteil benannt ist. Wie heißt dieser Stadtbezirk?',
    hint: 'Er grenzt südlich an Ehrenfeld und die Kölner Innenstadt.',
    answer: 'NIPPES',
    badge: 'Marktkorb',
  },
  {
    id: 'haus-schnackertz',
    title: 'Kölsche Tradition',
    locationName: 'Haus Schnackertz',
    locationHint: 'Wo gibt es seit 1912 leckeres Essen, wo man zuerst durch eine bronzene Tür muss',
    lat: 50.9643172,
    lng: 6.9561485,
    radiusMeters: 50,
    story:
      'Fast am Ziel wartet ein Traditionshaus, das echtes Kölsch ausschenkt — das Bier, das nur im Kölner Raum so heißen darf.',
    riddle:
      'Wie heißt das schlanke, 0,2-Liter-Glas, aus dem Kölsch traditionell serviert wird?',
    hint: 'Es ist deutlich schmaler als ein normales Bierglas.',
    answer: 'STANGE',
    badge: 'Stange',
  },
]
