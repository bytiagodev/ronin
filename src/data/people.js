// Short profiles about Musashi's relationships and the political conditions of his life.
export const people = [
  {
    id: 'nobunaga',
    name: 'Oda Nobunaga',
    kanji: '織田信長',
    years: '1534-1582',
    role: 'The commander whose death reopened the struggle for power',
    cardDescription:
      'His death at Honnōji left the contest for power unresolved as Musashi’s generation grew up.',
    description:
      'Nobunaga died around the time Musashi was born. His campaigns and unfinished succession shaped Musashi’s early world.',
    epithet: 'Before Musashi’s first duel',
    introduction: [
      'Oda Nobunaga belongs in Musashi’s story because of the country he helped change. His campaigns drew central Japan under a concentration of military power, but his death in 1582 left that project unfinished. Musashi grew up while other leaders fought over what came next.',
    ],
    facts: [
      { label: 'Region', value: 'Owari, Mino and central Japan' },
      { label: 'Period', value: '1534-1582' },
      { label: 'Position', value: 'Daimyō and expanding military ruler' },
      { label: 'Connection', value: 'His wars shaped the political world of Musashi’s childhood' },
    ],
    sections: [
      {
        id: 'building-power',
        title: 'A larger scale of warfare',
        paragraphs: [
          'Nobunaga’s victory over Imagawa Yoshimoto at Okehazama in 1560 strengthened his position beyond Owari. He captured Inabayama Castle in 1567, renamed it Gifu, and made it a base for further expansion. Regional fighting increasingly fed into a struggle for authority across the central provinces.',
          'These campaigns depended on armies, alliances and the ability to hold territory. They provide the background to Musashi’s later distinction between fighting one opponent and understanding strategy more broadly. The young swordsman inherited a society in which military skill had consequences for households and provinces as well as individuals.',
        ],
        sourceIds: ['nobunaga-gifu'],
      },
      {
        id: 'the-death-at-honnoji',
        title: 'An unfinished succession',
        paragraphs: [
          'In 1582, Akechi Mitsuhide turned against Nobunaga and attacked him at Honnōji in Kyoto. Nobunaga died. His ally Tokugawa Ieyasu, then away from his own territory, hurried back toward Okazaki. The sudden death of a dominant commander placed even established allies in danger.',
          'Toyotomi Hideyoshi emerged from the ensuing struggle as the strongest claimant to Nobunaga’s position. Ieyasu would later challenge the settlement following Hideyoshi’s death. Musashi’s childhood and early adulthood unfolded through these changes of allegiance and authority, rather than within an already secure Tokugawa peace.',
        ],
        sourceIds: ['nobunaga-honnoji', 'nobunaga-succession'],
      },
    ],
    timeline: [
      {
        year: '1560',
        title: 'Okehazama',
        description: 'Nobunaga defeats Imagawa Yoshimoto and strengthens his regional position.',
      },
      {
        year: '1567',
        title: 'A base at Gifu',
        description: 'He captures Inabayama Castle and renames it Gifu.',
      },
      {
        year: '1582',
        title: 'Death at Honnōji',
        description: 'Mitsuhide’s attack ends Nobunaga’s rule and opens a contest for succession.',
      },
    ],
    legacy: {
      title: 'The wars before Musashi',
      paragraphs: [
        'Nobunaga explains the scale of the conflict surrounding Musashi’s beginnings. His conquests helped make unification possible, while his abrupt death ensured that the next generation would still face war over who should govern.',
      ],
    },
    evidenceNote:
      'The connection is political context, rather than a documented personal relationship with Musashi.',
    relatedIds: ['ieyasu', 'tadatoshi'],
    sources: [
      {
        id: 'nobunaga-gifu',
        title: 'Gifu City: Past lords of Gifu Castle',
        url: 'https://www.city.gifu.lg.jp/kankoubunka/kankou/1013051/1005097/1034742/1034744.html',
        note: 'Municipal account of Nobunaga’s expansion and his base at Gifu.',
      },
      {
        id: 'nobunaga-honnoji',
        title: 'National Archives of Japan: Honnōji',
        url: 'https://www.archives.go.jp/exhibition/digital/ieyasu/contents1_07/',
        note: 'The attack of 1582 and Ieyasu’s return through Iga. Japanese.',
      },
      {
        id: 'nobunaga-succession',
        title: 'National Archives of Japan: Komaki and Nagakute',
        url: 'https://www.archives.go.jp/exhibition/digital/ieyasu/contents2_01/',
        note: 'The struggle for Nobunaga’s succession and the rise of Hideyoshi. Japanese.',
      },
    ],
  },
  {
    id: 'ieyasu',
    name: 'Tokugawa Ieyasu',
    kanji: '徳川家康',
    years: '1543-1616',
    role: 'Founder of the shogunate under which Musashi grew older',
    cardDescription: 'The Tokugawa settlement changed how a skilled swordsman could earn a living.',
    description:
      'Sekigahara and the Osaka campaigns changed the opportunities available to men like Musashi, from military service to teaching and patronage.',
    epithet: 'The ruler behind the change from war to peace',
    introduction: [
      'Tokugawa Ieyasu’s victories changed the conditions of Musashi’s working life. Musashi came of age while rival coalitions fought for power. By the time he settled in Kumamoto, the Tokugawa house governed from Edo and regional lords served within its political order.',
    ],
    facts: [
      { label: 'Region', value: 'Mikawa, the Kantō and the government at Edo' },
      { label: 'Period', value: '1543-1616' },
      { label: 'Position', value: 'Founder of the Tokugawa shogunate' },
      {
        label: 'Connection',
        value: 'His settlement shaped Musashi’s prospects for service and teaching',
      },
    ],
    sections: [
      {
        id: 'the-victory-at-sekigahara',
        title: 'A new centre of authority',
        paragraphs: [
          'After Hideyoshi’s death, Ieyasu gained influence within the government left to support the young Toyotomi Hideyori. Opposition developed into armed conflict. At Sekigahara in 1600, Ieyasu’s coalition defeated the forces opposing him, allowing him to reshape the distribution of land and power.',
          'His appointment as shōgun in 1603 gave that authority an established political form. Musashi was still a young man. Finding a place as a warrior now depended increasingly on relationships with households that had survived the settlement, rather than simply on the availability of another provincial war.',
        ],
        sourceIds: ['ieyasu-sekigahara'],
      },
      {
        id: 'the-last-toyotomi-campaigns',
        title: 'Osaka and a swordsman’s livelihood',
        paragraphs: [
          'The Toyotomi position at Osaka remained a competing centre. In 1614, masterless warriors gathered in the castle as Tokugawa forces surrounded it. A winter agreement failed to settle the conflict. The renewed campaign of 1615 ended with the destruction of Toyotomi resistance and the deaths of Hideyori and his mother.',
          'The peace that followed narrowed the demand for men seeking advancement through campaigns. Some warriors had lost their masters; others needed different work. Musashi’s later pursuit of pupils, patrons and a settled place in Kumamoto belongs to this changing economy of service. Swordsmanship could be taught and studied even when large wars became less frequent.',
        ],
        sourceIds: ['ieyasu-osaka', 'ieyasu-peace'],
      },
    ],
    timeline: [
      {
        year: '1600',
        title: 'Sekigahara',
        description: 'Ieyasu’s coalition wins the decisive confrontation with its opponents.',
      },
      {
        year: '1603',
        title: 'Appointed shōgun',
        description: 'A new military government is established at Edo.',
      },
      {
        year: '1614-15',
        title: 'The Osaka campaigns',
        description: 'Tokugawa forces remove the Toyotomi as a competing centre of power.',
      },
      {
        year: '1616',
        title: 'Death at Sunpu',
        description: 'Ieyasu dies, leaving the government in Tokugawa hands.',
      },
    ],
    legacy: {
      title: 'A different demand for military skill',
      paragraphs: [
        'Musashi outlived Ieyasu by almost thirty years. The older swordsman’s writing, painting and teaching took place within the peace built after these campaigns, where military status continued but employment and patronage mattered as much as a reputation won in combat.',
      ],
    },
    evidenceNote:
      'Musashi’s disputed participation at Sekigahara and Osaka is addressed in the main life narrative.',
    relatedIds: ['nobunaga', 'iori'],
    sources: [
      {
        id: 'ieyasu-sekigahara',
        title: 'National Archives of Japan: Sekigahara',
        url: 'https://www.archives.go.jp/exhibition/digital/ieyasu/contents3_01/',
        note: 'The post-Hideyoshi conflict, the victory of 1600 and the appointment of 1603. Japanese.',
      },
      {
        id: 'ieyasu-osaka',
        title: 'National Archives of Japan: Osaka winter and summer campaigns',
        url: 'https://www.archives.go.jp/exhibition/digital/ieyasu/contents5_04/',
        note: 'Masterless warriors at Osaka, the winter settlement and the renewed campaign. Japanese.',
      },
      {
        id: 'ieyasu-peace',
        title: 'The Metropolitan Museum of Art: Samurai Splendor',
        url: 'https://www.metmuseum.org/exhibitions/samurai-splendor',
        note: 'Tokugawa peace, social regulation and the continuing cultural role of the sword.',
      },
      {
        id: 'ieyasu-death',
        title: 'National Archives of Japan: Ieyasu’s death',
        url: 'https://www.archives.go.jp/exhibition/digital/ieyasu/contents6_03/',
        note: 'The death at Sunpu in 1616. Japanese.',
      },
    ],
  },
  {
    id: 'kojiro',
    name: 'Sasaki Kojirō',
    kanji: '佐々木小次郎',
    years: 'Birth unknown, died 1612',
    role: 'Musashi’s opponent at Ganryūjima',
    cardDescription: 'The defeated rival whose name stayed with the island where they fought.',
    description:
      'The swordsman at the centre of Musashi’s most famous encounter, remembered through an island, an early memorial and later retellings.',
    epithet: 'The other man on the island',
    introduction: [
      'Sasaki Kojirō is inseparable from the encounter with Musashi on Funashima, the island better known as Ganryūjima. Local history dates the fight to 1612. It ended in Kojirō’s defeat and became the best-known episode in Musashi’s reputation.',
    ],
    facts: [
      { label: 'Region', value: 'Kokura and Funashima in the Kanmon Strait' },
      { label: 'Period', value: 'Active in the early seventeenth century' },
      { label: 'Position', value: 'Swordsman associated with the Ganryū tradition' },
      { label: 'Connection', value: 'Faced Musashi in the duel remembered as Ganryūjima' },
    ],
    sections: [
      {
        id: 'a-swordsman-in-kokura',
        title: 'An opponent with a local following',
        paragraphs: [
          'Shimonoseki’s account places Kojirō in Kokura, serving the Hosokawa house and running a school of swordsmanship. Musashi approached the match through a Hosokawa retainer. The encounter therefore belonged to a world of teachers, followers and ruling households, rather than a chance meeting between two anonymous travellers.',
          'Funashima lies between Honshu and Kyushu. The name Ganryūjima preserves the name associated with the defeated swordsman’s school. Kojirō’s place in the story is consequently more than the obstacle a victor overcame: the location itself carries his reputation forward.',
        ],
        sourceIds: ['kojiro-shimonoseki'],
      },
      {
        id: 'the-duel-and-its-retellings',
        title: 'How the encounter became a story',
        paragraphs: [
          'Later retellings contrast Kojirō’s long sword with Musashi’s wooden weapon carved from an oar. They also make Musashi’s late arrival part of a psychological contest. These choices give the encounter its dramatic shape, turning the handling of time and equipment into an explanation of the outcome.',
          'In 1654, Musashi’s adopted son Iori erected a memorial recording his father’s achievements, including the fight on Funashima. Later biographies and fiction developed the scene further. Reading the encounter means keeping the early commemoration distinct from the dialogue, timing and gestures that later authors made memorable.',
        ],
        sourceIds: ['kojiro-tsukuba', 'kojiro-kokura-memorial'],
      },
    ],
    timeline: [
      {
        year: 'Before 1612',
        title: 'Swordsmanship in Kokura',
        description:
          'Local accounts associate Kojirō with a school and service to the Hosokawa house.',
      },
      {
        year: '1612',
        title: 'The encounter on Funashima',
        description: 'Kojirō faces Musashi on the island later known as Ganryūjima.',
      },
      {
        year: '1654',
        title: 'Iori’s memorial',
        description:
          'The duel appears in the account of Musashi’s achievements erected by his adopted son.',
      },
    ],
    legacy: {
      title: 'A name that survived defeat',
      paragraphs: [
        'Kojirō gives Musashi’s story its most enduring rivalry. His own life remains less recoverable, yet the island’s name and the continuing remembrance of both fighters show that the event did not belong to the winner alone.',
      ],
    },
    evidenceNote:
      'Kojirō’s birthplace, age and early training remain uncertain; versions of the duel differ.',
    relatedIds: ['iori', 'tadatoshi'],
    sources: [
      {
        id: 'kojiro-shimonoseki',
        title: 'Shimonoseki City: Ganryūjima',
        url: 'https://shimonoseki.travel/shimonosekistory/ganryujima/',
        note: 'Local account of the island, the 1612 duel and its competing versions. Japanese.',
      },
      {
        id: 'kojiro-tsukuba',
        title: 'University of Tsukuba: Miyamoto Musashi',
        url: 'https://budo-world.taiiku.tsukuba.ac.jp/en/2017/03/29/%E5%AE%AE%E6%9C%AC%E6%AD%A6%E8%94%B5/',
        note: 'Toshinobu Sakai distinguishes early evidence from later Ganryūjima fiction.',
      },
      {
        id: 'kojiro-kokura-memorial',
        title: 'Kitakyushu City: Musashi and Tamukeyama',
        url: 'https://www.city.kitakyushu.lg.jp/kokurakita/file_0080.html',
        note: 'The memorial established by Iori in 1654 records the encounter. Japanese.',
      },
    ],
  },
  {
    id: 'tadatoshi',
    name: 'Hosokawa Tadatoshi',
    kanji: '細川忠利',
    years: '1586-1641',
    role: 'The lord who invited Musashi to Kumamoto',
    cardDescription: 'The Hosokawa lord who opened his household to an older swordsman.',
    description:
      'Tadatoshi’s invitation in 1640 gave Musashi a settled base during the years in which he taught, painted and prepared his final writings.',
    epithet: 'A patron at the end of the wandering years',
    introduction: [
      'Hosokawa Tadatoshi’s direct place in Musashi’s life begins with an invitation. In 1640, the lord of the Higo domain welcomed the older swordsman to Kumamoto as a guest. Musashi remained there until his death five years later.',
    ],
    facts: [
      { label: 'Region', value: 'Kokura, then Higo with its seat at Kumamoto' },
      { label: 'Period', value: '1586-1641' },
      { label: 'Position', value: 'Hosokawa lord of Higo from 1632' },
      { label: 'Connection', value: 'Invited Musashi to Kumamoto in 1640' },
    ],
    sections: [
      {
        id: 'a-household-in-higo',
        title: 'A new household at Kumamoto Castle',
        paragraphs: [
          'The Hosokawa replaced the Katō as lords of Higo in 1632, moving from Kokura to Kumamoto. Tadatoshi inherited a household in which military authority and cultivated pursuits were closely connected. His grandfather Fujitaka was known for learning, while his father Tadaoki was an accomplished practitioner of tea.',
          'Inviting Musashi brought a respected swordsman into that setting. The arrangement provided a residence near Kumamoto Castle and the backing of a ruling house. It helps explain how Musashi’s teaching and artistic work could occupy the same final chapter, supported by a household that valued both.',
        ],
        sourceIds: ['tadatoshi-castle'],
      },
      {
        id: 'a-text-for-the-lord',
        title: 'Musashi puts his teaching into writing',
        paragraphs: [
          'In 1641, Musashi presented Tadatoshi with the Thirty-five Articles of Swordsmanship. This earlier statement of his teaching preceded The Book of Five Rings. His relationship with the lord therefore involved communicating a method, not only demonstrating a skill with a sword.',
          'Tadatoshi died that same year, leaving little time for the relationship to develop. His successor Mitsunao continued the Hosokawa patronage of Musashi. The work at Reigandō came afterwards, within the settled connection to Kumamoto that Tadatoshi’s invitation had helped establish.',
        ],
        sourceIds: ['tadatoshi-teaching', 'tadatoshi-patronage'],
      },
    ],
    timeline: [
      {
        year: '1632',
        title: 'The Hosokawa enter Higo',
        description: 'Tadatoshi moves from Kokura to govern from Kumamoto.',
      },
      {
        year: '1640',
        title: 'Musashi is invited',
        description: 'The swordsman takes up a place as a guest of the Hosokawa household.',
      },
      {
        year: '1641',
        title: 'Teaching and succession',
        description: 'Musashi presents the Thirty-five Articles; Tadatoshi dies later that year.',
      },
    ],
    legacy: {
      title: 'The conditions for Musashi’s final work',
      paragraphs: [
        'Tadatoshi did not live to see The Book of Five Rings completed. His contribution was the invitation that brought Musashi into a durable relationship with Kumamoto, where the older man could turn sustained attention to teaching, writing and painting.',
      ],
    },
    evidenceNote:
      'Tadatoshi’s invitation and Mitsunao’s later patronage are distinct stages of Musashi’s time in Kumamoto.',
    relatedIds: ['iori', 'ieyasu'],
    sources: [
      {
        id: 'tadatoshi-castle',
        title: 'Kumamoto Castle: The Hosokawa and Musashi',
        url: 'https://castle.kumamoto-guide.jp/en/history/',
        note: 'The transfer of 1632, the household’s cultural interests and Musashi’s invitation.',
      },
      {
        id: 'tadatoshi-teaching',
        title: 'University of Tsukuba: Outline of Kendo History',
        url: 'https://budo-world.taiiku.tsukuba.ac.jp/wp-content/uploads/2021/07/Germany-lecture-2021-Outline-of-Kendo-History-2.pdf',
        note: 'Chronology of the invitation, the Thirty-five Articles and Tadatoshi’s death in 1641.',
      },
      {
        id: 'tadatoshi-patronage',
        title: 'Kumamoto City: Shimada Museum of Art',
        url: 'https://kumamoto-guide.jp/en/spots/detail/21',
        note: 'The successive patronage of Tadatoshi and Mitsunao during Musashi’s final five years.',
      },
    ],
  },
  {
    id: 'iori',
    name: 'Miyamoto Iori',
    kanji: '宮本伊織',
    years: 'c. 1612-1678',
    role: 'Musashi’s adopted son and an Ogasawara retainer',
    cardDescription:
      'His service in Kyushu supported a career of his own; his memorial kept Musashi’s achievements in view.',
    description:
      'Iori’s service in Kokura linked Musashi to a ruling household. After his father’s death, he helped establish the record through which Musashi would be remembered.',
    epithet: 'The adopted son who recorded his father’s achievements',
    introduction: [
      'Miyamoto Iori followed a more settled career than his adoptive father. He entered the service of Ogasawara Tadazane and rose to senior office in the Kokura domain. Through Iori, Musashi had a close connection to a household with military and administrative responsibilities in northern Kyushu.',
    ],
    facts: [
      { label: 'Region', value: 'Akashi and the Kokura domain' },
      { label: 'Period', value: 'c. 1612-1678' },
      { label: 'Position', value: 'Senior retainer of the Ogasawara house' },
      { label: 'Connection', value: 'Musashi’s adopted son; erected his memorial in 1654' },
    ],
    sections: [
      {
        id: 'service-with-the-ogasawara',
        title: 'A place within a domain',
        paragraphs: [
          'Iori entered the Ogasawara household during the 1620s. The family later moved its seat from Akashi to Kokura, following the Hosokawa transfer to Kumamoto. His rise shows a route into continuing service at a time when a warrior’s future depended on more than the ability to win an individual encounter.',
          'During the suppression of the Shimabara rebellion in 1638, Iori served with the Ogasawara forces. Musashi also joined the campaign. Their presence places father and son within an organised army, far from the isolated duels that dominate Musashi’s popular image. Iori’s subsequent standing belonged to this service to a lord and domain.',
        ],
        sourceIds: ['iori-hyogo', 'iori-tsukuba'],
      },
      {
        id: 'remembering-his-father',
        title: 'The memorial at Tamukeyama',
        paragraphs: [
          'Nine years after Musashi’s death, Iori erected a memorial at Tamukeyama in Kokura. Dated 1654, its account records his father’s achievements, including the encounter with Kojirō on Funashima. It gave a lasting public form to a family’s remembrance of the swordsman.',
          'The inscription is important because it stands much closer to Musashi’s lifetime than the later biographies and novels. Its purpose was commemoration, and Iori selected the achievements through which his father should be known. He was consequently both a participant in Musashi’s life and an early author of his reputation.',
        ],
        sourceIds: ['iori-memorial'],
      },
    ],
    timeline: [
      {
        year: '1620s',
        title: 'Ogasawara service',
        description: 'Iori establishes his career in the household of Ogasawara Tadazane.',
      },
      {
        year: '1638',
        title: 'The Shimabara campaign',
        description: 'Iori and Musashi take part in the government campaign against the rebellion.',
      },
      {
        year: '1654',
        title: 'A memorial for Musashi',
        description: 'Iori erects the Tamukeyama inscription, nine years after his father’s death.',
      },
      {
        year: '1678',
        title: 'Iori’s death',
        description: 'His life extends into the established peace of the early Edo period.',
      },
    ],
    legacy: {
      title: 'Musashi was also somebody’s father',
      paragraphs: [
        'Iori brings family and employment into a story often told as solitary wandering. His career helped connect Musashi with service networks in Kyushu, while his memorial preserved an account that later generations would read alongside the swordsman’s own writings.',
      ],
    },
    evidenceNote:
      'Iori’s birth date and the circumstances of his adoption are less certain than his later service and the memorial of 1654.',
    relatedIds: ['kojiro', 'tadatoshi'],
    sources: [
      {
        id: 'iori-hyogo',
        title: 'Hyogo Prefectural Museum of Art: Musashi',
        url: 'https://www.artm.pref.hyogo.jp/bungaku/kikaku/musashi/',
        note: 'Iori’s Ogasawara service and the Shimabara campaign. Japanese.',
      },
      {
        id: 'iori-tsukuba',
        title: 'University of Tsukuba: Miyamoto Musashi',
        url: 'https://budo-world.taiiku.tsukuba.ac.jp/en/2017/03/29/%E5%AE%AE%E6%9C%AC%E6%AD%A6%E8%94%B5/',
        note: 'The adoption and household connection in the 1620s and the campaign of 1638.',
      },
      {
        id: 'iori-memorial',
        title: 'Kitakyushu City: Musashi and Tamukeyama',
        url: 'https://www.city.kitakyushu.lg.jp/kokurakita/file_0080.html',
        note: 'Iori’s establishment of the Musashi memorial in 1654. Japanese.',
      },
      {
        id: 'iori-dates',
        title: 'Japan Tourism Agency: Yoneda Tenjin Shrine',
        url: 'https://www.mlit.go.jp/kankocho/content/001882006.pdf',
        note: 'Official local interpretation identifies Iori as Musashi’s adopted son, a senior retainer, and dates his life to around 1612-1678.',
      },
    ],
  },
];

export const peopleSources = people.flatMap((person) => person.sources);
