#!/usr/bin/env python3
"""Dades de temporada, plans B, pla C i accessos per carretera (ABC).

Aquest fitxer és la font d'aquestes dades: escriu window.PLANS a content.js (ca i es)
i el traçat del pla C a guia/planc.js.  Executa'l des de l'arrel:  python3 tools/plans_data.py
Distàncies i desnivells del pla C i de les alternatives: calculats sobre els camins
d'OpenStreetMap (consulta del 17/11/2026) i el model d'elevacions SRTM; marge orientatiu ±10 %.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHECKED = '17/11/2026'

# ---------------------------------------------------------------- temporada
SEASON = {
    # una entrada per mes (gener..desembre): best | ok | risk | no
    'months': ['no', 'no', 'no', 'no', 'ok', 'best', 'best', 'risk', 'ok', 'no', 'no', 'no'],
    'ca': {
        'title': 'Quan fer la travessa',
        'window': 'Finestra recomanada: del 15 de juny al 31 de juliol',
        'proposal': 'Sortida proposada: segona quinzena de juny de 2027',
        'monthNames': ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'],
        'legend': {'best': 'Recomanat', 'ok': 'Possible, amb més incertesa', 'risk': 'Possible, amb risc de nevades fortes', 'no': 'No recomanat'},
        'reasons': [
            ['Juny i juliol', 'És el cor de l’estació seca: el temps és més estable, els rius baixen amb menys cabal i les carreteres del nord de La Paz estan obertes. Les nits són les més fredes de l’any.'],
            ['Maig i setembre', 'Possibles, però amb més incertesa: al maig encara poden quedar pluges i rius alts; al setembre augmenten les tempestes de tarda. Els operadors bolivians ofereixen la ruta de maig a setembre.'],
            ['Agost', 'Hi ha hagut nevades fortes a la zona del pas Sunchulli: uns 60 cm el 10 i 11 d’agost de 1993, amb els passos tancats, i nevades breus entre l’agost i el setembre de 2019. Només amb previsió molt estable i dies de reserva.'],
            ['De desembre a abril', 'Estació de pluges. La carretera Charazani–Apolo es va tallar del 9 al 19 de febrer de 2025 i hi va haver esllavissades al gener i al març de 2026.'],
        ],
    },
    'es': {
        'title': 'Cuándo hacer la travesía',
        'window': 'Ventana recomendada: del 15 de junio al 31 de julio',
        'proposal': 'Salida propuesta: segunda quincena de junio de 2027',
        'monthNames': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        'legend': {'best': 'Recomendado', 'ok': 'Posible, con más incertidumbre', 'risk': 'Posible, con riesgo de nevadas fuertes', 'no': 'No recomendado'},
        'reasons': [
            ['Junio y julio', 'Es el corazón de la estación seca: el tiempo es más estable, los ríos bajan con menos caudal y las carreteras del norte de La Paz están abiertas. Las noches son las más frías del año.'],
            ['Mayo y septiembre', 'Posibles, pero con más incertidumbre: en mayo aún pueden quedar lluvias y ríos altos; en septiembre aumentan las tormentas de tarde. Los operadores bolivianos ofrecen la ruta de mayo a septiembre.'],
            ['Agosto', 'Ha habido nevadas fuertes en la zona del paso Sunchulli: unos 60 cm el 10 y 11 de agosto de 1993, con los pasos cerrados, y nevadas breves entre agosto y septiembre de 2019. Solo con previsión muy estable y días de reserva.'],
            ['De diciembre a abril', 'Estación de lluvias. La carretera Charazani–Apolo se cortó del 9 al 19 de febrero de 2025 y hubo derrumbes en enero y marzo de 2026.'],
        ],
    },
}

# ---------------------------------------------------------------- plans B (per jornada, mateix ordre que window.DAYS)
# Cada element: [títol, text]. Llenguatge operatiu per al guia i el treball.
PLANB = [
    {'day': 5, 'ca': [
        ['Abans del Pas 1', 'Si el grup no està bé o el temps empitjora, tornar a Pelechuco pel mateix camí (6,4 km com a màxim).'],
        ['Evacuació en vehicle', 'Uns 6 dels 9,7 km van per la pista Pelechuco–Hilo Hilo, que creua el Pas 1 (pas de Katantika): un 4×4 des de Pelechuco pot arribar al pas i al Campament 1.'],
        ['A la nit', 'Amb símptomes d’altitud al Campament 1 (4.168 m), baixar a Pelechuco (3.660 m) per la pista.'],
    ], 'es': [
        ['Antes del Paso 1', 'Si el grupo no está bien o el tiempo empeora, volver a Pelechuco por el mismo camino (6,4 km como máximo).'],
        ['Evacuación en vehículo', 'Unos 6 de los 9,7 km van por la pista Pelechuco–Hilo Hilo, que cruza el Paso 1 (paso de Katantika): un 4×4 desde Pelechuco puede llegar al paso y al Campamento 1.'],
        ['Por la noche', 'Con síntomas de altitud en el Campamento 1 (4.168 m), bajar a Pelechuco (3.660 m) por la pista.'],
    ]},
    {'day': 6, 'ca': [
        ['Tota la jornada', 'Gairebé tota la jornada va per la pista. Hilo Hilo és un poble amb escola i pista a Pelechuco (uns 20 km): punt d’evacuació en vehicle.'],
        ['Més aclimatació', 'Si algú ho necessita, es fa servir un dia de reserva a Hilo Hilo abans del pas Sunchulli.'],
    ], 'es': [
        ['Toda la jornada', 'Casi toda la jornada va por la pista. Hilo Hilo es un pueblo con escuela y pista a Pelechuco (unos 20 km): punto de evacuación en vehículo.'],
        ['Más aclimatación', 'Si alguien lo necesita, se usa un día de reserva en Hilo Hilo antes del paso Sunchulli.'],
    ]},
    {'day': 7, 'ca': [
        ['Abans de les 10.10', 'Amb retard, símptomes o previsió desfavorable al primer control: tornar a Hilo Hilo.'],
        ['Hora límit al pas: 14.40', 'L’últim punt de mitja volta còmoda és Agua buena 3 a les 13.40. Si a les 14.40 el grup no és al pas, mitja volta: el retorn a peu fins a Hilo Hilo dura unes 3 h, de manera que es demana el 4×4 per la pista Hilo Hilo–Sorapata, que puja per la vall fins al pas.'],
        ['Pas tancat', 'Amb neu dura o gel no es creua: dia de reserva a Hilo Hilo. Si continua tancat, retirada a Pelechuco en vehicle i trasllat a Charazani per fer el pla C.'],
        ['Després del pas', 'Sunchully (comunitat minera, 4.540 m) és a 2,6 km del Campament 2 per pista, amb sortida en vehicle cap a Sorapata (7,4 km) i, pel pas, cap a Hilo Hilo i Pelechuco (uns 38 km). L’evacuació en vehicle s’acorda abans de sortir.'],
        ['Aigua', 'No s’agafa aigua del riu Sunchulli ni de cap curs per sota de les mines. Sortir d’Agua buena 3 amb 2–3 litres per persona per a la tarda i la nit.'],
    ], 'es': [
        ['Antes de las 10:10', 'Con retraso, síntomas o previsión desfavorable en el primer control: volver a Hilo Hilo.'],
        ['Hora límite en el paso: 14:40', 'El último punto de media vuelta cómoda es Agua buena 3 a las 13:40. Si a las 14:40 el grupo no está en el paso, media vuelta: el regreso a pie hasta Hilo Hilo dura unas 3 h, así que se pide el 4×4 por la pista Hilo Hilo–Sorapata, que sube por el valle hasta el paso.'],
        ['Paso cerrado', 'Con nieve dura o hielo no se cruza: día de reserva en Hilo Hilo. Si sigue cerrado, retirada a Pelechuco en vehículo y traslado a Charazani para hacer el plan C.'],
        ['Después del paso', 'Sunchully (comunidad minera, 4.540 m) está a 2,6 km del Campamento 2 por pista, con salida en vehículo hacia Sorapata (7,4 km) y, por el paso, hacia Hilo Hilo y Pelechuco (unos 38 km). La evacuación en vehículo se acuerda antes de salir.'],
        ['Agua', 'No se coge agua del río Sunchulli ni de ningún curso por debajo de las minas. Salir de Agua buena 3 con 2–3 litros por persona para la tarde y la noche.'],
    ]},
    {'day': 8, 'ca': [
        ['Pla B1 · baixada alternativa', 'Amb neu, gel, roca mullada o poca visibilitat no s’entra a les Mil Corbes (500 m de baixada en 1,2 km). Alternativa: des del Pas 5 baixar cap al sud fins al riu Akamani (≈3.950 m) i remuntar 0,8 km fins a Incacancha. Són 2,9 km i −600/+135 m, més llarga i amb menys pendent; té un tram d’uns 200 m sense cartografiar que cal reconèixer. És la baixada «menys dreta però menys directa» que indicaven els guardaparcs el 2019.'],
        ['Pla B2 · no baixar', 'Si cap de les dues baixades és segura: anar a Quellwa Cota (comunitat, 4.460 m, a 1 km del Pas 5) i acampar-hi amb permís, o evacuar en vehicle per la pista Quellwa Cota–Sunchully (8,3 km).'],
        ['Pla B3 · tornar', 'Abans del Pas 4, tornar al Campament 2 pel mateix camí.'],
    ], 'es': [
        ['Plan B1 · bajada alternativa', 'Con nieve, hielo, roca mojada o poca visibilidad no se entra en las Mil Curvas (500 m de bajada en 1,2 km). Alternativa: desde el Paso 5 bajar hacia el sur hasta el río Akamani (≈3.950 m) y remontar 0,8 km hasta Incacancha. Son 2,9 km y −600/+135 m, más larga y con menos pendiente; tiene un tramo de unos 200 m sin cartografiar que hay que reconocer. Es la bajada «menos empinada pero menos directa» que indicaban los guardaparques en 2019.'],
        ['Plan B2 · no bajar', 'Si ninguna de las dos bajadas es segura: ir a Quellwa Cota (comunidad, 4.460 m, a 1 km del Paso 5) y acampar allí con permiso, o evacuar en vehículo por la pista Quellwa Cota–Sunchully (8,3 km).'],
        ['Plan B3 · volver', 'Antes del Paso 4, volver al Campamento 2 por el mismo camino.'],
    ]},
    {'day': 9, 'ca': [
        ['Abans del Pas d’Akamani', 'Amb tempesta, mala visibilitat, neu o gel previstos als colls: no començar la pujada i quedar-se a Incacancha (dia de reserva).'],
        ['Sortida per l’est', 'Si els colls no són practicables, sortir pel camí de l’Akamani cap a Huayrapata i la carretera RN16 (etapes C3 i C4 del pla C): 19,4 km en dues jornades, sense passar de 4.060 m.'],
        ['Després del pas', 'El Campament 3 és a 600 m d’una pista que porta a Cañisaya (4,8 km) i a Curva (10,3 km): evacuació en vehicle.'],
    ], 'es': [
        ['Antes del Paso de Akamani', 'Con tormenta, mala visibilidad, nieve o hielo previstos en los collados: no empezar la subida y quedarse en Incacancha (día de reserva).'],
        ['Salida por el este', 'Si los collados no son practicables, salir por el camino del Akamani hacia Huayrapata y la carretera RN16 (etapas C3 y C4 del plan C): 19,4 km en dos jornadas, sin pasar de 4.060 m.'],
        ['Después del paso', 'El Campamento 3 está a 600 m de una pista que lleva a Cañisaya (4,8 km) y a Curva (10,3 km): evacuación en vehículo.'],
    ]},
    {'day': 10, 'ca': [
        ['Cruïlla de Curva (11.10)', 'Punt de decisió: si el grup va just de temps o l’arribada a Charazani passaria de les 16.40, la travessa acaba a Curva i es continua en vehicle.'],
        ['Pont del riu', 'El 2019 hi havia un pont de formigó a la baixada cap a Charazani. Sense confirmació recent del pont, el final és a Curva.'],
        ['Carretera', 'Abans de sortir, comprovar a l’ABC l’estat de la RN16 Charazani–Escoma per al retorn a La Paz.'],
    ], 'es': [
        ['Cruce de Curva (11:10)', 'Punto de decisión: si el grupo va justo de tiempo o la llegada a Charazani pasaría de las 16:40, la travesía termina en Curva y se sigue en vehículo.'],
        ['Puente del río', 'En 2019 había un puente de hormigón en la bajada hacia Charazani. Sin confirmación reciente del puente, el final es en Curva.'],
        ['Carretera', 'Antes de salir, comprobar en la ABC el estado de la RN16 Charazani–Escoma para el regreso a La Paz.'],
    ]},
]

# ---------------------------------------------------------------- pla C
PLANC_STAGES = [
    {'code': 'C1', 'day': 5, 'km': 5.2, 'ascent': 200, 'descent': 60, 'max': 3910, 'hours': '2–3 h', 'start': '09.00', 'arrival': '11.00–12.00', 'night': 3880, 'nightLabel': '3.880 m',
     'ca': {'name': 'Curva → Cañisaya', 'text': 'Sortim de Curva, on hem dormit, i fem una caminada curta per pista i camí entre conreus fins a Cañisaya. Serveix d’aclimatació abans de pujar.', 'key': 'Jornada curta: caminar a poc a poc, beure i preparar el pas de l’endemà.', 'night': 'Tenda a Cañisaya, en el lloc acordat amb la comunitat'},
     'es': {'name': 'Curva → Cañisaya', 'text': 'Salimos de Curva, donde hemos dormido, y hacemos una caminata corta por pista y camino entre cultivos hasta Cañisaya. Sirve de aclimatación antes de subir.', 'key': 'Jornada corta: caminar despacio, beber y preparar el paso del día siguiente.', 'night': 'Tienda en Cañisaya, en el lugar acordado con la comunidad'},
     'points': [{'ca': 'Curva', 'es': 'Curva', 'ele': 3740, 'km': 0, 'time': '09.00', 'll': [-15.130012, -69.000020]},
                {'ca': 'Cañisaya', 'es': 'Cañisaya', 'ele': 3880, 'km': 5.2, 'time': '11.00–12.00', 'll': [-15.090628, -69.017920]}]},
    {'code': 'C2', 'day': 6, 'km': 10.0, 'ascent': 950, 'descent': 750, 'max': 4661, 'hours': '6–8 h', 'start': '07.10', 'arrival': '13.10–15.10', 'night': 4060, 'nightLabel': '4.060 m',
     'ca': {'name': 'Cañisaya → Pas d’Akamani → Incacancha', 'text': 'Pugem pel camí de l’Akamani, de traçat precolombí, passem pel Campament 3 i l’Apacheta de Tambillo i creuem el Pas d’Akamani (4.661 m), el punt més alt del pla C. Baixada a les ruïnes d’Incacancha.', 'key': 'Hora límit al Pas d’Akamani: 13.10. Si no s’hi és, tornar al Campament 3.', 'night': 'Tenda a Incacancha'},
     'es': {'name': 'Cañisaya → Paso de Akamani → Incacancha', 'text': 'Subimos por el camino del Akamani, de trazado precolombino, pasamos por el Campamento 3 y la Apacheta de Tambillo y cruzamos el Paso de Akamani (4.661 m), el punto más alto del plan C. Bajada a las ruinas de Incacancha.', 'key': 'Hora límite en el Paso de Akamani: 13:10. Si no se ha llegado, volver al Campamento 3.', 'night': 'Tienda en Incacancha'},
     'points': [{'ca': 'Cañisaya', 'es': 'Cañisaya', 'ele': 3880, 'km': 0, 'time': '07.10', 'll': [-15.090628, -69.017920]},
                {'ca': 'Campament 3', 'es': 'Campamento 3', 'ele': 4171, 'km': 5.1, 'time': '09.40–10.40', 'll': [-15.073298, -68.998971]},
                {'ca': 'Apacheta de Tambillo', 'es': 'Apacheta de Tambillo', 'ele': 4523, 'km': 6.6, 'time': '10.40–11.40', 'll': [-15.065097, -68.993473]},
                {'ca': 'Pas d’Akamani', 'es': 'Paso de Akamani', 'ele': 4661, 'km': 7.3, 'time': '11.10–12.10', 'll': [-15.061215, -68.990457]},
                {'ca': 'Incacancha', 'es': 'Incacancha', 'ele': 4060, 'km': 10.0, 'time': '13.10–15.10', 'll': [-15.049699, -68.974377]}]},
    {'code': 'C3', 'day': 7, 'km': 12.1, 'ascent': 580, 'descent': 950, 'max': 4060, 'hours': '6–8 h', 'start': '07.10', 'arrival': '13.10–15.10', 'night': 3700, 'nightLabel': '3.700 m',
     'ca': {'name': 'Incacancha → Pas Lorisani → Huayrapata', 'text': 'Seguim el camí de l’Akamani riu avall, passem pel mur inca i el Pas Lorisani i baixem fins al refugi del camí. Última remuntada suau fins a Huayrapata.', 'key': 'Jornada llarga però sense passos alts. Aigua de fonts laterals, mai del riu principal.', 'night': 'Tenda a Huayrapata, en el lloc acordat amb la comunitat'},
     'es': {'name': 'Incacancha → Paso Lorisani → Huayrapata', 'text': 'Seguimos el camino del Akamani río abajo, pasamos por el muro inca y el Paso Lorisani y bajamos hasta el refugio del camino. Última remontada suave hasta Huayrapata.', 'key': 'Jornada larga pero sin pasos altos. Agua de fuentes laterales, nunca del río principal.', 'night': 'Tienda en Huayrapata, en el lugar acordado con la comunidad'},
     'points': [{'ca': 'Incacancha', 'es': 'Incacancha', 'ele': 4060, 'km': 0, 'time': '07.10', 'll': [-15.049699, -68.974377]},
                {'ca': 'Mur inca', 'es': 'Muro inca', 'ele': 3920, 'km': 1.4, 'time': '07.50–08.10', 'll': [-15.0574, -68.9663]},
                {'ca': 'Pas Lorisani', 'es': 'Paso Lorisani', 'ele': 3970, 'km': 4.0, 'time': '09.10–09.40', 'll': [-15.0718, -68.9541]},
                {'ca': 'Refugi del camí de l’Akamani', 'es': 'Refugio del camino del Akamani', 'ele': 3590, 'km': 6.1, 'time': '10.10–10.40', 'll': [-15.0834, -68.9492]},
                {'ca': 'Huayrapata', 'es': 'Huayrapata', 'ele': 3700, 'km': 12.1, 'time': '13.10–15.10', 'll': [-15.123098, -68.939598]}]},
    {'code': 'C4', 'day': 8, 'km': 7.3, 'ascent': 340, 'descent': 680, 'max': 4030, 'hours': '4–5 h', 'start': '07.10', 'arrival': '11.10–12.10', 'night': 3195, 'nightLabel': '3.195 m',
     'ca': {'name': 'Huayrapata → Pas de Chatalayo → RN16 → Charazani', 'text': 'Pugem al Pas de Chatalayo (4.030 m), passem per una antiga mina d’antimoni i baixem fins a la carretera RN16. Trasllat en vehicle a Charazani i tarda a les aigües termals.', 'key': 'El vehicle espera a la RN16, al tram Charazani–Apolo: comprovar-ne l’estat a l’ABC el dia abans.', 'night': 'Allotjament local a Charazani'},
     'es': {'name': 'Huayrapata → Paso de Chatalayo → RN16 → Charazani', 'text': 'Subimos al Paso de Chatalayo (4.030 m), pasamos por una antigua mina de antimonio y bajamos hasta la carretera RN16. Traslado en vehículo a Charazani y tarde en las aguas termales.', 'key': 'El vehículo espera en la RN16, en el tramo Charazani–Apolo: comprobar su estado en la ABC el día antes.', 'night': 'Alojamiento local en Charazani'},
     'points': [{'ca': 'Huayrapata', 'es': 'Huayrapata', 'ele': 3700, 'km': 0, 'time': '07.10', 'll': [-15.123098, -68.939598]},
                {'ca': 'Pas de Chatalayo', 'es': 'Paso de Chatalayo', 'ele': 4030, 'km': 2.7, 'time': '08.40–09.10', 'll': [-15.141, -68.9362]},
                {'ca': 'Antiga mina d’antimoni', 'es': 'Antigua mina de antimonio', 'ele': 3930, 'km': 3.1, 'time': '09.00–09.30', 'll': [-15.1431, -68.9383]},
                {'ca': 'Carretera RN16', 'es': 'Carretera RN16', 'ele': 3370, 'km': 7.3, 'time': '11.10–12.10', 'll': [-15.168328, -68.939378]}]},
]

PLANC = {
    'totals': {'km': 34.6, 'ascent': 2070, 'descent': 2440, 'max': 4661},
    'ca': {
        'title': 'Pla C · Cañisaya – Akamani – Charazani',
        'intro': 'Variant completa que evita el pas Sunchulli, la zona minera de Sunchulli i les Mil Corbes. Quatre jornades, 34,6 km, +2.070/−2.440 m i un punt màxim de 4.661 m. Segueix el camí de l’Akamani, de traçat precolombí, que l’autor del track de 2012 recomana com a alternativa a la ruta clàssica.',
        'when': [
            'Abans de sortir de La Paz: si el pas Sunchulli està tancat per neu, si hi ha conflicte a la zona minera, si no hi ha permís de les comunitats o si el reconeixement desaconsella la ruta principal.',
            'Durant la travessa: des d’Incacancha (dia 8) es pot sortir per les etapes C3 i C4 en lloc de les jornades 9 i 10.',
        ],
        'program': [
            ['1–3', 'La Paz: arribada i aclimatació (igual que el programa principal)'],
            ['4', 'La Paz → Curva en vehicle (≈9 h). Allotjament local o tenda a Curva, ≈3.740 m: només 90 m més amunt que La Paz'],
            ['5–8', 'Etapes C1 a C4'],
            ['9', 'Charazani → La Paz. Els dos dies que s’estalvien se sumen als de reserva'],
            ['', 'Aclimatació: La Paz 3.650 m → Curva 3.740 → Cañisaya 3.880 → Incacancha 4.060 → Huayrapata 3.700 → Charazani 3.195. Cap nit puja més de 500 m respecte de l’anterior.'],
        ],
        'source': 'Traçat: camí de l’Akamani a OpenStreetMap; altituds del model SRTM (±20 m). Distàncies i desnivells orientatius (±10 %), pendents de reconèixer.',
    },
    'es': {
        'title': 'Plan C · Cañisaya – Akamani – Charazani',
        'intro': 'Variante completa que evita el paso Sunchulli, la zona minera de Sunchulli y las Mil Curvas. Cuatro jornadas, 34,6 km, +2.070/−2.440 m y un punto máximo de 4.661 m. Sigue el camino del Akamani, de trazado precolombino, que el autor del track de 2012 recomienda como alternativa a la ruta clásica.',
        'when': [
            'Antes de salir de La Paz: si el paso Sunchulli está cerrado por nieve, si hay conflicto en la zona minera, si no hay permiso de las comunidades o si el reconocimiento desaconseja la ruta principal.',
            'Durante la travesía: desde Incacancha (día 8) se puede salir por las etapas C3 y C4 en lugar de las jornadas 9 y 10.',
        ],
        'program': [
            ['1–3', 'La Paz: llegada y aclimatación (igual que el programa principal)'],
            ['4', 'La Paz → Curva en vehículo (≈9 h). Alojamiento local o tienda en Curva, ≈3.740 m: solo 90 m más arriba que La Paz'],
            ['5–8', 'Etapas C1 a C4'],
            ['9', 'Charazani → La Paz. Los dos días que se ahorran se suman a los de reserva'],
            ['', 'Aclimatación: La Paz 3.650 m → Curva 3.740 → Cañisaya 3.880 → Incacancha 4.060 → Huayrapata 3.700 → Charazani 3.195. Ninguna noche sube más de 500 m respecto de la anterior.'],
        ],
        'source': 'Trazado: camino del Akamani en OpenStreetMap; altitudes del modelo SRTM (±20 m). Distancias y desniveles orientativos (±10 %), pendientes de reconocer.',
    },
    'stages': PLANC_STAGES,
}

# ---------------------------------------------------------------- carreteres (ABC) i altres criteris
ROADS = {
    'checked': CHECKED,
    'ca': {
        'title': 'Accessos per carretera (ABC)',
        'items': [
            ['La Paz → Escoma (RN16)', 'Xarxa fonamental, asfaltada. L’ABC hi va fer una inspecció el 2026 i hi va acordar treballs de bacheig. Sense talls coneguts en temporada seca.'],
            ['Escoma → Ulla Ulla → Pelechuco', 'Camí que no forma part de la xarxa fonamental: no surt als informes diaris de l’ABC. Cal confirmar-ne l’estat amb transportistes de Pelechuco i amb la Governació de La Paz.'],
            ['Escoma → Charazani (RN16)', 'Hi ha un projecte de carretera Escoma–Pacobamba amb finançament de la CAF en gestió el 2026: poden aparèixer talls programats per obres.'],
            ['Charazani → Apolo (RN16, tram de Bocamina i Aguas Calientes)', 'Punt crític: tallat del 9 al 19 de febrer de 2025; neteja d’esllavissades al gener de 2026; esllavissada i tall al març de 2026; talls de 07.00 a 19.00 per obres d’una alcantarilla a l’agost de 2026 i restriccions per a vehicles mitjans i pesants a l’octubre de 2026. És on s’acaba a peu el pla C.'],
            ['Com i quan consultar-ho', 'Informe diari de transitabilitat de l’ABC (transitabilidad.abc.gob.bo) i els seus comptes @carreterasbo, 48 h i 24 h abans de sortir i el dia abans de cada trasllat. El 17/11/2026 el portal tenia el certificat de seguretat caducat i demanava captcha: cal tenir també el telèfon dels transportistes.'],
            ['Si una carretera està tallada', 'Esperar amb els dies de reserva. Charazani només té sortida a La Paz per Escoma; si el tram Charazani–Apolo està tallat, el pla C s’acaba a Curva o a Cañisaya en lloc de la RN16.'],
        ],
    },
    'es': {
        'title': 'Accesos por carretera (ABC)',
        'items': [
            ['La Paz → Escoma (RN16)', 'Red fundamental, asfaltada. La ABC hizo una inspección en 2026 y acordó trabajos de bacheo. Sin cortes conocidos en temporada seca.'],
            ['Escoma → Ulla Ulla → Pelechuco', 'Camino que no forma parte de la red fundamental: no aparece en los informes diarios de la ABC. Hay que confirmar su estado con transportistas de Pelechuco y con la Gobernación de La Paz.'],
            ['Escoma → Charazani (RN16)', 'Hay un proyecto de carretera Escoma–Pacobamba con financiación de la CAF en gestión en 2026: pueden aparecer cortes programados por obras.'],
            ['Charazani → Apolo (RN16, tramo de Bocamina y Aguas Calientes)', 'Punto crítico: cortado del 9 al 19 de febrero de 2025; limpieza de derrumbes en enero de 2026; derrumbe y corte en marzo de 2026; cortes de 07:00 a 19:00 por obras de una alcantarilla en agosto de 2026 y restricciones para vehículos medianos y pesados en octubre de 2026. Es donde termina a pie el plan C.'],
            ['Cómo y cuándo consultarlo', 'Informe diario de transitabilidad de la ABC (transitabilidad.abc.gob.bo) y sus cuentas @carreterasbo, 48 h y 24 h antes de salir y el día antes de cada traslado. El 17/11/2026 el portal tenía el certificado de seguridad caducado y pedía captcha: hay que tener también el teléfono de los transportistas.'],
            ['Si una carretera está cortada', 'Esperar con los días de reserva. Charazani solo tiene salida a La Paz por Escoma; si el tramo Charazani–Apolo está cortado, el plan C termina en Curva o en Cañisaya en lugar de la RN16.'],
        ],
    },
}

RULES = {
    'ca': {
        'title': 'Criteris que canvien',
        'items': [
            ['Aigua', 'Tractar-la no n’elimina el mercuri ni altres metalls. A la zona hi ha mineria d’or amb mercuri (rius Sunchulli i Pelechuco). Només s’agafa aigua de fonts per sobre de les mines o confirmades per la comunitat, i se’n porta de reserva a la vall de Sunchulli.'],
            ['Campament 2', 'Lluny del campament miner de Sunchully i de la seva aigua, a l’emplaçament més baix de la vall que es confirmi (objectiu ≈4.500 m).'],
            ['Pistes mineres', 'Segons OpenStreetMap, uns 19 dels 53 km del recorregut (un 36 %) van per pistes per a vehicles. Es diu al client amb claredat. A canvi, gairebé tots els trams tenen sortida en vehicle si cal evacuar.'],
            ['Material', 'No cal material tècnic per al client. El guia porta microcrampons de reserva només per a plaques de gel aïllades en un sender fàcil. No canvien el límit del TD2: si un pas exigeix grampons, piolet o assegurament, no es creua.'],
            ['Permís de l’àrea protegida', 'Permís escrit del SERNAP, tramitat en persona a l’oficina central de La Paz, i registre als campaments de guardaparcs de Pelechuco i Lagunillas. El «passaport» d’àrees protegides de 2024 no és obligatori.'],
        ],
    },
    'es': {
        'title': 'Criterios que cambian',
        'items': [
            ['Agua', 'Tratarla no elimina el mercurio ni otros metales. En la zona hay minería de oro con mercurio (ríos Sunchulli y Pelechuco). Solo se coge agua de fuentes por encima de las minas o confirmadas por la comunidad, y se lleva de reserva en el valle de Sunchulli.'],
            ['Campamento 2', 'Lejos del campamento minero de Sunchully y de su agua, en el emplazamiento más bajo del valle que se confirme (objetivo ≈4.500 m).'],
            ['Pistas mineras', 'Según OpenStreetMap, unos 19 de los 53 km del recorrido (un 36 %) van por pistas para vehículos. Se le dice al cliente con claridad. A cambio, casi todos los tramos tienen salida en vehículo si hay que evacuar.'],
            ['Material', 'No hace falta material técnico para el cliente. El guía lleva microcrampones de reserva solo para placas de hielo aisladas en un sendero fácil. No cambian el límite del TD2: si un paso exige crampones, piolet o aseguramiento, no se cruza.'],
            ['Permiso del área protegida', 'Permiso escrito del SERNAP, tramitado en persona en la oficina central de La Paz, y registro en los campamentos de guardaparques de Pelechuco y Lagunillas. El «pasaporte» de áreas protegidas de 2024 no es obligatorio.'],
        ],
    },
}

# Punts d'evacuació (per a l'atles i l'app)
ESCAPES = [
    {'ca': 'Hilo Hilo · pista a Pelechuco', 'es': 'Hilo Hilo · pista a Pelechuco', 'll': [-14.9255, -69.0294], 'days': [5, 6, 7]},
    {'ca': 'Sunchully · pista a Sorapata', 'es': 'Sunchully · pista a Sorapata', 'll': [-15.0060, -68.9743], 'days': [7, 8]},
    {'ca': 'Quellwa Cota · pista a Sunchully', 'es': 'Quellwa Cota · pista a Sunchully', 'll': [-15.0449, -68.9578], 'days': [8]},
    {'ca': 'Cañisaya · pista a Curva', 'es': 'Cañisaya · pista a Curva', 'll': [-15.0906, -69.0181], 'days': [9, 10]},
    {'ca': 'Curva · carretera', 'es': 'Curva · carretera', 'll': [-15.1300, -69.0000], 'days': [10]},
]


def main():
    # Traçat del pla C i de la baixada alternativa: si hi ha fitxers nous de càlcul (PLANC_WORK), es regenera guia/planc.js
    work = os.environ.get('PLANC_WORK')
    import sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import i18n_plans as T   # anglès i francès
    for L in ('en', 'fr'):
        SEASON[L] = T.SEASON[L]; PLANC[L] = T.PLANC[L]; ROADS[L] = T.ROADS[L]; RULES[L] = T.RULES[L]
        for b in PLANB: b[L] = T.PLANB[b['day']][L]
        for st in PLANC_STAGES:
            st[L] = T.PLANC_STAGES[st['code']][L]
            for p in st['points']: p[L] = T.point(p['ca'])[0 if L == 'en' else 1]
        for e in ESCAPES: e[L] = T.ESCAPES[e['ca']][0 if L == 'en' else 1]
    plans = {'season': SEASON, 'b': PLANB, 'c': PLANC, 'roads': ROADS, 'rules': RULES, 'escapes': ESCAPES}
    p = os.path.join(ROOT, 'content.js')
    src = open(p, encoding='utf8').read()
    line = 'window.PLANS = ' + json.dumps(plans, ensure_ascii=False) + ';'
    if 'window.PLANS = ' in src:
        src = re.sub(r'window\.PLANS = .*?;\n', lambda m: line + '\n', src, count=1, flags=re.S)
    else:
        src = src.rstrip('\n') + '\n' + line + '\n'
    open(p, 'w', encoding='utf8').write(src)
    if not work:
        print('content.js actualitzat (guia/planc.js no es toca)')
        return
    track = json.load(open(os.path.join(work, 'planC_track.json')))
    alt = json.load(open(os.path.join(work, 'milcorbes_alt.json')))
    rpath = os.path.join(work, 'routes.json')
    routes = json.load(open(rpath)) if os.path.exists(rpath) else []
    g = os.path.join(ROOT, 'guia', 'planc.js')
    open(g, 'w', encoding='utf8').write(
        '/* Pla C (Cañisaya – Akamani – Charazani): traçat del camí de l’Akamani a OpenStreetMap (consulta del ' + CHECKED + ') i altituds SRTM.\n'
        '   pts: [lat, lon, altitud, km]; cut: inici de cada etapa C1–C4. alt: baixada alternativa a les Mil Corbes (pla B1 del dia 8).\n'
        '   routes: rutes dels plans B per jornada (a peu o pista per a vehicles), calculades sobre OpenStreetMap. */\n'
        'window.PLANC = ' + json.dumps({'pts': track['pts'], 'cut': track['cut'], 'alt': alt, 'routes': routes,
                                        'src': 'OpenStreetMap contributors (ODbL) · SRTM'}, separators=(',', ':')) + ';\n')
    print('content.js i guia/planc.js actualitzats')


if __name__ == '__main__':
    main()
