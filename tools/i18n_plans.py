# Traduccions a l'anglès i al francès de window.PLANS i dels noms dels punts de pas (window.DAYS).
# Les fa servir tools/plans_data.py (PLANS) i tools/i18n_apply.py (DAYS). Mateixa estructura que el català.

POINTS = {  # nom català → (anglès, francès)
    'Pelechuco': ('Pelechuco', 'Pelechuco'), 'Pas 1': ('Pass 1', 'Col 1'), 'Vall del riu Kotani': ('Kotani river valley', 'Vallée de la rivière Kotani'),
    'Campament 1': ('Camp 1', 'Camp 1'), 'Campament 2': ('Camp 2', 'Camp 2'), 'Campament 3': ('Camp 3', 'Camp 3'), 'Hilo Hilo': ('Hilo Hilo', 'Hilo Hilo'),
    'Pas Sunchulli': ('Sunchulli Pass', 'Col Sunchulli'), 'Pas 3': ('Pass 3', 'Col 3'), 'Pas 4': ('Pass 4', 'Col 4'), 'Pas 5': ('Pass 5', 'Col 5'),
    'Inici de les Mil Corbes': ('Start of the Mil Curvas', 'Début des Mil Curvas'), 'Final de les Mil Corbes': ('End of the Mil Curvas', 'Fin des Mil Curvas'),
    'Incacancha': ('Incacancha', 'Incacancha'), 'Pas d’Akamani': ('Akamani Pass', 'Col d’Akamani'), 'Apacheta de Tambillo': ('Tambillo apacheta', 'Apacheta de Tambillo'),
    'Cruïlla de Curva': ('Curva junction', 'Croisement de Curva'), 'Pont del riu': ('River bridge', 'Pont sur la rivière'), 'Capella': ('Chapel', 'Chapelle'),
    'Charazani': ('Charazani', 'Charazani'), 'Curva': ('Curva', 'Curva'), 'Cañisaya': ('Cañisaya', 'Cañisaya'), 'Mur inca': ('Inca wall', 'Mur inca'),
    'Pas Lorisani': ('Lorisani Pass', 'Col Lorisani'), 'Refugi del camí de l’Akamani': ('Akamani trail shelter', 'Refuge du chemin de l’Akamani'),
    'Huayrapata': ('Huayrapata', 'Huayrapata'), 'Pas de Chatalayo': ('Chatalayo Pass', 'Col de Chatalayo'),
    'Antiga mina d’antimoni': ('Old antimony mine', 'Ancienne mine d’antimoine'), 'Carretera RN16': ('RN16 road', 'Route RN16'),
}
def point(ca):
    if ca.startswith('Agua buena'):
        return ca, ca          # nom del GPS, no es tradueix
    return POINTS[ca]

