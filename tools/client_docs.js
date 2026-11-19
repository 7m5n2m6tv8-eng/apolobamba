#!/usr/bin/env node
/* Genera els documents per al client en català, castellà, anglès i francès:
   fitxa del viatge, preparació i material, pla d'entrenament, llibreta de ruta (dossiers/client/)
   i l'enquesta de satisfacció (dossiers/Enquesta_Satisfaccio_XX.pdf).
   Dades: content.js (COPY, DAYS, PLANS). Executa-ho des de l'arrel:  node tools/client_docs.js */
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const ctx = { window: {} }; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'content.js'), 'utf8'), ctx);
const { COPY, DAYS, PLANS } = ctx;
const LANGS = ['ca', 'es', 'en', 'fr'];
let L = 'ca';
const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ({ en: ',', fr: ' ' })[L] || '.');
const dec = n => n.toFixed(1).replace('.', L === 'en' ? '.' : ',');
const hm = v => L === 'ca' ? v : L === 'fr' ? String(v).replace(/(\d\d)\.(\d\d)/g, '$1 h $2') : String(v).replace(/(\d\d)\.(\d\d)/g, '$1:$2');
const WEB = '7m5n2m6tv8-eng.github.io/apolobamba';

const FILES = {
  fitxa: { ca: 'Fitxa_Viatge_CA.pdf', es: 'Ficha_Viaje_ES.pdf', en: 'Trip_Sheet_EN.pdf', fr: 'Fiche_Voyage_FR.pdf' },
  prep: { ca: 'Preparacio_Material_CA.pdf', es: 'Preparacion_Material_ES.pdf', en: 'Preparation_Gear_EN.pdf', fr: 'Preparation_Materiel_FR.pdf' },
  pla: { ca: 'Pla_Entrenament_CA.pdf', es: 'Plan_Entrenamiento_ES.pdf', en: 'Training_Plan_EN.pdf', fr: 'Plan_Entrainement_FR.pdf' },
  llib: { ca: 'Llibreta_Ruta_CA.pdf', es: 'Libreta_Ruta_ES.pdf', en: 'Route_Notebook_EN.pdf', fr: 'Carnet_Route_FR.pdf' },
  enq: { ca: 'Enquesta_Satisfaccio_CA.pdf', es: 'Enquesta_Satisfaccio_ES.pdf', en: 'Enquesta_Satisfaccio_EN.pdf', fr: 'Enquesta_Satisfaccio_FR.pdf' },
};

