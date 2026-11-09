// Данные постов. Отдельный модуль без побочных эффектов —
// его импортируют и лента, и главная страница.
export const posts = [
  {
    title: "Первый пост",
    date: "2026-06-30",
    time: "14:31",
    text: "https://discord.gg/bNdxCWZy3H",
    image: "images/posts/budgie-sherry.jpg"
  },
  {
    title: "Новая вкладка",
    date: "2026-06-29",
    time: "20:25",
    text: "Добавлена вкладка интерактив",
    image: ""
  },
  {
    title: "Оао",
    date: "2026-06-29",
    time: "20:28",
    text: "ОНО РАБОТАЕТ!",
    image: ""
  },
  {
    title: "Чистка",
    date: "2026-07-02",
    time: "22:22",
    text: "Сделал масштабную «уборку» в репозитории, теперь не стыдно оставлять ссылку на гитхаб",
    image: "images/posts/github-repo-after-cleanup.webp"
  },
  {
    title: "День Независимости",
    date: "2026-07-04",
    time: "18:16",
    text: "Happy independence day",
    image: "images/posts/independence-day-eagle-flag.jpg"
  },
  {
    title: "Squad World",
    date: "2026-07-04",
    time: "20:49",
    text: "Добавлен новый проект - Squad World",
    image: "images/posts/squad-world-logo.webp"
  },
  {
    title: "Новая иконка сайта",
    date: "2026-07-06",
    time: "00:10",
    text: "Добавлена новая иконка для сайта, я иконки хуже не видел, но за то она теперь есть",
    image: "images/posts/new-site-icon-in-tab.jpg"
  },
  {
    title: "Эксперимент не был провальным",
    date: "2026-07-22",
    time: "16:50",
    text: "Ну имба же",
    image: "images/posts/discord-listening-to-voice-track.jpg"
  },
  {
    title: " ",
    date: "2026-07-22",
    time: "18:30",
    text: "На кристаликсе больше не играем",
    image: "images/posts/cristalix-trojan-alert.jpg"
  },
  {
    title: "Планы на будущее",
    date: "2026-07-31",
    time: "23:14",
    text: "Когда нибудь я доделаю этот сайт (завтра)",
    image: "images/posts/minecraft-golden-fountain-griefed.jpg"
  },
  {
    title: "Обнова",
    date: "2026-08-01",
    time: "22:55",
    text: "Обновил дизайн сайта, добавил кнопку «Перемешать», ещё что-то и на этом всё",
    image: "images/posts/budgie-after-dagestan.jpg"
  },
  {
    title: "Обновление галереи",
    date: "2026-08-08",
    time: "19:00",
    text: "Добавлен задний фон для галереи",
    image: "images/gallery-bg.webp"
  },
  {
    title: "Обновление проектов",
    date: "2026-08-08",
    time: "19:00",
    text: "Добавлен задний фон для проектов",
    image: "images/projects-bg.webp"
  },
  {
    title: "Обновление интерактива",
    date: "2026-08-08",
    time: "22:00",
    text: "Добавлен задний фон для интерактива",
    image: "images/posts-bg.webp"
  },
  {
    title: "Временное неудобство",
    date: "2026-08-14",
    time: "15:18",
    text: "Разработка сайта временно остановлена, мне заблокировали все аккаунты в клауде",
    image: "images/posts/claude-guide-dialogue.jpg"
  },
  {
    title: "Обновление галереи",
    date: "2026-08-16",
    time: "19:12",
    text: "Переписал некоторые комментарии и добавил много новых фото. Техническая разработка сайта продолжится 23 августа",
    image: "images/posts/claude-account-suspended-email.jpg"
  },
  {
    title: "Прощай, статичный html",
    date: "2026-08-18",
    time: "16:30",
    text: "Мне тут посоветовали использовать сборщик фронтенда Vite и фреймворк Next.js. Скоро сайт станет современным, а не просто какой то страницей на html написанной дипсиком",
    image: "images/posts/homelander-drinking-milk.webp"
  },
    {
    title: "Разработка началась",
    date: "2026-08-26",
    time: "22:30",
    text: "Разработка сайта продолжается, дипсик согласился её продолжить",
    image: "images/posts/dark-night-club.jpg"
  },
    {
    title: "Сложнейший выбор сделает лишь сильнейший",
    date: "2026-09-03",
    time: "22:22",
    text: "Недавно приобрёл пк, надо выбрать что делать с ос, оставить виндовс или стать угашенным и перейти на убунту (картинку делал чат джпт, да простит меня дипсик)",
    image: "images/posts/windows-or-ubuntu-choice.jpg"
  },
      {
    title: "Учу клода",
    date: "2026-09-12",
    time: "11:04",
    text: "Я взял клода в стажёры работать над моим сайтом",
    image: "images/posts/github-contributors-with-claude.jpg"
  },
        {
    title: "Гениальность",
    date: "2026-09-12",
    time: "11:05",
    text: "Впервые что-то работает как задумывалось",
    image: "images/posts/discord-playing-on-virus-hub.jpg"
  },
          {
    title: "Оральная",
    date: "2026-09-13",
    time: "22:22",
    text: "В войсе мне мурлычит",
    image: "images/posts/discord-voice-channel-with-filya.jpg"
  },
            {
    title: "Трепещите, вайбкодеры",
    date: "2026-09-13",
    time: "22:22",
    text: "Теперь Claude подчиняется мне",
    image: "images/posts/wojaks-pointing-at-filya.png"
  },
              {
    title: "Добавил музыку на свой серв",
    date: "2026-09-14",
    time: "22:35",
    text: "Минус нервы, минус время, плюс красивые кнопочки и работающая музыка",
    image: "images/posts/music-bot-control-buttons.jpg"
  },
                {
    title: "Ещё одна работающая функция",
    date: "2026-09-14",
    time: "23:09",
    text: "Эта чувырла работает, не без багов конечно",
    image: "images/posts/music-bot-message-with-buttons.jpg"
  },
                  {
    title: "Добавлен новый проект - ViRuS Hub",
    date: "2026-09-19",
    time: "19:17",
    text: "Пристанице бездарей: Реализована ранговая система, музыка с красивым интерфейсом, мост между тг и дс и всё что душе угодно. Всей рутиной заправляет один человек и его кот",
    image: "images/posts/virus-hub-logo.png"
  },
                    {
    title: "Я мост себе воздвиг нерукотворный...",
    date: "2026-09-19",
    time: "19:22",
    text: "Я почти весь день морочился этим мостом, зато провёл его между дс каналом и тг группой",
    image: "images/posts/telegram-discord-bridge-chat.jpg"
  },
                      {
    title: "Безобидная зверюшка",
    date: "2026-09-23",
    time: "23:49",
    text: "Спойлер к будущему плагину",
    image: "images/posts/spoiler-harmless-beast.jpg"
  },
                        {
    title: "Смерть постучалась",
    date: "2026-09-23",
    time: "23:50",
    text: "Ещё один спойлер связанный со все-чёрным из марвел",
    image: "images/posts/spoiler-death-knocked.jpg"
  },
                          {
    title: "В главных ролях",
    date: "2026-09-24",
    time: "22:47",
    text: "Разработка плагина на мечи вышла из под контроля и я случайно добавил туда сюжет... Клод займёт место альтрона",
    image: "images/posts/claude-guide-dialogue.jpg"
  },
                            {
    title: "Лимиты кончились",
    date: "2026-09-25",
    time: "23:11",
    text: "Испытал вайбкодерский страх, мне плохо",
    image: "images/posts/claude-session-limit-reached.jpg"
  },
  {
    title: "Новый проект - VirusSwords",
    date: "2026-09-27",
    time: "14:24",
    text: "Плагин на мечи дорос до своего имени: теперь он VirusSwords, а команда — /virusswords. 27 клинков, пять святилищ, шесть родословных и Claude в роли Альтрона. Всё расписано в вики: https://virus-momentx.github.io/wiki-virus-swords/",
    image: "images/posts/virusswords-wiki-codex.jpg"
  },
    {
    title: "Время, Доктор Фримен?",
    date: "2026-10-03",
    time: "23:11",
    text: "Добавлю тайм-стопы в плагин",
    image: "images/posts/time-stop-message.jpg"
  },
      {
    title: "Модельки Тессеракта и готовность плагина",
    date: "2026-10-05",
    time: "17:11",
    text: "Плагин создан процентов на 70, вот модельки эндгейм предметов. Через пару часов будет тест боссов и механик",
    image: "images/posts/tesseract-item-models.png"
  },
  {
    title: "Трейлер VirusSwords",
    date: "2026-10-05",
    time: "22:55",
    text: "Вышел первый трейлер плагина: полминуты боссов — Предвестник, Пустотный Серафим, всадники апокалипсиса и Проклятый король. Смотреть во вкладке «Проекты», в карточке VirusSwords.",
    image: "images/virusswords-trailer.webp"
  },
      {
    title: "Мучения на 80% пройдены",
    date: "2026-10-08",
    time: "14:02",
    text: "Готовность плагина 80%, тестировщики (мученики) найдены, осталось пару структур подобавлять и решить проблему баланса",
    image: "images/posts/floating-island-structure.jpg"
  },
        {
    title: "Готовность плагина 90%",
    date: "2026-10-12",
    time: "23:14",
    text: "Финишная прямая — механики есть, багов минимально, осталось пару клинков, предметов, тестовых забегов и мы станем на шаг ближе к Судному дню. Вот кстати описание Короны Технокрови (финального оружия этой родословной), в христианской традиции Антихрист презирает человеческую природу, созданную по образу и подобию Бога. Его цель — духовно и физически погубить человеческий род, доведя его до полного морального разложения и краха что очень схоже с взглядами Альтрона характер которого я пытаюсь передать одному из трёх путеводителей.",
    image: "images/posts/technoblood-crown-antichrist-sword.jpg"
  },
          {
    title: "Ищу тестеров, снова",
    date: "2026-10-14",
    time: "23:06",
    text: "Все бывшие тестеры намучались и сбежали, а работы ещё дофига. Впишу имена в плагин тех кто помогал тестить так что потом знамениты будете",
    image: "images/posts/claude-bugfix-report.png"
  },
            {
    title: "Спойлер",
    date: "2026-10-15",
    time: "23:06",
    text: "Спойлер к секретному квесту плагина (реально)",
    image: "images/posts/secret-quest-pig-king.png"
  },
              {
    title: "«Они ушли, не сказав ни слова. Ответ придётся выковать самому.»",
    date: "2026-10-24",
    time: "21:20",
    text: "Целестиалы, владыки ада, повелители неба и прочие... Всё позади, остались тесты, баланс и он готов ",
    image: "images/posts/celestial-boss.png"
  },
                {
    title: "«Часы на его лице давно не тикают, но время всё равно подчиняется ему. Его заковали в цепи, однако эхо его механизма всё ещё отзывается в верхнем мире»",
    date: "2026-10-25",
    time: "22:14",
    text: "Один из боссов, в одном из данжей нижнего мира будет развилка между боссами. Сразиться с существом, что заточило само Время или с искусителем Ада, что скрывается за маской Короля Проклятого замка?",
    image: "images/posts/chronarch-boss.png"
  },
                  {
    title: "Ключики",
    date: "2026-10-29",
    time: "11:20",
    text: "Текстуры ключей, красивые текстуры",
    image: "images/posts/dungeon-key-textures.png"
  },
                    {
    title: "Клод бездарь",
    date: "2026-10-31",
    time: "23:50",
    text: "Мудила весь лимит недельный сожрал, а выдал маленький списочек что работает не так",
    image: "images/posts/claude-final-build-files.jpg"
  },
                      {
    title: "Опять спойлер?",
    date: "2026-11-06",
    time: "18:40",
    text: "Так у кого же награда? (Плагин никогда не будет закончен, но по нему всегда будут спойлеры)",
    image: "images/posts/blood-key-three-oddities-puzzle.jpg"
  },
];