SEASON = {
 'en': {'title': 'When to do the trek', 'window': 'Recommended window: 15 June to 31 July', 'proposal': 'Proposed departure: second half of June 2027',
        'monthNames': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'legend': {'best': 'Recommended', 'ok': 'Possible, less certain', 'risk': 'Possible, risk of heavy snow', 'no': 'Not recommended'},
        'reasons': [['June and July', 'The heart of the dry season: the weather is more stable, rivers carry less water and the roads in northern La Paz are open. Nights are the coldest of the year.'],
                    ['May and September', 'Possible but less certain: in May there may still be rain and high rivers; in September afternoon storms increase. Bolivian operators offer the route from May to September.'],
                    ['August', 'There has been heavy snow around the Sunchulli Pass: about 60 cm on 10 and 11 August 1993, with the passes closed, and short snowfalls between August and September 2019. Only with a very stable forecast and reserve days.'],
                    ['December to April', 'Rainy season. The Charazani–Apolo road was cut from 9 to 19 February 2025 and there were landslides in January and March 2026.']]},
 'fr': {'title': 'Quand faire le trek', 'window': 'Période recommandée : du 15 juin au 31 juillet', 'proposal': 'Départ proposé : seconde quinzaine de juin 2027',
        'monthNames': ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        'legend': {'best': 'Recommandé', 'ok': 'Possible, plus incertain', 'risk': 'Possible, risque de fortes chutes de neige', 'no': 'Déconseillé'},
        'reasons': [['Juin et juillet', 'Le cœur de la saison sèche : le temps est plus stable, les rivières ont moins de débit et les routes du nord de La Paz sont ouvertes. Les nuits sont les plus froides de l’année.'],
                    ['Mai et septembre', 'Possibles mais plus incertains : en mai il peut encore pleuvoir et les rivières être hautes ; en septembre les orages d’après-midi augmentent. Les opérateurs boliviens proposent l’itinéraire de mai à septembre.'],
                    ['Août', 'Il y a eu de fortes chutes de neige autour du col Sunchulli : environ 60 cm les 10 et 11 août 1993, cols fermés, et de brèves chutes de neige entre août et septembre 2019. Seulement avec une prévision très stable et des jours de réserve.'],
                    ['De décembre à avril', 'Saison des pluies. La route Charazani–Apolo a été coupée du 9 au 19 février 2025 et il y a eu des glissements de terrain en janvier et mars 2026.']]},
}