const S = {
 ca: {
  fitxaT: 'Fitxa del viatge', sub: 'Pelechuco → Charazani · Bolívia', when: 'Millor època: del 15 de juny al 31 de juliol · Proposta: segona quinzena de juny de 2027',
  figs: [['Programa', '11 dies + 2 de reserva'], ['A peu', '6 jornades · 53,4 km'], ['Desnivell', '+3.450 / −3.915 m'], ['Punt més alt', '5.032 m · pas Sunchulli']],
  dayByDay: 'El viatge, dia a dia', cols: ['Dia', 'Jornada', 'Dades', 'Nit'], reserve: ['+2', 'Dies de reserva', 'Per a aclimatació, meteorologia o imprevistos, sense cost addicional. Cal disposar de 13 dies, més els vols.'],
  forWho: 'Per a qui és', forWhoL: ['Senderistes amb experiència en travesses de diversos dies.', 'Capacitat per a jornades de fins a 9 h 30 i nits en tenda per sobre dels 4.000 m.', 'Conversa prèvia i revisió amb medicina del viatge.', 'Grup de 8 a 13 persones amb guia de muntanya i guia local.'],
  gearH: 'Material personal', gearL: ['Botes provades, bastons i motxilla.', 'Capes tèrmiques, impermeable, guants i gorro.', 'Sac i aïllant per a nits sota zero; frontal amb recanvi.', 'Ampolles i tractament d’aigua; menjar de reserva.', 'Ulleres i crema solar; documents.'],
  hoursH: 'Horaris de marxa', hoursL: ['Sortida a partir de les 07.10 i arribada abans de les 16.40 (hora de Bolívia).', 'Cada jornada té un pla B; el dia 10 pot acabar a Curva amb vehicle.'],
  safeH: 'Altitud i seguretat', safeL: ['Avisa el guia de qualsevol malestar: amb símptomes no es puja a dormir més amunt.', 'Amb neu dura o gel al pas Sunchulli, la jornada no es fa.', 'Aigua només de fonts segures: tractar-la no n’elimina els metalls de la mineria.'],
  planH: 'Plans alternatius', planC: 'Pla C: si el pas Sunchulli no és practicable, la travessa es fa per Cañisaya i l’Akamani (4 jornades, 35 km, màxim 4.661 m), al mateix preu.',
  priceBox: 'Preu de referència amb un mínim de 8 participants i un màxim de 13. Inclou guies, transports del programa, mules, àpats, allotjament, material col·lectiu i assegurança de viatge i activitat. No inclou vols internacionals, equip personal ni despeses personals. Reserves encara no obertes.',
  perPerson: 'per persona', foot: 'Distàncies i desnivells d’un registre GPS: valors aproximats. Horaris de planificació, pendents de reconeixement del recorregut. Condicions a la web:',
  photo: 'Foto: Realnif · Cordillera de Apolobamba · Wikimedia Commons · CC BY-SA 4.0',
  prepT: 'Preparació i material', prepSub: 'Tot el que cal tenir a punt abans de sortir cap a Bolívia',
  prep: [['Abans de reservar', ['Has de tenir experiència en travesses de diversos dies, jornades de fins a 9 hores i mitja i nits en tenda.', 'Fem una conversa prèvia per valorar la teva experiència, la forma física i les expectatives.', 'El viatge dura 11 dies més 2 de reserva: compta 13 dies, més els vols.']],
         ['Documents i vols', ['Passaport vigent. Comprova els requisits d’entrada a Bolívia per a la teva nacionalitat.', 'L’assegurança de viatge i activitat està inclosa: porta la pòlissa i el telèfon d’assistència.', 'Arribada a La Paz el dia 1. Reserva el vol de tornada per després del dia 13, si pot ser amb tarifa flexible.']],
         ['Preparació física', ['Comença com a mínim tres mesos abans.', 'Fes sortides llargues amb motxilla i uns 1.000 m de desnivell.', 'Enllaça dos o tres dies seguits de caminada per acostumar-te a recuperar.', 'Entrena també les baixades: l’últim dia en té gairebé 1.500 m.']],
         ['El temps de mitjan juny a juliol', ['És l’estació seca: dies sovint assolellats i sol intens per l’altitud.', 'Nits sota zero als campaments; als més alts poden baixar de −10 °C.', 'Pot fer vent fort als passos i, de manera puntual, nevar.']],
         ['Salut i altitud', ['Demana cita a un centre de medicina del viatge amb temps: et diran quines vacunes i mesures necessites.', 'Explica al guia la medicació que prens i qualsevol problema de salut rellevant.', 'Passarem cinc nits per sobre dels 4.000 m. Mal de cap, nàusees, cansament estrany o mal dormir són senyals per avisar el guia.', 'Amb símptomes no es puja a dormir més amunt, i si cal es baixa.']],
         ['Qui porta què', ['Les mules porten les tendes, la cuina i una bossa tova amb el teu equipatge. El límit de pes es confirmarà en reservar.', 'Tu portes una motxilla de dia de 25–35 litres amb roba d’abric, aigua, menjar i el que necessitis durant la jornada.']],
         ['Aigua', ['A la zona hi ha mineria d’or: tractar l’aigua no n’elimina els metalls.', 'L’agafem de fonts per sobre de les mines o confirmades per la comunitat i la tractem sempre.', 'Porta capacitat per a 2–3 litres: al tram de Sunchulli en portem de reserva.']],
         ['Un dia de travessa', ['Ens llevem cap a les 6, esmorzem i desmuntem el campament.', 'Sortim a partir de les 07.10 i fem parades i reagrupaments durant el camí.', 'Dinem al camí i arribem al campament a mitja tarda, abans de les 16.40.', 'Sopar calent, revisió del dia i a dormir d’hora.']]],
  listT: 'Llista de material',
  list: [['Roba i calçat', ['Botes de muntanya ja provades', 'Mitjons de muntanya (3–4 parells)', 'Samarretes tèrmiques', 'Folre polar o jaqueta lleugera', 'Jaqueta de plomes o sintètica', 'Jaqueta i pantalons impermeables', 'Pantalons de trekking', 'Guants fins i guants gruixuts', 'Gorro i braga de coll', 'Barret o gorra per al sol']],
         ['Per dormir', ['Sac de dormir de confort a −10 °C o menys', 'Aïllant inflable o de bombolles', 'Roba seca només per dormir']],
         ['Motxilla de dia', ['Motxilla de 25–35 litres', 'Bastons de trekking', 'Ampolles o bossa d’aigua (2–3 litres)', 'Pastilles o filtre per tractar l’aigua', 'Frontal i piles o bateria de recanvi', 'Menjar de reserva per al camí']],
         ['Protecció i salut', ['Ulleres de sol de categoria 3 o 4', 'Crema solar i protector labial', 'Farmaciola personal i medicació habitual', 'Gel hidroalcohòlic i paper', 'Bossa per endur-te els residus']],
         ['Documents', ['Passaport', 'Pòlissa de l’assegurança i telèfons', 'Còpia digital dels documents', 'Diners en efectiu en bolivians']]],
  noTech: 'No cal material tècnic (grampons ni piolet): si un pas els exigís, no es creuaria.',
  prepFoot: 'Recomanacions orientatives. La llista definitiva i el límit de pes s’enviaran en confirmar la reserva. Reserves encara no obertes.',
  plaT: 'Pla d’entrenament de 12 setmanes', plaSub: 'Per arribar a La Paz amb les cames i el cap preparats',
  plaIntro: 'Pla orientatiu per a una persona sana que ja camina per muntanya. Adapta’l al teu nivell i consulta el teu metge abans de començar si tens cap problema de salut. L’entrenament no garanteix una bona adaptació a l’altitud, però fa que les jornades llargues costin menys.',
  plaCols: ['Setmanes', 'Objectiu', 'Entre setmana', 'Cap de setmana'],
  plaRows: [['1–4', 'Base: crear l’hàbit', '2 sessions de 45–60 min a ritme suau (caminar ràpid, bici o córrer) i 1 sessió de força.', '1 sortida de 3–4 h amb 500–700 m de desnivell i motxilla lleugera.'],
            ['5–8', 'Volum: allargar les jornades', '2 sessions de 60 min, una amb pujades, i 1–2 sessions de força.', '1 sortida de 5–6 h amb 900–1.100 m de desnivell i 6–7 kg. Un cap de setmana, dos dies seguits.'],
            ['9–11', 'Específic: semblant a la travessa', '2 sessions de 60–75 min i 1 sessió de força.', 'Dos dies seguits: 8–9 h amb uns 1.000 m el primer i 4–5 h el segon. Baixades llargues amb bastons.'],
            ['12', 'Descàrrega: arribar descansat', '2 sessions suaus de 30–40 min i estiraments.', 'Passeig curt. Prepara la motxilla i dorm bé.']],
  plaBoxes: [['Força: 30 minuts, dues vegades per setmana', ['Esquats i gambades (3 sèries de 12).', 'Pujades a un banc o esglaó amb motxilla.', 'Planxa frontal i lateral.', 'Bessons i treball d’equilibri sobre una cama.']],
             ['Si pots, guanya altitud abans', ['Una o dues sortides per sobre dels 2.500–3.000 m, amb nit en refugi si és possible.', 'Fixa’t en com dorms i com et trobes: és informació útil per al guia.']],
             ['Prova el material mentre entrenes', ['Fes almenys cinc sortides amb les botes del viatge.', 'Camina amb la motxilla i el pes que portaràs.', 'Prova els bastons a les baixades.', 'Prova què menges i beus en jornades llargues.']],
             ['Senyals per afluixar', ['Dolor articular que no marxa en 48 h.', 'Cansament que s’acumula setmana rere setmana.', 'Davant del dubte, descansa: és millor arribar poc entrenat que lesionat.']]],
  plaReady: 'Estàs a punt si pots caminar 8–9 hores amb 1.000 m de desnivell i, l’endemà, tornar a caminar 4–5 hores.',
  plaFoot: 'Recomanacions generals, no un pla mèdic ni individualitzat. Reserves encara no obertes.',
  llibT: 'Llibreta de ruta', llibSub: 'Sis jornades · Pelechuco → Charazani', llibCut: 'Imprimeix a doble cara o retalla les targetes per portar-les a la butxaca.',
  jornada: 'Jornada', dia: 'Dia', llibCols: ['Km', 'Punt', 'Altitud', 'Hora'], key: 'La clau', planB: 'Pla B', night: 'Nit',
  every: 'Cada dia', everyL: ['Sortida a partir de les 07.10 i arribada abans de les 16.40.', 'Avisa el guia de qualsevol malestar.', 'Aigua només de fonts segures, i sempre tractada.', 'Tot el que portes, torna amb tu.'],
  alt: 'Mal d’altura: avisa si notes', altL: ['Mal de cap que no marxa', 'Nàusees o falta de gana', 'Mareig o cansament estrany', 'Dificultat per dormir'], llibFoot: 'Distàncies i hores aproximades.',
  enqT: 'Enquesta anònima de satisfacció', enqCode: 'Codi de sortida',
  enqIntro: 'Participació voluntària i anònima, uns 3 minuts. No escriguis noms, dades mèdiques ni informació que identifiqui altres persones. Les respostes s’utilitzen de forma agregada per millorar el servei. Aquest formulari no autoritza l’ús de la teva opinió com a testimoni publicitari.',
  enqScale: 'Puntua d’1 (gens d’acord) a 5 (totalment d’acord). Marca NA si no ho pots valorar.', enqCol: 'Afirmació',
  enqItems: ['La informació prèvia va explicar clarament la dificultat, l’altitud i els serveis inclosos.', 'El ritme i les parades es van adaptar adequadament al grup.', 'Vaig poder comunicar dubtes o malestar i em vaig sentir escoltat/ada.', 'El guia va donar consignes clares i va explicar les decisions i els canvis.', 'Em vaig sentir acompanyat/ada en les situacions de dificultat.', 'Els continguts sobre natura, cultura i territori em van interessar.', 'L’allotjament, l’alimentació i els recursos es van correspondre amb la informació rebuda.', 'Es va fomentar el respecte pel medi i per les comunitats locals.', 'Globalment, estic satisfet/a amb l’experiència.'],
  enqQ: ['Què t’ha agradat més?', 'Què canviaries o milloraries?', 'Recomanaries aquesta travessa a una persona amb el perfil adequat?', 'Quina informació t’hauria ajudat a preparar-te millor?'], enqYN: ['Sí', 'No', 'No ho sé'], why: 'Per què?',
  enqFoot: 'L’enquesta s’ofereix en acabar el servei. No es condiciona cap servei a contestar-la. Per comunicar una incidència personal, utilitza el canal privat que t’ha indicat l’organització.',
  booking: 'Reserves encara no obertes', page: 'Pàgina',
 },
};
S.es = {
  fitxaT: 'Ficha del viaje', sub: 'Pelechuco → Charazani · Bolivia', when: 'Mejor época: del 15 de junio al 31 de julio · Propuesta: segunda quincena de junio de 2027',
  figs: [['Programa', '11 días + 2 de reserva'], ['A pie', '6 jornadas · 53,4 km'], ['Desnivel', '+3.450 / −3.915 m'], ['Punto más alto', '5.032 m · paso Sunchulli']],
  dayByDay: 'El viaje, día a día', cols: ['Día', 'Jornada', 'Datos', 'Noche'], reserve: ['+2', 'Días de reserva', 'Para aclimatación, meteorología o imprevistos, sin coste adicional. Hay que disponer de 13 días, más los vuelos.'],
  forWho: 'Para quién es', forWhoL: ['Senderistas con experiencia en travesías de varios días.', 'Capacidad para jornadas de hasta 9 h 30 y noches en tienda por encima de los 4.000 m.', 'Conversación previa y revisión con medicina del viajero.', 'Grupo de 8 a 13 personas con guía de montaña y guía local.'],
  gearH: 'Material personal', gearL: ['Botas probadas, bastones y mochila.', 'Capas térmicas, impermeable, guantes y gorro.', 'Saco y aislante para noches bajo cero; frontal con recambio.', 'Botellas y tratamiento de agua; comida de reserva.', 'Gafas y crema solar; documentos.'],
  hoursH: 'Horarios de marcha', hoursL: ['Salida a partir de las 07:10 y llegada antes de las 16:40 (hora de Bolivia).', 'Cada jornada tiene un plan B; el día 10 puede terminar en Curva con vehículo.'],
  safeH: 'Altitud y seguridad', safeL: ['Avisa al guía de cualquier malestar: con síntomas no se sube a dormir más arriba.', 'Con nieve dura o hielo en el paso Sunchulli, la jornada no se hace.', 'Agua solo de fuentes seguras: tratarla no elimina los metales de la minería.'],
  planH: 'Planes alternativos', planC: 'Plan C: si el paso Sunchulli no es practicable, la travesía se hace por Cañisaya y el Akamani (4 jornadas, 35 km, máximo 4.661 m), al mismo precio.',
  priceBox: 'Precio de referencia con un mínimo de 8 participantes y un máximo de 13. Incluye guías, transportes del programa, mulas, comidas, alojamiento, material colectivo y seguro de viaje y actividad. No incluye vuelos internacionales, equipo personal ni gastos personales. Reservas todavía no abiertas.',
  perPerson: 'por persona', foot: 'Distancias y desniveles de un registro GPS: valores aproximados. Horarios de planificación, pendientes de reconocimiento del recorrido. Condiciones en la web:',
  photo: 'Foto: Realnif · Cordillera de Apolobamba · Wikimedia Commons · CC BY-SA 4.0',
  prepT: 'Preparación y material', prepSub: 'Todo lo que hay que tener a punto antes de salir hacia Bolivia',
  prep: [['Antes de reservar', ['Debes tener experiencia en travesías de varios días, jornadas de hasta 9 horas y media y noches en tienda.', 'Hacemos una conversación previa para valorar tu experiencia, la forma física y las expectativas.', 'El viaje dura 11 días más 2 de reserva: cuenta 13 días, más los vuelos.']],
         ['Documentos y vuelos', ['Pasaporte vigente. Comprueba los requisitos de entrada en Bolivia para tu nacionalidad.', 'El seguro de viaje y actividad está incluido: lleva la póliza y el teléfono de asistencia.', 'Llegada a La Paz el día 1. Reserva el vuelo de vuelta para después del día 13, a ser posible con tarifa flexible.']],
         ['Preparación física', ['Empieza como mínimo tres meses antes.', 'Haz salidas largas con mochila y unos 1.000 m de desnivel.', 'Enlaza dos o tres días seguidos de caminata para acostumbrarte a recuperar.', 'Entrena también las bajadas: el último día tiene casi 1.500 m.']],
         ['El tiempo de mediados de junio a julio', ['Es la estación seca: días a menudo soleados y sol intenso por la altitud.', 'Noches bajo cero en los campamentos; en los más altos pueden bajar de −10 °C.', 'Puede hacer viento fuerte en los pasos y, de forma puntual, nevar.']],
         ['Salud y altitud', ['Pide cita en un centro de medicina del viajero con tiempo: te dirán qué vacunas y medidas necesitas.', 'Explica al guía la medicación que tomas y cualquier problema de salud relevante.', 'Pasaremos cinco noches por encima de los 4.000 m. Dolor de cabeza, náuseas, cansancio extraño o dormir mal son señales para avisar al guía.', 'Con síntomas no se sube a dormir más arriba y, si hace falta, se baja.']],
         ['Quién lleva qué', ['Las mulas llevan las tiendas, la cocina y una bolsa blanda con tu equipaje. El límite de peso se confirmará al reservar.', 'Tú llevas una mochila de día de 25–35 litros con ropa de abrigo, agua, comida y lo que necesites durante la jornada.']],
         ['Agua', ['En la zona hay minería de oro: tratar el agua no elimina los metales.', 'La cogemos de fuentes por encima de las minas o confirmadas por la comunidad y la tratamos siempre.', 'Lleva capacidad para 2–3 litros: en el tramo de Sunchulli llevamos de reserva.']],
         ['Un día de travesía', ['Nos levantamos hacia las 6, desayunamos y desmontamos el campamento.', 'Salimos a partir de las 07:10 y hacemos paradas y reagrupamientos durante el camino.', 'Comemos en el camino y llegamos al campamento a media tarde, antes de las 16:40.', 'Cena caliente, repaso del día y a dormir pronto.']]],
  listT: 'Lista de material',
  list: [['Ropa y calzado', ['Botas de montaña ya probadas', 'Calcetines de montaña (3–4 pares)', 'Camisetas térmicas', 'Forro polar o chaqueta ligera', 'Chaqueta de plumas o sintética', 'Chaqueta y pantalones impermeables', 'Pantalones de trekking', 'Guantes finos y guantes gruesos', 'Gorro y braga de cuello', 'Sombrero o gorra para el sol']],
         ['Para dormir', ['Saco de dormir de confort a −10 °C o menos', 'Aislante hinchable o de burbujas', 'Ropa seca solo para dormir']],
         ['Mochila de día', ['Mochila de 25–35 litros', 'Bastones de trekking', 'Botellas o bolsa de agua (2–3 litros)', 'Pastillas o filtro para tratar el agua', 'Frontal y pilas o batería de recambio', 'Comida de reserva para el camino']],
         ['Protección y salud', ['Gafas de sol de categoría 3 o 4', 'Crema solar y protector labial', 'Botiquín personal y medicación habitual', 'Gel hidroalcohólico y papel', 'Bolsa para llevarte los residuos']],
         ['Documentos', ['Pasaporte', 'Póliza del seguro y teléfonos', 'Copia digital de los documentos', 'Dinero en efectivo en bolivianos']]],
  noTech: 'No hace falta material técnico (crampones ni piolet): si un paso los exigiera, no se cruzaría.',
  prepFoot: 'Recomendaciones orientativas. La lista definitiva y el límite de peso se enviarán al confirmar la reserva. Reservas todavía no abiertas.',
  plaT: 'Plan de entrenamiento de 12 semanas', plaSub: 'Para llegar a La Paz con las piernas y la cabeza preparadas',
  plaIntro: 'Plan orientativo para una persona sana que ya camina por montaña. Adáptalo a tu nivel y consulta a tu médico antes de empezar si tienes algún problema de salud. El entrenamiento no garantiza una buena adaptación a la altitud, pero hace que las jornadas largas cuesten menos.',
  plaCols: ['Semanas', 'Objetivo', 'Entre semana', 'Fin de semana'],
  plaRows: [['1–4', 'Base: crear el hábito', '2 sesiones de 45–60 min a ritmo suave (caminar rápido, bici o correr) y 1 sesión de fuerza.', '1 salida de 3–4 h con 500–700 m de desnivel y mochila ligera.'],
            ['5–8', 'Volumen: alargar las jornadas', '2 sesiones de 60 min, una con subidas, y 1–2 sesiones de fuerza.', '1 salida de 5–6 h con 900–1.100 m de desnivel y 6–7 kg. Un fin de semana, dos días seguidos.'],
            ['9–11', 'Específico: parecido a la travesía', '2 sesiones de 60–75 min y 1 sesión de fuerza.', 'Dos días seguidos: 8–9 h con unos 1.000 m el primero y 4–5 h el segundo. Bajadas largas con bastones.'],
            ['12', 'Descarga: llegar descansado', '2 sesiones suaves de 30–40 min y estiramientos.', 'Paseo corto. Prepara la mochila y duerme bien.']],
  plaBoxes: [['Fuerza: 30 minutos, dos veces por semana', ['Sentadillas y zancadas (3 series de 12).', 'Subidas a un banco o escalón con mochila.', 'Plancha frontal y lateral.', 'Gemelos y trabajo de equilibrio sobre una pierna.']],
             ['Si puedes, gana altitud antes', ['Una o dos salidas por encima de los 2.500–3.000 m, con noche en refugio si es posible.', 'Fíjate en cómo duermes y cómo te encuentras: es información útil para el guía.']],
             ['Prueba el material mientras entrenas', ['Haz al menos cinco salidas con las botas del viaje.', 'Camina con la mochila y el peso que llevarás.', 'Prueba los bastones en las bajadas.', 'Prueba qué comes y bebes en jornadas largas.']],
             ['Señales para aflojar', ['Dolor articular que no se va en 48 h.', 'Cansancio que se acumula semana tras semana.', 'Ante la duda, descansa: es mejor llegar poco entrenado que lesionado.']]],
  plaReady: 'Estás a punto si puedes caminar 8–9 horas con 1.000 m de desnivel y, al día siguiente, volver a caminar 4–5 horas.',
  plaFoot: 'Recomendaciones generales, no un plan médico ni individualizado. Reservas todavía no abiertas.',
  llibT: 'Libreta de ruta', llibSub: 'Seis jornadas · Pelechuco → Charazani', llibCut: 'Imprime a doble cara o recorta las tarjetas para llevarlas en el bolsillo.',
  jornada: 'Jornada', dia: 'Día', llibCols: ['Km', 'Punto', 'Altitud', 'Hora'], key: 'La clave', planB: 'Plan B', night: 'Noche',
  every: 'Cada día', everyL: ['Salida a partir de las 07:10 y llegada antes de las 16:40.', 'Avisa al guía de cualquier malestar.', 'Agua solo de fuentes seguras, y siempre tratada.', 'Todo lo que llevas vuelve contigo.'],
  alt: 'Mal de altura: avisa si notas', altL: ['Dolor de cabeza que no se va', 'Náuseas o falta de apetito', 'Mareo o cansancio extraño', 'Dificultad para dormir'], llibFoot: 'Distancias y horas aproximadas.',
  enqT: 'Encuesta anónima de satisfacción', enqCode: 'Código de salida',
  enqIntro: 'Participación voluntaria y anónima, unos 3 minutos. No escribas nombres, datos médicos ni información que identifique a otras personas. Las respuestas se usan de forma agregada para mejorar el servicio. Este formulario no autoriza el uso de tu opinión como testimonio publicitario.',
  enqScale: 'Puntúa de 1 (nada de acuerdo) a 5 (totalmente de acuerdo). Marca NA si no lo puedes valorar.', enqCol: 'Afirmación',
  enqItems: ['La información previa explicó claramente la dificultad, la altitud y los servicios incluidos.', 'El ritmo y las paradas se adaptaron adecuadamente al grupo.', 'Pude comunicar dudas o malestar y me sentí escuchado/a.', 'El guía dio consignas claras y explicó las decisiones y los cambios.', 'Me sentí acompañado/a en las situaciones de dificultad.', 'Los contenidos sobre naturaleza, cultura y territorio me interesaron.', 'El alojamiento, la alimentación y los recursos se correspondieron con la información recibida.', 'Se fomentó el respeto por el medio y por las comunidades locales.', 'Globalmente, estoy satisfecho/a con la experiencia.'],
  enqQ: ['¿Qué te ha gustado más?', '¿Qué cambiarías o mejorarías?', '¿Recomendarías esta travesía a una persona con el perfil adecuado?', '¿Qué información te habría ayudado a prepararte mejor?'], enqYN: ['Sí', 'No', 'No lo sé'], why: '¿Por qué?',
  enqFoot: 'La encuesta se ofrece al terminar el servicio. Ningún servicio se condiciona a contestarla. Para comunicar una incidencia personal, usa el canal privado que te ha indicado la organización.',
  booking: 'Reservas todavía no abiertas', page: 'Página',
};
S.en = {
  fitxaT: 'Trip sheet', sub: 'Pelechuco → Charazani · Bolivia', when: 'Best season: 15 June to 31 July · Proposal: second half of June 2027',
  figs: [['Programme', '11 days + 2 in reserve'], ['On foot', '6 days · 53.4 km'], ['Height gain', '+3,450 / −3,915 m'], ['Highest point', '5,032 m · Sunchulli Pass']],
  dayByDay: 'The trip, day by day', cols: ['Day', 'Stage', 'Figures', 'Night'], reserve: ['+2', 'Reserve days', 'For acclimatisation, weather or the unexpected, at no extra cost. You need 13 days, plus flights.'],
  forWho: 'Who it is for', forWhoL: ['Hikers with multi-day trekking experience.', 'Able to handle days of up to 9 h 30 and nights in tents above 4,000 m.', 'Prior conversation and a travel-medicine check-up.', 'Group of 8 to 13 people with a mountain guide and a local guide.'],
  gearH: 'Personal gear', gearL: ['Broken-in boots, poles and backpack.', 'Thermal layers, waterproofs, gloves and hat.', 'Sleeping bag and mat for nights below zero; head torch with spare.', 'Bottles and water treatment; spare food.', 'Sunglasses and sun cream; documents.'],
  hoursH: 'Walking hours', hoursL: ['Departure from 07:10 and arrival before 16:40 (Bolivian time).', 'Every day has a plan B; day 10 can end at Curva by vehicle.'],
  safeH: 'Altitude and safety', safeL: ['Tell the guide about any discomfort: with symptoms we do not go higher to sleep.', 'With hard snow or ice on the Sunchulli Pass, the day is not done.', 'Water only from safe springs: treating it does not remove metals from mining.'],
  planH: 'Alternative plans', planC: 'Plan C: if the Sunchulli Pass is not passable, the trek goes via Cañisaya and the Akamani (4 days, 35 km, high point 4,661 m), at the same price.',
  priceBox: 'Reference price with a minimum of 8 participants and a maximum of 13. Includes guides, programme transport, mules, meals, accommodation, group equipment and travel and activity insurance. Does not include international flights, personal gear or personal expenses. Bookings not open yet.',
  perPerson: 'per person', foot: 'Distances and height gains from a GPS record: approximate values. Planning times, pending reconnaissance of the route. Conditions on the website:',
  photo: 'Photo: Realnif · Cordillera de Apolobamba · Wikimedia Commons · CC BY-SA 4.0',
  prepT: 'Preparation and gear', prepSub: 'Everything you need to have ready before leaving for Bolivia',
  prep: [['Before booking', ['You need experience of multi-day treks, days of up to nine and a half hours and nights in tents.', 'We have a prior conversation to assess your experience, fitness and expectations.', 'The trip lasts 11 days plus 2 in reserve: allow 13 days, plus flights.']],
         ['Documents and flights', ['Valid passport. Check Bolivia’s entry requirements for your nationality.', 'Travel and activity insurance is included: bring the policy and the assistance phone number.', 'Arrival in La Paz on day 1. Book your return flight for after day 13, ideally with a flexible fare.']],
         ['Physical preparation', ['Start at least three months before.', 'Do long walks with a backpack and about 1,000 m of ascent.', 'Link two or three walking days in a row to get used to recovering.', 'Train the descents too: the last day has almost 1,500 m.']],
         ['The weather from mid-June to July', ['It is the dry season: often sunny days and strong sun because of the altitude.', 'Nights below zero at the camps; at the highest ones it can drop below −10 °C.', 'There can be strong wind on the passes and, occasionally, snow.']],
         ['Health and altitude', ['Book a travel-medicine appointment in good time: they will tell you which vaccines and measures you need.', 'Tell the guide about any medication you take and any relevant health problem.', 'We spend five nights above 4,000 m. Headache, nausea, unusual tiredness or poor sleep are signs to tell the guide.', 'With symptoms we do not go higher to sleep and, if needed, we descend.']],
         ['Who carries what', ['Mules carry the tents, the kitchen and a soft bag with your luggage. The weight limit will be confirmed on booking.', 'You carry a 25–35 litre daypack with warm clothes, water, food and whatever you need during the day.']],
         ['Water', ['There is gold mining in the area: treating water does not remove metals.', 'We take it from springs above the mines or confirmed by the community and always treat it.', 'Bring capacity for 2–3 litres: on the Sunchulli section we carry a reserve.']],
         ['A trekking day', ['We get up around 6, have breakfast and take down camp.', 'We leave from 07:10 and stop and regroup along the way.', 'We have lunch on the trail and reach camp mid-afternoon, before 16:40.', 'Hot dinner, review of the day and early to bed.']]],
  listT: 'Gear list',
  list: [['Clothing and footwear', ['Broken-in mountain boots', 'Mountain socks (3–4 pairs)', 'Thermal tops', 'Fleece or light jacket', 'Down or synthetic jacket', 'Waterproof jacket and trousers', 'Trekking trousers', 'Thin and thick gloves', 'Hat and neck gaiter', 'Sun hat or cap']],
         ['For sleeping', ['Sleeping bag with comfort rating of −10 °C or lower', 'Inflatable or foam mat', 'Dry clothes just for sleeping']],
         ['Daypack', ['25–35 litre backpack', 'Trekking poles', 'Bottles or water bladder (2–3 litres)', 'Tablets or filter to treat water', 'Head torch and spare batteries or power bank', 'Spare food for the trail']],
         ['Protection and health', ['Category 3 or 4 sunglasses', 'Sun cream and lip balm', 'Personal first-aid kit and usual medication', 'Hand sanitiser and tissues', 'Bag to carry your waste out']],
         ['Documents', ['Passport', 'Insurance policy and phone numbers', 'Digital copy of documents', 'Cash in bolivianos']]],
  noTech: 'No technical gear is needed (crampons or ice axe): if a pass required them, we would not cross it.',
  prepFoot: 'Indicative recommendations. The final list and weight limit will be sent when the booking is confirmed. Bookings not open yet.',
  plaT: '12-week training plan', plaSub: 'To arrive in La Paz with legs and head ready',
  plaIntro: 'An indicative plan for a healthy person who already walks in the mountains. Adapt it to your level and see your doctor before starting if you have any health problem. Training does not guarantee good adaptation to altitude, but it makes the long days easier.',
  plaCols: ['Weeks', 'Goal', 'Weekdays', 'Weekend'],
  plaRows: [['1–4', 'Base: build the habit', '2 sessions of 45–60 min at an easy pace (brisk walking, cycling or running) and 1 strength session.', '1 outing of 3–4 h with 500–700 m of ascent and a light pack.'],
            ['5–8', 'Volume: longer days', '2 sessions of 60 min, one with hills, and 1–2 strength sessions.', '1 outing of 5–6 h with 900–1,100 m of ascent and 6–7 kg. One weekend, two days in a row.'],
            ['9–11', 'Specific: like the trek', '2 sessions of 60–75 min and 1 strength session.', 'Two days in a row: 8–9 h with about 1,000 m on the first and 4–5 h on the second. Long descents with poles.'],
            ['12', 'Taper: arrive rested', '2 easy sessions of 30–40 min and stretching.', 'Short walk. Pack your bag and sleep well.']],
  plaBoxes: [['Strength: 30 minutes, twice a week', ['Squats and lunges (3 sets of 12).', 'Step-ups on a bench or step with a backpack.', 'Front and side planks.', 'Calf raises and single-leg balance work.']],
             ['If you can, gain altitude beforehand', ['One or two outings above 2,500–3,000 m, with a night in a hut if possible.', 'Notice how you sleep and feel: it is useful information for the guide.']],
             ['Test your gear while training', ['Do at least five outings in your trip boots.', 'Walk with the backpack and the weight you will carry.', 'Try the poles on descents.', 'Test what you eat and drink on long days.']],
             ['Signs to ease off', ['Joint pain that does not go away within 48 h.', 'Tiredness that builds up week after week.', 'When in doubt, rest: better to arrive under-trained than injured.']]],
  plaReady: 'You are ready if you can walk 8–9 hours with 1,000 m of ascent and walk again for 4–5 hours the next day.',
  plaFoot: 'General recommendations, not a medical or individual plan. Bookings not open yet.',
  llibT: 'Route notebook', llibSub: 'Six days · Pelechuco → Charazani', llibCut: 'Print double-sided or cut out the cards to carry in your pocket.',
  jornada: 'Stage', dia: 'Day', llibCols: ['Km', 'Point', 'Altitude', 'Time'], key: 'Key', planB: 'Plan B', night: 'Night',
  every: 'Every day', everyL: ['Departure from 07:10 and arrival before 16:40.', 'Tell the guide about any discomfort.', 'Water only from safe springs, and always treated.', 'Everything you bring goes back with you.'],
  alt: 'Altitude sickness: tell us if you notice', altL: ['A headache that won’t go away', 'Nausea or loss of appetite', 'Dizziness or unusual tiredness', 'Trouble sleeping'], llibFoot: 'Approximate distances and times.',
  enqT: 'Anonymous satisfaction survey', enqCode: 'Departure code',
  enqIntro: 'Voluntary and anonymous, about 3 minutes. Do not write names, medical data or information that identifies other people. Answers are used in aggregate to improve the service. This form does not authorise the use of your opinion as an advertising testimonial.',
  enqScale: 'Score from 1 (strongly disagree) to 5 (strongly agree). Tick NA if you cannot rate it.', enqCol: 'Statement',
  enqItems: ['The prior information clearly explained the difficulty, altitude and services included.', 'The pace and stops were well adapted to the group.', 'I could share doubts or discomfort and felt listened to.', 'The guide gave clear instructions and explained decisions and changes.', 'I felt supported in difficult situations.', 'The content about nature, culture and the land interested me.', 'Accommodation, food and resources matched the information received.', 'Respect for the environment and local communities was encouraged.', 'Overall, I am satisfied with the experience.'],
  enqQ: ['What did you like most?', 'What would you change or improve?', 'Would you recommend this trek to someone with the right profile?', 'What information would have helped you prepare better?'], enqYN: ['Yes', 'No', 'Not sure'], why: 'Why?',
  enqFoot: 'The survey is offered at the end of the service. No service depends on answering it. To report a personal issue, use the private channel indicated by the organisation.',
  booking: 'Bookings not open yet', page: 'Page',
};
S.fr = {
  fitxaT: 'Fiche du voyage', sub: 'Pelechuco → Charazani · Bolivie', when: 'Meilleure période : du 15 juin au 31 juillet · Proposition : seconde quinzaine de juin 2027',
  figs: [['Programme', '11 jours + 2 de réserve'], ['À pied', '6 jours · 53,4 km'], ['Dénivelé', '+3 450 / −3 915 m'], ['Point le plus haut', '5 032 m · col Sunchulli']],
  dayByDay: 'Le voyage, jour par jour', cols: ['Jour', 'Étape', 'Données', 'Nuit'], reserve: ['+2', 'Jours de réserve', 'Pour l’acclimatation, la météo ou les imprévus, sans coût supplémentaire. Il faut disposer de 13 jours, plus les vols.'],
  forWho: 'Pour qui', forWhoL: ['Randonneurs ayant l’expérience des treks de plusieurs jours.', 'Capables d’enchaîner des journées jusqu’à 9 h 30 et des nuits sous tente au-dessus de 4 000 m.', 'Entretien préalable et consultation de médecine des voyages.', 'Groupe de 8 à 13 personnes avec guide de montagne et guide local.'],
  gearH: 'Matériel personnel', gearL: ['Chaussures rodées, bâtons et sac à dos.', 'Couches thermiques, vêtements imperméables, gants et bonnet.', 'Sac de couchage et matelas pour des nuits sous zéro ; frontale avec rechange.', 'Gourdes et traitement de l’eau ; nourriture de réserve.', 'Lunettes et crème solaire ; documents.'],
  hoursH: 'Horaires de marche', hoursL: ['Départ à partir de 07 h 10 et arrivée avant 16 h 40 (heure bolivienne).', 'Chaque journée a un plan B ; le jour 10 peut se terminer à Curva en véhicule.'],
  safeH: 'Altitude et sécurité', safeL: ['Signalez au guide tout malaise : avec des symptômes, on ne monte pas dormir plus haut.', 'Avec de la neige dure ou de la glace au col Sunchulli, la journée ne se fait pas.', 'Eau uniquement de sources sûres : la traiter n’élimine pas les métaux des mines.'],
  planH: 'Plans alternatifs', planC: 'Plan C : si le col Sunchulli n’est pas praticable, le trek passe par Cañisaya et l’Akamani (4 jours, 35 km, point culminant 4 661 m), au même prix.',
  priceBox: 'Prix de référence avec 8 participants minimum et 13 maximum. Comprend les guides, les transports du programme, les mules, les repas, l’hébergement, le matériel collectif et l’assurance voyage et activité. Ne comprend pas les vols internationaux, l’équipement personnel ni les dépenses personnelles. Réservations pas encore ouvertes.',
  perPerson: 'par personne', foot: 'Distances et dénivelés d’un enregistrement GPS : valeurs approximatives. Horaires prévisionnels, en attente de reconnaissance de l’itinéraire. Conditions sur le site :',
  photo: 'Photo : Realnif · Cordillera de Apolobamba · Wikimedia Commons · CC BY-SA 4.0',
  prepT: 'Préparation et matériel', prepSub: 'Tout ce qu’il faut avoir prêt avant de partir pour la Bolivie',
  prep: [['Avant de réserver', ['Il faut avoir l’expérience des treks de plusieurs jours, de journées jusqu’à neuf heures et demie et des nuits sous tente.', 'Nous avons un entretien préalable pour évaluer votre expérience, votre forme et vos attentes.', 'Le voyage dure 11 jours plus 2 de réserve : prévoyez 13 jours, plus les vols.']],
         ['Documents et vols', ['Passeport valide. Vérifiez les conditions d’entrée en Bolivie pour votre nationalité.', 'L’assurance voyage et activité est incluse : emportez la police et le numéro d’assistance.', 'Arrivée à La Paz le jour 1. Réservez le vol retour après le jour 13, si possible avec un tarif flexible.']],
         ['Préparation physique', ['Commencez au moins trois mois avant.', 'Faites de longues sorties avec sac et environ 1 000 m de dénivelé.', 'Enchaînez deux ou trois jours de marche d’affilée pour vous habituer à récupérer.', 'Entraînez aussi les descentes : le dernier jour en compte près de 1 500 m.']],
         ['Le temps de mi-juin à juillet', ['C’est la saison sèche : journées souvent ensoleillées et soleil intense à cause de l’altitude.', 'Nuits sous zéro aux camps ; aux plus hauts, il peut faire moins de −10 °C.', 'Il peut y avoir un vent fort sur les cols et, ponctuellement, de la neige.']],
         ['Santé et altitude', ['Prenez rendez-vous à temps dans un centre de médecine des voyages : on vous dira quels vaccins et mesures il vous faut.', 'Signalez au guide les médicaments que vous prenez et tout problème de santé important.', 'Nous passons cinq nuits au-dessus de 4 000 m. Mal de tête, nausées, fatigue inhabituelle ou mauvais sommeil sont des signaux à signaler au guide.', 'Avec des symptômes, on ne monte pas dormir plus haut et, si nécessaire, on descend.']],
         ['Qui porte quoi', ['Les mules portent les tentes, la cuisine et un sac souple avec vos bagages. La limite de poids sera confirmée à la réservation.', 'Vous portez un sac de journée de 25–35 litres avec des vêtements chauds, de l’eau, de quoi manger et ce dont vous avez besoin dans la journée.']],
         ['Eau', ['Il y a des mines d’or dans la zone : traiter l’eau n’élimine pas les métaux.', 'Nous la prenons à des sources au-dessus des mines ou confirmées par la communauté et la traitons toujours.', 'Prévoyez une capacité de 2–3 litres : sur le tronçon de Sunchulli, nous portons une réserve.']],
         ['Une journée de trek', ['Lever vers 6 h, petit-déjeuner et démontage du camp.', 'Départ à partir de 07 h 10, avec des pauses et des regroupements en chemin.', 'Déjeuner en chemin et arrivée au camp en milieu d’après-midi, avant 16 h 40.', 'Dîner chaud, bilan de la journée et coucher tôt.']]],
  listT: 'Liste de matériel',
  list: [['Vêtements et chaussures', ['Chaussures de montagne déjà rodées', 'Chaussettes de montagne (3–4 paires)', 'Hauts thermiques', 'Polaire ou veste légère', 'Doudoune en duvet ou synthétique', 'Veste et pantalon imperméables', 'Pantalon de trek', 'Gants fins et gants chauds', 'Bonnet et tour de cou', 'Chapeau ou casquette pour le soleil']],
         ['Pour dormir', ['Sac de couchage confort −10 °C ou moins', 'Matelas gonflable ou en mousse', 'Vêtements secs réservés à la nuit']],
         ['Sac de journée', ['Sac de 25–35 litres', 'Bâtons de marche', 'Gourdes ou poche à eau (2–3 litres)', 'Pastilles ou filtre pour traiter l’eau', 'Frontale et piles ou batterie de rechange', 'Nourriture de réserve pour le chemin']],
         ['Protection et santé', ['Lunettes de soleil catégorie 3 ou 4', 'Crème solaire et baume à lèvres', 'Trousse de secours personnelle et médicaments habituels', 'Gel hydroalcoolique et mouchoirs', 'Sac pour remporter vos déchets']],
         ['Documents', ['Passeport', 'Police d’assurance et numéros de téléphone', 'Copie numérique des documents', 'Espèces en bolivianos']]],
  noTech: 'Aucun matériel technique n’est nécessaire (crampons ou piolet) : si un col les exigeait, on ne le franchirait pas.',
  prepFoot: 'Recommandations indicatives. La liste définitive et la limite de poids seront envoyées à la confirmation de la réservation. Réservations pas encore ouvertes.',
  plaT: 'Plan d’entraînement de 12 semaines', plaSub: 'Pour arriver à La Paz les jambes et la tête prêtes',
  plaIntro: 'Plan indicatif pour une personne en bonne santé qui marche déjà en montagne. Adaptez-le à votre niveau et consultez votre médecin avant de commencer si vous avez un problème de santé. L’entraînement ne garantit pas une bonne adaptation à l’altitude, mais il rend les longues journées plus faciles.',
  plaCols: ['Semaines', 'Objectif', 'En semaine', 'Week-end'],
  plaRows: [['1–4', 'Base : créer l’habitude', '2 séances de 45–60 min à allure douce (marche rapide, vélo ou course) et 1 séance de renforcement.', '1 sortie de 3–4 h avec 500–700 m de dénivelé et un sac léger.'],
            ['5–8', 'Volume : allonger les journées', '2 séances de 60 min, dont une avec des montées, et 1–2 séances de renforcement.', '1 sortie de 5–6 h avec 900–1 100 m de dénivelé et 6–7 kg. Un week-end, deux jours d’affilée.'],
            ['9–11', 'Spécifique : comme le trek', '2 séances de 60–75 min et 1 séance de renforcement.', 'Deux jours d’affilée : 8–9 h avec environ 1 000 m le premier et 4–5 h le second. Longues descentes avec bâtons.'],
            ['12', 'Récupération : arriver reposé', '2 séances douces de 30–40 min et étirements.', 'Courte promenade. Préparez votre sac et dormez bien.']],
  plaBoxes: [['Renforcement : 30 minutes, deux fois par semaine', ['Squats et fentes (3 séries de 12).', 'Montées sur un banc ou une marche avec sac.', 'Gainage frontal et latéral.', 'Mollets et travail d’équilibre sur une jambe.']],
             ['Si possible, prenez de l’altitude avant', ['Une ou deux sorties au-dessus de 2 500–3 000 m, avec une nuit en refuge si possible.', 'Observez comment vous dormez et comment vous vous sentez : c’est une information utile pour le guide.']],
             ['Testez le matériel pendant l’entraînement', ['Faites au moins cinq sorties avec les chaussures du voyage.', 'Marchez avec le sac et le poids que vous porterez.', 'Essayez les bâtons dans les descentes.', 'Testez ce que vous mangez et buvez lors des longues journées.']],
             ['Signaux pour lever le pied', ['Douleur articulaire qui ne passe pas en 48 h.', 'Fatigue qui s’accumule de semaine en semaine.', 'En cas de doute, reposez-vous : mieux vaut arriver peu entraîné que blessé.']]],
  plaReady: 'Vous êtes prêt si vous pouvez marcher 8–9 heures avec 1 000 m de dénivelé et remarcher 4–5 heures le lendemain.',
  plaFoot: 'Recommandations générales, pas un plan médical ni individualisé. Réservations pas encore ouvertes.',
  llibT: 'Carnet de route', llibSub: 'Six jours · Pelechuco → Charazani', llibCut: 'Imprimez en recto verso ou découpez les cartes pour les garder dans la poche.',
  jornada: 'Étape', dia: 'Jour', llibCols: ['Km', 'Point', 'Altitude', 'Heure'], key: 'La clé', planB: 'Plan B', night: 'Nuit',
  every: 'Chaque jour', everyL: ['Départ à partir de 07 h 10 et arrivée avant 16 h 40.', 'Signalez au guide tout malaise.', 'Eau uniquement de sources sûres, et toujours traitée.', 'Tout ce que vous apportez repart avec vous.'],
  alt: 'Mal des montagnes : prévenez si vous ressentez', altL: ['Un mal de tête qui ne passe pas', 'Des nausées ou une perte d’appétit', 'Des vertiges ou une fatigue inhabituelle', 'Des difficultés à dormir'], llibFoot: 'Distances et horaires approximatifs.',
  enqT: 'Enquête de satisfaction anonyme', enqCode: 'Code du départ',
  enqIntro: 'Participation volontaire et anonyme, environ 3 minutes. N’écrivez ni noms, ni données médicales, ni informations qui identifient d’autres personnes. Les réponses sont utilisées de façon agrégée pour améliorer le service. Ce formulaire n’autorise pas l’utilisation de votre avis comme témoignage publicitaire.',
  enqScale: 'Notez de 1 (pas du tout d’accord) à 5 (tout à fait d’accord). Cochez NA si vous ne pouvez pas évaluer.', enqCol: 'Affirmation',
  enqItems: ['L’information préalable a clairement expliqué la difficulté, l’altitude et les services inclus.', 'Le rythme et les pauses ont été bien adaptés au groupe.', 'J’ai pu exprimer mes doutes ou mon malaise et je me suis senti(e) écouté(e).', 'Le guide a donné des consignes claires et expliqué les décisions et les changements.', 'Je me suis senti(e) accompagné(e) dans les situations difficiles.', 'Les contenus sur la nature, la culture et le territoire m’ont intéressé(e).', 'L’hébergement, les repas et les moyens correspondaient aux informations reçues.', 'Le respect du milieu et des communautés locales a été encouragé.', 'Globalement, je suis satisfait(e) de l’expérience.'],
  enqQ: ['Qu’avez-vous préféré ?', 'Que changeriez-vous ou amélioreriez-vous ?', 'Recommanderiez-vous ce trek à une personne au profil adapté ?', 'Quelle information vous aurait aidé à mieux vous préparer ?'], enqYN: ['Oui', 'Non', 'Je ne sais pas'], why: 'Pourquoi ?',
  enqFoot: 'L’enquête est proposée à la fin du service. Aucun service n’est conditionné à la réponse. Pour signaler un incident personnel, utilisez le canal privé indiqué par l’organisation.',
  booking: 'Réservations pas encore ouvertes', page: 'Page',
};

