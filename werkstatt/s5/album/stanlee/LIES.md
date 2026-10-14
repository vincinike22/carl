# Zweites Album · Garage (stan-lee, s5)
Zurückholen: `fahrrad_s4.js.txt`, `laden_s4.js.txt`, `garage_s4.css.txt` (Stand s4) nach `src/raeume/fahrrad.js|laden.js|garage.css` kopieren, oder die Stücke einzeln übernehmen.
- Radteile binden Spaces („Daran binde ich, woran du gerade baust“): `spaces()`, `neuerSpace()`, `binde()/loese()`, Abschnitt „Dein Space hier“ in `malBlatt()`, farbige Punkte `c6s-gebunden` (fahrrad_s4). Die Daten `S.rad.teile` bleiben gespeichert.
- „Alle zehn, halt dich fest“: Carl fährt auf dem Rad, wenn alle zehn Teile gebunden sind: `pruefeZehn()`, `fahren()`, `setzeAufsRad()` (fahrrad_s4).
- Münze am Tag neben dem Rad (`fund`, `S.fundTag`): fällt weg, weil Münzen nur noch aus dem Kieselpark kommen (fahrrad_s4).
- Schrankreihen Jacken, Fell und Wimpern: `jacke()`, `fellMuster()`, `wimper()/wimpernSvg()`, 18 Artikel, Kartenbilder, Sätze (laden_s4). Wer sie trug, trägt sie nicht mehr (`S.laden.an.jacke|fell|wimpern` bleiben gespeichert, werden aber nicht gezeigt).