PLANB = {  # par jour: [titre, texte]
 5: {'en': [['Before Pass 1', 'If the group is not well or the weather worsens, return to Pelechuco on the same path (6.4 km at most).'],
            ['Vehicle evacuation', 'About 6 of the 9.7 km follow the Pelechuco–Hilo Hilo track, which crosses Pass 1 (Katantika pass): a 4×4 from Pelechuco can reach the pass and Camp 1.'],
            ['At night', 'With altitude symptoms at Camp 1 (4,168 m), descend to Pelechuco (3,660 m) by the track.']],
     'fr': [['Avant le col 1', 'Si le groupe ne va pas bien ou si le temps se dégrade, revenir à Pelechuco par le même chemin (6,4 km au maximum).'],
            ['Évacuation en véhicule', 'Environ 6 des 9,7 km suivent la piste Pelechuco–Hilo Hilo, qui franchit le col 1 (col de Katantika) : un 4×4 depuis Pelechuco peut atteindre le col et le camp 1.'],
            ['La nuit', 'Avec des symptômes d’altitude au camp 1 (4 168 m), descendre à Pelechuco (3 660 m) par la piste.']]},
 6: {'en': [['The whole day', 'Almost the whole day follows the track. Hilo Hilo is a village with a school and a track to Pelechuco (about 20 km): a vehicle evacuation point.'],
            ['More acclimatisation', 'If someone needs it, a reserve day is used in Hilo Hilo before the Sunchulli Pass.']],
     'fr': [['Toute la journée', 'Presque toute la journée suit la piste. Hilo Hilo est un village avec une école et une piste vers Pelechuco (environ 20 km) : point d’évacuation en véhicule.'],
            ['Plus d’acclimatation', 'Si quelqu’un en a besoin, on utilise un jour de réserve à Hilo Hilo avant le col Sunchulli.']]},
 7: {'en': [['Before 10:10', 'If late, with symptoms or a poor forecast at the first control: return to Hilo Hilo.'],
            ['Cut-off at the pass: 14:40', 'The last comfortable turning point is Agua buena 3 at 13:40. If the group is not at the pass by 14:40, turn back: walking back to Hilo Hilo takes about 3 h, so the 4×4 is called up the Hilo Hilo–Sorapata track, which climbs the valley to the pass.'],
            ['Pass closed', 'With hard snow or ice we do not cross: reserve day in Hilo Hilo. If it stays closed, withdraw to Pelechuco by vehicle and transfer to Charazani to do plan C.'],
            ['After the pass', 'Sunchully (mining community, 4,540 m) is 2.6 km from Camp 2 by track, with a vehicle exit towards Sorapata (7.4 km) and, over the pass, towards Hilo Hilo and Pelechuco (about 38 km). Vehicle evacuation is agreed before setting off.'],
            ['Water', 'No water from the Sunchulli river or any stream below the mines. Leave Agua buena 3 with 2–3 litres per person for the afternoon and night.']],
     'fr': [['Avant 10 h 10', 'En cas de retard, de symptômes ou de prévision défavorable au premier contrôle : retour à Hilo Hilo.'],
            ['Heure limite au col : 14 h 40', 'Le dernier point de demi-tour confortable est Agua buena 3 à 13 h 40. Si le groupe n’est pas au col à 14 h 40, demi-tour : le retour à pied jusqu’à Hilo Hilo prend environ 3 h, on fait donc venir le 4×4 par la piste Hilo Hilo–Sorapata, qui remonte la vallée jusqu’au col.'],
            ['Col fermé', 'Avec de la neige dure ou de la glace, on ne passe pas : jour de réserve à Hilo Hilo. S’il reste fermé, repli sur Pelechuco en véhicule et transfert à Charazani pour faire le plan C.'],
            ['Après le col', 'Sunchully (communauté minière, 4 540 m) est à 2,6 km du camp 2 par la piste, avec une sortie en véhicule vers Sorapata (7,4 km) et, par le col, vers Hilo Hilo et Pelechuco (environ 38 km). L’évacuation en véhicule se convient avant le départ.'],
            ['Eau', 'Pas d’eau de la rivière Sunchulli ni d’aucun cours d’eau en aval des mines. Partir d’Agua buena 3 avec 2–3 litres par personne pour l’après-midi et la nuit.']]},
 8: {'en': [['Plan B1 · alternative descent', 'With snow, ice, wet rock or poor visibility we do not enter the Mil Curvas (500 m of descent in 1.2 km). Alternative: from Pass 5 descend south to the Akamani river (≈3,950 m) and climb 0.8 km back to Incacancha. It is 2.9 km and −600/+135 m, longer and less steep; it has an unmapped stretch of about 200 m that must be checked. It is the “less steep but less direct” descent the park rangers pointed out in 2019.'],
            ['Plan B2 · do not descend', 'If neither descent is safe: go to Quellwa Cota (community, 4,460 m, 1 km from Pass 5) and camp there with permission, or evacuate by vehicle on the Quellwa Cota–Sunchully track (8.3 km).'],
            ['Plan B3 · turn back', 'Before Pass 4, return to Camp 2 on the same path.']],
     'fr': [['Plan B1 · descente alternative', 'Avec de la neige, de la glace, du rocher mouillé ou peu de visibilité, on n’entre pas dans les Mil Curvas (500 m de descente en 1,2 km). Alternative : depuis le col 5, descendre vers le sud jusqu’à la rivière Akamani (≈3 950 m) et remonter 0,8 km jusqu’à Incacancha. Soit 2,9 km et −600/+135 m, plus long et moins raide ; il comporte un tronçon d’environ 200 m non cartographié à reconnaître. C’est la descente « moins raide mais moins directe » indiquée par les gardes du parc en 2019.'],
            ['Plan B2 · ne pas descendre', 'Si aucune des deux descentes n’est sûre : aller à Quellwa Cota (communauté, 4 460 m, à 1 km du col 5) et y camper avec autorisation, ou évacuer en véhicule par la piste Quellwa Cota–Sunchully (8,3 km).'],
            ['Plan B3 · faire demi-tour', 'Avant le col 4, revenir au camp 2 par le même chemin.']]},
 9: {'en': [['Before the Akamani Pass', 'With storms, poor visibility, snow or ice forecast on the passes: do not start the climb and stay in Incacancha (reserve day).'],
            ['Eastern exit', 'If the passes are not practicable, leave by the Akamani trail towards Huayrapata and the RN16 road (plan C stages C3 and C4): 19.4 km over two days, never above 4,060 m.'],
            ['After the pass', 'Camp 3 is 600 m from a track that leads to Cañisaya (4.8 km) and Curva (10.3 km): vehicle evacuation.']],
     'fr': [['Avant le col d’Akamani', 'Avec orages, mauvaise visibilité, neige ou glace prévus sur les cols : ne pas commencer la montée et rester à Incacancha (jour de réserve).'],
            ['Sortie par l’est', 'Si les cols ne sont pas praticables, sortir par le chemin de l’Akamani vers Huayrapata et la route RN16 (étapes C3 et C4 du plan C) : 19,4 km en deux jours, sans dépasser 4 060 m.'],
            ['Après le col', 'Le camp 3 est à 600 m d’une piste qui mène à Cañisaya (4,8 km) et à Curva (10,3 km) : évacuation en véhicule.']]},
 10: {'en': [['Curva junction (11:10)', 'Decision point: if the group is short of time or arrival in Charazani would be after 16:40, the trek ends at Curva and continues by vehicle.'],
             ['River bridge', 'In 2019 there was a concrete bridge on the descent to Charazani. Without recent confirmation of the bridge, the trek ends at Curva.'],
             ['Road', 'Before setting off, check with the ABC the state of the RN16 Charazani–Escoma road for the return to La Paz.']],
      'fr': [['Croisement de Curva (11 h 10)', 'Point de décision : si le groupe est juste en temps ou si l’arrivée à Charazani dépasserait 16 h 40, le trek se termine à Curva et continue en véhicule.'],
             ['Pont sur la rivière', 'En 2019, il y avait un pont en béton dans la descente vers Charazani. Sans confirmation récente du pont, l’arrivée se fait à Curva.'],
             ['Route', 'Avant de partir, vérifier auprès de l’ABC l’état de la RN16 Charazani–Escoma pour le retour à La Paz.']]},
}