const CSS = `@page{size:A4;margin:14mm 13mm 14mm}*{box-sizing:border-box}body{margin:0;font:9.6pt/1.45 Inter,'Helvetica Neue',Arial,sans-serif;color:#1d302a}
h1{font:400 24pt/1.1 Georgia,serif;color:#163e33;margin:0 0 1.5mm;letter-spacing:-.02em}h2{font:600 11pt Inter,Arial,sans-serif;color:#163e33;margin:4mm 0 1.5mm;padding-bottom:1mm;border-bottom:1px solid #e5c98d}
.sub{color:#5b6b64;margin:0 0 1mm}.when{display:inline-block;background:#163e33;color:#fff;border-radius:1mm;padding:1.2mm 3mm;font-weight:600;font-size:9pt;margin:1.5mm 0 3mm}
.figs{display:grid;grid-template-columns:repeat(4,1fr);gap:2mm;margin:0 0 2mm}.figs div{border:1px solid #d9ddd0;border-radius:1.5mm;padding:2mm 2.5mm}.figs b{display:block;font-size:7.5pt;text-transform:uppercase;letter-spacing:.06em;color:#5b6b64}.figs span{font:600 10.5pt Inter,Arial,sans-serif;color:#163e33}
table{width:100%;border-collapse:collapse;font-size:8.6pt}th,td{text-align:left;padding:1.3mm 1.6mm;border-bottom:1px solid #e3e6dd;vertical-align:top}thead th{font-size:7.3pt;text-transform:uppercase;letter-spacing:.06em;color:#5b6b64;border-bottom:1.2px solid #163e33}
tr.walk td:first-child{color:#163e33;font-weight:700}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:1mm 6mm}ul{margin:0;padding-left:4mm}li{margin:.6mm 0}
.price{display:flex;gap:6mm;align-items:center;background:#163e33;color:#fff;border-radius:2mm;padding:3.5mm 5mm;margin-top:3mm}.price strong{font:600 17pt Inter,Arial,sans-serif;white-space:nowrap}.price p{margin:0;font-size:8.4pt}
.foot{font-size:7.3pt;color:#5b6b64;margin-top:3mm;border-top:1px solid #e3e6dd;padding-top:1.5mm}.kick{font-size:7.5pt;letter-spacing:.16em;color:#a5603c;font-weight:700;text-transform:uppercase;margin:0 0 1mm}
.cols3{columns:2;column-gap:7mm}.box{break-inside:avoid;margin-bottom:2.5mm}.box h3{font:600 9.8pt Inter,Arial,sans-serif;color:#163e33;margin:0 0 1mm}
.check li{list-style:none;margin-left:-4mm}.note{background:#eff2e9;border-left:2px solid #163e33;padding:2mm 3mm;margin-top:2mm;font-size:8.8pt}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:0}.card{border:1px dashed #9aa79e;padding:4mm;min-height:92mm;break-inside:avoid}.card h3{font:600 12pt Inter,Arial,sans-serif;color:#163e33;margin:0 0 1mm}.card .m{font-weight:600;color:#163e33;margin:0 0 2mm}.card .k{background:#eff2e9;padding:1.6mm 2mm;margin-top:2mm;font-size:8.4pt}.card .b{font-size:8.2pt;color:#5b6b64;margin-top:1.2mm}
.cover{background:#163e33;color:#fff}.cover h1{color:#fff;font-size:22pt}.cover .sub{color:#e5c98d}
.dur{margin:0 0 1mm;font-size:9pt}.levels{display:grid;grid-template-columns:repeat(4,1fr);gap:2mm}.levels>div{border:1px solid #d9ddd0;border-radius:1.5mm;padding:2mm 2.5mm}.levels b{font-size:7.5pt;text-transform:uppercase;letter-spacing:.05em;color:#5b6b64}.levels p{margin:1mm 0 0;font-size:8pt;line-height:1.35}.dots{display:flex;align-items:center;gap:1mm;margin-top:1.2mm}.dots i{width:5mm;height:1.6mm;border-radius:1mm;background:#e2e6da}.dots i.on{background:#163e33}.dots em{font-style:normal;font-weight:600;color:#163e33;margin-left:2mm}ul.two{columns:2;column-gap:6mm}.meet{background:#eff2e9;border-left:2px solid #a5603c;padding:2mm 3mm;font-size:9pt}.price div{display:flex;flex-direction:column;flex:0 0 66mm}.price div strong{font-size:15pt}.price small{font-size:7.8pt;opacity:.9}.gear{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;font-size:8.3pt}.gear b{color:#163e33;font-size:8.3pt}.gear ul{padding-left:3.5mm}.steps{margin:0;padding-left:4.5mm}.steps li{margin:.8mm 0}.small{font-size:8.3pt}.likert td,.likert th{text-align:center}.likert td:first-child,.likert th:first-child{text-align:left;width:62%}.line{border-bottom:1px solid #9aa79e;height:7mm}`;

