import type { ReadingPassage } from "../readingTypes";

/** Original graded passages bundled with the app. There is no public,
 * CORS-open API serving HSK-graded reading texts (existing sites are
 * copyrighted and API-less), so passages live here as static data - same
 * pattern as the word lists, and it keeps the PWA working offline. Add new
 * passages by appending to this array. */
export const READINGS_ZH: ReadingPassage[] = [
  // ---------------------------------------------------------- beginner
  {
    id: "beginner-my-day",
    difficulty: "beginner",
    band: "HSK 1–2",
    title: "我的一天",
    titleEn: "My Day",
    paragraphs: [
      "我每天早上六点半起床。起床以后，我喝一杯水，吃一点儿东西。我喜欢吃面包和鸡蛋。",
      "八点我去上班。我坐地铁去公司，地铁上人很多。我在公司工作八个小时。",
      "晚上我和家人一起吃饭。吃完饭，我们看一会儿电视。十一点我去睡觉。我的一天很简单，可是我很高兴。",
    ],
    translation: [
      "I get up at six thirty every morning. After getting up, I drink a glass of water and eat a little something. I like eating bread and eggs.",
      "At eight I go to work. I take the subway to the company; the subway is very crowded. I work eight hours at the company.",
      "In the evening I eat dinner together with my family. After dinner, we watch a bit of TV. At eleven I go to sleep. My day is very simple, but I am happy.",
    ],
    questions: [
      { q: "他每天几点起床？", a: "六点半。" },
      { q: "他怎么去公司？", a: "坐地铁。" },
    ],
  },
  {
    id: "beginner-my-family",
    difficulty: "beginner",
    band: "HSK 1–2",
    title: "我的家",
    titleEn: "My Family",
    paragraphs: [
      "我家有四口人：爸爸、妈妈、姐姐和我。我们住在北京。",
      "我爸爸是医生，他工作很忙。我妈妈是老师，她喜欢做饭，她做的菜很好吃。",
      "我姐姐是大学生，她在上海学习。她每个星期给我们打电话。我很想她，希望她常回家。",
    ],
    translation: [
      "There are four people in my family: dad, mom, my older sister, and me. We live in Beijing.",
      "My dad is a doctor; his work is very busy. My mom is a teacher; she likes to cook, and the food she makes is delicious.",
      "My older sister is a university student; she studies in Shanghai. She calls us every week. I miss her a lot and hope she comes home often.",
    ],
    questions: [
      { q: "他家有几口人？", a: "四口人。" },
      { q: "姐姐在哪儿学习？", a: "在上海。" },
    ],
  },
  {
    id: "beginner-buying-fruit",
    difficulty: "beginner",
    band: "HSK 1–2",
    title: "买水果",
    titleEn: "Buying Fruit",
    paragraphs: [
      "今天是星期六，天气很好。我和妈妈去商店买东西。",
      "商店里有很多水果：苹果、香蕉，还有西瓜。苹果十块钱一斤，香蕉五块钱一斤。",
      "妈妈买了三斤苹果和两斤香蕉。我想买西瓜，可是太大了，我们拿不了。妈妈说：“明天让爸爸开车来买。”",
    ],
    translation: [
      "Today is Saturday and the weather is nice. My mom and I go to the store to buy things.",
      "The store has lots of fruit: apples, bananas, and watermelons too. Apples are ten yuan per jin, bananas five yuan per jin.",
      "Mom bought three jin of apples and two jin of bananas. I wanted to buy a watermelon, but it was too big and we couldn't carry it. Mom said: \"Tomorrow we'll have dad drive over to buy it.\"",
    ],
    questions: [
      { q: "苹果多少钱一斤？", a: "十块钱一斤。" },
      { q: "他们为什么没买西瓜？", a: "西瓜太大了，他们拿不了。" },
    ],
  },
  {
    id: "beginner-my-hobby",
    difficulty: "beginner",
    band: "HSK 1–2",
    title: "我的爱好",
    titleEn: "My Hobbies",
    paragraphs: [
      "我有两个爱好：打篮球和听音乐。",
      "每个星期三下午，我和朋友们去学校打篮球。我们打两个小时，都很累，可是很开心。",
      "晚上做完作业，我喜欢听音乐。我最喜欢的歌手是一个中国人，她的歌很好听。听音乐的时候，我觉得很舒服。",
    ],
    translation: [
      "I have two hobbies: playing basketball and listening to music.",
      "Every Wednesday afternoon, my friends and I go play basketball at school. We play for two hours; we get tired, but we are very happy.",
      "In the evening after finishing homework, I like listening to music. My favorite singer is Chinese; her songs are beautiful. When I listen to music, I feel very relaxed.",
    ],
    questions: [
      { q: "他有几个爱好？", a: "两个：打篮球和听音乐。" },
      { q: "他们打多长时间篮球？", a: "两个小时。" },
    ],
  },
  {
    id: "beginner-rainy-day",
    difficulty: "beginner",
    band: "HSK 1–2",
    title: "下雨天",
    titleEn: "A Rainy Day",
    paragraphs: [
      "今天早上天气很好，我没带伞就出门了。",
      "下午三点，天上来了很多云，一会儿就下雨了。雨很大，我不能回家。",
      "我给妈妈打电话。妈妈说：“你在学校等我，我开车去接你。”半个小时以后，妈妈来了。在车上，妈妈对我说：“出门以前，要先看天气。”",
    ],
    translation: [
      "This morning the weather was nice, so I left home without an umbrella.",
      "At three in the afternoon, many clouds came into the sky, and soon it started to rain. The rain was heavy, and I couldn't go home.",
      "I called my mom. She said: \"Wait for me at school; I'll drive over to pick you up.\" Half an hour later, mom arrived. In the car, she said to me: \"Before going out, check the weather first.\"",
    ],
    questions: [
      { q: "他为什么没带伞？", a: "因为早上天气很好。" },
      { q: "谁去接他了？", a: "他妈妈开车去接他了。" },
    ],
  },
  // ------------------------------------------------------ intermediate
  {
    id: "intermediate-weekend-plan",
    difficulty: "intermediate",
    band: "HSK 3–4",
    title: "周末的计划",
    titleEn: "Weekend Plans",
    paragraphs: [
      "这个周末我本来打算在家好好休息，因为最近工作特别忙，我已经三个星期没有好好睡觉了。",
      "可是昨天晚上，我的大学同学突然给我打电话，说他星期六要来我们城市出差，问我有没有时间见面。我们已经五年没见了，所以我马上答应了。",
      "我打算带他去我们城市最有名的饭馆吃饭，然后去河边走一走。听说周末天气不错，不冷也不热，最适合出去玩儿。休息虽然重要，但是老朋友见面的机会更难得。",
    ],
    translation: [
      "This weekend I had originally planned to rest well at home, because work has been especially busy lately — I haven't slept properly for three weeks.",
      "But last night, my university classmate suddenly called me, saying he'd be coming to our city on a business trip on Saturday, and asked if I had time to meet. We haven't seen each other for five years, so I agreed immediately.",
      "I plan to take him to our city's most famous restaurant for dinner, and then go for a walk by the river. I hear the weather this weekend is pretty good — neither cold nor hot, perfect for going out. Rest is important, but the chance to see an old friend is rarer.",
    ],
    questions: [
      { q: "他本来周末打算做什么？", a: "在家好好休息。" },
      { q: "他和大学同学多长时间没见了？", a: "五年。" },
    ],
  },
  {
    id: "intermediate-learning-cooking",
    difficulty: "intermediate",
    band: "HSK 3–4",
    title: "学做饭",
    titleEn: "Learning to Cook",
    paragraphs: [
      "以前我从来不做饭，每天不是吃食堂，就是点外卖。后来我发现，这样不但花钱多，而且对身体不好。",
      "上个月，我决定跟妈妈学做饭。刚开始的时候，我连鸡蛋都煎不好，不是太咸，就是烧焦了。妈妈笑着说：“别着急，做饭跟学外语一样，需要多练习。”",
      "现在我已经会做五六个菜了。上个星期，我请朋友们来家里吃饭，他们都说我做的鱼特别好吃。自己做饭虽然花时间，但是更健康，也让我觉得生活更有意思了。",
    ],
    translation: [
      "I never used to cook — every day I either ate at the cafeteria or ordered takeout. Later I realized that this not only cost a lot of money, but was also bad for my health.",
      "Last month, I decided to learn cooking from my mom. At first, I couldn't even fry an egg properly — it was either too salty or burnt. Mom laughed and said: \"Don't worry, cooking is like learning a foreign language — it takes lots of practice.\"",
      "Now I can already make five or six dishes. Last week, I invited friends over for dinner, and they all said the fish I made was especially delicious. Cooking for yourself takes time, but it's healthier, and it makes me feel life is more interesting.",
    ],
    questions: [
      { q: "他以前为什么不做饭？", a: "他每天不是吃食堂，就是点外卖。" },
      { q: "妈妈觉得做饭跟什么一样？", a: "跟学外语一样，需要多练习。" },
    ],
  },
  {
    id: "intermediate-moving-city",
    difficulty: "intermediate",
    band: "HSK 3–4",
    title: "搬到新城市",
    titleEn: "Moving to a New City",
    paragraphs: [
      "半年前，因为工作的关系，我从小城市搬到了大城市。刚来的时候，我觉得什么都不习惯：路上车太多，说话太快，连吃的东西都跟家里的不一样。",
      "最难的是我一个朋友都没有。周末的时候，别人都出去玩儿，我只能一个人在家看电视。那时候我常常想家，甚至想过放弃这份工作回老家去。",
      "后来，我参加了公司的篮球队，慢慢认识了很多新朋友。现在我已经习惯了这里的生活，也越来越喜欢这个城市了。我明白了一个道理：新的环境虽然会带来困难，但是也会带来新的机会。",
    ],
    translation: [
      "Half a year ago, because of work, I moved from a small city to a big one. When I first arrived, nothing felt familiar: too many cars on the road, people spoke too fast, and even the food was different from home.",
      "The hardest part was that I didn't have a single friend. On weekends, everyone else went out to have fun, while I could only watch TV at home alone. Back then I often felt homesick, and even thought about giving up the job and going back to my hometown.",
      "Later, I joined the company basketball team and gradually got to know many new friends. Now I've gotten used to life here, and I like this city more and more. I've come to understand something: a new environment brings difficulties, but it also brings new opportunities.",
    ],
    questions: [
      { q: "他为什么搬到大城市？", a: "因为工作的关系。" },
      { q: "他是怎么认识新朋友的？", a: "他参加了公司的篮球队。" },
    ],
  },
  {
    id: "intermediate-lost-phone",
    difficulty: "intermediate",
    band: "HSK 3–4",
    title: "手机丢了",
    titleEn: "Losing My Phone",
    paragraphs: [
      "昨天下午，我坐公共汽车回家。下车的时候，我突然发现手机不见了。我又着急又生气，因为手机里有很多重要的照片和电话号码。",
      "我马上用朋友的手机给自己打电话。响了很久，终于有人接了。原来，一位老人在座位上发现了我的手机，正在等我的电话。",
      "晚上，我按照老人说的地址找到了他家。我想买些水果感谢他，可是他怎么也不要。他笑着说：“谁都有需要帮助的时候，这只是一件小事。”这件小事让我感动了很久。",
    ],
    translation: [
      "Yesterday afternoon, I took the bus home. When getting off, I suddenly realized my phone was gone. I was both anxious and angry, because the phone had many important photos and phone numbers in it.",
      "I immediately used my friend's phone to call my own number. It rang for a long time, and finally someone answered. It turned out an elderly man had found my phone on a seat, and was waiting for my call.",
      "In the evening, I found his home following the address he gave. I wanted to buy some fruit to thank him, but he refused no matter what. He smiled and said: \"Everyone needs help sometimes; this is just a small thing.\" This small thing moved me for a long time.",
    ],
    questions: [
      { q: "他为什么又着急又生气？", a: "因为手机里有很多重要的照片和电话号码。" },
      { q: "谁发现了他的手机？", a: "一位老人在座位上发现了他的手机。" },
    ],
  },
  {
    id: "intermediate-biking-to-work",
    difficulty: "intermediate",
    band: "HSK 3–4",
    title: "骑车上班",
    titleEn: "Biking to Work",
    paragraphs: [
      "以前我每天开车上班。虽然家离公司只有五公里，但是路上总是堵车，有时候要开四十多分钟，我常常迟到。",
      "三个月前，同事建议我骑自行车上班。我试了一个星期，发现骑车只要二十五分钟，比开车还快！而且一路上可以看看风景，心情也变好了。",
      "现在，骑车已经成了我生活的一部分。我不但再也没有迟到过，而且身体比以前健康多了，连感冒都很少得了。有时候，解决问题的办法其实很简单，只是我们没有想到。",
    ],
    translation: [
      "I used to drive to work every day. Although my home is only five kilometers from the company, the roads were always jammed — sometimes it took over forty minutes, and I was often late.",
      "Three months ago, a colleague suggested I bike to work. I tried it for a week and found that biking takes only twenty-five minutes — even faster than driving! Plus, I can enjoy the scenery along the way, and my mood has improved.",
      "Now, biking has become part of my life. Not only have I never been late again, but my health is much better than before — I rarely even catch colds anymore. Sometimes the solution to a problem is actually very simple; we just haven't thought of it.",
    ],
    questions: [
      { q: "他以前为什么常常迟到？", a: "因为路上总是堵车。" },
      { q: "骑车上班要多长时间？", a: "只要二十五分钟。" },
    ],
  },
  // ---------------------------------------------------------- advanced
  {
    id: "advanced-city-country",
    difficulty: "advanced",
    band: "HSK 5–6",
    title: "城市与乡村",
    titleEn: "City and Countryside",
    paragraphs: [
      "随着经济的发展，越来越多的年轻人离开乡村，到大城市去寻找机会。城市里有更多的工作、更好的医院和学校，这些都深深地吸引着他们。",
      "然而，城市生活并不像想象中那么完美。房价高、竞争激烈、节奏太快，让许多人感到巨大的压力。有调查显示，超过一半的城市年轻人认为自己的生活质量并不高，甚至有人开始怀念乡村安静的生活。",
      "近年来，一种新的趋势正在出现：一部分人选择离开城市，回到乡村创业。他们利用互联网把家乡的农产品卖到全国各地，也把新的观念带回了乡村。也许未来的理想生活，不是简单地在城市与乡村之间做选择，而是让两者的优势结合起来。",
    ],
    translation: [
      "With economic development, more and more young people leave the countryside to seek opportunities in big cities. Cities have more jobs, better hospitals and schools — all of which deeply attract them.",
      "However, city life is not as perfect as imagined. High housing prices, fierce competition, and a too-fast pace leave many people feeling enormous pressure. Surveys show that over half of young people in cities feel their quality of life isn't high, and some have even begun to miss the quiet life of the countryside.",
      "In recent years, a new trend has been emerging: some people choose to leave the city and return to the countryside to start businesses. They use the internet to sell their hometown's agricultural products across the country, and also bring new ideas back to the countryside. Perhaps the ideal life of the future is not simply a choice between city and countryside, but a combination of the strengths of both.",
    ],
    questions: [
      { q: "年轻人为什么想去大城市？", a: "城市里有更多的工作、更好的医院和学校。" },
      { q: "回到乡村的人是怎么卖农产品的？", a: "他们利用互联网把农产品卖到全国各地。" },
    ],
  },
  {
    id: "advanced-reading-habits",
    difficulty: "advanced",
    band: "HSK 5–6",
    title: "碎片化阅读",
    titleEn: "Fragmented Reading",
    paragraphs: [
      "智能手机改变了人们的阅读方式。过去，人们习惯安安静静地读一本书；如今，更多人是在地铁上、排队时，利用零碎的时间刷手机，看一些简短的文章和视频。这种现象被称为“碎片化阅读”。",
      "支持者认为，碎片化阅读让知识的获取变得更加方便，人们可以随时随地学习新东西。反对者则担心，长期阅读碎片化的内容，会让人失去深入思考的能力，变得越来越没有耐心，甚至连一篇长文章都读不完。",
      "其实，问题的关键不在于工具，而在于我们如何使用它。碎片化阅读可以用来了解信息，但真正的学习仍然需要系统的、深度的阅读。在这个信息过载的时代，懂得选择读什么、怎么读，也许比阅读本身更重要。",
    ],
    translation: [
      "Smartphones have changed the way people read. In the past, people were used to quietly reading a book; nowadays, more people use scraps of time — on the subway, while waiting in line — to scroll on their phones, reading short articles and watching short videos. This phenomenon is called \"fragmented reading.\"",
      "Supporters argue that fragmented reading makes acquiring knowledge more convenient — people can learn new things anytime, anywhere. Opponents worry that reading fragmented content over the long term causes people to lose the ability to think deeply, become less and less patient, and even fail to finish a single long article.",
      "In fact, the key issue lies not in the tool, but in how we use it. Fragmented reading can be used to keep up with information, but real learning still requires systematic, deep reading. In this age of information overload, knowing how to choose what to read and how to read it may matter even more than reading itself.",
    ],
    questions: [
      { q: "什么是“碎片化阅读”？", a: "利用零碎的时间看一些简短的文章和视频。" },
      { q: "作者认为问题的关键是什么？", a: "关键不在于工具，而在于我们如何使用它。" },
    ],
  },
  {
    id: "advanced-festivals",
    difficulty: "advanced",
    band: "HSK 5–6",
    title: "传统节日的意义",
    titleEn: "The Meaning of Traditional Festivals",
    paragraphs: [
      "春节、中秋节、端午节……这些传统节日承载着中国几千年的历史与文化。吃饺子、赏月、赛龙舟，每一个习俗背后，都有属于自己的故事和寓意。",
      "但是，随着生活节奏的加快，一些人觉得传统节日变得越来越“没意思”了：年夜饭可以在饭店解决，祝福变成了群发的短信，甚至有人干脆利用假期出国旅游。有学者担心，节日正在失去它原来的文化内涵，慢慢变成单纯的假期。",
      "不过，也有人持不同的看法。他们认为，节日的形式本来就是随着时代不断变化的，重要的不是形式，而是节日所表达的情感——对家人的思念、对团圆的渴望、对美好生活的期待。只要这些情感还在，传统节日就永远不会真正消失。",
    ],
    translation: [
      "Spring Festival, Mid-Autumn Festival, Dragon Boat Festival... these traditional festivals carry thousands of years of Chinese history and culture. Eating dumplings, admiring the moon, racing dragon boats — behind every custom lies its own story and meaning.",
      "But as the pace of life quickens, some people feel traditional festivals have become more and more \"boring\": New Year's Eve dinner can be handled at a restaurant, blessings have become mass text messages, and some people simply use the holiday to travel abroad. Some scholars worry that festivals are losing their original cultural meaning and slowly turning into mere holidays.",
      "However, others hold a different view. They believe the form of festivals has always changed with the times; what matters is not the form, but the feelings festivals express — missing one's family, longing for reunion, and hoping for a better life. As long as these feelings remain, traditional festivals will never truly disappear.",
    ],
    questions: [
      { q: "为什么有人觉得传统节日“没意思”了？", a: "年夜饭在饭店解决，祝福变成群发的短信，有人利用假期出国旅游。" },
      { q: "持不同看法的人认为节日重要的是什么？", a: "重要的不是形式，而是节日所表达的情感。" },
    ],
  },
  {
    id: "advanced-sleep",
    difficulty: "advanced",
    band: "HSK 5–6",
    title: "被忽视的睡眠",
    titleEn: "Neglected Sleep",
    paragraphs: [
      "在现代社会，熬夜似乎成了一种普遍现象。工作压力、社交活动，还有睡前刷不完的短视频，让越来越多的人把睡觉的时间一推再推。不少年轻人甚至把“熬最晚的夜”当成一种生活方式。",
      "然而，科学研究早已证明，长期缺乏睡眠会带来严重的后果：记忆力下降、免疫力变弱、情绪不稳定，甚至增加患心脏病的风险。更值得注意的是，睡眠不足造成的伤害，往往无法通过周末“补觉”来完全恢复。",
      "专家建议，成年人每天应保证七到八小时的睡眠，并尽量在固定的时间上床。睡前一小时最好放下手机，让大脑慢慢安静下来。毕竟，睡眠不是浪费时间，而是对身体最基本的投资。",
    ],
    translation: [
      "In modern society, staying up late seems to have become a common phenomenon. Work pressure, social activities, and the endless short videos before bed lead more and more people to push back their bedtime again and again. Many young people even treat \"staying up the latest\" as a lifestyle.",
      "However, scientific research has long proven that chronic lack of sleep brings serious consequences: declining memory, weakened immunity, unstable moods, and even an increased risk of heart disease. What's more noteworthy is that the damage caused by insufficient sleep often cannot be fully recovered by \"catching up\" on weekends.",
      "Experts recommend that adults get seven to eight hours of sleep per day, and go to bed at a fixed time as much as possible. In the hour before sleep, it's best to put down the phone and let the brain quiet down. After all, sleep is not a waste of time, but the most basic investment in your body.",
    ],
    questions: [
      { q: "长期缺乏睡眠会带来哪些后果？", a: "记忆力下降、免疫力变弱、情绪不稳定，甚至增加患心脏病的风险。" },
      { q: "专家建议成年人每天睡多长时间？", a: "七到八小时。" },
    ],
  },
  {
    id: "advanced-ai-work",
    difficulty: "advanced",
    band: "HSK 5–6",
    title: "人工智能与未来的工作",
    titleEn: "AI and the Future of Work",
    paragraphs: [
      "近年来，人工智能技术发展迅速，从自动翻译到无人驾驶，它正在深刻地改变着我们的生活。与此同时，一个问题也引起了广泛的讨论：人工智能会不会取代人类的工作？",
      "悲观者指出，许多重复性的工作，比如工厂流水线上的操作、简单的数据处理，已经开始被机器取代。乐观者则认为，历史上每一次技术革命虽然消灭了一些旧职业，但同时也创造了更多新的岗位——就像汽车取代马车后，出现了司机、修车工等职业一样。",
      "无论未来如何，有一点是确定的：社会对人的要求正在发生变化。与其担心被机器取代，不如把精力放在机器难以做到的事情上——创造力、沟通能力，以及不断学习新知识的能力。适应变化，也许才是这个时代最重要的技能。",
    ],
    translation: [
      "In recent years, artificial intelligence technology has developed rapidly. From automatic translation to self-driving cars, it is profoundly changing our lives. At the same time, one question has sparked wide discussion: will AI replace human jobs?",
      "Pessimists point out that many repetitive jobs — such as factory assembly line operations and simple data processing — are already being replaced by machines. Optimists argue that although every technological revolution in history has eliminated some old occupations, it has also created even more new positions — just as when cars replaced horse-drawn carriages, professions like drivers and mechanics appeared.",
      "Whatever the future holds, one thing is certain: society's demands on people are changing. Rather than worrying about being replaced by machines, it's better to focus your energy on what machines struggle to do — creativity, communication, and the ability to keep learning new things. Adapting to change may be the most important skill of this era.",
    ],
    questions: [
      { q: "悲观者认为哪些工作已经开始被取代？", a: "重复性的工作，比如工厂流水线上的操作、简单的数据处理。" },
      { q: "作者认为应该把精力放在什么上？", a: "创造力、沟通能力，以及不断学习新知识的能力。" },
    ],
  },
];
