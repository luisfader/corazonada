// Disco «Nuestra Utopía», de Proyecto R (banda ficticia de rap y nu metal argentino).
// Para agregar una canción: el mp3 en proyecto-r/audio/, la letra en proyecto-r/letras/ y una entrada acá con el mismo id.
// Mientras no haya grabación, poné audio: false y la canción aparece con la letra y la marca «pronto».
// En las letras, las indicaciones para Suno van después de un guion en la etiqueta ([Verso 1 — rap rápido]);
// la página las oculta y muestra solo «Verso 1». El comentario <!-- estilo: … --> también queda oculto.
window.CANCIONES = [
  {
    id: "01-la-lucha-de-a-dos",
    titulo: "La lucha de a dos",
    escena: "Dos para la esperanza",
    nota: "Una canción de amor en medio del caos: empieza y termina en susurros, y en el medio, dos personas que se eligen aunque el mundo los quiera separar.",
    duracion: "3:18"
  },
  {
    id: "02-nuestro-san-jorge",
    titulo: "Nuestro San Jorge",
    escena: "El caballero de hierro contra la serpiente imperial",
    nota: "Un caballero en moto, una fortaleza de muros turquesa y una serpiente de orugas y acero que promete libertad pero viene por el subsuelo.",
    duracion: "3:00"
  },
  {
    id: "03-mi-corazonada",
    titulo: "Mi corazonada",
    escena: "Del búnker al fogón",
    nota: "Setecientos treinta días encerrado, una moto vieja y un mundo vacío. Empieza como una pregunta en la soledad y termina alrededor del fuego, con cincuenta personas que ya no están solas.",
    duracion: "3:43"
  },
  {
    id: "04-mi-corazonada-version-melodica",
    titulo: "Mi corazonada (versión melódica)",
    escena: "La misma búsqueda, cantada",
    nota: "Otra forma de contar el camino del búnker al fogón: menos rap y más melodía.",
    duracion: "4:00"
  },
  {
    id: "05-rutas",
    titulo: "Rutas",
    escena: "Los clanes y la fortaleza se dan la mano",
    nota: "Tambores que marchan por el desierto y un coro de multitud que le canta de frente a la Potencia Central: vienen por las tierras raras, pero cada amanecer nos encuentra de pie.",
    duracion: "3:22"
  },
  {
    id: "06-reyes-bajo-tierra",
    titulo: "Reyes bajo tierra",
    escena: "El palacio debajo de la arena",
    nota: "Mientras arriba el pueblo pelea por calor, unos pocos se encerraron bajo tierra con la despensa llena y luz de mentira. Rap rápido y sarcástico, hasta que se abren las compuertas.",
    duracion: "3:49"
  },
  {
    id: "07-humanidad",
    titulo: "Humanidad",
    escena: "Otra vez en la misma trampa",
    nota: "Bandoneón, guitarras y rap a toda velocidad para hablarle a la humanidad como a una vieja conocida que siempre vuelve a la misma esquina. Esta vez, alguien le guardó un lugar junto al fogón.",
    duracion: "4:20"
  },
  {
    id: "08-al-mejor-postor",
    titulo: "Al mejor postor",
    escena: "Para los que se venden",
    nota: "Solo rap, motores lejanos y un coro de voces graves para los que cambian de patrón como de remera. Y una puerta abierta para el que se canse de tener precio.",
    duracion: "3:26"
  },
  {
    id: "09-manana-siempre-es-mejor-version-rap",
    titulo: "Mañana siempre es mejor (versión rap)",
    escena: "Para vos, mi amor",
    nota: "La canción que Natalia cantó en la plaza, convertida en rap por una sola voz, con violín y piano. Un homenaje.",
    duracion: "3:23"
  },
  {
    id: "10-imperfeccion",
    titulo: "Imperfección",
    escena: "Lo que no se puede arreglar",
    duracion: "3:55"
  }
];

