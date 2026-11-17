/* Fitxes tècniques del guia (cap. 10 del treball). Per a cada jornada: hora de control màxim i decisió de cada punt de pas,
   en el mateix ordre que els punts de window.DAYS (content.js). Hores locals de Bolívia (BOT, UTC−4). */
window.GUIDE = {
  control: [
    [ // Dia 5 · Pelechuco → Campament 1
      ['abans de sortir', 'antes de salir', 'Només iniciar amb aclimatació satisfactòria, camp final confirmat i retorn contrastat localment.', 'Solo iniciar con aclimatación satisfactoria, campamento final confirmado y regreso contrastado localmente.'],
      ['11.10', '11:10', 'Comprovar símptomes, ritme, reserva d’aigua i aspecte del coll. L’aigua es tracta. Si el grup no està bé, tornar pel camí reconegut mentre hi ha marge.', 'Comprobar síntomas, ritmo, reserva de agua y aspecto del collado. El agua se trata. Si el grupo no está bien, volver por el camino reconocido mientras haya margen.'],
      ['13.10', '13:10', 'No creuar amb neu o gel incompatibles amb el material, mala visibilitat, vent que impedeixi l’equilibri o tempesta. No baixar sense identificar el descens al mapa i al terreny.', 'No cruzar con nieve o hielo incompatibles con el material, mala visibilidad, viento que impida el equilibrio o tormenta. No bajar sin identificar el descenso en el mapa y en el terreno.'],
      ['14.10', '14:10', 'Confirmar orientació i camp. Després del coll, tornar enrere pot no ser la millor opció: aplicar la fitxa local de retirada.', 'Confirmar orientación y campamento. Pasado el collado, volver atrás puede no ser la mejor opción: aplicar la ficha local de retirada.'],
      ['16.40', '16:40', 'Només l’emplaçament verificat: lluny de cursos d’aigua i despreniments, amb espai i permís. Nit +508 m respecte de Pelechuco: valoració individual al vespre i al matí.', 'Solo el emplazamiento verificado: lejos de cursos de agua y desprendimientos, con espacio y permiso. Noche +508 m respecto a Pelechuco: valoración individual por la noche y por la mañana.']
    ],
    [ // Dia 6 · Campament 1 → Hilo Hilo
      ['abans de sortir', 'antes de salir', 'Jornada curta de recuperació. Valorar la primera nit alta: amb símptomes, no es continua cap amunt l’endemà.', 'Jornada corta de recuperación. Valorar la primera noche alta: con síntomas, no se sigue hacia arriba al día siguiente.'],
      ['14.00', '14:00', 'Camp acordat amb la comunitat. Tarda de descans, hidratació, revisió de material i del pla del pas Sunchulli.', 'Campamento acordado con la comunidad. Tarde de descanso, hidratación, revisión de material y del plan del paso Sunchulli.']
    ],
    [ // Dia 7 · Hilo Hilo → pas Sunchulli → Campament 2
      ['abans de sortir', 'antes de salir', 'Sortir només amb previsió estable, grup sense símptomes i informe local del pas.', 'Salir solo con previsión estable, grupo sin síntomas e informe local del paso.'],
      ['10.10', '10:10', 'Primer filtre de ritme. Amb retard, símptomes o previsió desfavorable: tornar a Hilo Hilo.', 'Primer filtro de ritmo. Con retraso, síntomas o previsión desfavorable: volver a Hilo Hilo.'],
      ['13.40', '13:40', 'Control individual i del terreny; calcular l’hora d’arribada al coll i al camp. Últim punt de mitja volta còmoda.', 'Control individual y del terreno; calcular la hora de llegada al collado y al campamento. Último punto de media vuelta cómoda.'],
      ['14.40', '14:40', 'MITJA VOLTA si no s’hi és a les 14.40. Passar amb el grup unit i parada mínima. Amb neu dura o gel, no es creua.', 'MEDIA VUELTA si no se ha llegado a las 14:40. Pasar con el grupo unido y parada mínima. Con nieve dura o hielo, no se cruza.'],
      ['16.40', '16:40', 'Acampar a l’emplaçament reconegut més baix de la vall (ideal ≈4.500 m). Valoració individual i avís d’arribada.', 'Acampar en el emplazamiento reconocido más bajo del valle (ideal ≈4.500 m). Valoración individual y aviso de llegada.']
    ],
    [ // Dia 8 · Campament 2 → Incacancha
      ['abans de sortir', 'antes de salir', 'Valorar descens immediat si hi ha símptomes: una nit alta mal tolerada no es resol forçant els colls següents.', 'Valorar descenso inmediato si hay síntomas: una noche alta mal tolerada no se resuelve forzando los collados siguientes.'],
      ['09.10', '09:10', 'Confirmar visibilitat, neu o gel i traçat de baixada.', 'Confirmar visibilidad, nieve o hielo y trazado de bajada.'],
      ['11.40', '11:40', 'Última comprovació anticipada del descens i del camp d’Incacancha.', 'Última comprobación anticipada del descenso y del campamento de Incacancha.'],
      ['11.55', '11:55', 'Verificar l’accés real a l’aigua i tractar-la.', 'Verificar el acceso real al agua y tratarla.'],
      ['12.10', '12:10', 'Reagrupar i observar la continuació abans de les Mil Corbes.', 'Reagrupar y observar la continuación antes de las Mil Curvas.'],
      ['12.40', '12:40', 'No entrar amb gel, roca lliscant, poca visibilitat o grup que no controla el descens. No tallar vessants.', 'No entrar con hielo, roca resbaladiza, poca visibilidad o grupo que no controla el descenso. No atajar laderas.'],
      ['13.10', '13:10', 'Recompte i comprovació d’incidències abans del camp.', 'Recuento y comprobación de incidencias antes del campamento.'],
      ['16.40', '16:40', 'Camp amb autorització i adequació resoltes abans de sortir.', 'Campamento con autorización y adecuación resueltas antes de salir.']
    ],
    [ // Dia 9 · Incacancha → Campament 3
      ['abans de sortir', 'antes de salir', 'No començar la pujada si es preveu entrar als colls amb tempesta, mala visibilitat o neu o gel.', 'No empezar la subida si se prevé entrar en los collados con tormenta, mala visibilidad o nieve o hielo.'],
      ['10.40', '10:40', 'Recompte, estat individual i observació del descens. Amb deteriorament, retorn pel camí reconegut mentre sigui practicable.', 'Recuento, estado individual y observación del descenso. Con deterioro, regreso por el camino reconocido mientras sea practicable.'],
      ['11.10', '11:10', 'Confirmar sobre el terreny la línia entre els dos colls.', 'Confirmar sobre el terreno la línea entre los dos collados.'],
      ['16.40', '16:40', 'Confirmar el camp i preparar la jornada final: comunicació i recollida.', 'Confirmar el campamento y preparar la jornada final: comunicación y recogida.']
    ],
    [ // Dia 10 · Campament 3 → Charazani
      ['abans de sortir', 'antes de salir', 'Confirmar estat del pont, recollida a Charazani i alternativa a Curva. Sense pont verificat, el final és a Curva.', 'Confirmar estado del puente, recogida en Charazani y alternativa en Curva. Sin puente verificado, el final es en Curva.'],
      ['11.10', '11:10', 'PUNT DE DECISIÓ: recompte, peus, genolls i ritme. Passades les 11.10, o si l’arribada a Charazani passaria de les 16.40, final a Curva amb vehicle.', 'PUNTO DE DECISIÓN: recuento, pies, rodillas y ritmo. Pasadas las 11:10, o si la llegada a Charazani pasaría de las 16:40, final en Curva con vehículo.'],
      ['12.40', '12:40', 'Comprovar estructura, accessos i cabal abans d’acostar el grup. No improvisar guals.', 'Comprobar estructura, accesos y caudal antes de acercar al grupo. No improvisar vados.'],
      ['15.10', '15:10', 'Valorar fatiga després de la remuntada i comunicar hora d’arribada a la recollida.', 'Valorar fatiga tras la remontada y comunicar hora de llegada a la recogida.'],
      ['16.40', '16:40', 'Punt de reunió confirmat, recompte, lliurament al transport i avís de tancament.', 'Punto de encuentro confirmado, recuento, entrega al transporte y aviso de cierre.']
    ]
  ],
  // Llum de juny de 2027 a Pelechuco (càlcul NOAA del treball): [dia, sortida del sol, posta]
  sun: [[1, '06:54', '18:13'], [8, '06:57', '18:13'], [15, '06:59', '18:14'], [22, '07:00', '18:15'], [30, '07:02', '18:17']],
  ca: {
    title: 'Guia · Apolobamba', sub: 'Fitxes tècniques de la travessa', tabs: ['Jornades', 'Mapa', 'Meteo', 'Seguretat', 'Llistes'],
    offlineOk: 'Llesta per funcionar sense cobertura.', offlineNo: 'Obre-la amb connexió una vegada per desar-la al mòbil.',
    install: 'Afegeix-la a la pantalla d’inici: menú del navegador → «Afegeix a la pantalla d’inici».',
    day: 'Dia', km: 'km', up: 'Ascens', down: 'Descens', max: 'Punt més alt', night: 'Nit', start: 'Sortida', arrival: 'Arribada', limit: 'Límit al lloc segur',
    cols: ['Km', 'Punt', 'Alt.', 'Objectiu', 'Control màx.'], coords: 'Coordenades', copy: 'Copia', copied: 'Copiat', key: 'Clau de la jornada',
    rule: 'El control efectiu és el més restrictiu entre l’hora escrita, la llum, el grup i les condicions. No s’accelera el grup per complir la taula.',
    gpx: 'Descarrega el GPX (per al GPS o el mòbil)', locate: 'On soc?', locating: 'Buscant posició…', locErr: 'No s’ha pogut obtenir la posició (activa el GPS).',
    you: 'Ets a {d} del traçat, a prop del km {k} ({day}).', far: 'Ets a {d} del recorregut.', mapNote: 'Esquema del traçat GPS (2012) sense mapa de fons: funciona sense cobertura. Per navegar, fes servir el GPX al GPS o en una app de mapes offline.',
    acc: 'precisió ±{a} m', north: 'N', allDays: 'Tot',
    meteoTitle: 'On mirar la meteorologia a Bolívia', meteoWhen: 'Quan: 48 h i 24 h abans de la travessa, i cada matí. Apunta sempre font, hora i decisió al formulari de la jornada.',
    meteoSources: [
      ['SENAMHI Bolívia', 'Servei oficial. Pronòstic per departament (La Paz) i avisos d’alerta. Font de referència per al registre.', 'https://senamhi.gob.bo/'],
      ['Windy', 'Model ECMWF per hores al punt exacte. Mira: vent a 500 hPa (≈5.500 m), isoterma de 0 °C, núvols i precipitació. Obre-ho directament al pas Sunchulli.', 'https://www.windy.com/?-14.997,-68.997,11'],
      ['Meteoblue', 'Meteograma de 7–14 dies i comparació de models per a Pelechuco i Charazani. Útil per veure si els models coincideixen.', 'https://www.meteoblue.com/'],
      ['Mountain-Forecast', 'Previsió per altituds de cims (cerca els cims d’Apolobamba més propers): vent i fred a la cota dels passos.', 'https://www.mountain-forecast.com/'],
      ['Satèl·lit GOES (NOAA)', 'Imatge real de núvols sobre els Andes, cada 10 minuts. Per veure si entren tempestes des de l’Amazònia.', 'https://www.star.nesdis.noaa.gov/GOES/'],
      ['Sense cobertura', 'A la travessa no hi ha mòbil. Previsió per comunicador satèl·lit (p. ex. inReach o Zoleo, servei meteo del dispositiu) i informació de l’arrier i del guia local.', '']
    ],
    meteoCriteria: 'Criteris per decidir',
    criteria: ['Neu dura o gel al pas Sunchulli: no es creua; mitja volta a Hilo Hilo i dia de reserva.', 'Tempesta prevista a la tarda: avançar sortida dins de la llum útil (no abans de les 07.10) o esperar un dia.', 'Vent que impedeix l’equilibri o mala visibilitat als colls: no es creua.', 'Models que no coincideixen: decidir amb la previsió més desfavorable.', 'Al juny el sol es pon cap a les 18.15: arribar a lloc segur abans de les 16.40.'],
    sunTitle: 'Llum de juny de 2027 (Pelechuco)', sunCols: ['Dia', 'Surt el sol', 'Es pon', 'Límit (−90 min)'],
    safetyTitle: 'Seguretat i retirada',
    safety: [
      ['Abans de deixar cada punt segur', 'Compara el temps per continuar amb el temps de retorn validat localment. Deixa 90 minuts de marge abans de la posta.'],
      ['Retirada ordinària', 'Desfer només el camí comprovat fins a l’últim camp o punt segur. No s’inventen dreceres ni sortides per valls sense reconèixer (Lorisani i valls veïnes no són escapaments).'],
      ['No es pot continuar ni tornar', 'Protegir el grup en un lloc adequat, primers auxilis, avisar l’operador i activar el pla acordat. Un SOS no garanteix helicòpter ni temps de resposta.'],
      ['Mal d’altitud greu', 'Alteració de coordinació o consciència, falta d’aire en repòs: prioritzar el descens i l’assistència urgent. La persona no baixa sola. Amb símptomes no es puja a dormir més amunt.'],
      ['Neu o gel al pas Sunchulli', 'Amb dubte, mitja volta a Hilo Hilo i dia de reserva o canvi de programa.'],
      ['Pont o riu impracticable', 'Allunyar el grup del marge, no fer guals i activar l’alternativa (final a Curva).']
    ],
    nightsTitle: 'Cotes de nit', nights: [['La Paz (3 nits)', 3650], ['Pelechuco', 3660], ['Campament 1', 4168], ['Hilo Hilo', 4010], ['Campament 2', 4717], ['Incacancha', 4060], ['Campament 3', 4171], ['Charazani', 3195]],
    nightsNote: 'Referència CDC: per sobre de 3.000 m, no pujar la cota de nit més d’uns 500 m per dia. El salt crític és Hilo Hilo → Campament 2: buscar camp cap als 4.500 m.',
    contactsTitle: 'Contactes de l’expedició', contactsHint: 'Omple-ho abans de sortir. Es desa només en aquest mòbil.',
    contacts: ['Operador local', 'Guia local', 'Contacte extern de seguiment', 'Assistència 24 h de l’assegurança i núm. de pòlissa', 'Centre sanitari receptor', 'Transport a Charazani', 'Transport alternatiu a Curva', 'Comunicador satèl·lit (ID)'],
    checksTitle: 'Llistes de comprovació', reset: 'Desmarca-ho tot',
    checks: [
      ['Tarda anterior', ['Camp, accessos i previsió confirmats', 'Ruta, alternatives i horari d’avisos enviats al contacte extern', 'Mapes i GPX provats sense connexió', 'Bateries, farmaciola, aigua i reserves a punt']],
      ['45 min abans de sortir', ['Conversa individual: son, gana, hidratació, mal de cap, cansament', 'Ningú comença una pujada amb símptomes sense resoldre']],
      ['Briefing (5–10 min)', ['Objectiu i llocs crítics', 'Ritme i reagrupaments', 'Hora de control i alternativa', 'Qui tanca el grup', 'Recompte, material i aigua']],
      ['A cada pas', ['Recompte abans i després', 'Posició verificada al mapa i al terreny', 'Hora real, observacions i decisió anotades']],
      ['En arribar', ['Tothom hi és', 'Tendes muntades, aigua tractada', 'Valoració individual', 'Avís al contacte extern en 30 min', 'Debriefing curt i nota del guia']],
      ['Material del guia', ['Cartografia impresa i offline', 'Brúixola i GPS amb energia', 'Farmaciola ajustada', 'Comunicador satèl·lit provat', 'Documents i formularis']]
    ],
    footer: 'Dades del treball TD2. Recorregut planificat sobre un GPX de 2012 i no reconegut sobre el terreny: els horaris són de planificació.'
  },
  es: {
    title: 'Guía · Apolobamba', sub: 'Fichas técnicas de la travesía', tabs: ['Jornadas', 'Mapa', 'Meteo', 'Seguridad', 'Listas'],
    offlineOk: 'Lista para funcionar sin cobertura.', offlineNo: 'Ábrela con conexión una vez para guardarla en el móvil.',
    install: 'Añádela a la pantalla de inicio: menú del navegador → «Añadir a pantalla de inicio».',
    day: 'Día', km: 'km', up: 'Ascenso', down: 'Descenso', max: 'Punto más alto', night: 'Noche', start: 'Salida', arrival: 'Llegada', limit: 'Límite en lugar seguro',
    cols: ['Km', 'Punto', 'Alt.', 'Objetivo', 'Control máx.'], coords: 'Coordenadas', copy: 'Copiar', copied: 'Copiado', key: 'Clave de la jornada',
    rule: 'El control efectivo es el más restrictivo entre la hora escrita, la luz, el grupo y las condiciones. No se acelera al grupo para cumplir la tabla.',
    gpx: 'Descargar el GPX (para el GPS o el móvil)', locate: '¿Dónde estoy?', locating: 'Buscando posición…', locErr: 'No se ha podido obtener la posición (activa el GPS).',
    you: 'Estás a {d} del trazado, cerca del km {k} ({day}).', far: 'Estás a {d} del recorrido.', mapNote: 'Esquema del trazado GPS (2012) sin mapa de fondo: funciona sin cobertura. Para navegar, usa el GPX en el GPS o en una app de mapas offline.',
    acc: 'precisión ±{a} m', north: 'N', allDays: 'Todo',
    meteoTitle: 'Dónde mirar la meteorología en Bolivia', meteoWhen: 'Cuándo: 48 h y 24 h antes de la travesía, y cada mañana. Anota siempre fuente, hora y decisión en el formulario de la jornada.',
    meteoSources: [
      ['SENAMHI Bolivia', 'Servicio oficial. Pronóstico por departamento (La Paz) y avisos de alerta. Fuente de referencia para el registro.', 'https://senamhi.gob.bo/'],
      ['Windy', 'Modelo ECMWF por horas en el punto exacto. Mira: viento a 500 hPa (≈5.500 m), isoterma de 0 °C, nubes y precipitación. Ábrelo directamente en el paso Sunchulli.', 'https://www.windy.com/?-14.997,-68.997,11'],
      ['Meteoblue', 'Meteograma de 7–14 días y comparación de modelos para Pelechuco y Charazani. Útil para ver si los modelos coinciden.', 'https://www.meteoblue.com/'],
      ['Mountain-Forecast', 'Previsión por altitudes de cumbres (busca las cumbres de Apolobamba más cercanas): viento y frío a la cota de los pasos.', 'https://www.mountain-forecast.com/'],
      ['Satélite GOES (NOAA)', 'Imagen real de nubes sobre los Andes, cada 10 minutos. Para ver si entran tormentas desde la Amazonía.', 'https://www.star.nesdis.noaa.gov/GOES/'],
      ['Sin cobertura', 'En la travesía no hay móvil. Previsión por comunicador satélite (p. ej. inReach o Zoleo, servicio meteo del dispositivo) e información del arriero y del guía local.', '']
    ],
    meteoCriteria: 'Criterios para decidir',
    criteria: ['Nieve dura o hielo en el paso Sunchulli: no se cruza; media vuelta a Hilo Hilo y día de reserva.', 'Tormenta prevista por la tarde: adelantar la salida dentro de la luz útil (no antes de las 07:10) o esperar un día.', 'Viento que impide el equilibrio o mala visibilidad en los collados: no se cruza.', 'Modelos que no coinciden: decidir con la previsión más desfavorable.', 'En junio el sol se pone hacia las 18:15: llegar a lugar seguro antes de las 16:40.'],
    sunTitle: 'Luz de junio de 2027 (Pelechuco)', sunCols: ['Día', 'Sale el sol', 'Se pone', 'Límite (−90 min)'],
    safetyTitle: 'Seguridad y retirada',
    safety: [
      ['Antes de dejar cada punto seguro', 'Compara el tiempo para continuar con el tiempo de regreso validado localmente. Deja 90 minutos de margen antes de la puesta de sol.'],
      ['Retirada ordinaria', 'Deshacer solo el camino comprobado hasta el último campamento o punto seguro. No se inventan atajos ni salidas por valles sin reconocer (Lorisani y valles vecinos no son escapes).'],
      ['No se puede seguir ni volver', 'Proteger al grupo en un lugar adecuado, primeros auxilios, avisar al operador y activar el plan acordado. Un SOS no garantiza helicóptero ni tiempo de respuesta.'],
      ['Mal de altura grave', 'Alteración de coordinación o consciencia, falta de aire en reposo: priorizar el descenso y la asistencia urgente. La persona no baja sola. Con síntomas no se sube a dormir más arriba.'],
      ['Nieve o hielo en el paso Sunchulli', 'Con duda, media vuelta a Hilo Hilo y día de reserva o cambio de programa.'],
      ['Puente o río impracticable', 'Alejar al grupo de la orilla, no vadear y activar la alternativa (final en Curva).']
    ],
    nightsTitle: 'Cotas de noche', nights: [['La Paz (3 noches)', 3650], ['Pelechuco', 3660], ['Campamento 1', 4168], ['Hilo Hilo', 4010], ['Campamento 2', 4717], ['Incacancha', 4060], ['Campamento 3', 4171], ['Charazani', 3195]],
    nightsNote: 'Referencia CDC: por encima de 3.000 m, no subir la cota de noche más de unos 500 m por día. El salto crítico es Hilo Hilo → Campamento 2: buscar campamento hacia los 4.500 m.',
    contactsTitle: 'Contactos de la expedición', contactsHint: 'Rellénalo antes de salir. Se guarda solo en este móvil.',
    contacts: ['Operador local', 'Guía local', 'Contacto externo de seguimiento', 'Asistencia 24 h del seguro y n.º de póliza', 'Centro sanitario receptor', 'Transporte en Charazani', 'Transporte alternativo en Curva', 'Comunicador satélite (ID)'],
    checksTitle: 'Listas de comprobación', reset: 'Desmarcar todo',
    checks: [
      ['Tarde anterior', ['Campamento, accesos y previsión confirmados', 'Ruta, alternativas y horario de avisos enviados al contacto externo', 'Mapas y GPX probados sin conexión', 'Baterías, botiquín, agua y reservas a punto']],
      ['45 min antes de salir', ['Conversación individual: sueño, apetito, hidratación, dolor de cabeza, cansancio', 'Nadie empieza una subida con síntomas sin resolver']],
      ['Briefing (5–10 min)', ['Objetivo y lugares críticos', 'Ritmo y reagrupamientos', 'Hora de control y alternativa', 'Quién cierra el grupo', 'Recuento, material y agua']],
      ['En cada paso', ['Recuento antes y después', 'Posición verificada en el mapa y en el terreno', 'Hora real, observaciones y decisión anotadas']],
      ['Al llegar', ['Están todos', 'Tiendas montadas, agua tratada', 'Valoración individual', 'Aviso al contacto externo en 30 min', 'Debriefing corto y nota del guía']],
      ['Material del guía', ['Cartografía impresa y offline', 'Brújula y GPS con energía', 'Botiquín ajustado', 'Comunicador satélite probado', 'Documentos y formularios']]
    ],
    footer: 'Datos del trabajo TD2. Recorrido planificado sobre un GPX de 2012 y no reconocido sobre el terreno: los horarios son de planificación.'
  }
};
