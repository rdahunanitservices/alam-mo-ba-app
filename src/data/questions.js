// ============================================================
// QUESTION BANK — Edit this file to add/remove questions!
// Each topic has easy, normal, and hard arrays.
// c = correct answer index (0-based), e = explanation
// ============================================================

const questions = {
  history: {
    easy: [
      { q: "Sino ang sumulat ng Noli Me Tangere?", o: ["Marcelo del Pilar", "Jose Rizal", "Andres Bonifacio", "Apolinario Mabini"], c: 1, e: "Isinulat ni Jose Rizal ang Noli Me Tangere noong 1887 sa Berlin." },
      { q: "Anong taon idineklara ang kalayaan ng Pilipinas mula sa Spain?", o: ["1896", "1898", "1900", "1901"], c: 1, e: "June 12, 1898 sa Kawit, Cavite — araw ng kalayaan!" },
      { q: "Sino ang Supremo ng Katipunan?", o: ["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"], c: 1, e: "Si Andres Bonifacio ang Supremo ng KKK." },
      { q: "Who was the first President of the Philippines?", o: ["Manuel Quezon", "Emilio Aguinaldo", "Jose P. Laurel", "Sergio Osmena"], c: 1, e: "Emilio Aguinaldo — first president of the First Philippine Republic in 1899." },
      { q: "Sino ang Ama ng Wikang Filipino?", o: ["Jose Rizal", "Andres Bonifacio", "Manuel L. Quezon", "Emilio Aguinaldo"], c: 2, e: "Si Manuel L. Quezon ang champion ng national language." },
      { q: "Saan naganap ang Cry of Pugad Lawin?", o: ["Cavite", "Quezon City", "Bulacan", "Manila"], c: 1, e: "Sa kasalukuyang Quezon City noong August 1896." },
      { q: "Anong taon naging Commonwealth ang Pilipinas?", o: ["1935", "1942", "1946", "1898"], c: 0, e: "November 15, 1935 — Philippine Commonwealth established." },
      { q: "The EDSA Revolution is also known as?", o: ["Yellow Revolution", "Velvet Revolution", "People Power Revolution", "Freedom Revolution"], c: 2, e: "The 1986 EDSA People Power Revolution peacefully ousted Marcos." },
    ],
    normal: [
      { q: "What is the longest-running revolt in Philippine history?", o: ["Dagohoy Revolt", "Silang Revolt", "Bankaw Revolt", "Malong Revolt"], c: 0, e: "Dagohoy Revolt — 85 years (1744-1829) in Bohol." },
      { q: "Sino ang nagtatag ng La Liga Filipina?", o: ["Andres Bonifacio", "Jose Rizal", "Marcelo del Pilar", "Graciano Lopez Jaena"], c: 1, e: "Itinatag ni Rizal ang La Liga Filipina noong 1892 sa Manila." },
      { q: "What treaty ended Spanish rule in the Philippines?", o: ["Treaty of Manila", "Treaty of Paris", "Treaty of Berlin", "Treaty of Madrid"], c: 1, e: "The Treaty of Paris (1898) transferred the Philippines to the US." },
      { q: "Sino ang Utak ng Katipunan?", o: ["Andres Bonifacio", "Emilio Jacinto", "Pio Valenzuela", "Macario Sakay"], c: 1, e: "Si Emilio Jacinto ang tinaguriang Utak ng Katipunan." },
      { q: "Saan isinilang si Jose Rizal?", o: ["Manila", "Batangas", "Calamba, Laguna", "Cavite"], c: 2, e: "Si Jose Rizal ay ipinanganak sa Calamba, Laguna noong June 19, 1861." },
    ],
    hard: [
      { q: "What was the Biak-na-Bato Republic?", o: ["A government under Aguinaldo", "A Katipunan faction", "A Spanish fortress", "A rebel stronghold in Bataan"], c: 0, e: "The Biak-na-Bato Republic was established by Aguinaldo in 1897 in Bulacan." },
      { q: "Who wrote the Philippine Declaration of Independence?", o: ["Emilio Aguinaldo", "Ambrosio Rianzares Bautista", "Apolinario Mabini", "Felipe Agoncillo"], c: 1, e: "Ambrosio Rianzares Bautista drafted and read the Philippine Declaration of Independence." },
      { q: "What does KKK stand for in the Katipunan full name?", o: ["Kataastaasang Kilusan ng Kalayaan", "Kataastaasang Kagalang-galangang Katipunan ng mga Anak ng Bayan", "Kilusang Katipunero ng Katipunan", "Kataas-taasang Katipunero"], c: 1, e: "KKK = Kataastaasang Kagalang-galangang Katipunan ng mga Anak ng Bayan." },
      { q: "Who was the last Filipino president of the Commonwealth?", o: ["Manuel Quezon", "Sergio Osmena", "Jose P. Laurel", "Elpidio Quirino"], c: 1, e: "Sergio Osmena served as Commonwealth president after Quezon died in 1944." },
    ]
  },

  food: {
    easy: [
      { q: "Anong probinsya ang Sisig Capital?", o: ["Bulacan", "Pampanga", "Tarlac", "Bataan"], c: 1, e: "Pampanga — lalo na ang Angeles City — ang kilala bilang sisig capital." },
      { q: "Main ingredient of kare-kare?", o: ["Pork belly", "Oxtail", "Chicken", "Fish"], c: 1, e: "Kare-kare — oxtail in a thick peanut sauce." },
      { q: "What Filipino dessert is made from purple yam?", o: ["Leche flan", "Ube halaya", "Biko", "Turon"], c: 1, e: "Ube halaya — sweet jam from boiled mashed purple yam." },
      { q: "Ano ang tawag sa garlic fried rice?", o: ["Kanin", "Sinangag", "Arroz", "Lugaw"], c: 1, e: "Sinangag — ang iconic na garlic fried rice ng Pinoy!" },
      { q: "What is balut?", o: ["Fried quail eggs", "Fertilized duck egg", "Salted egg", "Boiled chicken egg"], c: 1, e: "Balut — fertilized developing duck egg, popular street food." },
      { q: "Pangunahing sangkap ng Bicol Express?", o: ["Bagoong", "Coconut milk at sili", "Tamarind", "Soy sauce"], c: 1, e: "Bicol Express uses gata (coconut milk) and lots of sili." },
      { q: "Silog comes from what two words?", o: ["Sinigang + Log", "Sinangag + Itlog", "Sino + Alog", "Sitsaron + Log"], c: 1, e: "Silog = Sinangag (garlic rice) + Itlog (egg)!" },
      { q: "Which region is known for bagnet?", o: ["Cebu", "Ilocos", "Bicol", "Davao"], c: 1, e: "Bagnet — crispy deep-fried pork belly from the Ilocos region." },
    ],
    normal: [
      { q: "What souring agent is used in sinigang?", o: ["Vinegar", "Tamarind", "Calamansi", "Tomato"], c: 1, e: "Traditional sinigang uses sampaloc (tamarind)." },
      { q: "Ano ang pambansang pagkain ng Pilipinas?", o: ["Adobo", "Sinigang", "Lechon", "Kare-kare"], c: 0, e: "Adobo is widely considered the unofficial national dish." },
      { q: "What cheese is used in traditional ensaymada?", o: ["Eden cheese", "Edam (Queso de Bola)", "Cheddar", "Cream cheese"], c: 1, e: "Traditional ensaymada uses Edam cheese (queso de bola)." },
      { q: "Saang probinsya sikat ang Chicken Inasal?", o: ["Cebu", "Bacolod", "Iloilo", "Davao"], c: 1, e: "Chicken Inasal originated in Bacolod City, Negros Occidental." },
      { q: "What is kinilaw?", o: ["Grilled fish", "Raw seafood cured in vinegar", "Deep fried squid", "Boiled shellfish"], c: 1, e: "Kinilaw — Filipino ceviche, raw seafood cured in vinegar or calamansi." },
    ],
    hard: [
      { q: "Primary ingredient of dinuguan?", o: ["Pork liver", "Pork blood", "Chicken giblets", "Beef tripe"], c: 1, e: "Dinuguan — savory stew cooked in pig's blood." },
      { q: "Anong probinsya ang pinakasikat sa tuba (palm wine)?", o: ["Pampanga", "Ilocos Norte", "Quezon", "Batangas"], c: 1, e: "Ilocos Norte is famous for basi and tuba — traditional Ilocano drinks." },
      { q: "What is burong isda?", o: ["Smoked fish", "Fermented rice and fish", "Dried fish", "Salted fish"], c: 1, e: "Burong isda — Kapampangan fermented rice and freshwater fish." },
      { q: "What makes Vigan longganisa unique?", o: ["It's sweet", "Very garlicky and small", "Made of chicken", "It's smoked"], c: 1, e: "Vigan longganisa — very garlicky, small, reddish, from Ilocos Sur." },
    ]
  },

  culture: {
    easy: [
      { q: "What is mano po?", o: ["A dance", "A greeting to elders", "A type of food", "A prayer"], c: 1, e: "Mano po — pressing an elder's hand to your forehead as respect." },
      { q: "What is bayanihan?", o: ["A type of boat", "Community spirit of helping", "A martial art", "A traditional song"], c: 1, e: "Bayanihan — Filipino tradition of communal unity." },
      { q: "Ano ang pasalubong?", o: ["A souvenir or gift from a trip", "A type of dance", "A greeting", "A holiday"], c: 0, e: "Pasalubong — bringing gifts when coming home from a trip." },
      { q: "Anong festival ang pinakamalaki sa Cebu?", o: ["Ati-Atihan", "Sinulog", "Pahiyas", "MassKara"], c: 1, e: "Sinulog Festival — tuwing third Sunday of January sa Cebu." },
      { q: "Pambansang sayaw ng Pilipinas?", o: ["Tinikling", "Pandanggo sa Ilaw", "Carinosa", "Kuratsa"], c: 2, e: "Ang Carinosa ang opisyal na national dance ng Pilipinas." },
      { q: "What do po and opo signify?", o: ["Agreement", "Respect", "Excitement", "Sadness"], c: 1, e: "Po and opo — used to show respect to elders." },
      { q: "Tawag sa Pinoy gesture ng pag-point gamit ang lips?", o: ["Nguso", "Tingin", "Kilay", "Turo"], c: 0, e: "Ang nguso o lip pointing ay uniquely Filipino!" },
      { q: "Saan ginagawa ang MassKara Festival?", o: ["Iloilo", "Bacolod", "Davao", "Zamboanga"], c: 1, e: "MassKara Festival — Bacolod City tuwing October." },
    ],
    normal: [
      { q: "Which Filipino value means debt of gratitude?", o: ["Hiya", "Utang na loob", "Pakikisama", "Bayanihan"], c: 1, e: "Utang na loob — owing gratitude and reciprocating kindness." },
      { q: "What is harana?", o: ["A type of dance", "Serenading a girl outside her home", "A festival", "A wedding ceremony"], c: 1, e: "Harana — traditional Filipino courtship by serenading a woman." },
      { q: "Saan ginagawa ang Pahiyas Festival?", o: ["Cebu", "Quezon", "Ilocos", "Pampanga"], c: 1, e: "Pahiyas Festival — Lucban, Quezon, May 15, with rice decorations." },
      { q: "What is the national flower of the Philippines?", o: ["Rose", "Sampaguita", "Waling-waling", "Ilang-ilang"], c: 1, e: "Sampaguita (Jasminum sambac) — national flower of the Philippines." },
      { q: "What is the national martial art of the Philippines?", o: ["Karate", "Arnis/Eskrima", "Judo", "Wushu"], c: 1, e: "Arnis (also Eskrima or Kali) — national martial art." },
    ],
    hard: [
      { q: "What is Pintados Festival known for?", o: ["Street dancing", "Traditional tattoo art and body painting", "Giant lanterns", "Fluvial processions"], c: 1, e: "Pintados Festival in Tacloban — celebrates ancient Visayan warrior tattooing." },
      { q: "What is ambahan in Hanunuo Mangyan culture?", o: ["A dance", "A type of boat", "A form of poetry", "A weapon"], c: 2, e: "Ambahan — poetic form of the Hanunuo Mangyan people of Mindoro." },
      { q: "What does lihi mean in Filipino superstition?", o: ["Bad luck", "Prenatal influence on a child from mother's cravings", "A curse", "A blessing"], c: 1, e: "Lihi — belief that a mother's cravings affect the child's traits." },
    ]
  },

  geo: {
    easy: [
      { q: "Ilan ang islands ng Pilipinas?", o: ["5,000", "7,641", "10,000", "3,500"], c: 1, e: "7,641 islands — based on the latest NAMRIA count." },
      { q: "Pinakamataas na bundok sa Pilipinas?", o: ["Mt. Pinatubo", "Mt. Apo", "Mt. Pulag", "Mt. Mayon"], c: 1, e: "Mt. Apo in Davao — 2,954 meters, highest peak." },
      { q: "Saang probinsya ang Chocolate Hills?", o: ["Cebu", "Bohol", "Palawan", "Leyte"], c: 1, e: "Chocolate Hills — Bohol! Mahigit 1,200 cone-shaped hills." },
      { q: "Largest island in the Philippines?", o: ["Mindanao", "Visayas", "Luzon", "Palawan"], c: 2, e: "Luzon — about 109,965 sq km." },
      { q: "Summer Capital of the Philippines?", o: ["Tagaytay", "Baguio", "Davao", "Sagada"], c: 1, e: "Baguio City — cool mountain climate." },
      { q: "Pinakamahaba na ilog sa Pilipinas?", o: ["Pasig River", "Cagayan River", "Agusan River", "Pampanga River"], c: 1, e: "Cagayan River — 505 km long." },
      { q: "Saan ang Tubbataha Reefs?", o: ["Palawan", "Cebu", "Mindoro", "Bohol"], c: 0, e: "Tubbataha Reefs — Sulu Sea, part of Palawan." },
      { q: "Pinakamaliit na active volcano sa mundo na nasa Pilipinas?", o: ["Mt. Pinatubo", "Taal Volcano", "Mt. Mayon", "Mt. Hibok-Hibok"], c: 1, e: "Taal Volcano sa Batangas — pinakamaliit na active volcano." },
    ],
    normal: [
      { q: "Deepest lake in the Philippines?", o: ["Laguna de Bay", "Lake Sebu", "Lake Lanao", "Taal Lake"], c: 2, e: "Lake Lanao in Mindanao — deepest at about 112m." },
      { q: "Saang probinsya ang Puerto Princesa Underground River?", o: ["Cebu", "Mindoro", "Palawan", "Bohol"], c: 2, e: "Puerto Princesa Subterranean River — UNESCO World Heritage in Palawan." },
      { q: "Largest lake in the Philippines?", o: ["Taal Lake", "Laguna de Bay", "Lake Lanao", "Buhi Lake"], c: 1, e: "Laguna de Bay — largest lake in the Philippines." },
      { q: "Province with the most islands?", o: ["Palawan", "Cebu", "Sulu", "Romblon"], c: 0, e: "Palawan — over 1,700 islands and islets." },
      { q: "Capital of the Cordillera Administrative Region?", o: ["Baguio City", "Tabuk", "Lagawe", "Bontoc"], c: 0, e: "Baguio City — regional center of CAR." },
    ],
    hard: [
      { q: "Southernmost point of the Philippines?", o: ["Tawi-Tawi", "Sibutu Island", "Cape San Agustin", "Balut Island"], c: 1, e: "Sibutu Island in Tawi-Tawi — southernmost island." },
      { q: "Total area of the Philippines in sq km?", o: ["200,170", "298,170", "340,000", "189,000"], c: 1, e: "Philippines total land area — approximately 298,170 sq km." },
      { q: "What is the deepest trench near the Philippines?", o: ["Mariana Trench", "Philippine Trench", "Sulu Trench", "Manila Trench"], c: 0, e: "The Mariana Trench, east of Philippines, is the deepest on Earth." },
    ]
  },

  popculture: {
    easy: [
      { q: "Classic Filipino game involving a slipper?", o: ["Patintero", "Tumbang preso", "Luksong tinik", "Agawan base"], c: 1, e: "Tumbang preso — uses a tsinelas to knock down a tin can." },
      { q: "Sino ang Star for All Seasons?", o: ["Nora Aunor", "Vilma Santos", "Sharon Cuneta", "Sarah Geronimo"], c: 1, e: "Vilma Santos — Star for All Seasons in Philippine cinema." },
      { q: "Anong laro ang piko?", o: ["Tag", "Hopscotch", "Hide and seek", "Jump rope"], c: 1, e: "Piko — Filipino hopscotch." },
      { q: "Philippine King of Comedy?", o: ["Vice Ganda", "Dolphy", "Vic Sotto", "Jose de Leon"], c: 1, e: "Dolphy (Rodolfo Vera Quizon Sr.) — King of Philippine Comedy." },
      { q: "Ano ang hugot?", o: ["A dance move", "Deep emotional lines", "A type of food", "A sport"], c: 1, e: "Hugot — deep emotional quotes or pickup lines." },
      { q: "Filipino bamboo jaw harp?", o: ["Kulintang", "Banduria", "Kubing", "Rondalla"], c: 2, e: "Kubing — bamboo jaw harp used by indigenous groups." },
      { q: "Mars Ravelo Pinoy superheroes?", o: ["Captain Barbell only", "Darna only", "Panday", "Both Captain Barbell and Darna"], c: 3, e: "Darna at Captain Barbell — parehong creation ni Mars Ravelo!" },
      { q: "Filipino card game like Crazy Eights?", o: ["Pusoy Dos", "Tongits", "Unggoy-ungguyan", "Mahjong"], c: 2, e: "Unggoy-ungguyan — Filipino Crazy Eights." },
    ],
    normal: [
      { q: "ABS-CBN's iconic Sunday variety show?", o: ["ASAP", "Party Pilipinas", "SOP", "GGV"], c: 0, e: "ASAP — ABS-CBN's long-running Sunday variety show." },
      { q: "When did Shake, Rattle and Roll premiere?", o: ["1984", "1990", "1988", "1980"], c: 0, e: "Shake, Rattle and Roll premiered in 1984 — OG Filipino horror anthology." },
      { q: "Game that uses a rubber band string at varying heights?", o: ["Patintero", "Chinese garter", "Luksong baka", "Habulan"], c: 1, e: "Chinese garter — jump over elastic band at different heights." },
      { q: "Sino ang Asia's Songbird?", o: ["Sarah Geronimo", "Regine Velasquez", "Lea Salonga", "Morissette"], c: 1, e: "Regine Velasquez — Asia's Songbird." },
      { q: "What is patintero?", o: ["A card game", "A street game with lines and runners", "A dance", "A song"], c: 1, e: "Patintero — a street game where taggers guard lines while runners try to pass." },
    ],
    hard: [
      { q: "What is the pre-colonial Visayan term for gender-fluid spiritual leaders?", o: ["Babaylan", "Asog", "Bayot", "Binabae"], c: 1, e: "Asog — pre-colonial Visayan term for gender-fluid spiritual leaders." },
      { q: "What is pantomina in Sorsogon?", o: ["A puppet show", "A courtship dance festival", "A street parade", "A type of music"], c: 1, e: "Pantomina — courtship dance festival in Sorsogon, also called dance of the doves." },
      { q: "What 1970s Filipino film genre featured women fighters?", o: ["Bomba films", "Susanna films", "Female action films", "Komiks adaptations"], c: 2, e: "1970s saw a surge of Pinay action stars like Rosemarie Gil." },
    ]
  }
};

export default questions;