// Traducciones de títulos, escenas y notas. Las letras traducidas están en letras/ru/ y letras/en/, con el mismo id.
window.TRADUCCIONES = {
  "01-la-lucha-de-a-dos": {
    ru: { titulo: "Борьба вдвоём", escena: "Двое ради надежды", nota: "Песня о любви посреди хаоса: она начинается и заканчивается шёпотом, а между ними — двое, которые выбирают друг друга, даже когда мир хочет их разлучить." },
    en: { titulo: "The Fight for Two", escena: "Two for hope", nota: "A love song in the middle of chaos: it starts and ends in whispers, and in between, two people who choose each other even though the world wants to tear them apart." }
  },
  "02-nuestro-san-jorge": {
    ru: { titulo: "Наш Святой Георгий", escena: "Железный рыцарь против имперского змея", nota: "Рыцарь на мотоцикле, крепость с бирюзовыми стенами и змей из гусениц и стали, который обещает свободу, но идёт за недрами." },
    en: { titulo: "Our Saint George", escena: "The iron knight against the imperial serpent", nota: "A knight on a motorbike, a fortress with turquoise walls and a serpent of tank treads and steel that promises freedom but is really after what lies underground." }
  },
  "03-mi-corazonada": {
    ru: { titulo: "Моё предчувствие", escena: "Из бункера к костру", nota: "Семьсот тридцать дней взаперти, старый мотоцикл и опустевший мир. Песня начинается как вопрос в одиночестве и заканчивается у огня, где пятьдесят человек больше не одни." },
    en: { titulo: "My Hunch", escena: "From the bunker to the campfire", nota: "Seven hundred thirty days locked away, an old motorbike and an empty world. It starts as a question asked in loneliness and ends around the fire, with fifty people who are no longer alone." }
  },
  "04-mi-corazonada-version-melodica": {
    ru: { titulo: "Моё предчувствие (мелодичная версия)", escena: "Те же поиски, но спетые", nota: "Другой способ рассказать о пути из бункера к костру: меньше рэпа и больше мелодии." },
    en: { titulo: "My Hunch (melodic version)", escena: "The same search, sung", nota: "Another way of telling the journey from the bunker to the campfire: less rap and more melody." }
  },
  "05-rutas": {
    ru: { titulo: "Дороги", escena: "Кланы и крепость протягивают друг другу руки", nota: "Барабаны, марширующие по пустыне, и хор толпы, который поёт прямо в лицо Центральной Державе: они пришли за редкоземельными металлами, но каждый рассвет застаёт нас на ногах." },
    en: { titulo: "Roads", escena: "The clans and the fortress shake hands", nota: "Drums marching across the desert and a crowd chorus singing straight at the Central Power: they come for the rare earths, but every dawn finds us standing." }
  },
  "06-reyes-bajo-tierra": {
    ru: { titulo: "Короли под землёй", escena: "Дворец под песком", nota: "Пока наверху народ дерётся за тепло, немногие заперлись под землёй с полной кладовой и фальшивым светом. Быстрый и саркастичный рэп — до тех пор, пока не откроются шлюзы." },
    en: { titulo: "Kings Underground", escena: "The palace beneath the sand", nota: "While up above the people fight for warmth, a few have locked themselves underground with a full pantry and fake light. Fast, sarcastic rap, until the floodgates open." }
  },
  "07-humanidad": {
    ru: { titulo: "Человечество", escena: "Снова в той же ловушке", nota: "Бандонеон, гитары и рэп на предельной скорости — чтобы говорить с человечеством, как со старой знакомой, которая всегда возвращается на тот же угол. На этот раз кто-то сберёг для неё место у костра." },
    en: { titulo: "Humanity", escena: "In the same trap again", nota: "Bandoneon, guitars and full-speed rap to talk to humanity like an old acquaintance who always ends up back on the same corner. This time, someone saved it a place by the campfire." }
  },
  "08-al-mejor-postor": {
    ru: { titulo: "Тому, кто больше заплатит", escena: "Для тех, кто продаётся", nota: "Только рэп, далёкие моторы и хор низких голосов — для тех, кто меняет хозяев, как футболки. И открытая дверь для того, кто устанет иметь цену." },
    en: { titulo: "To the Highest Bidder", escena: "For those who sell themselves", nota: "Just rap, distant engines and a chorus of deep voices for those who change bosses like T-shirts. And an open door for anyone who gets tired of having a price." }
  },
  "09-manana-siempre-es-mejor-version-rap": {
    ru: { titulo: "Завтра всегда лучше (рэп-версия)", escena: "Для тебя, любовь моя", nota: "Песня, которую Наталья спела на площади, превращённая в рэп для одного голоса, со скрипкой и фортепиано. Посвящение." },
    en: { titulo: "Tomorrow Is Always Better (rap version)", escena: "For you, my love", nota: "The song Natalia sang in the square, turned into rap for a single voice, with violin and piano. A tribute." }
  },
  "10-imperfeccion": {
    ru: { titulo: "Несовершенство", escena: "То, что нельзя исправить" },
    en: { titulo: "Imperfection", escena: "What can't be fixed" }
  }
};