PLANC_STAGES = {  # code: {en: {name,text,key,night}, fr: {...}}
 'C1': {'en': {'name': 'Curva → Cañisaya', 'text': 'We leave Curva, where we slept, and take a short walk on tracks and paths between fields to Cañisaya. It helps acclimatisation before climbing.', 'key': 'Short day: walk slowly, drink and prepare the next day’s pass.', 'night': 'Tent in Cañisaya, at the site agreed with the community'},
        'fr': {'name': 'Curva → Cañisaya', 'text': 'Nous partons de Curva, où nous avons dormi, et faisons une courte marche par piste et chemin entre les cultures jusqu’à Cañisaya. Elle aide à s’acclimater avant de monter.', 'key': 'Courte journée : marcher lentement, boire et préparer le col du lendemain.', 'night': 'Tente à Cañisaya, à l’endroit convenu avec la communauté'}},
 'C2': {'en': {'name': 'Cañisaya → Akamani Pass → Incacancha', 'text': 'We climb the Akamani trail, a pre-Columbian route, pass Camp 3 and the Tambillo apacheta and cross the Akamani Pass (4,661 m), the highest point of plan C. Descent to the ruins of Incacancha.', 'key': 'Cut-off at the Akamani Pass: 13:10. If not there by then, return to Camp 3.', 'night': 'Tent in Incacancha'},
        'fr': {'name': 'Cañisaya → col d’Akamani → Incacancha', 'text': 'Nous montons par le chemin de l’Akamani, au tracé précolombien, passons par le camp 3 et l’apacheta de Tambillo et franchissons le col d’Akamani (4 661 m), point le plus haut du plan C. Descente aux ruines d’Incacancha.', 'key': 'Heure limite au col d’Akamani : 13 h 10. Sinon, retour au camp 3.', 'night': 'Tente à Incacancha'}},
 'C3': {'en': {'name': 'Incacancha → Lorisani Pass → Huayrapata', 'text': 'We follow the Akamani trail downstream, past the Inca wall and the Lorisani Pass, and descend to the trail shelter. A last gentle climb leads to Huayrapata.', 'key': 'A long day but with no high passes. Water from side springs, never from the main river.', 'night': 'Tent in Huayrapata, at the site agreed with the community'},
        'fr': {'name': 'Incacancha → col Lorisani → Huayrapata', 'text': 'Nous suivons le chemin de l’Akamani vers l’aval, passons par le mur inca et le col Lorisani et descendons jusqu’au refuge du chemin. Une dernière remontée douce mène à Huayrapata.', 'key': 'Longue journée mais sans grands cols. Eau des sources latérales, jamais de la rivière principale.', 'night': 'Tente à Huayrapata, à l’endroit convenu avec la communauté'}},
 'C4': {'en': {'name': 'Huayrapata → Chatalayo Pass → RN16 → Charazani', 'text': 'We climb to the Chatalayo Pass (4,030 m), pass an old antimony mine and descend to the RN16 road. Vehicle transfer to Charazani and an afternoon at the hot springs.', 'key': 'The vehicle waits on the RN16, on the Charazani–Apolo section: check its state with the ABC the day before.', 'night': 'Local lodging in Charazani'},
        'fr': {'name': 'Huayrapata → col de Chatalayo → RN16 → Charazani', 'text': 'Nous montons au col de Chatalayo (4 030 m), passons par une ancienne mine d’antimoine et descendons jusqu’à la route RN16. Transfert en véhicule à Charazani et après-midi aux sources chaudes.', 'key': 'Le véhicule attend sur la RN16, tronçon Charazani–Apolo : vérifier son état auprès de l’ABC la veille.', 'night': 'Hébergement local à Charazani'}},
}

