import type { Station } from './types'

/**
 * Stations are processed strictly in array order. Reorder, remove, or insert
 * freely — app logic reads `stations.length` and `stations[currentIndex]`,
 * never hardcoded indexes.
 *
 * Route (6 stops, Odeonsplatz → Marienplatz):
 *   Odeonsplatz · Hofgarten · Residenz · Platzl/Hofbräuhaus ·
 *   Viktualienmarkt · Marienplatz
 *
 * Coordinates are approximate Munich centroids; radii are intentionally
 * generous (60–80 m) to absorb urban GPS drift between buildings.
 *
 * Player-visible copy is German. Answers are accepted case-insensitively
 * after `.trim()` and ignore umlaut variants ("LOWE" passes "LÖWE").
 */
export const stations: Station[] = [
  {
    id: 'odeonsplatz',
    title: 'Der erste Datenpunkt',
    locationName: 'Odeonsplatz',
    lat: 48.1426,
    lng: 11.5773,
    radiusMeters: 70,
    story:
      'Die Nachricht aktiviert sich nur am richtigen Ort. Der Architekt glaubte: Jede Stadt beginnt dort, wo Macht, Bewegung und Geschichte sich kreuzen. Hier setzte er den ersten Datenpunkt.',
    riddle:
      'Zwei steinerne Wächter flankieren seit über hundert Jahren die Freitreppe der Feldherrnhalle. Welches Wappentier stellen sie dar?',
    hint: 'Bayerns Wappentier — es ziert unzählige Stadtwappen.',
    answer: 'LÖWE',
    badge: 'Löwe',
  },
  {
    id: 'hofgarten',
    title: 'Das stille Zentrum',
    locationName: 'Hofgarten',
    lat: 48.1432,
    lng: 11.5793,
    radiusMeters: 80,
    story:
      'Hier verklingt der Lärm. Der Architekt glaubte: Städte versteht man nicht nur durch Bewegung, sondern auch durch Pausen.',
    riddle:
      'Dem Pavillon im Zentrum des Gartens ist eine römische Göttin gewidmet. Wie heißt sie?',
    hint: 'Göttin der Jagd.',
    answer: 'DIANA',
    badge: 'Pavillon',
  },
  {
    id: 'residenz',
    title: 'Das Zeichen der Macht',
    locationName: 'Residenz / Max-Joseph-Platz',
    lat: 48.1394,
    lng: 11.5772,
    radiusMeters: 70,
    story:
      'Städte werden ebenso von Herrschern wie von Baumeistern geformt. Hier hinterlegte der Architekt Symbole von Autorität und Ordnung.',
    riddle:
      'Welches Herrschergeschlecht ließ die Residenz errichten und regierte Bayern über Jahrhunderte?',
    hint: 'Die bayerische Königsdynastie.',
    answer: 'WITTELSBACH',
    badge: 'Krone',
  },
  {
    id: 'platzl',
    title: 'Der Geschmack der Stadt',
    locationName: 'Platzl / Hofbräuhaus',
    lat: 48.1376,
    lng: 11.5798,
    radiusMeters: 70,
    story:
      'Der Architekt wusste: Eine Stadt schmeckt man, bevor man sie versteht. Am Platzl mischten sich über Jahre Bierdunst, Gewürze und Geschichten zu einer eigenen Sprache.',
    riddle:
      'Welcher Münchner Sternekoch betrieb hier am Platzl jahrelang seine Kochschule und ein ganzes Genuss-Imperium? (Nachname genügt)',
    hint: 'Berühmt für seine Gewürzmischungen.',
    answer: 'SCHUHBECK',
    badge: 'Kochlöffel',
  },
  {
    id: 'viktualienmarkt',
    title: 'Die Stimme des Marktes',
    locationName: 'Viktualienmarkt',
    lat: 48.1351,
    lng: 11.5762,
    radiusMeters: 70,
    story:
      'Identität lebt im Alltag, nicht in Denkmälern. Zwischen Ständen und Brunnen hörte der Architekt nicht auf Statuen, sondern auf das Lachen der Münchner.',
    riddle:
      'Ein Brunnen am Markt ehrt einen legendären Münchner Komiker mit Melone und langer Nase. Wie hieß er? (Nachname genügt)',
    hint: 'Münchner Komikerlegende, Partner von Liesl Karlstadt.',
    answer: 'VALENTIN',
    badge: 'Maibaum',
  },
  {
    id: 'marienplatz',
    title: 'Die Wächter der Säule',
    locationName: 'Marienplatz',
    lat: 48.1374,
    lng: 11.5755,
    radiusMeters: 70,
    story:
      'Im Herzen der Stadt steht eine goldene Säule. Zu ihren Füßen ringen steinerne Figuren mit den alten Plagen — ein Code aus Stein, den der Architekt nicht zufällig wählte.',
    riddle:
      'Am Fuß der Mariensäule kämpfen vier Putten gegen Bestien. Welches geflügelte Fabeltier verkörpert dort die Pest?',
    hint: 'Ein Hahn-Schlangen-Wesen der Sage.',
    answer: 'BASILISK',
    badge: 'Wasser',
  },
]
