import type { Station } from './types'

/**
 * Route (6 Stopps, Escher Str. 30 → Gneisenaustr. 17, Köln-Nippes):
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
      'Es gibt sie seit Jahrzehnten, und jede Kölnerin und jeder Kölner kennt mindestens eines davon auswendig: die kölschen Grundgesetze. Wie viele gibt es insgesamt?',
    hint: 'Artikel 1 lautet: „Et is, wie et is."',
    answer: 'ELF',
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
      'Zwischen Schläuchen, Sätteln und Speichen wartet die nächste Frage – natürlich mit kölschem Bezug zum Wasser nebenan.',
    riddle:
      'Viele Kölner Radtouren führen an einem berühmten Fluss entlang, der die Stadt in zwei Hälften teilt. Wie heißt dieser Fluss?',
    hint: 'Auf der einen Seite die Altstadt, auf der anderen "Schäl Sick".',
    answer: 'RHEIN',
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
      'Bei Kaffee und Kuchen wartet ein Rätsel über das bekannteste Wahrzeichen der Stadt.',
    riddle:
      'Es hat zwei markante Türme, ist Weltkulturerbe und das Wahrzeichen der Stadt Köln schlechthin. Wie heißt dieses Bauwerk?',
    hint: 'Er ist die meistbesuchte Sehenswürdigkeit Deutschlands.',
    answer: 'DOM',
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
      'In welchem Kölner Stadtteil (auf Kölsch auch "Veedel" genannt) befindet ihr euch gerade?',
    hint: 'Der Stadtteil grenzt an Ehrenfeld und ist für seinen Wochenmarkt bekannt.',
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