PLANC = {
 'en': {'title': 'Plan C · Cañisaya – Akamani – Charazani',
        'intro': 'A complete variant that avoids the Sunchulli Pass, the Sunchulli mining area and the Mil Curvas. Four days, 34.6 km, +2,070/−2,440 m and a high point of 4,661 m. It follows the Akamani trail, a pre-Columbian route that the author of the 2012 track presents as an alternative to the classic route.',
        'when': ['Before leaving La Paz: if the Sunchulli Pass is closed by snow, if there is conflict in the mining area, if the communities do not grant permission or if the reconnaissance advises against the main route.',
                 'During the trek: from Incacancha (day 8) the group can exit by stages C3 and C4 instead of days 9 and 10.'],
        'program': [['1–3', 'La Paz: arrival and acclimatisation (same as the main programme)'],
                    ['4', 'La Paz → Curva by vehicle (≈9 h). Local lodging or tent in Curva, ≈3,740 m: only 90 m higher than La Paz'],
                    ['5–8', 'Stages C1 to C4'],
                    ['9', 'Charazani → La Paz. The two days saved are added to the reserve days'],
                    ['', 'Acclimatisation: La Paz 3,650 m → Curva 3,740 → Cañisaya 3,880 → Incacancha 4,060 → Huayrapata 3,700 → Charazani 3,195. No night is more than 500 m higher than the previous one.']],
        'source': 'Line: Akamani trail on OpenStreetMap; altitudes from the SRTM model (±20 m). Distances and height gains are indicative (±10%) and must be checked on the ground.'},
 'fr': {'title': 'Plan C · Cañisaya – Akamani – Charazani',
        'intro': 'Variante complète qui évite le col Sunchulli, la zone minière de Sunchulli et les Mil Curvas. Quatre jours, 34,6 km, +2 070/−2 440 m et un point culminant à 4 661 m. Elle suit le chemin de l’Akamani, au tracé précolombien, que l’auteur de la trace de 2012 présente comme alternative à l’itinéraire classique.',
        'when': ['Avant de quitter La Paz : si le col Sunchulli est fermé par la neige, s’il y a un conflit dans la zone minière, si les communautés ne donnent pas leur autorisation ou si la reconnaissance déconseille l’itinéraire principal.',
                 'Pendant le trek : depuis Incacancha (jour 8), on peut sortir par les étapes C3 et C4 au lieu des jours 9 et 10.'],
        'program': [['1–3', 'La Paz : arrivée et acclimatation (comme le programme principal)'],
                    ['4', 'La Paz → Curva en véhicule (≈9 h). Hébergement local ou tente à Curva, ≈3 740 m : seulement 90 m plus haut que La Paz'],
                    ['5–8', 'Étapes C1 à C4'],
                    ['9', 'Charazani → La Paz. Les deux jours économisés s’ajoutent aux jours de réserve'],
                    ['', 'Acclimatation : La Paz 3 650 m → Curva 3 740 → Cañisaya 3 880 → Incacancha 4 060 → Huayrapata 3 700 → Charazani 3 195. Aucune nuit ne monte de plus de 500 m par rapport à la précédente.']],
        'source': 'Tracé : chemin de l’Akamani sur OpenStreetMap ; altitudes du modèle SRTM (±20 m). Distances et dénivelés indicatifs (±10 %), à reconnaître sur le terrain.'},
}

