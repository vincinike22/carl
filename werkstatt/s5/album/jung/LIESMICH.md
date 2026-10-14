# Zweites Album · Freundschaftsbuch (jung, s5)
Zurückholen: `atlas_s4.js|css` (Stand s4, 12 Seiten) nach `src/module/atlas.*` kopieren, oder einzelne `BAU.<seite>` daraus übernehmen.
- Innendeckel mit gepresstem Keimblatt („Dieses Buch gehört … und Carl“) – `BAU.titel`
- Lieblingsdinge (8 Freundebuch-Zeilen, `S.atlas.lieb`) – `BAU.lieblings`
- Das mag ich an dir (Carl zählt, was er gesehen hat) – `BAU.mag`, `carlMag()`
- Was ich für dich tue (tun / nie aus der Bibliothek) – `BAU.fuerdich`; die Einträge stehen weiter in „Was ich von dir weiß“
- Pläne mit „In einen Space legen“ – `BAU.plaene`, `waehleSpace()`
- Unser Jahr als eigene Seite mit „Ein Wort für den Monat“ – `BAU.jahr` (die Monatsleiste lebt in Damals weiter)
- Briefe an Carl – `BAU.brief` (es gibt nur noch Carls einen Brief)
- Dein Gerät: Hardware-Chips mit Carls Sätzen, „Carl schaut selbst nach“, Merkzettel – `geraetSeite()`
- Claude Code in 7 Schritten mit Befehlen aus der Doku – `BAU.code` (die Lehre lebt in der Helferecke)
- Stempelwahl, Hinterdeckel, Inhaltsmenü (schon in s4 gestrichen)
Alte Daten (`S.atlas.briefe|plaene|lieb|jahr|mag|geraet`) bleiben gespeichert, sichtbar als „Ältere Buchseiten“ und dort löschbar.
