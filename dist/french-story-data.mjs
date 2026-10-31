// Original French reading errands. Variants change language support, not learner age.
export const frenchStoryData = [
  {
    id: 'fr-bookstall-envelope', destination: 'bookstall', title: 'L’enveloppe bleue',
    invitation: 'A message disappears among the maps. Follow the clues at the bookstall.',
    passages: {
      1: ['Inès cherche une enveloppe bleue.', 'Elle regarde sous un grand livre.', 'L’enveloppe est là, sous le livre.', 'Dans l’enveloppe, il y a un dessin de bateau.'],
      2: ['Inès cherche une enveloppe bleue au marché.', 'Sur la table, elle voit un grand livre et une petite carte.', 'Elle regarde sous le grand livre.', 'L’enveloppe bleue est là.', 'Dans l’enveloppe, elle trouve un dessin de bateau.'],
      3: ['Inès cherche une enveloppe bleue au marché.', 'Elle voit une petite carte sur la table, mais ce n’est pas son message.', 'Un grand livre cache une partie de la table.', 'Inès regarde donc sous le livre.', 'L’enveloppe bleue est là, avec un dessin de bateau à l’intérieur.', 'Le dessin est un premier indice pour une nouvelle aventure.']
    },
    meanings: {
      1: 'Inès is looking for a blue envelope. She looks under a big book. The envelope is there, under the book. In the envelope, there is a drawing of a boat.',
      2: 'Inès is looking for a blue envelope at the market. On the table, she sees a big book and a small map. She looks under the big book. The blue envelope is there. In the envelope, she finds a drawing of a boat.',
      3: 'Inès is looking for a blue envelope at the market. She sees a small map on the table, but it is not her message. A big book hides part of the table. So Inès looks under the book. The blue envelope is there, with a drawing of a boat inside. The drawing is a first clue for a new adventure.'
    },
    words: 'une enveloppe = an envelope; sous = under; un dessin = a drawing; un bateau = a boat; un indice = a clue; donc = so.',
    questions: [
      { type: 'mc', title: 'Locate the message', skill: 'Locate an object in a French passage', prompt: 'Où est l’enveloppe bleue ?', choices: ['Sous le grand livre.', 'Dans le bateau.', 'Sur une chaise.'], answer: 0, hint: 'Look for « sous » and the object that follows it.', explanation: '« Sous le grand livre » means under the big book. That is where Inès finds the envelope.', helper: 'detail' },
      { type: 'mc', title: 'Read the first clue', skill: 'Identify a detail in a French passage', prompt: 'Quel dessin est dans l’enveloppe ?', choices: ['Un dessin de jardin.', 'Un dessin de bateau.', 'Un dessin de chat.'], answer: 1, hint: 'Look for « dessin de »: a drawing of something.', explanation: '« Un dessin de bateau » is a drawing of a boat. It is inside the envelope.', helper: 'detail' }
    ],
    postcard: 'Invent the next clue with a picture or a sentence: « Dans l’enveloppe, il y a… »'
  },
  {
    id: 'fr-bookstall-poster', destination: 'bookstall', title: 'L’affiche déchirée',
    invitation: 'Restore a torn concert poster and work out the order of the repair.',
    passages: {
      1: ['Une affiche est déchirée en deux morceaux.', 'D’abord, Sami rapproche les morceaux.', 'Ensuite, il colle les morceaux.', 'Enfin, il accroche l’affiche sur le mur.'],
      2: ['Sami trouve une affiche de concert en deux morceaux.', 'Les morceaux sont sur la table.', 'D’abord, il rapproche les morceaux pour voir le dessin.', 'Ensuite, il colle les morceaux.', 'Enfin, il accroche l’affiche sur le mur.'],
      3: ['Sami trouve une affiche de concert en deux morceaux.', 'Il voit une guitare sur un morceau et une chanteuse sur l’autre.', 'D’abord, il rapproche les morceaux pour retrouver le dessin complet.', 'Ensuite, il colle les morceaux avec soin.', 'Enfin, il accroche l’affiche sur le mur, où les passants peuvent la lire.', 'Le concert a maintenant une belle affiche.']
    },
    meanings: {
      1: 'A poster is torn into two pieces. First, Sami brings the pieces together. Next, he glues the pieces together. Finally, he hangs the poster on the wall.',
      2: 'Sami finds a concert poster in two pieces. The pieces are on the table. First, he brings the pieces together to see the picture. Next, he glues the pieces together. Finally, he hangs the poster on the wall.',
      3: 'Sami finds a concert poster in two pieces. He sees a guitar on one piece and a singer on the other. First, he brings the pieces together to recover the complete picture. Next, he carefully glues the pieces together. Finally, he hangs the poster on the wall, where passersby can read it. The concert now has a beautiful poster.'
    },
    words: 'une affiche = a poster; un morceau = a piece; rapproche = brings together; colle = glues; accroche = hangs; d’abord = first; ensuite = next; enfin = finally.',
    questions: [
      { type: 'mc', title: 'Where can people see it?', skill: 'Find a final location in French', prompt: 'Où est l’affiche à la fin ?', choices: ['Sous la table.', 'Dans un sac.', 'Sur le mur.'], answer: 2, hint: '« Enfin » marks the last action. Find where Sami hangs the poster.', explanation: '« Sur le mur » means on the wall. That is the poster’s final place.', helper: 'detail' },
      { type: 'order', title: 'Restore the poster', skill: 'Follow explicitly ordered French actions', prompt: 'Dans quel ordre Sami répare-t-il l’affiche ?', items: ['Il rapproche les morceaux.', 'Il colle les morceaux.', 'Il accroche l’affiche.'], hint: 'Follow « D’abord », « Ensuite », and « Enfin ».', explanation: 'First « rapproche » brings the pieces together; next « colle » glues them; finally « accroche » hangs the poster.', helper: 'sequence' }
    ],
    postcard: 'Design a concert poster or describe a repair: « D’abord… Ensuite… Enfin… »'
  },
  {
    id: 'fr-bookstall-map', destination: 'bookstall', title: 'Un autre chemin',
    invitation: 'A gate is closed. How will Nora get in?',
    passages: {
      1: ['Nora apporte un livre au jardin.', 'La première porte du jardin est fermée.', 'Elle prend le chemin près de la rivière.', 'Ce chemin mène à une autre porte, ouverte.'],
      2: ['Nora apporte un livre au jardin.', 'Mais la première porte du jardin est fermée.', 'Elle regarde sa carte pour trouver un autre chemin.', 'Elle prend le chemin près de la rivière.', 'Ce chemin mène à une autre porte, qui est ouverte.'],
      3: ['Nora apporte un livre au jardin pour le club de lecture.', 'La première porte est fermée, alors elle ne peut pas entrer par là.', 'Elle regarde sa carte et cherche une autre entrée.', 'Elle choisit le chemin près de la rivière.', 'Ce chemin mène à une autre porte, qui est ouverte.', 'Grâce à ce détour, Nora peut apporter le livre au club.']
    },
    meanings: {
      1: 'Nora brings a book to the garden. The first garden gate is closed. She takes the path near the river. This path leads to another gate, which is open.',
      2: 'Nora brings a book to the garden. But the first garden gate is closed. She looks at her map to find another path. She takes the path near the river. This path leads to another gate, which is open.',
      3: 'Nora brings a book to the garden for the reading club. The first gate is closed, so she cannot go in that way. She looks at her map and searches for another entrance. She chooses the path near the river. This path leads to another gate, which is open. Thanks to this detour, Nora can bring the book to the club.'
    },
    words: 'apporte = brings; fermée = closed; ouverte = open; un chemin = a path; près de = near; une entrée = an entrance; un détour = a detour.',
    questions: [
      { type: 'mc', title: 'Why change the route?', skill: 'Find a simple reason in a French passage', prompt: 'Pourquoi Nora prend-elle un autre chemin ?', choices: ['Le livre est trop lourd.', 'La première porte est fermée.', 'Elle cherche son bateau.'], answer: 1, hint: 'Read what stops Nora at the first gate.', explanation: '« La première porte … est fermée » means the first gate is closed. This gives Nora a reason to use another path.', helper: 'inference' },
      { type: 'mc', title: 'An open way in', skill: 'Understand a French word through a contrast', prompt: 'Grâce à la porte « ouverte », Nora peut…', choices: ['Entrer dans le jardin.', 'Fermer le livre.', 'Dessiner la rivière.'], answer: 0, hint: 'Compare « fermée » with « ouverte ». Which gate lets her through?', explanation: '« Ouverte » means open. Unlike the closed gate, the open gate lets Nora enter: « entrer ».', helper: 'context' }
    ],
    postcard: 'Draw two routes or give directions with « Le chemin mène à… »'
  },
  {
    id: 'fr-river-scarf', destination: 'river', title: 'L’écharpe sur le banc',
    invitation: 'Someone leaves a scarf beside the river. Whose scarf is it? Look for a name.',
    passages: {
      1: ['Mila trouve une écharpe verte sur un banc.', 'Une étiquette porte le nom « Léa ».', 'Léa est près du pont.', 'Mila lui rend l’écharpe.'],
      2: ['Mila trouve une écharpe verte sur un banc près de la rivière.', 'Elle regarde l’étiquette dans l’écharpe.', 'L’étiquette porte le nom « Léa ».', 'Mila voit Léa près du pont.', 'Elle lui rend l’écharpe verte.'],
      3: ['Mila trouve une écharpe verte sur un banc près de la rivière.', 'Elle ne sait pas à qui elle appartient.', 'Elle regarde donc l’étiquette dans l’écharpe et lit le nom « Léa ».', 'Mila voit Léa près du pont et lui montre le nom.', 'Léa voit son nom et reconnaît son écharpe.', 'Mila la lui rend, et Léa la remercie.']
    },
    meanings: {
      1: 'Mila finds a green scarf on a bench. A label has the name “Léa” on it. Léa is near the bridge. Mila gives her the scarf back.',
      2: 'Mila finds a green scarf on a bench near the river. She looks at the label inside the scarf. The label has the name “Léa” on it. Mila sees Léa near the bridge. She gives her the green scarf back.',
      3: 'Mila finds a green scarf on a bench near the river. She does not know whom it belongs to. So she looks at the label inside the scarf and reads the name “Léa”. Mila sees Léa near the bridge and shows her the name. Léa sees her name and recognizes her scarf. Mila gives it back to her, and Léa thanks her.'
    },
    words: 'une écharpe = a scarf; une étiquette = a label; un banc = a bench; un pont = a bridge; rend = gives back; appartient à = belongs to.',
    questions: [
      { type: 'mc', title: 'A written clue', skill: 'Identify evidence in a French passage', prompt: 'Quel nom est sur l’étiquette ?', choices: ['Mila.', 'Nora.', 'Léa.'], answer: 2, hint: 'Look beside « étiquette » or « nom » for the name in quotation marks.', explanation: 'The label says « Léa ». The written name helps Mila find the owner.', helper: 'detail' },
      { type: 'mc', title: 'What does she give back?', skill: 'Understand a French action in context', prompt: 'Mila lui « rend » l’écharpe : que fait-elle ?', choices: ['Elle donne l’écharpe à Léa.', 'Elle cache l’écharpe sous le banc.', 'Elle achète une autre écharpe.'], answer: 0, hint: 'Follow the scarf from the bench to the person whose name is on it.', explanation: '« Rend » means gives back here. Mila returns the scarf to Léa: « Elle donne l’écharpe à Léa. »', helper: 'context' }
    ],
    postcard: 'Create a lost-object notice with « Je cherche… » and a color or place clue.'
  },
  {
    id: 'fr-river-delivery', destination: 'river', title: 'Le panier du concert',
    invitation: 'Bring a picnic to a riverside concert. Follow a short delivery plan.',
    passages: {
      1: ['Amir prépare un panier pour les musiciens.', 'D’abord, il met du pain dans le panier.', 'Ensuite, il ajoute des pommes.', 'Enfin, il apporte le panier au kiosque.'],
      2: ['Les musiciens jouent près de la rivière.', 'Amir prépare un panier pour eux.', 'D’abord, il met du pain dans le panier.', 'Ensuite, il ajoute des pommes pour le goûter.', 'Enfin, il apporte le panier au kiosque.'],
      3: ['Les musiciens jouent près de la rivière et préparent un concert.', 'Amir organise leur goûter pour leur pause.', 'D’abord, il met du pain dans le panier.', 'Ensuite, il ajoute des pommes, qui voyagent bien dans le panier.', 'Enfin, il apporte le panier au kiosque, où les musiciens l’attendent.', 'Le goûter arrive juste avant leur pause.']
    },
    meanings: {
      1: 'Amir prepares a basket for the musicians. First, he puts bread in the basket. Next, he adds apples. Finally, he brings the basket to the bandstand.',
      2: 'The musicians play near the river. Amir prepares a basket for them. First, he puts bread in the basket. Next, he adds apples for the snack. Finally, he brings the basket to the bandstand.',
      3: 'The musicians play near the river and prepare a concert. Amir organizes their snack for their break. First, he puts bread in the basket. Next, he adds apples, which travel well in the basket. Finally, he brings the basket to the bandstand, where the musicians are waiting for him. The snack arrives just before their break.'
    },
    words: 'un panier = a basket; du pain = bread; ajoute = adds; une pomme = an apple; un goûter = a snack; un kiosque = a bandstand here; une pause = a break.',
    questions: [
      { type: 'mc', title: 'The delivery place', skill: 'Locate a destination in French', prompt: 'Où Amir apporte-t-il le panier ?', choices: ['Au kiosque.', 'À la bibliothèque.', 'Sur un bateau.'], answer: 0, hint: 'Find the final action, after « Enfin ».', explanation: '« Au kiosque » means to the bandstand here. Amir brings the basket there.', helper: 'detail' },
      { type: 'order', title: 'Pack and deliver', skill: 'Follow explicitly ordered French actions', prompt: 'Dans quel ordre Amir prépare-t-il la livraison ?', items: ['Il met du pain dans le panier.', 'Il ajoute des pommes.', 'Il apporte le panier au kiosque.'], hint: 'Use the sequence words: first « D’abord », next « Ensuite », finally « Enfin ».', explanation: 'Amir puts in the bread (« pain »), adds apples (« pommes »), then delivers the basket (« apporte le panier »).', helper: 'sequence' }
    ],
    postcard: 'Plan a picnic with words, a drawing, or « Dans mon panier, il y a… »'
  },
  {
    id: 'fr-river-box', destination: 'river', title: 'Le bruit dans la boîte',
    invitation: 'Something rattles in a box. What could it be?',
    passages: {
      1: ['Zoé trouve une boîte près du pont.', 'La boîte fait un petit bruit quand elle bouge.', 'Zoé ouvre la boîte.', 'À l’intérieur, une clé touche une cuillère.'],
      2: ['Zoé trouve une boîte près du pont.', 'Quand elle bouge la boîte, elle entend un petit bruit.', 'Elle pose la boîte et le bruit s’arrête.', 'Elle l’ouvre pour regarder à l’intérieur.', 'Elle voit une clé qui touche une cuillère.'],
      3: ['Zoé trouve une boîte près du pont et entend un petit bruit quand elle la bouge.', 'Elle pense d’abord à un animal, mais elle préfère vérifier.', 'Elle pose la boîte et le bruit s’arrête.', 'Elle l’ouvre doucement pour regarder à l’intérieur.', 'Une clé touche une cuillère quand la boîte bouge : voilà l’origine du bruit.', 'Zoé peut maintenant expliquer ce qu’elle entend.']
    },
    meanings: {
      1: 'Zoé finds a box near the bridge. The box makes a little noise when it moves. Zoé opens the box. Inside, a key touches a spoon.',
      2: 'Zoé finds a box near the bridge. When she moves the box, she hears a little noise. She puts the box down and the noise stops. She opens it to look inside. She sees a key touching a spoon.',
      3: 'Zoé finds a box near the bridge and hears a little noise when she moves it. At first she thinks of an animal, but she prefers to check. She puts the box down and the noise stops. She opens it gently to look inside. A key touches a spoon when the box moves: that is the source of the noise. Zoé can now explain what she hears.'
    },
    words: 'une boîte = a box; un bruit = a noise; bouge = moves; à l’intérieur = inside; une clé = a key; une cuillère = a spoon; vérifier = to check.',
    questions: [
      { type: 'mc', title: 'Look inside', skill: 'Identify objects in a French passage', prompt: 'Que trouve Zoé dans la boîte ?', choices: ['Un chat et une feuille.', 'Une clé et une cuillère.', 'Un livre et une pomme.'], answer: 1, hint: 'Look near « à l’intérieur » for the objects.', explanation: '« Une clé » is a key and « une cuillère » is a spoon. Both are inside the box.', helper: 'detail' },
      { type: 'mc', title: 'Explain the sound', skill: 'Connect a French detail to a simple cause', prompt: 'Pourquoi la boîte fait-elle du bruit quand elle bouge ?', choices: ['Un chat chante dans la boîte.', 'La boîte contient une radio.', 'La clé touche la cuillère.'], answer: 2, hint: 'What two things touch inside the moving box?', explanation: '« La clé touche la cuillère » means the key touches the spoon. Their contact explains the sound when the box moves.', helper: 'inference' }
    ],
    postcard: 'Invent a sound mystery: « J’entends un bruit. Dans la boîte, il y a… »'
  },
  {
    id: 'fr-rooftops-banner', destination: 'rooftops', title: 'La banderole au vent',
    invitation: 'Keep a rooftop welcome banner in place when the wind picks up.',
    passages: {
      1: ['Il y a une banderole sur la terrasse.', 'Le vent soulève un coin.', 'Émile attache ce coin avec une corde.', 'La banderole reste en place.'],
      2: ['Émile installe une banderole sur la terrasse.', 'Elle porte le mot « Bienvenue ».', 'Le vent soulève un coin de la banderole.', 'Émile attache ce coin avec une corde.', 'La banderole reste alors en place.'],
      3: ['Émile installe une banderole sur la terrasse pour accueillir les voisins.', 'Il écrit le mot « Bienvenue » en grandes lettres.', 'Mais le vent soulève un coin et les lettres bougent.', 'Émile attache ce coin avec une corde, car il veut garder la banderole en place.', 'La corde retient le coin, et le message reste visible.', 'Les voisins peuvent maintenant lire la banderole.']
    },
    meanings: {
      1: 'A banner is on the terrace. The wind lifts one corner. Émile ties this corner with a rope. The banner stays in place.',
      2: 'Émile sets up a banner on the terrace. It has the word “Welcome” on it. The wind lifts one corner of the banner. Émile ties this corner with a rope. The banner then stays in place.',
      3: 'Émile sets up a banner on the terrace to welcome the neighbors. He writes the word “Welcome” in big letters. But the wind lifts a corner and the letters move. Émile ties this corner with a rope, because he wants to keep the banner in place. The rope holds the corner, and the message stays visible. The neighbors can now read the banner.'
    },
    words: 'une banderole = a banner; le vent = the wind; soulève = lifts; un coin = a corner; attache = ties; une corde = a rope; reste en place = stays in place.',
    questions: [
      { type: 'mc', title: 'Choose the useful tool', skill: 'Identify a tool in a French passage', prompt: 'Avec quoi Émile attache-t-il la banderole ?', choices: ['Avec une cuillère.', 'Avec une carte.', 'Avec une corde.'], answer: 2, hint: 'Find « avec », which means with.', explanation: '« Avec une corde » means with a rope. Émile uses it to tie the corner.', helper: 'detail' },
      { type: 'mc', title: 'What problem does it solve?', skill: 'Find a simple reason in French', prompt: 'Pourquoi Émile attache-t-il le coin ?', choices: ['Le vent soulève le coin.', 'La banderole est dans une boîte.', 'Il cherche un livre.'], answer: 0, hint: 'Read what the wind does before Émile uses the rope.', explanation: '« Le vent soulève un coin » means the wind lifts a corner. The rope solves that problem by holding the corner down.', helper: 'inference' }
    ],
    postcard: 'Design a welcome sign with « Bienvenue… » or draw a way to keep it in place.'
  },
  {
    id: 'fr-rooftops-photo', destination: 'rooftops', title: 'La photo de la ville',
    invitation: 'Frame a city photograph from the rooftop. Follow a photographer’s plan.',
    passages: {
      1: ['Lina veut une photo de la ville.', 'D’abord, elle pose son appareil sur la table.', 'Ensuite, elle choisit la vue sur la rivière.', 'Enfin, elle prend la photo.'],
      2: ['Lina prépare une photo de la ville depuis la terrasse.', 'D’abord, elle pose son appareil sur la table.', 'Il est stable à cet endroit.', 'Ensuite, elle choisit la vue sur la rivière.', 'Enfin, elle prend la photo.'],
      3: ['Lina prépare une photo de la ville depuis la terrasse.', 'Elle veut une image nette, sans mouvement.', 'D’abord, elle pose son appareil sur la table, car la table est stable.', 'Ensuite, elle choisit la vue sur la rivière plutôt que la vue sur le mur.', 'Enfin, elle prend la photo et regarde le résultat.', 'La rivière traverse son image comme un long ruban.']
    },
    meanings: {
      1: 'Lina wants a photo of the city. First, she puts her camera on the table. Next, she chooses the view of the river. Finally, she takes the photo.',
      2: 'Lina prepares a photo of the city from the terrace. First, she puts her camera on the table. It is steady in this spot. Next, she chooses the view of the river. Finally, she takes the photo.',
      3: 'Lina prepares a photo of the city from the terrace. She wants a clear image, without movement. First, she puts her camera on the table, because the table is steady. Next, she chooses the view of the river rather than the view of the wall. Finally, she takes the photo and looks at the result. The river crosses her image like a long ribbon.'
    },
    words: 'un appareil = a camera here; une vue = a view; une rivière = a river; prend une photo = takes a photo; stable = steady; nette = clear; un ruban = a ribbon.',
    questions: [
      { type: 'mc', title: 'Choose the view', skill: 'Find a chosen detail in French', prompt: 'Quelle vue Lina choisit-elle ?', choices: ['La vue sur la rivière.', 'La vue sur le mur.', 'La vue sur le livre.'], answer: 0, hint: 'Find the sentence with « choisit »: chooses.', explanation: '« La vue sur la rivière » is the view of the river. That is the view Lina chooses.', helper: 'detail' },
      { type: 'order', title: 'Prepare the photograph', skill: 'Follow explicitly ordered French actions', prompt: 'Dans quel ordre Lina prépare-t-elle sa photo ?', items: ['Elle pose son appareil sur la table.', 'Elle choisit la vue sur la rivière.', 'Elle prend la photo.'], hint: 'Trace the actions after « D’abord », « Ensuite », and « Enfin ».', explanation: 'Lina first sets down the camera (« pose »), then chooses the view (« choisit »), then takes the photo (« prend »).', helper: 'sequence' }
    ],
    postcard: 'Frame an imaginary city view with a drawing or « Sur ma photo, il y a… »'
  },
  {
    id: 'fr-rooftops-shadow', destination: 'rooftops', title: 'Le dessin à l’ombre',
    invitation: 'Help an artist find a comfortable spot to finish a rooftop drawing.',
    passages: {
      1: ['Noé dessine sur la terrasse.', 'Le soleil est très fort.', 'Il place sa chaise à l’ombre, sous un parasol.', 'Le parasol le protège du soleil.'],
      2: ['Noé dessine les toits depuis la terrasse.', 'Le soleil est très fort près du mur.', 'Il cherche une place plus agréable.', 'Il place sa chaise à l’ombre, sous un parasol.', 'Le parasol le protège du soleil pendant qu’il dessine.'],
      3: ['Noé dessine les toits depuis la terrasse.', 'Il aime la vue, mais le soleil est très fort près du mur.', 'Il cherche donc une place où il peut continuer son dessin confortablement.', 'Il place sa chaise à l’ombre, sous un parasol.', 'Le parasol le protège du soleil tout en lui laissant voir les toits.', 'Noé garde ainsi la même vue depuis une place plus agréable.']
    },
    meanings: {
      1: 'Noé draws on the terrace. The sun is very strong. He puts his chair in the shade, under a sun umbrella. The sun umbrella protects him from the sun.',
      2: 'Noé draws the rooftops from the terrace. The sun is very strong near the wall. He looks for a more pleasant spot. He puts his chair in the shade, under a sun umbrella. The sun umbrella protects him from the sun while he draws.',
      3: 'Noé draws the rooftops from the terrace. He likes the view, but the sun is very strong near the wall. So he looks for a spot where he can comfortably continue his drawing. He puts his chair in the shade, under a sun umbrella. The sun umbrella protects him from the sun while still letting him see the rooftops. In this way, Noé keeps the same view from a more pleasant spot.'
    },
    words: 'dessine = draws; un toit = a roof; le soleil = the sun; à l’ombre = in the shade; un parasol = a sun umbrella; protège = protects; agréable = pleasant.',
    questions: [
      { type: 'mc', title: 'Use the surrounding words', skill: 'Understand a French phrase in context', prompt: '« À l’ombre », Noé est…', choices: ['Protégé de la pluie.', 'Protégé du soleil.', 'Caché derrière le mur.'], answer: 1, hint: 'The sentence about the parasol explains what « à l’ombre » does for Noé.', explanation: '« À l’ombre » means in the shade. The parasol protects Noé from the strong sun: « protégé du soleil ».', helper: 'context' },
      { type: 'mc', title: 'Why move the chair?', skill: 'Connect an action to a simple French reason', prompt: 'Pourquoi Noé place-t-il sa chaise sous le parasol ?', choices: ['Il cherche une écharpe.', 'Le dessin est dans le parasol.', 'Le soleil est très fort.'], answer: 2, hint: 'Find the problem described just before he changes places.', explanation: '« Le soleil est très fort » means the sun is very strong. This explains why Noé chooses the shade.', helper: 'inference' }
    ],
    postcard: 'Imagine a comfortable drawing spot: « Je dessine… sous… » or show it in a picture.'
  }
];