ROADS = {
 'en': {'title': 'Road access (ABC)', 'items': [
   ['La Paz → Escoma (RN16)', 'Main network, paved. The ABC inspected it in 2026 and agreed pothole repairs. No known closures in the dry season.'],
   ['Escoma → Ulla Ulla → Pelechuco', 'Road outside the main network: it does not appear in the ABC daily reports. Its state must be confirmed with Pelechuco drivers and the La Paz departmental government.'],
   ['Escoma → Charazani (RN16)', 'An Escoma–Pacobamba road project with CAF funding was under way in 2026: scheduled closures for works may appear.'],
   ['Charazani → Apolo (RN16, Bocamina and Aguas Calientes section)', 'Critical point: closed from 9 to 19 February 2025; landslide clearing in January 2026; landslide and closure in March 2026; closures from 07:00 to 19:00 for culvert works in August 2026 and restrictions for medium and heavy vehicles in October 2026. This is where plan C ends on foot.'],
   ['How and when to check', 'ABC daily road report (transitabilidad.abc.gob.bo) and its @carreterasbo accounts, 48 h and 24 h before leaving and the day before each transfer. On 17/11/2026 the website had an expired security certificate and asked for a captcha: also keep the drivers’ phone numbers.'],
   ['If a road is closed', 'Wait using the reserve days. Charazani only connects to La Paz via Escoma; if the Charazani–Apolo section is closed, plan C ends at Curva or Cañisaya instead of the RN16.']]},
 'fr': {'title': 'Accès routiers (ABC)', 'items': [
   ['La Paz → Escoma (RN16)', 'Réseau principal, goudronné. L’ABC l’a inspecté en 2026 et a convenu de travaux de reprise. Pas de coupures connues en saison sèche.'],
   ['Escoma → Ulla Ulla → Pelechuco', 'Route hors réseau principal : elle n’apparaît pas dans les rapports quotidiens de l’ABC. Son état doit être confirmé auprès des chauffeurs de Pelechuco et du gouvernement départemental de La Paz.'],
   ['Escoma → Charazani (RN16)', 'Un projet de route Escoma–Pacobamba financé par la CAF était en cours en 2026 : des coupures programmées pour travaux peuvent apparaître.'],
   ['Charazani → Apolo (RN16, secteur Bocamina et Aguas Calientes)', 'Point critique : coupée du 9 au 19 février 2025 ; déblaiement de glissements en janvier 2026 ; glissement et coupure en mars 2026 ; coupures de 07 h à 19 h pour des travaux de buse en août 2026 et restrictions pour les véhicules moyens et lourds en octobre 2026. C’est là que se termine à pied le plan C.'],
   ['Comment et quand vérifier', 'Rapport quotidien de praticabilité de l’ABC (transitabilidad.abc.gob.bo) et ses comptes @carreterasbo, 48 h et 24 h avant le départ et la veille de chaque transfert. Le 17/11/2026, le site avait un certificat de sécurité expiré et demandait un captcha : gardez aussi le téléphone des chauffeurs.'],
   ['Si une route est coupée', 'Attendre en utilisant les jours de réserve. Charazani n’est relié à La Paz que par Escoma ; si le tronçon Charazani–Apolo est coupé, le plan C se termine à Curva ou à Cañisaya au lieu de la RN16.']]},
}

