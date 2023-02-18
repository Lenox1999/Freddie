# Economy Bot

## Featurepläne

- Level-System >> XP durch Events wie Daily Reward, Fische verkaufen, Shopkäufe, ... (benötigte Level XP verdoppeln sich pro Level (Lvl 1 200XP, Lvl 2 400XP, ...))
- Coin-System >> Durch Fische Verkaufen, Lotterie
- Du bekommst ("Fische") durch Nachrichten schreiben und Zeit in Voice Channel (Cooldowns: Zwischen collecten)
- Daily (Tägliche Belohnungen) >> Login Reward (alle 24h?) Tages-Streaks?
- Coin-Multiplier (12h, 24h, 48h) mit versch. Werten (1.5x, 2x, ...)
- "Fische" haben wechselkurs (er ändert sich alle 12h) (Fische haben an sich keinen Wert abgesehen vom Verkaufswert) Wechselkurs wird bei Aktualisierung immer in Channel gepostet
- Gears (Angel: Mehr Fische durch Nachrichten, Köder: Mehr Fische durch VC, Messer: Cooldown beim Schreiben verringern, Eimer: Cooldown im VC verringern, Boot: Zeit für Fischen verringern, Schwarzmarkt: Verbesserte Fischverkaufspreise => 75% Nicht aufliegen, 15% Auffliegen)
- Items()
- geld leaderboard (geld kann durch Fische gekauft werden)
- Lotterie: Slots (Einsatz (Unter- und Obergrenzen) -> Random Spining 3 nebeneinander -> Gewinn: 3 Nebeneinander, kein Verlust bei 2 Nebeneinander )
- Spin: Einsatz + aus Früchten aussuchen -> random Frucht -> wenn Frucht mit deiner gewählten übereinstimmt = Gewinn
- (später) items sammeln durch käufe im shop -> verschiedene Seltenheiten (verschieden teure Lootboxen)

## Commands

- /help -> Credits, Liste aller Commands - Done
- /bal -> Geld + Fische + Streak + aktive Multiplier + Fähigkeiten - Done
- /daily -> Infos über Daily Reward - Done
- /level -> Infos über Level - Done
- /top10 (bal/lvl) -> zum einen: XP-Top10(basierend auf Levels) zum anderen: Geld-Top10 - Done
- /sell -> Fische verkaufen -> Geld - Done
- /spin -> spin lotterie starten - Done
- /slots -> slots lotterie starten - Done

- /gear -> zeigt Fischerausrüstung
- /cooldowns -> zeigt Fischcooldowns
- /fishing -> jede 4 Stunden kannst du fischen gehen (Mehr Fische bekommen)
- /exch -> Fischwechselkurs anzeigen
- /shop -> kaufe Fischausrüstung und Items (Ohne Argument: Shop anzeigen, Mit Argument: bestimmtes item kaufen)
- /use -> Benutze ein Item

## Changelog
- Burger werden zu Fischen umgeändert

## Featureideen

- Items nur für Fische 
- /rob -> Anderen User ausrauben (nur alle 24h) -> 50% um 2% der coins eines users zu bekommen -> 50% um geschnappt zu werden und 20% deiner coins zu verlieren
- -> ein user kann nur alle 10 Tage ausgeraubt werden (Schutz kann für Geld gekauft werden)

- /event -> Boss spawnt und der kann mit den eigenen Items angegriffen werden (Community event) (Boss hat leben und basierend auf Zugefügten schaden Leaderboard -> Belohnungen)
- In Help Command Github für Bugs hinzufügen (als Issue)
- /stocks -> in virtuelle Aktien investieren
  ... more to come ...
