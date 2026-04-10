# jenny_duell

Eigenständige, statische Lerneinheit zu Fanny Lewalds *Jenny* mit Fokus auf das Motiv des Duells.

Die Seite ist bewusst kompakt gehalten und konzentriert sich nur auf dieses eine Motiv. Sie eignet sich für den direkten Einsatz nach der gemeinsamen Lektüre des Romans oder nach einer bereits erfolgten thematischen Erarbeitung im Unterricht.

## Inhalt

- vier textnahe Auszüge zur Duellszene
- kurze Analysefragen mit Sofortfeedback
- Synonymerkennung bei Freitextantworten
- Transferaufgabe zum Duell als archaischer Konfliktlösung
- lokale Schülerprofile im Browser
- freischaltbare Lehreransicht
- lokales Lehrerdashboard mit Profilübersicht

## Dateien

- [index.html](/Users/patrickfischer/Documents/New project/jenny_duell/index.html)
- [data.js](/Users/patrickfischer/Documents/New project/jenny_duell/data.js)
- [app.js](/Users/patrickfischer/Documents/New project/jenny_duell/app.js)
- [styles.css](/Users/patrickfischer/Documents/New project/jenny_duell/styles.css)

## Lokal öffnen

Da die Einheit rein statisch ist, reicht es in der Regel, [index.html](/Users/patrickfischer/Documents/New project/jenny_duell/index.html) direkt im Browser zu öffnen.

Alternativ kann ein einfacher lokaler Server verwendet werden, zum Beispiel:

```bash
cd "/Users/patrickfischer/Documents/New project/jenny_duell"
python3 -m http.server 8080
```

Dann ist die Seite unter `http://127.0.0.1:8080` erreichbar.

## Lehrer*innenzugang

Standardpasswort lokal:

- `duell`

Akzeptierte Aliase:

- `jenny duell`
- `fanny lewald`
- `jenny`
- `ehrbegriff`

## GitHub Pages

Das Repo ist für GitHub Pages vorbereitet. Nach dem Push auf GitHub kann in den Repository-Einstellungen unter `Pages` die Quelle `GitHub Actions` gewählt werden.

Die mitgelieferte Workflow-Datei veröffentlicht die statische Seite automatisch.