RULES = {
 'en': {'title': 'Criteria that change', 'items': [
   ['Water', 'Treating it does not remove mercury or other metals. There is gold mining with mercury in the area (Sunchulli and Pelechuco rivers). Water is only taken from springs above the mines or confirmed by the community, and a reserve is carried in the Sunchulli valley.'],
   ['Camp 2', 'Away from the Sunchully mining camp and its water, at the lowest site in the valley that can be confirmed (target ≈4,500 m).'],
   ['Mining tracks', 'According to OpenStreetMap, about 19 of the 53 km of the route (36%) follow vehicle tracks. The client is told clearly. In return, almost every section has a vehicle exit for an evacuation.'],
   ['Gear', 'No technical gear is needed for the client. The guide carries spare microspikes only for isolated patches of ice on an easy path. They do not change the TD2 limit: if a pass requires crampons, an ice axe or a rope, we do not cross.'],
   ['Protected area permit', 'Written permit from SERNAP, obtained in person at the head office in La Paz, and registration at the ranger stations of Pelechuco and Lagunillas. The 2024 protected-areas “passport” is not compulsory.']]},
 'fr': {'title': 'Critères qui changent', 'items': [
   ['Eau', 'La traiter n’élimine ni le mercure ni les autres métaux. Il y a des mines d’or utilisant du mercure dans la zone (rivières Sunchulli et Pelechuco). L’eau n’est prise qu’à des sources au-dessus des mines ou confirmées par la communauté, et on en porte une réserve dans la vallée de Sunchulli.'],
   ['Camp 2', 'Loin du campement minier de Sunchully et de son eau, sur l’emplacement le plus bas de la vallée qui puisse être confirmé (objectif ≈4 500 m).'],
   ['Pistes minières', 'Selon OpenStreetMap, environ 19 des 53 km de l’itinéraire (36 %) suivent des pistes carrossables. On le dit clairement au client. En contrepartie, presque chaque tronçon a une sortie en véhicule en cas d’évacuation.'],
   ['Matériel', 'Aucun matériel technique n’est nécessaire pour le client. Le guide porte des microcrampons de réserve uniquement pour des plaques de glace isolées sur un sentier facile. Ils ne changent pas la limite du TD2 : si un col exige crampons, piolet ou encordement, on ne passe pas.'],
   ['Permis de l’aire protégée', 'Permis écrit du SERNAP, obtenu en personne au siège de La Paz, et enregistrement aux postes des gardes de Pelechuco et de Lagunillas. Le « passeport » des aires protégées de 2024 n’est pas obligatoire.']]},
}

ESCAPES = {  # nom català → (anglès, francès)
 'Hilo Hilo · pista a Pelechuco': ('Hilo Hilo · track to Pelechuco', 'Hilo Hilo · piste vers Pelechuco'),
 'Sunchully · pista a Sorapata': ('Sunchully · track to Sorapata', 'Sunchully · piste vers Sorapata'),
 'Quellwa Cota · pista a Sunchully': ('Quellwa Cota · track to Sunchully', 'Quellwa Cota · piste vers Sunchully'),
 'Cañisaya · pista a Curva': ('Cañisaya · track to Curva', 'Cañisaya · piste vers Curva'),
 'Curva · carretera': ('Curva · road', 'Curva · route'),
}
