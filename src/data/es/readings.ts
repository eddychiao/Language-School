import type { ReadingPassage } from "../readingTypes";

/** Original graded Spanish passages, bundled as static data for the same
 * reasons as the Chinese set (no public API exists; keeps the PWA offline).
 * Difficulty bands follow CEFR instead of HSK. */
export const READINGS_ES: ReadingPassage[] = [
  // ---------------------------------------------------------- beginner
  {
    id: "es-beginner-mi-rutina",
    difficulty: "beginner",
    band: "A1–A2",
    title: "Mi rutina diaria",
    titleEn: "My Daily Routine",
    paragraphs: [
      "Me levanto todos los días a las siete de la mañana. Primero me ducho y después desayuno. Normalmente como pan con mantequilla y bebo un café con leche.",
      "Trabajo en una oficina en el centro de la ciudad. Voy al trabajo en autobús porque no tengo coche. El viaje dura treinta minutos.",
      "Por la noche, ceno con mi familia a las nueve. Después vemos la televisión un rato. Me acuesto a las once y media. Mi vida es tranquila y me gusta así.",
    ],
    translation: [
      "I get up every day at seven in the morning. First I shower and then I have breakfast. I usually eat bread with butter and drink a coffee with milk.",
      "I work in an office in the city center. I go to work by bus because I don't have a car. The trip takes thirty minutes.",
      "At night, I have dinner with my family at nine. Afterwards we watch TV for a while. I go to bed at half past eleven. My life is calm and I like it that way.",
    ],
    questions: [
      { q: "¿A qué hora se levanta?", a: "A las siete de la mañana." },
      { q: "¿Cómo va al trabajo?", a: "En autobús, porque no tiene coche." },
    ],
  },
  {
    id: "es-beginner-mi-familia",
    difficulty: "beginner",
    band: "A1–A2",
    title: "Mi familia",
    titleEn: "My Family",
    paragraphs: [
      "En mi familia somos cinco: mi padre, mi madre, mis dos hermanos y yo. Vivimos en una casa pequeña cerca del mar.",
      "Mi padre es cocinero y trabaja en un restaurante. Mi madre es profesora de matemáticas. Mi hermano mayor estudia en la universidad y mi hermano pequeño va al colegio.",
      "Los domingos comemos todos juntos. Mi padre prepara paella, su plato favorito. Por la tarde paseamos por la playa. Me encanta pasar tiempo con mi familia.",
    ],
    translation: [
      "There are five of us in my family: my father, my mother, my two brothers, and me. We live in a small house near the sea.",
      "My father is a cook and works in a restaurant. My mother is a math teacher. My older brother studies at university and my little brother goes to school.",
      "On Sundays we all eat together. My father makes paella, his favorite dish. In the afternoon we walk along the beach. I love spending time with my family.",
    ],
    questions: [
      { q: "¿Cuántas personas hay en su familia?", a: "Cinco personas." },
      { q: "¿Qué prepara el padre los domingos?", a: "Paella, su plato favorito." },
    ],
  },
  {
    id: "es-beginner-en-el-mercado",
    difficulty: "beginner",
    band: "A1–A2",
    title: "En el mercado",
    titleEn: "At the Market",
    paragraphs: [
      "Hoy es sábado y voy al mercado con mi abuela. El mercado está en la plaza, cerca de nuestra casa.",
      "Compramos frutas y verduras: manzanas, naranjas, tomates y patatas. Las naranjas cuestan dos euros el kilo. También compramos pescado fresco.",
      "Mi abuela conoce a todos los vendedores. Habla mucho con ellos y siempre le dan las mejores frutas. Después del mercado, tomamos un chocolate caliente en un café. Es mi momento favorito de la semana.",
    ],
    translation: [
      "Today is Saturday and I'm going to the market with my grandmother. The market is in the square, near our house.",
      "We buy fruits and vegetables: apples, oranges, tomatoes, and potatoes. The oranges cost two euros per kilo. We also buy fresh fish.",
      "My grandmother knows all the vendors. She talks a lot with them and they always give her the best fruit. After the market, we have a hot chocolate at a café. It's my favorite moment of the week.",
    ],
    questions: [
      { q: "¿Cuánto cuestan las naranjas?", a: "Dos euros el kilo." },
      { q: "¿Qué toman después del mercado?", a: "Un chocolate caliente en un café." },
    ],
  },
  {
    id: "es-beginner-mi-ciudad",
    difficulty: "beginner",
    band: "A1–A2",
    title: "Mi ciudad",
    titleEn: "My City",
    paragraphs: [
      "Vivo en una ciudad pequeña en el sur de España. Hace sol casi todos los días y en verano hace mucho calor.",
      "En el centro hay una iglesia antigua, muchas tiendas y restaurantes. A los turistas les gusta visitar el castillo, que está en una montaña.",
      "Mi lugar favorito es el parque grande que está al lado del río. Allí juego al fútbol con mis amigos los fines de semana. Mi ciudad no es famosa, pero para mí es la mejor del mundo.",
    ],
    translation: [
      "I live in a small city in the south of Spain. It's sunny almost every day and in summer it's very hot.",
      "In the center there is an old church, many shops and restaurants. Tourists like to visit the castle, which is on a mountain.",
      "My favorite place is the big park next to the river. There I play soccer with my friends on weekends. My city isn't famous, but for me it's the best in the world.",
    ],
    questions: [
      { q: "¿Dónde está la ciudad?", a: "En el sur de España." },
      { q: "¿Qué les gusta visitar a los turistas?", a: "El castillo, que está en una montaña." },
    ],
  },
  {
    id: "es-beginner-el-cumpleanos",
    difficulty: "beginner",
    band: "A1–A2",
    title: "El cumpleaños de Ana",
    titleEn: "Ana's Birthday",
    paragraphs: [
      "Mañana es el cumpleaños de mi amiga Ana. Cumple veinte años y hace una fiesta en su casa.",
      "Quiero comprarle un regalo, pero no sé qué. A Ana le gusta leer y también le gusta la música. Al final, le compro un libro de su escritora favorita.",
      "En la fiesta comemos pizza y tarta de chocolate. Cantamos, bailamos y jugamos hasta muy tarde. Ana abre mi regalo y dice: “¡Es perfecto! ¡Muchas gracias!” Estoy muy contento.",
    ],
    translation: [
      "Tomorrow is my friend Ana's birthday. She's turning twenty and is having a party at her house.",
      "I want to buy her a gift, but I don't know what. Ana likes reading and she also likes music. In the end, I buy her a book by her favorite writer.",
      "At the party we eat pizza and chocolate cake. We sing, dance, and play until very late. Ana opens my gift and says: \"It's perfect! Thank you so much!\" I'm very happy.",
    ],
    questions: [
      { q: "¿Cuántos años cumple Ana?", a: "Veinte años." },
      { q: "¿Qué regalo le compra?", a: "Un libro de su escritora favorita." },
    ],
  },
  // ------------------------------------------------------ intermediate
  {
    id: "es-intermediate-viaje-mexico",
    difficulty: "intermediate",
    band: "B1",
    title: "Un viaje inolvidable",
    titleEn: "An Unforgettable Trip",
    paragraphs: [
      "El año pasado viajé a México con dos amigos. Era la primera vez que salíamos del país y estábamos muy emocionados. Pasamos dos semanas recorriendo el país: la capital, las playas del Caribe y varios pueblos pequeños.",
      "Lo que más me gustó fue la comida. Probamos tacos en puestos de la calle, y aunque al principio me daba un poco de miedo la comida picante, terminé pidiendo salsa extra en todas partes. La gente era amable y paciente con nuestro español.",
      "El último día, un señor mayor nos invitó a un café y nos contó historias de su juventud. Al despedirnos, nos dijo: “Viajar es la mejor escuela.” Creo que tenía razón: aprendí más español en dos semanas que en un año de clases.",
    ],
    translation: [
      "Last year I traveled to Mexico with two friends. It was the first time we had left the country and we were very excited. We spent two weeks touring the country: the capital, the Caribbean beaches, and several small towns.",
      "What I liked most was the food. We tried tacos at street stands, and although spicy food scared me a little at first, I ended up asking for extra salsa everywhere. People were kind and patient with our Spanish.",
      "On the last day, an elderly man invited us for coffee and told us stories from his youth. When we said goodbye, he told us: \"Traveling is the best school.\" I think he was right: I learned more Spanish in two weeks than in a year of classes.",
    ],
    questions: [
      { q: "¿Cuánto tiempo pasaron en México?", a: "Dos semanas." },
      { q: "¿Qué le dijo el señor mayor al despedirse?", a: "“Viajar es la mejor escuela.”" },
    ],
  },
  {
    id: "es-intermediate-aprender-cocinar",
    difficulty: "intermediate",
    band: "B1",
    title: "Aprendiendo a cocinar",
    titleEn: "Learning to Cook",
    paragraphs: [
      "Cuando me mudé a mi propio apartamento, me di cuenta de que no sabía cocinar nada. Durante el primer mes, comí casi todos los días comida a domicilio, lo cual era caro y poco saludable.",
      "Decidí aprender viendo vídeos en internet. Al principio todo me salía mal: quemé el arroz, la tortilla se me rompió y una vez confundí la sal con el azúcar. Mi madre se reía cuando se lo contaba por teléfono, pero siempre me animaba a seguir intentándolo.",
      "Seis meses después, ya sé preparar varios platos bastante bien. El mes pasado invité a mis padres a cenar y preparé una lasaña casera. Mi madre me pidió la receta, aunque sospecho que solo quería hacerme sentir orgulloso. Funcionó.",
    ],
    translation: [
      "When I moved into my own apartment, I realized I didn't know how to cook anything. During the first month, I ate delivery food almost every day, which was expensive and unhealthy.",
      "I decided to learn by watching videos online. At first everything went wrong: I burned the rice, my omelet fell apart, and once I confused salt with sugar. My mother laughed when I told her on the phone, but she always encouraged me to keep trying.",
      "Six months later, I can now prepare several dishes quite well. Last month I invited my parents to dinner and made a homemade lasagna. My mother asked me for the recipe, though I suspect she just wanted to make me feel proud. It worked.",
    ],
    questions: [
      { q: "¿Por qué decidió aprender a cocinar?", a: "Porque la comida a domicilio era cara y poco saludable." },
      { q: "¿Qué preparó para sus padres?", a: "Una lasaña casera." },
    ],
  },
  {
    id: "es-intermediate-ciudad-nueva",
    difficulty: "intermediate",
    band: "B1",
    title: "Una nueva vida",
    titleEn: "A New Life",
    paragraphs: [
      "Hace un año me mudé de mi pueblo a la capital por motivos de trabajo. Al principio todo me parecía difícil: el metro estaba siempre lleno, la gente caminaba demasiado rápido y nadie tenía tiempo para conversar.",
      "Lo peor era la soledad. Los fines de semana, mientras mis compañeros salían con sus familias, yo me quedaba en casa viendo series. Más de una vez pensé en volver a mi pueblo, donde todos me conocían.",
      "Todo cambió cuando me apunté a un club de senderismo. Cada domingo salíamos a caminar por las montañas cercanas, y poco a poco hice buenos amigos. Ahora la ciudad ya no me parece fría. He aprendido que sentirse en casa no depende del lugar, sino de las personas.",
    ],
    translation: [
      "A year ago I moved from my small town to the capital for work. At first everything seemed difficult: the metro was always full, people walked too fast, and nobody had time to chat.",
      "The worst part was the loneliness. On weekends, while my coworkers went out with their families, I stayed home watching series. More than once I thought about returning to my town, where everyone knew me.",
      "Everything changed when I joined a hiking club. Every Sunday we went walking in the nearby mountains, and little by little I made good friends. Now the city no longer seems cold to me. I've learned that feeling at home doesn't depend on the place, but on the people.",
    ],
    questions: [
      { q: "¿Por qué se mudó a la capital?", a: "Por motivos de trabajo." },
      { q: "¿Qué cambió su vida en la ciudad?", a: "Se apuntó a un club de senderismo e hizo buenos amigos." },
    ],
  },
  {
    id: "es-intermediate-telefono-perdido",
    difficulty: "intermediate",
    band: "B1",
    title: "El teléfono perdido",
    titleEn: "The Lost Phone",
    paragraphs: [
      "El martes pasado perdí mi teléfono en el tren. Me di cuenta al llegar a casa y me puse muy nervioso: allí tenía todas mis fotos, mis contactos y hasta mis tarjetas del banco.",
      "Llamé a mi número desde el teléfono de mi hermana, sin muchas esperanzas. Para mi sorpresa, contestó una chica. Había encontrado el teléfono en el asiento y lo había guardado esperando mi llamada.",
      "Quedamos al día siguiente en una cafetería. Quise invitarla a un café como agradecimiento, pero no aceptó. “Yo perdí mi cartera hace unos meses y alguien me la devolvió”, me explicó sonriendo. “Solo estoy devolviendo el favor al mundo.” Desde entonces, intento hacer lo mismo.",
    ],
    translation: [
      "Last Tuesday I lost my phone on the train. I realized when I got home and became very nervous: it had all my photos, my contacts, and even my bank cards.",
      "I called my number from my sister's phone, without much hope. To my surprise, a girl answered. She had found the phone on the seat and kept it waiting for my call.",
      "We met the next day at a café. I wanted to buy her a coffee as thanks, but she wouldn't accept. \"I lost my wallet a few months ago and someone returned it to me,\" she explained, smiling. \"I'm just returning the favor to the world.\" Since then, I try to do the same.",
    ],
    questions: [
      { q: "¿Dónde perdió el teléfono?", a: "En el tren." },
      { q: "¿Por qué la chica no aceptó el café?", a: "Porque solo estaba devolviendo el favor al mundo." },
    ],
  },
  {
    id: "es-intermediate-mercadillo",
    difficulty: "intermediate",
    band: "B1",
    title: "El mercadillo del barrio",
    titleEn: "The Neighborhood Flea Market",
    paragraphs: [
      "Todos los primeros domingos del mes, en la plaza de mi barrio se organiza un mercadillo de segunda mano. Los vecinos venden libros, ropa, juguetes y objetos antiguos a precios muy baratos.",
      "Al principio yo iba solo para pasar el rato, pero pronto descubrí verdaderos tesoros: una cámara de fotos antigua que todavía funciona, novelas descatalogadas y una guitarra que ahora estoy aprendiendo a tocar.",
      "Además de comprar barato, el mercadillo tiene otra ventaja: dar una segunda vida a las cosas es bueno para el medio ambiente. Y lo mejor de todo es el ambiente: los vecinos charlan, negocian y se conocen mejor. Creo que estos mercadillos hacen que el barrio sea más humano.",
    ],
    translation: [
      "Every first Sunday of the month, a second-hand flea market is organized in my neighborhood square. Neighbors sell books, clothes, toys, and antiques at very cheap prices.",
      "At first I went just to pass the time, but I soon discovered real treasures: an old camera that still works, out-of-print novels, and a guitar I'm now learning to play.",
      "Besides buying cheaply, the flea market has another advantage: giving things a second life is good for the environment. And best of all is the atmosphere: neighbors chat, haggle, and get to know each other better. I think these markets make the neighborhood more human.",
    ],
    questions: [
      { q: "¿Cuándo se organiza el mercadillo?", a: "Todos los primeros domingos del mes." },
      { q: "¿Qué está aprendiendo a tocar?", a: "Una guitarra que compró en el mercadillo." },
    ],
  },
  // ---------------------------------------------------------- advanced
  {
    id: "es-advanced-campo-ciudad",
    difficulty: "advanced",
    band: "B2–C1",
    title: "Entre el campo y la ciudad",
    titleEn: "Between Country and City",
    paragraphs: [
      "Durante décadas, los pueblos españoles han visto cómo sus jóvenes se marchaban a las grandes ciudades en busca de oportunidades. Este fenómeno, conocido como la “España vaciada”, ha dejado comarcas enteras con escuelas cerradas, consultas médicas sin médico y calles cada vez más silenciosas.",
      "Sin embargo, en los últimos años se percibe un cambio de tendencia. El teletrabajo, el precio inalcanzable de la vivienda urbana y el deseo de una vida más tranquila han llevado a muchas familias a plantearse el camino inverso. Algunos ayuntamientos ofrecen incluso vivienda gratuita o ayudas económicas a quienes se instalen en sus municipios.",
      "Los expertos advierten de que estas iniciativas, aunque valiosas, no bastan por sí solas: sin buena conexión a internet, transporte y servicios básicos, pocos recién llegados echarán raíces. El futuro del mundo rural no depende de gestos aislados, sino de una apuesta sostenida por hacer que vivir en un pueblo no implique renunciar a nada esencial.",
    ],
    translation: [
      "For decades, Spanish villages have watched their young people leave for the big cities in search of opportunities. This phenomenon, known as \"emptied Spain,\" has left entire regions with closed schools, medical clinics without doctors, and increasingly silent streets.",
      "However, in recent years a shift in the trend can be seen. Remote work, the unattainable price of urban housing, and the desire for a quieter life have led many families to consider the reverse path. Some town councils even offer free housing or financial aid to those who settle in their municipalities.",
      "Experts warn that these initiatives, though valuable, are not enough on their own: without good internet connection, transportation, and basic services, few newcomers will put down roots. The future of rural areas doesn't depend on isolated gestures, but on a sustained commitment to ensuring that living in a village doesn't mean giving up anything essential.",
    ],
    questions: [
      { q: "¿Qué es la “España vaciada”?", a: "El fenómeno de los pueblos que pierden a sus jóvenes, que se marchan a las grandes ciudades." },
      { q: "¿Qué ofrecen algunos ayuntamientos?", a: "Vivienda gratuita o ayudas económicas a quienes se instalen en sus municipios." },
    ],
  },
  {
    id: "es-advanced-redes-sociales",
    difficulty: "advanced",
    band: "B2–C1",
    title: "La vida en escaparate",
    titleEn: "Life on Display",
    paragraphs: [
      "Las redes sociales nos prometieron conexión, y en cierto modo la han cumplido: hoy es posible mantener el contacto con amigos que viven a miles de kilómetros o encontrar comunidades que comparten nuestras aficiones más minoritarias.",
      "Pero esa promesa tiene un reverso inquietante. Al convertir la vida cotidiana en un escaparate, muchos usuarios sienten la presión constante de mostrar una existencia perfecta: viajes envidiables, cuerpos ideales, éxitos profesionales. La comparación permanente con vidas cuidadosamente editadas se ha relacionado con el aumento de la ansiedad, especialmente entre los adolescentes.",
      "No se trata de demonizar la tecnología, sino de usarla con criterio. Algunos pequeños gestos ayudan: silenciar las cuentas que nos hacen sentir mal, establecer horarios sin pantallas y recordar, cada vez que abrimos la aplicación, que nadie publica sus fracasos. La vida real, con sus imperfecciones, sigue ocurriendo fuera de la pantalla.",
    ],
    translation: [
      "Social media promised us connection, and in a way it has delivered: today it's possible to keep in touch with friends who live thousands of kilometers away, or find communities that share our most niche hobbies.",
      "But that promise has a troubling flip side. By turning daily life into a display window, many users feel constant pressure to show a perfect existence: enviable trips, ideal bodies, professional successes. Permanent comparison with carefully edited lives has been linked to rising anxiety, especially among teenagers.",
      "It's not about demonizing technology, but about using it wisely. Some small habits help: muting accounts that make us feel bad, setting screen-free hours, and remembering, every time we open the app, that nobody posts their failures. Real life, with its imperfections, keeps happening off-screen.",
    ],
    questions: [
      { q: "¿Con qué se ha relacionado la comparación constante en redes?", a: "Con el aumento de la ansiedad, especialmente entre los adolescentes." },
      { q: "¿Qué gestos recomienda el texto?", a: "Silenciar cuentas que nos hacen sentir mal, establecer horarios sin pantallas y recordar que nadie publica sus fracasos." },
    ],
  },
  {
    id: "es-advanced-siesta",
    difficulty: "advanced",
    band: "B2–C1",
    title: "En defensa de la siesta",
    titleEn: "In Defense of the Siesta",
    paragraphs: [
      "Pocos tópicos sobre España están tan extendidos como el de la siesta. Paradójicamente, las encuestas indican que menos de un veinte por ciento de los españoles la practica a diario: los horarios laborales modernos y los desplazamientos largos la han convertido en un lujo reservado para fines de semana y vacaciones.",
      "Resulta irónico que, mientras España abandona la siesta, la ciencia no deja de reivindicarla. Numerosos estudios sugieren que una siesta breve, de veinte a treinta minutos, mejora la concentración, la memoria y el estado de ánimo. Algunas empresas tecnológicas, siempre atentas a la productividad, han instalado incluso salas de descanso para sus empleados.",
      "Quizá el error haya sido considerar la siesta un símbolo de pereza en lugar de lo que realmente es: una forma inteligente de escuchar al cuerpo. En un mundo que presume de estar siempre ocupado, detenerse veinte minutos puede ser, más que un capricho, un acto de sensatez.",
    ],
    translation: [
      "Few clichés about Spain are as widespread as the siesta. Paradoxically, surveys indicate that fewer than twenty percent of Spaniards take one daily: modern work schedules and long commutes have turned it into a luxury reserved for weekends and holidays.",
      "It's ironic that while Spain abandons the siesta, science keeps vindicating it. Numerous studies suggest that a short nap, twenty to thirty minutes, improves concentration, memory, and mood. Some tech companies, always attentive to productivity, have even installed nap rooms for their employees.",
      "Perhaps the mistake was considering the siesta a symbol of laziness instead of what it really is: an intelligent way of listening to the body. In a world that boasts of being always busy, stopping for twenty minutes may be, more than an indulgence, an act of good sense.",
    ],
    questions: [
      { q: "¿Qué porcentaje de españoles duerme la siesta a diario?", a: "Menos de un veinte por ciento." },
      { q: "¿Qué beneficios tiene una siesta breve según los estudios?", a: "Mejora la concentración, la memoria y el estado de ánimo." },
    ],
  },
  {
    id: "es-advanced-idiomas",
    difficulty: "advanced",
    band: "B2–C1",
    title: "El cerebro bilingüe",
    titleEn: "The Bilingual Brain",
    paragraphs: [
      "Aprender un idioma de adulto tiene fama de ser una batalla perdida. Se repite con frecuencia que solo los niños pueden alcanzar la fluidez, y que a partir de cierta edad la memoria ya no da para tanto. La neurociencia actual, sin embargo, ofrece un panorama bastante más alentador.",
      "Es cierto que los niños adquieren el acento con más facilidad, pero los adultos cuentan con ventajas propias: mayor disciplina, estrategias de aprendizaje más desarrolladas y una comprensión gramatical que los pequeños no poseen. Diversos estudios muestran, además, que el aprendizaje de idiomas a cualquier edad fortalece la llamada reserva cognitiva y podría retrasar la aparición de enfermedades como el alzhéimer.",
      "La clave, coinciden los expertos, no está en la edad sino en la constancia y en la exposición real a la lengua: conversar, leer, equivocarse y volver a intentarlo. Más que un talento innato, dominar un idioma es la suma de miles de pequeños encuentros con él. Nunca es tarde para empezar a acumularlos.",
    ],
    translation: [
      "Learning a language as an adult has a reputation for being a lost battle. It's often repeated that only children can achieve fluency, and that past a certain age memory just isn't up to it. Modern neuroscience, however, offers a considerably more encouraging picture.",
      "It's true that children pick up accents more easily, but adults have advantages of their own: greater discipline, more developed learning strategies, and a grammatical understanding that children lack. Various studies also show that language learning at any age strengthens the so-called cognitive reserve and could delay the onset of diseases like Alzheimer's.",
      "The key, experts agree, is not age but consistency and real exposure to the language: conversing, reading, making mistakes, and trying again. More than an innate talent, mastering a language is the sum of thousands of small encounters with it. It's never too late to start accumulating them.",
    ],
    questions: [
      { q: "¿Qué ventajas tienen los adultos al aprender idiomas?", a: "Mayor disciplina, estrategias de aprendizaje más desarrolladas y una comprensión gramatical que los niños no poseen." },
      { q: "Según los expertos, ¿cuál es la clave para dominar un idioma?", a: "La constancia y la exposición real a la lengua, no la edad." },
    ],
  },
  {
    id: "es-advanced-turismo",
    difficulty: "advanced",
    band: "B2–C1",
    title: "El precio del turismo",
    titleEn: "The Price of Tourism",
    paragraphs: [
      "El turismo es uno de los motores económicos de España: aporta en torno al doce por ciento del producto interior bruto y da empleo a millones de personas. Cada verano, ciudades como Barcelona o Palma reciben a más visitantes de los que sus calles parecen capaces de absorber.",
      "Ese éxito, sin embargo, tiene efectos secundarios cada vez más visibles. En los barrios más turísticos, los alquileres se han disparado y los comercios tradicionales han sido sustituidos por tiendas de recuerdos. Muchos vecinos de toda la vida se han visto obligados a mudarse, y algunos hablan abiertamente de sentirse extraños en su propia ciudad.",
      "Ante esta situación, varias ciudades ensayan medidas como limitar los pisos turísticos o las tasas a los visitantes. El debate de fondo, no obstante, sigue abierto: ¿cómo repartir los beneficios del turismo sin sacrificar la vida de quienes habitan los lugares que lo hacen posible? La respuesta definirá el rostro de muchas ciudades en las próximas décadas.",
    ],
    translation: [
      "Tourism is one of Spain's economic engines: it contributes around twelve percent of GDP and employs millions of people. Every summer, cities like Barcelona and Palma receive more visitors than their streets seem capable of absorbing.",
      "That success, however, has increasingly visible side effects. In the most touristy neighborhoods, rents have skyrocketed and traditional shops have been replaced by souvenir stores. Many lifelong residents have been forced to move, and some speak openly of feeling like strangers in their own city.",
      "Faced with this situation, several cities are trying measures such as limiting tourist apartments or charging visitor taxes. The underlying debate, however, remains open: how do you distribute the benefits of tourism without sacrificing the lives of those who inhabit the places that make it possible? The answer will define the face of many cities in the coming decades.",
    ],
    questions: [
      { q: "¿Cuánto aporta el turismo a la economía española?", a: "En torno al doce por ciento del producto interior bruto." },
      { q: "¿Qué medidas ensayan algunas ciudades?", a: "Limitar los pisos turísticos o poner tasas a los visitantes." },
    ],
  },
];
