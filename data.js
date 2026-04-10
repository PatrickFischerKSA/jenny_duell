window.JENNY_DUELL_DATA = {
  title: "Jenny - Das Duell",
  subtitle: "Kompakte Lerneinheit zum Motiv des Duells in Fanny Lewalds Roman",
  teacherPassword: "duell",
  teacherPasswordAliases: [
    "duell",
    "jenny duell",
    "fanny lewald",
    "jenny",
    "ehrbegriff"
  ],
  intro:
    "Die Einheit setzt voraus, dass der Roman bereits gelesen wurde. Sie bündelt die entscheidenden Textstellen und fokussiert nur auf das Motiv des Duells.",
  passages: [
    {
      id: "p1",
      shortLabel: "1",
      title: "Gegenfolie: Ehre und moralischer Mut",
      focus:
        "Noch vor der eigentlichen Duellszene formuliert Eduard eine Gegenposition zum ritualisierten Ehrbegriff.",
      quote:
        "»Leider lügt er nicht«, sagte Eduard ernsthaft, »wenn er von moralischem Mute spricht. Denn jene sogenannte Courage, die jeder Raufbold in sich erzwingt, um während eines Duells oder sonst einer Viertelstunde Parade zu machen, die schlage ich sehr gering an. Der Feigste, wenn er nur eitel genug ist, sich zu schämen, bringt das zustande. Aber der moralische Mut, der fehlt uns.«",
      source:
        "Fanny Lewald, Jenny, frühe Gesprächsszene um Courage, Ehre und gesellschaftlichen Mut"
    },
    {
      id: "p2",
      shortLabel: "2",
      title: "Auslöser: Beleidigung und Genugtuung",
      focus:
        "Die Begegnung beim Juwelier macht sichtbar, dass das Duell aus verletzter Standesehre und antisemitischer Herabsetzung hervorgeht.",
      quote:
        "»Meine Braut ist ein Fräulein Meier, die Tochter des Bankier Meier.« - »Ach, scherzen Sie nicht, ein Judenmädchen?« rief der Baron lachend. - »Sie hören aber, daß ich sie mache!« sagte Walter, heftig auffahrend, »und werden guttun, Ihre Verwunderung auf sich selbst zurückzuwenden, denn ich finde sie unverschämt.« ... »Der Unverschämte soll mir Genugtuung geben für die Beleidigung.«",
      source:
        "Fanny Lewald, Jenny, Juwelierszene und Entschluss zum Ehrenhandel"
    },
    {
      id: "p3",
      shortLabel: "3",
      title: "Ablauf: Sekundant, Verharmlosung, Treffen",
      focus:
        "Der alte Graf verhindert keine Eskalation, sondern stabilisiert den Ehrenkodex.",
      quote:
        "»Die Angelegenheit ist sehr fatal! Aber sie muß ernst und rasch beseitigt werden, darin stimme ich dir bei. Es ist das Beste, du weisest jede Vermittlung ab ... und damit man erfährt, wie deine Familie die Sache ansieht, will ich selber deinen Sekundanten machen.« ... »Ihr jungen Herren der jetzigen Zeit nehmt solche Dinge viel zu schwer. In meiner Jugend war das anders!«",
      source:
        "Fanny Lewald, Jenny, Vorbereitung des Duells am Abend vor dem Treffen"
    },
    {
      id: "p4",
      shortLabel: "4",
      title: "Folgen: Tod, Opfer, politische Deutung",
      focus:
        "Lewald zeigt nicht heroische Ehre, sondern Verwüstung: Walter stirbt, Jenny bricht zusammen, Eduard deutet das Geschehen politisch.",
      quote:
        "Am nächsten Tage verkündete die Zeitung: »Gestern fand hier ein Schuß-Duell ... statt, dessen Folgen für den Grafen tödlich waren.« ... Da richtete Eduard sich mächtig empor: »Wir leben«, sagte er, »um eine Zeit zu erblicken, in der keine solche Opfer auf dem Altare der Vorurteile bluten!«",
      source:
        "Fanny Lewald, Jenny, Nachgang des Duells und Grabrede Eduards"
    }
  ],
  teacherToolkit: {
    duration: "25 bis 35 Minuten",
    socialForms: [
      "Einzelarbeit mit sofortigem Feedback",
      "Partnerabgleich nach Frage 4 oder 5",
      "abschließender kurzer Austausch zur Transferfrage"
    ],
    assessmentFocus: [
      "textnahe Benennung des Auslösers statt allgemeiner Nacherzählung",
      "Unterscheidung zwischen äußerem Ehrcode und moralischem Mut",
      "historische Einordnung des Duells als Restform privater Gewalt",
      "Verknüpfung von Antisemitismus, Standesdenken und Konfliktform"
    ],
    misconceptions: [
      "Walter handle nur aus Liebe zu Jenny",
      "das Duell sei eine mutige oder ehrenhafte Lösung",
      "der alte Graf wirke deeskalierend",
      "die Szene habe nur private, nicht gesellschaftliche Bedeutung"
    ],
    product:
      "Kurzer Deutungstext: Warum erscheint das Duell im Roman als archaische Konfliktlösung?",
    extension:
      "Vergleich mit einem späteren Romanduell, etwa in Fontanes Effi Briest, oder mit Landfrieden und gerichtlicher Konfliktlösung."
  },
  questions: [
    {
      id: "q1",
      passageId: "p1",
      title: "Ehrbegriff prüfen",
      type: "short-text",
      challenge: "Grundlage",
      prompt:
        "Worin unterscheidet Eduard die „sogenannte Courage“ des Duells vom „moralischen Mut“?",
      help:
        "Nenne den Gegensatz zwischen äußerer Ehrparade und echtem politisch-ethischem Mut.",
      placeholder: "Eduard unterscheidet, dass ...",
      conceptGroups: [
        {
          label: "Duellcourage ist bloße äußere Parade",
          variants: ["parade", "aeussere parade", "äußere parade", "ritual", "scheinmut", "theatralisch", "auftritt"]
        },
        {
          label: "sie entsteht aus Eitelkeit oder Schamdruck",
          variants: ["eitelkeit", "scham", "schamdruck", "sozialer druck", "man will nicht feige wirken", "nicht blamieren"]
        },
        {
          label: "moralischer Mut heißt für Rechte und Gerechtigkeit einzustehen",
          variants: ["rechte", "gerechtigkeit", "moralischer mut", "politischer mut", "für sein volk", "für gleichstellung", "gegen unterdrueckung", "gegen unterdrückung"]
        }
      ],
      successThreshold: 2,
      modelAnswer:
        "Eduard trennt die Duellcourage als äußerliche, von Eitelkeit und Schamdruck getriebene Parade vom moralischen Mut, der wirklich für Rechte, Gerechtigkeit und gegen Unterdrückung eintritt.",
      teacherPrompt:
        "Wichtig ist die klare Gegenüberstellung: nicht Mut allgemein, sondern ein Gegensatz von ritualisierter Ehre und ethisch-politischer Haltung."
    },
    {
      id: "q2",
      passageId: "p2",
      title: "Auslöser genau benennen",
      type: "short-text",
      challenge: "Textnah",
      prompt:
        "Warum fordert Walter „Genugtuung“? Benenne den Auslöser möglichst genau.",
      help:
        "Die Antwort soll Jenny, den antisemitischen Ton und Walters verletzte Standesehre verbinden.",
      placeholder: "Walter fordert Genugtuung, weil ...",
      conceptGroups: [
        {
          label: "Jenny wird als Jüdin abgewertet",
          variants: ["judenmaedchen", "judenmädchen", "antisemitisch", "als judin abgewertet", "herabgesetzt", "beleidigung jennys", "verachtung"]
        },
        {
          label: "die Verlobung wird als standeswidrig verspottet",
          variants: ["stand", "standeswidrig", "verhältnisse", "sozialer abstieg", "rang", "adel", "standesehre"]
        },
        {
          label: "die Beleidigung ist öffentlich und ehrverletzend",
          variants: ["beleidigung", "oeffentlich", "öffentlich", "ehrverletzung", "vor anderen", "bloßstellung"]
        }
      ],
      successThreshold: 2,
      modelAnswer:
        "Walter fordert Genugtuung, weil der Baron Jenny antisemitisch herabsetzt, die Verlobung als standeswidrig verspottet und Walter damit öffentlich in seiner Ehre verletzt.",
      teacherPrompt:
        "Die Antwort soll nicht bei „weil er wütend ist“ stehen bleiben, sondern die antisemitische und ständische Dimension benennen."
    },
    {
      id: "q3",
      passageId: "p3",
      title: "Rolle des Onkels",
      type: "multi-select",
      challenge: "Analyse",
      prompt:
        "Welche Aussagen treffen auf den alten Grafen in der Vorbereitung des Duells zu?",
      help: "Wähle alle passenden Aussagen aus.",
      options: [
        {
          id: "o1",
          label: "Er weist Vermittlung ausdrücklich zurück."
        },
        {
          id: "o2",
          label: "Er übernimmt selbst die Rolle des Sekundanten."
        },
        {
          id: "o3",
          label: "Er erklärt das Duell für gesetzlich unzulässig und verbietet es."
        },
        {
          id: "o4",
          label: "Er verharmlost das Risiko des Duells."
        },
        {
          id: "o5",
          label: "Er will vor allem zeigen, wie die Familie die Sache auffasst."
        }
      ],
      correctOptionIds: ["o1", "o2", "o4", "o5"],
      explanation:
        "Der alte Graf verhindert das Duell nicht, sondern stabilisiert den Ehrkodex: keine Vermittlung, eigener Sekundant, Verharmlosung und demonstrative Familienhaltung.",
      modelAnswer:
        "Richtig sind: Vermittlung wird abgewiesen, der alte Graf wird Sekundant, er verharmlost das Risiko und denkt stark an die öffentliche Familienhaltung.",
      teacherPrompt:
        "Hier zeigt sich, dass die ältere Generation den Ehrenkodex nicht kritisch bricht, sondern traditionsgestützt weiterträgt."
    },
    {
      id: "q4",
      passageId: "p3",
      title: "Ablauf ordnen",
      type: "drag-order",
      challenge: "Struktur",
      prompt:
        "Ordne die Schritte des Geschehens vom Auslöser bis zur Katastrophe.",
      help: "Ziehe die Karten in eine sinnvolle Reihenfolge.",
      items: [
        { id: "i1", label: "Der Baron verspottet Walters Verlobung mit dem „Judenmädchen“." },
        { id: "i2", label: "Walter verlangt Genugtuung für die Beleidigung." },
        { id: "i3", label: "Der alte Graf weist Vermittlung zurück und wird Sekundant." },
        { id: "i4", label: "Am nächsten Morgen kommt es zum Schuss-Duell." },
        { id: "i5", label: "Walter wird tödlich verwundet und zu Jenny gebracht." },
        { id: "i6", label: "Eduard deutet das Geschehen als Opfer auf dem Altar der Vorurteile." }
      ],
      correctOrder: ["i1", "i2", "i3", "i4", "i5", "i6"],
      explanation:
        "Die Szene folgt konsequent der Logik des Ehrenhandels: Beleidigung, Genugtuung, Absage an Vermittlung, ritualisierte Austragung, Tod und nachträgliche Deutung.",
      modelAnswer:
        "Die richtige Reihenfolge führt von der antisemitischen Beleidigung über Genugtuung und Sekundantenrolle zum Duell, zum Tod Walters und schließlich zu Eduards Deutung.",
      teacherPrompt:
        "Die Ordnungsfrage sichert den Mechanismus des Ehrenhandels. Wichtig ist die Einsicht, dass Deutung und Kritik erst nach dem Vollzug einsetzen."
    },
    {
      id: "q5",
      passageId: "p4",
      title: "Folgen und Deutung",
      type: "short-text",
      challenge: "Vertiefung",
      prompt:
        "Welche Folgen hat das Duell, und wie deutet Eduard diese Folgen?",
      help:
        "Verbinde private Katastrophe und gesellschaftlich-politische Kritik.",
      placeholder: "Das Duell hat die Folge, dass ...",
      conceptGroups: [
        {
          label: "Walter stirbt",
          variants: ["walter stirbt", "tod walters", "toedlich", "tödlich", "verwundet und stirbt"]
        },
        {
          label: "Jenny zerbricht daran und stirbt ebenfalls",
          variants: ["jenny stirbt", "jenny bricht zusammen", "braut stirbt", "schmerz ueber seinen verlust", "schmerz über seinen verlust"]
        },
        {
          label: "Eduard deutet das als Opfer der Vorurteile",
          variants: ["vorurteile", "opfer", "altar der vorurteile", "gesellschaftliche kritik", "antisemitismus", "nicht nur privat"]
        }
      ],
      successThreshold: 2,
      modelAnswer:
        "Das Duell endet mit Walters Tod; Jenny zerbricht an dem Verlust und stirbt ebenfalls. Eduard deutet die Katastrophe deshalb nicht bloß privat, sondern als Opfer, das gesellschaftliche Vorurteile hervorgebracht haben.",
      teacherPrompt:
        "Ziel ist die Verbindung von Erzählfolge und Deutung: nicht nur Folgen nennen, sondern die politische Lesart ausdrücklich erfassen."
    },
    {
      id: "q6",
      passageId: "p4",
      title: "Archaische Konfliktlösung",
      type: "open-analysis",
      challenge: "Transfer",
      prompt:
        "Erkläre, warum das Duell in Lewalds Roman als archaische Form der Konfliktlösung erscheint. Beziehe den Ehrbegriff, den fehlenden Rückgriff auf juristische Konfliktlösung und die Folgen textnah ein.",
      help:
        "Arbeite mit den Auszügen und formuliere eine kurze, zusammenhängende Deutung mit historischem Kontext.",
      placeholder:
        "Das Duell erscheint als archaische Form der Konfliktlösung, weil ...",
      minWords: 85,
      sourceHints: ["genugtuung", "sekundant", "vorurteile", "moralischer mut", "beleidigung", "duell"],
      structureExpectations: {
        mandatory: ["thesis", "evidence"],
        targetHits: 4
      },
      rubric: [
        {
          concept: "private Gewalt statt rechtlicher Konfliktlösung",
          keywords: ["private gewalt", "selbsthilfe", "nicht vor gericht", "nicht juristisch", "statt recht", "statt gericht", "vorjuristisch"]
        },
        {
          concept: "Ehrcode und öffentliche Anerkennung",
          keywords: ["ehre", "ehrcode", "standesehre", "oeffentliche anerkennung", "öffentliche anerkennung", "genugtuung", "familie"]
        },
        {
          concept: "Antisemitische oder gesellschaftliche Vorurteile als Motor",
          keywords: ["antisemitisch", "vorurteile", "judenmaedchen", "judenmädchen", "abwertung", "standesdenken"]
        },
        {
          concept: "katastrophale Folgen widerlegen die Idee einer ehrenhaften Lösung",
          keywords: ["tod", "katastrophe", "walter stirbt", "jenny stirbt", "zerstoerung", "zerstörung", "keine loesung", "keine lösung"]
        },
        {
          concept: "Eduards Gegenmodell des moralischen Muts",
          keywords: ["moralischer mut", "rechte", "gerechtigkeit", "gegen unterdrueckung", "gegen unterdrückung", "nicht duell", "anderer mut"]
        }
      ],
      modelAnswer:
        "Das Duell erscheint archaisch, weil der Konflikt nicht durch Recht oder Vermittlung, sondern durch private Gewalt und Ehrlogik geregelt wird. Die Forderung nach Genugtuung reagiert auf eine öffentliche, antisemitisch aufgeladene Beleidigung. Der alte Graf stützt diese Logik noch, indem er Vermittlung ablehnt und selbst Sekundant wird. Dadurch wird nicht Gerechtigkeit hergestellt, sondern eine ritualisierte Form von Selbsthilfe vollzogen. Eduards frühere Unterscheidung zwischen bloßer Duellcourage und moralischem Mut bildet die Gegenfolie: Wahre Größe läge im Einsatz für Rechte und gegen Vorurteile. Das Duell endet dagegen in Tod und Zerstörung und entlarvt den Ehrbegriff als menschenfeindliche soziale Fessel.",
      teacherPrompt:
        "Die Transferleistung soll aus mehreren Textstellen synthetisieren und den Schritt von der Szene zur historischen Einordnung leisten."
    }
  ]
};