const head = (title) => `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body>`;

function fitxa() {
  const s = S[L], c = COPY[L];
  const walk = d => `${dec(d.km)} km · +${fmt(d.ascent)} / −${fmt(d.descent)} m · ${d.hours.replace('9 h 30', '9 h 30 min')}`;
  const rows = c.itinerary.map(r => {
    const d = DAYS.find(x => String(x.day) === r[0]);
    return `<tr class="${d ? 'walk' : ''}"><td>${r[0]}</td><td>${r[1]}</td><td>${d ? walk(d) : hm(r[2])}</td><td>${r[3]}</td></tr>`;
  }).join('') + `<tr><td>${s.reserve[0]}</td><td>${s.reserve[1]}</td><td colspan="2">${s.reserve[2]}</td></tr>`;
  const dots = n => [1, 2, 3, 4].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('');
  const pb = c.planItems.slice(0, 3).map(([a, b]) => `<li><b>${a}.</b> ${hm(b)}</li>`).join('');
  return head(s.fitxaT) + `<p class="kick">Andes Wild Trek</p><h1>Apolobamba · ${s.fitxaT}</h1><p class="sub">${s.sub}</p><span class="when">${s.when}</span>
  <p class="dur"><b>${c.duration}</b> · ${s.booking}</p>
  <h2>${c.levelWord}</h2><div class="levels">${c.levels.map(([n, v, w, t]) => `<div><b>${n}</b><span class="dots">${dots(v)}<em>${w}</em></span><p>${t}</p></div>`).join('')}</div>
  <h2>${c.reqTitle}</h2><ul class="two">${c.reqs.map(x => `<li>${x}</li>`).join('')}</ul>
  <h2>${s.dayByDay}</h2><table><thead><tr>${s.cols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>
  <h2>${s.planH}</h2><ul class="small">${pb}<li>${s.planC}</li></ul>
  <p class="foot">${s.foot} ${WEB}</p>
  <div style="page-break-before:always"></div>
  <div class="meet"><b>${c.meetTitle}.</b> ${hm(c.meetText)}</div>
  <div class="price"><div><strong>${c.priceAmount} € ${s.perPerson}</strong><small>${c.earlyLabel}</small><small><b>${c.priceStd} €</b> · ${c.stdLabel}</small></div><p><b>${c.guarantee[0]}.</b> ${c.guarantee[1]}</p></div>
  <div class="grid2"><div><h2>${c.included}</h2><ul>${c.includeItems.map(x => `<li>${x}</li>`).join('')}</ul></div><div><h2>${c.excluded}</h2><ul>${c.excludeItems.map(x => `<li>${x}</li>`).join('')}</ul><h2>${c.extrasTitle}</h2><ul>${c.extras.map(([a, b]) => `<li>${a}: <i>${b}</i></li>`).join('')}</ul></div></div>
  <h2>${s.gearH}</h2><div class="gear">${c.gearGroups.map(([h, items]) => `<div><b>${h}</b><ul>${items.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}<div><b>${c.gearOrgTitle}</b><ul>${c.gearOrg.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
  <div class="grid2"><div><h2>${c.bookTitle}</h2><ol class="steps">${c.bookSteps.map(([a, b]) => `<li><b>${a}.</b> ${b}</li>`).join('')}</ol><h2>${c.privateTitle}</h2><p class="small">${c.privateText}</p></div>
  <div><h2>${c.cancelTitle}</h2><table><thead><tr>${c.cancelCols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${c.cancelRows.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table><ul class="small">${c.cancelNotes.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
  <p class="foot">${s.priceBox} ${s.photo}<br>ANDES WILD TREK · ${s.fitxaT} · 19.11.2026</p></body></html>`;
}

function prep() {
  const s = S[L];
  return head(s.prepT) + `<p class="kick">Andes Wild Trek</p><h1>Apolobamba · ${s.prepT}</h1><p class="sub">${s.prepSub}</p>
  <div class="cols3">${s.prep.map(([h, items]) => `<div class="box"><h3>${h}</h3><ul>${items.map(x => `<li>${hm(x)}</li>`).join('')}</ul></div>`).join('')}</div>
  <p class="foot">${s.prepFoot} ${WEB}</p>
  <div style="page-break-before:always"></div><h1>${s.listT}</h1>
  <div class="cols3">${[...COPY[L].gearGroups, [COPY[L].gearOrgTitle, COPY[L].gearOrg]].map(([h, items], g) => `<div class="box"><h3>${h}</h3><ul class="check">${items.map(x => `<li>${g < 3 ? '☐' : '✓'} ${x}</li>`).join('')}</ul></div>`).join('')}</div>
  <p class="note">${s.noTech}</p><p class="foot">${s.prepFoot} ${WEB}</p></body></html>`;
}

function pla() {
  const s = S[L];
  return head(s.plaT) + `<p class="kick">Andes Wild Trek</p><h1>Apolobamba · ${s.plaT}</h1><p class="sub">${s.plaSub}</p><p>${s.plaIntro}</p>
  <table><thead><tr>${s.plaCols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${s.plaRows.map(r => `<tr class="walk">${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>
  <div class="grid2" style="margin-top:3mm">${s.plaBoxes.map(([h, items]) => `<div class="box"><h3>${h}</h3><ul>${items.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>
  <p class="note"><b>${s.plaReady}</b></p><p class="foot">${s.plaFoot} ${WEB}</p></body></html>`;
}

function llib() {
  const s = S[L], c = COPY[L];
  const cards = DAYS.map((d, i) => {
    const b = PLANS.b.find(x => x.day === d.day)[L].map(x => x[0]).join(' · ');
    return `<div class="card"><p class="kick">${s.jornada} ${i + 1} · ${s.dia} ${d.day}</p><h3>${c.stageNames[i]}</h3><p class="m">${dec(d.km)} km · +${fmt(d.ascent)} m · −${fmt(d.descent)} m · ${d.hours}</p>
    <table><thead><tr>${s.llibCols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${d.points.map(p => `<tr><td>${dec(p.km)}</td><td>${p[L]}</td><td>${fmt(p.ele)} m</td><td>${hm(p.time)}</td></tr>`).join('')}</tbody></table>
    <div class="k"><b>${s.key}:</b> ${hm(c.stageFocusText[i])}</div><p class="b"><b>${s.planB}:</b> ${hm(b)}</p><p class="b"><b>${s.night}:</b> ${d.nightLabel.replace(/(\d)\.(\d{3})/g, (_, a, z) => a + (({ en: ',', fr: ' ' })[L] || '.') + z)}</p></div>`;
  });
  const cover = `<div class="card cover"><p class="kick" style="color:#e5c98d">Andes Wild Trek</p><h1>${s.llibT}<br>Apolobamba</h1><p class="sub">${s.llibSub}</p><p style="margin-top:40mm;font-size:8.5pt">${s.llibCut}</p></div>`;
  const last = `<div class="card"><h3>${s.every}</h3><ul>${s.everyL.map(x => `<li>${hm(x)}</li>`).join('')}</ul><h3 style="margin-top:4mm">${s.alt}</h3><ul>${s.altL.map(x => `<li>${x}</li>`).join('')}</ul><p class="b" style="margin-top:4mm">${s.llibFoot} ${s.booking}. ${WEB}</p></div>`;
  return head(s.llibT) + `<div class="cards">${cover}${cards[0]}${cards[1]}${cards[2]}</div><div style="page-break-before:always"></div><div class="cards">${cards[3]}${cards[4]}${cards[5]}${last}</div></body></html>`;
}

function enq() {
  const s = S[L];
  return head(s.enqT) + `<p class="kick">Andes Wild Trek · Apolobamba</p><h1>${s.enqT}</h1><p class="sub">${s.enqCode}: ____________________</p><p>${s.enqIntro}</p><p><b>${s.enqScale}</b></p>
  <table class="likert"><thead><tr><th>${s.enqCol}</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>NA</th></tr></thead><tbody>${s.enqItems.map(x => `<tr><td>${x}</td>${'<td>☐</td>'.repeat(6)}</tr>`).join('')}</tbody></table>
  ${s.enqQ.map((q, i) => `<h2>${i + 1}. ${q}</h2>${i === 2 ? `<p>${s.enqYN.map(x => `☐ ${x}`).join('&nbsp;&nbsp;&nbsp;')}</p><p>${s.why}</p><div class="line"></div>` : '<div class="line"></div><div class="line"></div>'}`).join('')}
  <p class="foot">${s.enqFoot}</p></body></html>`;
}

(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-'));
  for (const lang of LANGS) {
    L = lang;
    for (const [key, fn, dir] of [['fitxa', fitxa, 'dossiers/client'], ['prep', prep, 'dossiers/client'], ['pla', pla, 'dossiers/client'], ['llib', llib, 'dossiers/client'], ['enq', enq, 'dossiers']]) {
      const f = path.join(tmp, `${key}-${lang}.html`); fs.writeFileSync(f, fn());
      await page.goto('file://' + f); await page.waitForLoadState('networkidle');
      const out = path.join(ROOT, dir, FILES[key][lang]);
      await page.pdf({ path: out, format: 'A4', printBackground: true, margin: key === 'llib' ? { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' } : undefined, scale: key === 'fitxa' ? 0.84 : 1 });
      console.log(path.relative(ROOT, out));
    }
  }
  await browser.close();
})();
