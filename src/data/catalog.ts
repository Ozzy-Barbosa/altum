export const site = {
  name: 'Altum',
  origin: 'https://www.altumlapaz.com',
  phone: '+52 612 212 5198',
  whatsapp: 'https://wa.me/526122125198',
  github: 'https://github.com/Ozzy-Barbosa',
  location: 'La Paz, Baja California Sur',
};
export const solutions = [
  {
    slug: 'menu',
    name: 'Altum Menú',
    label: 'Menús digitales',
    category: 'Alimentos',
    icon: 'utensils',
    color: '#f6b66b',
    headline: 'Tu menú, siempre al día.',
    description:
      'Una carta digital que tus clientes consultan desde un QR. Actualiza productos y precios sin volver a imprimir.',
    audience: 'Restaurantes, cafeterías, bares y negocios de alimentos.',
    features: [
      'Categorías y búsqueda de platillos',
      'Carrito con resumen de pedido',
      'Precios y disponibilidad editables',
      'Carta preparada para compartir con QR',
    ],
    demo: 'Explora la carta, agrega productos y prepara un pedido de ejemplo.',
    boundary:
      'La demo simula pedidos. La recepción en cocina, el reparto y los pagos se cotizan según el negocio.',
    next: ['Panel de cocina', 'Pedidos por mesa', 'Variantes y extras'],
  },
  {
    slug: 'agenda',
    name: 'Altum Agenda',
    label: 'Agenda de servicios',
    category: 'Servicios',
    icon: 'calendar',
    color: '#b6a4ff',
    headline: 'Menos mensajes. Más organización.',
    description:
      'Presenta tus servicios y permite elegir fecha, profesional y horario en un solo recorrido.',
    audience: 'Barberías, estudios, salones y profesionales que trabajan con citas.',
    features: [
      'Catálogo con duración y precio',
      'Horarios por profesional',
      'Reservas y cancelaciones',
      'Panel de ocupación',
    ],
    demo: 'Elige un servicio y reserva un horario de demostración. Después consulta o cancela tu cita.',
    boundary:
      'No se envían recordatorios ni se cobran anticipos en esta demo. Los horarios son ficticios.',
    next: ['Recordatorios', 'Anticipos', 'Varias sucursales'],
  },
  {
    slug: 'inventario',
    name: 'Altum Inventario',
    label: 'Control de inventario',
    category: 'Operación',
    icon: 'boxes',
    color: '#65d9b5',
    headline: 'Cada producto, bajo control.',
    description:
      'Consulta existencias, registra movimientos y detecta qué productos necesitan reposición.',
    audience: 'Comercios, almacenes pequeños y negocios que administran productos.',
    features: [
      'Alta, edición y baja de productos',
      'Entradas y salidas con historial',
      'Alertas de existencias mínimas',
      'Exportación y resumen del inventario',
    ],
    demo: 'Agrega un producto, registra una entrada o salida y observa cómo cambian los indicadores.',
    boundary:
      'Los datos son de ejemplo. Lotes, caducidades y facturación requieren un alcance adicional.',
    next: ['Proveedores y compras', 'Almacenes', 'Lotes y caducidades'],
  },
  {
    slug: 'commerce',
    name: 'Altum Commerce',
    label: 'Tiendas en línea',
    category: 'Comercio',
    icon: 'shopping-bag',
    color: '#80c9ff',
    headline: 'De descubrirlo a pedirlo.',
    description:
      'Una experiencia de compra con catálogo, carrito y seguimiento de pedidos para tu marca.',
    audience: 'Marcas y comercios que quieren vender productos en línea.',
    features: [
      'Catálogo y filtros',
      'Carrito y cálculo de envío de ejemplo',
      'Confirmación de compra simulada',
      'Historial de pedidos',
    ],
    demo: 'Recorre una tienda de muestra y completa una compra simulada, sin tarjeta ni cobro.',
    boundary:
      'La demo no procesa pagos ni envíos reales. La tienda de un cliente se integra a sus proveedores y políticas.',
    next: ['Pasarela de pago', 'Envíos', 'Devoluciones'],
  },
  {
    slug: 'proyectos',
    name: 'Altum Proyectos',
    label: 'Portal de proyectos',
    category: 'Operación',
    icon: 'kanban',
    color: '#f2b2cf',
    headline: 'El siguiente paso, claro para todos.',
    description:
      'Organiza entregables, responsables y fechas en un tablero que muestra el avance del trabajo.',
    audience: 'Agencias, constructoras, estudios y equipos que coordinan proyectos.',
    features: [
      'Tablero por estado',
      'Tareas con responsable y fecha',
      'Edición y eliminación',
      'Avance y filtro por proyecto',
    ],
    demo: 'Crea una tarea, asigna una fecha y muévela entre pendientes, en proceso y terminadas.',
    boundary:
      'La demo representa un equipo ficticio. Los portales privados y permisos por cliente se configuran en la implementación.',
    next: ['Archivos y aprobaciones', 'Acceso por cliente', 'Comentarios'],
  },
  {
    slug: 'search',
    name: 'Altum Search',
    label: 'Búsqueda de información',
    category: 'Información',
    icon: 'search',
    color: '#96b8ff',
    headline: 'Encuentra lo que necesitas.',
    description:
      'Un buscador que reúne documentos y respuestas del negocio con filtros y resultados relevantes.',
    audience: 'Negocios con catálogos, manuales, políticas o documentación frecuente.',
    features: [
      'Búsqueda por palabras',
      'Resultados ordenados por relevancia',
      'Filtros por categoría',
      'Biblioteca editable de documentos',
    ],
    demo: 'Busca una política o servicio, abre su contenido y agrega un documento a tu biblioteca de ejemplo.',
    boundary:
      'Es búsqueda de texto sobre documentos de muestra. No utiliza IA ni consulta información privada de otros negocios.',
    next: ['Fuentes externas', 'Búsqueda semántica', 'Permisos por documento'],
  },
] as const;
export const projects = [
  {
    slug: 'orthomax',
    name: 'Orthomax',
    sector: 'Salud',
    status: 'Publicado',
    image: 'project-ortomax.jpg',
    url: 'https://orthomaxlapaz.com/',
    intro: 'Información clara para acercar un centro odontológico a sus pacientes.',
    challenge:
      'Organizar la información del consultorio y facilitar el contacto desde cualquier pantalla.',
    work: [
      'Jerarquía de servicios y contenido',
      'Diseño adaptable a móvil',
      'Recorridos hacia información y contacto',
    ],
    role: 'Diseño de experiencia y desarrollo web',
    result:
      'Un sitio que reúne la presentación del consultorio, sus servicios y sus vías de contacto.',
    tags: ['Diseño web', 'Experiencia de usuario', 'Desarrollo'],
  },
  {
    slug: 'conchalito-tours',
    name: 'Conchalito Tours',
    sector: 'Turismo',
    status: 'Publicado',
    image: 'project-conchalito-tours.jpg',
    url: 'https://conchalitotours.com/',
    intro: 'Una experiencia digital para descubrir actividades en el Mar de Cortés.',
    challenge:
      'Presentar experiencias turísticas con claridad y facilitar el paso de la exploración a una consulta de reserva.',
    work: [
      'Presentación visual de experiencias',
      'Organización de rutas y consultas',
      'Experiencia adaptable y bilingüe',
    ],
    role: 'Diseño y desarrollo web',
    result:
      'Una presentación visual de la oferta turística con acceso directo al sitio de la marca.',
    tags: ['Turismo', 'Diseño web', 'Responsive'],
  },
  {
    slug: 'alexa-lara',
    name: 'Alexa Lara Fotografía',
    sector: 'Fotografía',
    status: 'En desarrollo',
    image: 'project-alexa-lara.jpg',
    url: '',
    intro: 'Un portafolio editorial que da espacio a las imágenes y a cada historia.',
    challenge:
      'Crear una presentación donde el trabajo fotográfico sea el centro de la experiencia.',
    work: [
      'Dirección visual editorial',
      'Organización del portafolio',
      'Adaptación a distintos tamaños de pantalla',
    ],
    role: 'Dirección visual y desarrollo web',
    result:
      'Vista previa de un proyecto en desarrollo. El sitio final todavía no se presenta como publicado.',
    tags: ['Portafolio', 'Dirección visual', 'Responsive'],
  },
  {
    slug: 'proyectcons',
    name: 'Proyectcons',
    sector: 'Construcción',
    status: 'En desarrollo',
    image: 'project-proyectcons.jpg',
    url: '',
    intro:
      'Una presencia digital estructurada para presentar proyectos y servicios de construcción.',
    challenge:
      'Comunicar la actividad de la empresa con una estructura clara y una presentación visual consistente.',
    work: [
      'Arquitectura de información',
      'Presentación de proyectos',
      'Diseño y desarrollo adaptable',
    ],
    role: 'Diseño de experiencia y desarrollo web',
    result:
      'Vista previa de un sitio en desarrollo. Se publicará su alcance final cuando esté terminado.',
    tags: ['Construcción', 'Diseño web', 'Desarrollo'],
  },
];
export const services = [
  {
    slug: 'paginas-web-la-paz',
    name: 'Páginas web en La Paz',
    short: 'Diseño web',
    intro: 'Una página que explique tu negocio y facilite el siguiente paso.',
    text: 'Diseñamos y desarrollamos páginas web para negocios en La Paz, Baja California Sur. Organizamos tus servicios, tu identidad y tus medios de contacto en una experiencia clara para quien te visita desde el celular o la computadora.',
    problem:
      'Cuando tus clientes encuentran información dispersa, cuesta entender qué ofreces y cómo contratarte. Un sitio propio reúne lo esencial y te permite compartir una dirección que representa a tu negocio.',
    deliverables: [
      'Diseño adaptado a tu identidad',
      'Páginas de servicios y contacto',
      'Optimización de imágenes y experiencia móvil',
      'Metadatos, estructura semántica y mapa del sitio',
      'Publicación en tu dominio y guía de uso',
    ],
    demo: 'menu',
    faq: [
      [
        '¿Puedo usar mi dominio actual?',
        'Sí. Revisamos dónde está registrado y dónde se aloja tu sitio para planear la publicación conservando tu dominio.',
      ],
      [
        '¿Qué información necesito preparar?',
        'Logo, servicios confirmados, fotografías que puedas usar, medios de contacto y objetivos del sitio. Te ayudamos a organizar ese material.',
      ],
      [
        '¿Incluye mantenimiento?',
        'Definimos por separado qué acompañamiento, actualizaciones y alojamiento necesitas después de publicar.',
      ],
    ],
  },
  {
    slug: 'tiendas-en-linea-la-paz',
    name: 'Tiendas en línea en La Paz',
    short: 'Comercio electrónico',
    intro: 'Un recorrido de compra pensado para tus productos.',
    text: 'Creamos catálogos y tiendas en línea para comercios de La Paz. Definimos contigo cómo se eligen los productos, cómo se recibe un pedido y qué opciones de pago y entrega necesita tu operación.',
    problem:
      'Una tienda necesita más que fotografías: requiere precios claros, disponibilidad y una forma confiable de completar cada pedido. Empezamos por tu proceso de venta y construimos alrededor de él.',
    deliverables: [
      'Catálogo con categorías y variantes',
      'Carrito y proceso de compra',
      'Administración de productos y pedidos',
      'Integraciones de pago y envío según alcance',
      'Capacitación para operar la tienda',
    ],
    demo: 'commerce',
    faq: [
      [
        '¿Puede comenzar como catálogo por WhatsApp?',
        'Sí. Podemos iniciar con consulta y solicitud de pedidos, y ampliar el sistema cuando necesites pagos dentro de la tienda.',
      ],
      [
        '¿Quién recibe los pagos?',
        'El negocio utiliza su propia cuenta con el proveedor de pagos acordado. Sus comisiones se revisan antes de la integración.',
      ],
      [
        '¿La demo cobra dinero?',
        'No. La compra demostrativa es una simulación y no solicita tarjetas.',
      ],
    ],
  },
  {
    slug: 'desarrollo-aplicaciones-la-paz',
    name: 'Desarrollo de aplicaciones web en La Paz',
    short: 'Aplicaciones y software',
    intro: 'Software que acompaña la forma en que trabajas.',
    text: 'Desarrollamos aplicaciones web y sistemas a medida para negocios en La Paz, BCS. Convertimos procesos como citas, inventario y seguimiento de proyectos en herramientas que tu equipo puede utilizar desde el navegador.',
    problem:
      'Cuando una operación depende de archivos separados y mensajes, es difícil saber qué está pendiente y quién tiene la información. Diseñamos un flujo compartido con reglas y permisos adecuados.',
    deliverables: [
      'Definición del proceso y alcance',
      'Interfaz y panel de administración',
      'Base de datos y permisos',
      'Validaciones y pruebas de recorridos críticos',
      'Documentación y publicación',
    ],
    demo: 'proyectos',
    faq: [
      [
        '¿Necesito instalar una aplicación?',
        'Las aplicaciones web se utilizan desde un navegador. Revisamos si tu proceso también requiere capacidades sin conexión o una aplicación nativa.',
      ],
      [
        '¿Se puede conectar con otro sistema?',
        'Primero comprobamos si el proveedor ofrece una API o exportaciones compatibles. La integración se estima con esa información.',
      ],
      [
        '¿Puedo empezar con pocas funciones?',
        'Sí. Priorizamos un proceso completo y útil, y después incorporamos nuevas funciones con un alcance definido.',
      ],
    ],
  },
  {
    slug: 'menus-digitales-la-paz',
    name: 'Menús digitales para restaurantes en La Paz',
    short: 'Menús con QR',
    intro: 'Tu carta disponible desde el celular de cada cliente.',
    text: 'Creamos menús digitales para restaurantes, cafeterías y negocios de alimentos en La Paz. Tus categorías, platillos y precios se consultan desde un enlace o un código QR que puedes colocar en tus mesas.',
    problem:
      'Imprimir una carta nueva por cada cambio de precio cuesta tiempo. Un menú digital permite mantener la información organizada y ampliar después hacia pedidos si tu negocio lo necesita.',
    deliverables: [
      'Carta por categorías',
      'Precios y disponibilidad',
      'Diseño con la identidad del restaurante',
      'Acceso desde QR y enlace',
      'Administración y acompañamiento inicial',
    ],
    demo: 'menu',
    faq: [
      [
        '¿El cliente necesita descargar algo?',
        'No. Abre el enlace desde el navegador de su celular.',
      ],
      [
        '¿Puedo cambiar mis precios?',
        'La implementación puede incluir un panel para que el negocio actualice productos y disponibilidad.',
      ],
      [
        '¿Se pueden recibir pedidos?',
        'Sí, como parte del alcance acordado. La demo permite armar un pedido de ejemplo.',
      ],
    ],
  },
  {
    slug: 'sistemas-reservas-la-paz',
    name: 'Sistemas de citas y reservas en La Paz',
    short: 'Agendas y reservas',
    intro: 'Servicios, horarios y citas en un mismo lugar.',
    text: 'Diseñamos agendas en línea para negocios de servicios en La Paz. Tus clientes pueden consultar opciones y elegir horarios según la disponibilidad definida para cada profesional.',
    problem:
      'Coordinar una cita requiere considerar duración, disponibilidad y cambios. Una agenda centraliza esos pasos y permite consultar qué está reservado.',
    deliverables: [
      'Catálogo de servicios y duración',
      'Calendario de disponibilidad',
      'Reserva y cancelación',
      'Panel de citas',
      'Reglas por profesional',
    ],
    demo: 'agenda',
    faq: [
      [
        '¿Se pueden evitar citas duplicadas?',
        'Sí. En un sistema conectado, las reglas de disponibilidad se validan también en la base de datos.',
      ],
      [
        '¿Incluye recordatorios?',
        'Podemos integrar recordatorios. El canal y su costo se definen según el servicio elegido.',
      ],
      [
        '¿Funciona para varios profesionales?',
        'Sí. La disponibilidad se organiza por profesional y servicio.',
      ],
    ],
  },
  {
    slug: 'dashboards-inventario-la-paz',
    name: 'Dashboards y control de inventario en La Paz',
    short: 'Datos e inventario',
    intro: 'Información clara para decidir qué sigue.',
    text: 'Construimos paneles y sistemas de inventario para negocios en La Paz. Partimos de tus registros y de las decisiones que necesitas tomar para definir indicadores comprensibles y operaciones controladas.',
    problem:
      'Un indicador resulta útil cuando puedes consultar los registros que lo explican. Conectamos el resumen con el detalle para revisar existencias, movimientos y trabajo pendiente.',
    deliverables: [
      'Indicadores definidos con el negocio',
      'Búsqueda, filtros y detalle',
      'Registros de movimientos',
      'Importación o exportación según alcance',
      'Permisos para el equipo',
    ],
    demo: 'inventario',
    faq: [
      [
        '¿Qué tipos de dashboard se pueden crear?',
        'Ventas, inventario, operación y seguimiento de proyectos, entre otros. Cada panel se diseña alrededor de una decisión concreta.',
      ],
      [
        '¿Pueden usar mis archivos actuales?',
        'Revisamos su estructura y calidad para preparar una importación, cuando el formato lo permita.',
      ],
      [
        '¿Los números de la demo son reales?',
        'No. Se calculan sobre registros ficticios para mostrar cómo funciona la herramienta.',
      ],
    ],
  },
];
