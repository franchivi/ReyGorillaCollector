// ReygorillaCollector - Consoles Metadata Database
// This file contains definitions and details for the 27 cataloged systems.

const CONSOLE_GENERATIONS = {
  gen1_2: {
    id: "gen1_2",
    name: "1ª y 2ª Generación",
    period: "Los Orígenes (1972 - 1983)",
    color: "#ff3e3e",
    glow: "rgba(255, 62, 62, 0.4)"
  },
  gen3: {
    id: "gen3",
    name: "3ª Generación",
    period: "La era de los 8 bits (1983 - 1987)",
    color: "#ff9f00",
    glow: "rgba(255, 159, 0, 0.4)"
  },
  gen4: {
    id: "gen4",
    name: "4ª Generación",
    period: "El duelo de los 16 bits (1987 - 1993)",
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.4)"
  },
  gen5: {
    id: "gen5",
    name: "5ª Generación",
    period: "El salto al 3D y el CD-ROM (1993 - 1998)",
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.4)"
  },
  gen6: {
    id: "gen6",
    name: "6ª Generación",
    period: "El cambio de milenio (1998 - 2005)",
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.4)"
  }
};

const CONSOLES_DATABASE = [
  // Primera y Segunda Generación (Los Orígenes: 1972 - 1983)
  {
    id: "odyssey",
    name: "Magnavox Odyssey",
    generation: "gen1_2",
    manufacturer: "Magnavox",
    year: 1972,
    media: "Tarjeta de Circuito (Cartucho Analógico)",
    description: "La primera consola de la historia. Usaba tarjetas impresas sin componentes electrónicos activos, utilizando plantillas de plástico para la televisión.",
    gradient: "linear-gradient(135deg, #4b5563, #1f2937)",
    textColor: "#ffffff"
  },
  {
    id: "atari2600",
    name: "Atari 2600",
    generation: "gen1_2",
    manufacturer: "Atari",
    year: 1977,
    media: "Cartucho",
    description: "El primer gran éxito de masas en los hogares. Popularizó los cartuchos intercambiables y trajo clásicos como Space Invaders y Pac-Man.",
    gradient: "linear-gradient(135deg, #78350f, #451a03)",
    textColor: "#fef3c7"
  },
  {
    id: "colecovision",
    name: "ColecoVision",
    generation: "gen1_2",
    manufacturer: "Coleco",
    year: 1982,
    media: "Cartucho",
    description: "Ofrecía una calidad gráfica y sonora asombrosa para su época, muy cercana a los muebles de arcade como Donkey Kong.",
    gradient: "linear-gradient(135deg, #1e3a8a, #0f172a)",
    textColor: "#e0f2fe"
  },
  {
    id: "intellivision",
    name: "Intellivision",
    generation: "gen1_2",
    manufacturer: "Mattel",
    year: 1979,
    media: "Cartucho",
    description: "Primera consola de 16 bits gracias a su CPU GI 1600. Destacó por sus mandos con disco direccional plano y teclados numéricos con plantillas.",
    gradient: "linear-gradient(135deg, #064e3b, #022c22)",
    textColor: "#d1fae5"
  },
  {
    id: "atari5200",
    name: "Atari 5200",
    generation: "gen1_2",
    manufacturer: "Atari",
    year: 1982,
    media: "Cartucho",
    description: "Diseñada para competir con ColecoVision. Basada en la arquitectura de los ordenadores de 8 bits de Atari, famosa por sus mandos analógicos y su gran tamaño.",
    gradient: "linear-gradient(135deg, #3f3f46, #18181b)",
    textColor: "#f4f4f5"
  },

  // Tercera Generación (La era de los 8 bits: 1983 - 1987)
  {
    id: "nes",
    name: "NES / Famicom",
    generation: "gen3",
    manufacturer: "Nintendo",
    year: 1983,
    media: "Cartucho",
    description: "Revivió la industria del videojuego en Norteamérica tras la crisis de 1983. Estableció los estándares modernos de diseño de juego y control.",
    gradient: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    textColor: "#fee2e2"
  },
  {
    id: "mastersystem",
    name: "Sega Master System",
    generation: "gen3",
    manufacturer: "Sega",
    year: 1985,
    media: "Cartucho / Tarjeta Sega Card",
    description: "Consola de 8 bits de Sega con hardware superior a la NES en paleta de colores y potencia. Famosa por Alex Kidd y Sonic en su versión de 8 bits.",
    gradient: "linear-gradient(135deg, #2563eb, #1e3a8a)",
    textColor: "#dbeafe"
  },
  {
    id: "atari7800",
    name: "Atari 7800",
    generation: "gen3",
    manufacturer: "Atari",
    year: 1986,
    media: "Cartucho",
    description: "Compatible de forma nativa con el catálogo de Atari 2600. Ofrecía un chip gráfico MARIA capaz de mover gran cantidad de sprites simultáneos.",
    gradient: "linear-gradient(135deg, #18181b, #09090b)",
    textColor: "#e4e4e7"
  },

  // Cuarta Generación (El duelo de los 16 bits: 1987 - 1993)
  {
    id: "snes",
    name: "Super Nintendo (SNES)",
    generation: "gen4",
    manufacturer: "Nintendo",
    year: 1990,
    media: "Cartucho",
    description: "El cerebro de la bestia. Introdujo el chip Mode 7, sonido de calidad CD y un catálogo legendario de RPGs y plataformas.",
    gradient: "linear-gradient(135deg, #4b5563, #374151)",
    textColor: "#ffffff"
  },
  {
    id: "megadrive",
    name: "Sega Mega Drive / Genesis",
    generation: "gen4",
    manufacturer: "Sega",
    year: 1988,
    media: "Cartucho",
    description: "La consola rebelde de Sega. Gracias a su veloz CPU Motorola 68000 y su 'Blast Processing', ofreció los mejores ports de deportes y acción arcade.",
    gradient: "linear-gradient(135deg, #09090b, #1e293b)",
    textColor: "#cbd5e1"
  },
  {
    id: "pcengine",
    name: "PC Engine / TurboGrafx-16",
    generation: "gen4",
    manufacturer: "NEC / Hudson",
    year: 1987,
    media: "HuCard / CD-ROM",
    description: "Increíble consola japonesa de tamaño ultracompacto con CPU de 8 bits pero GPU de 16 bits. Fue la primera en tener accesorio de CD-ROM.",
    gradient: "linear-gradient(135deg, #db2777, #4c1d95)",
    textColor: "#fce7f3"
  },
  {
    id: "neogeo",
    name: "Neo-Geo AES",
    generation: "gen4",
    manufacturer: "SNK",
    year: 1990,
    media: "Cartucho (Gigante)",
    description: "La reina de los salones recreativos. Llevaba exactamente la misma placa arcade MVS a los hogares, con cartuchos de precio y calidad astronómicos.",
    gradient: "linear-gradient(135deg, #b45309, #78350f)",
    textColor: "#fef3c7"
  },
  {
    id: "gameboy",
    name: "Game Boy",
    generation: "gen4",
    manufacturer: "Nintendo",
    year: 1989,
    media: "Cartucho portátil",
    description: "El rey indiscutible de las portátiles. Pantalla monocromática con un consumo de pila eficiente, catapultada por Tetris y Pokémon.",
    gradient: "linear-gradient(135deg, #4d7c0f, #365314)",
    textColor: "#f1f5f9"
  },
  {
    id: "gamegear",
    name: "Sega Game Gear",
    generation: "gen4",
    manufacturer: "Sega",
    year: 1990,
    media: "Cartucho portátil",
    description: "Portátil a todo color con pantalla retroiluminada. Básicamente una Master System de bolsillo, famosa por su gran consumo de pilas.",
    gradient: "linear-gradient(135deg, #0f766e, #115e59)",
    textColor: "#ccfbf1"
  },
  {
    id: "lynx",
    name: "Atari Lynx",
    generation: "gen4",
    manufacturer: "Atari",
    year: 1989,
    media: "Cartucho portátil",
    description: "La primera consola portátil a color. Destacaba por poder jugarse al revés para usuarios zurdos y por su potencia de zoom de sprites en 3D simulado.",
    gradient: "linear-gradient(135deg, #27272a, #18181b)",
    textColor: "#f4f4f5"
  },

  // Quinta Generación (El salto al 3D y el CD-ROM: 1993 - 1998)
  {
    id: "ps1",
    name: "Sony PlayStation (PS1)",
    generation: "gen5",
    manufacturer: "Sony",
    year: 1994,
    media: "CD-ROM",
    description: "La consola que cambió la industria para siempre. Popularizó los entornos 3D complejos, las cinemáticas en CD y el target de público adulto.",
    gradient: "linear-gradient(135deg, #9ca3af, #4b5563)",
    textColor: "#f3f4f6"
  },
  {
    id: "n64",
    name: "Nintendo 64",
    generation: "gen5",
    manufacturer: "Nintendo",
    year: 1996,
    media: "Cartucho",
    description: "Apostó por el formato cartucho para evitar cargas de datos. Introdujo el stick analógico estándar y revolucionó la jugabilidad 3D.",
    gradient: "linear-gradient(135deg, #059669, #064e3b)",
    textColor: "#ecfdf5"
  },
  {
    id: "saturn",
    name: "Sega Saturn",
    generation: "gen5",
    manufacturer: "Sega",
    year: 1994,
    media: "CD-ROM",
    description: "Una bestia del 2D con un diseño complejo de doble procesador. Dejó grandes joyas de culto y de lucha en 2D.",
    gradient: "linear-gradient(135deg, #4f46e5, #312e81)",
    textColor: "#e0e7ff"
  },
  {
    id: "3do",
    name: "3DO Interactive Multiplayer",
    generation: "gen5",
    manufacturer: "Panasonic / Sanyo / GoldStar",
    year: 1993,
    media: "CD-ROM",
    description: "Estándar de hardware diseñado por Trip Hawkins para unificar el entretenimiento. Fue muy avanzada, pero su alto precio limitó su éxito.",
    gradient: "linear-gradient(135deg, #0891b2, #164e63)",
    textColor: "#ecfeff"
  },
  {
    id: "jaguar",
    name: "Atari Jaguar",
    generation: "gen5",
    manufacturer: "Atari",
    year: 1993,
    media: "Cartucho",
    description: "La última consola de Atari. Comercializada como el primer sistema de 64 bits mediante la suma de sus múltiples chips integrados.",
    gradient: "linear-gradient(135deg, #ea580c, #7c2d12)",
    textColor: "#fff7ed"
  },
  {
    id: "neogeocd",
    name: "Neo-Geo CD",
    generation: "gen5",
    manufacturer: "SNK",
    year: 1994,
    media: "CD-ROM",
    description: "Diseñada para reducir los exorbitantes costos de los cartuchos AES. Famosa por su excelente calidad de sonido CD pero con lentas cargas de pantalla.",
    gradient: "linear-gradient(135deg, #d97706, #78350f)",
    textColor: "#fffbeb"
  },
  {
    id: "gbc",
    name: "Game Boy Color",
    generation: "gen5",
    manufacturer: "Nintendo",
    year: 1998,
    media: "Cartucho portátil",
    description: "Evolución en color de la Game Boy. Manteniendo retrocompatibilidad total y añadiendo un puerto de comunicación infrarrojo.",
    gradient: "linear-gradient(135deg, #c084fc, #581c87)",
    textColor: "#faf5ff"
  },

  // Sexta Generación (El cambio de milenio: 1998 - 2005)
  {
    id: "dreamcast",
    name: "Sega Dreamcast",
    generation: "gen6",
    manufacturer: "Sega",
    year: 1998,
    media: "GD-ROM",
    description: "Una adelantada a su tiempo. Introdujo módem integrado para juego online de serie, mandos con VMU y una increíble potencia gráfica.",
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    textColor: "#fff7ed"
  },
  {
    id: "ps2",
    name: "Sony PlayStation 2 (PS2)",
    generation: "gen6",
    manufacturer: "Sony",
    year: 2000,
    media: "DVD-ROM / CD-ROM",
    description: "La videoconsola más vendida de todos los tiempos. Sirvió como reproductor de DVD en muchos hogares y acumuló un catálogo inmenso.",
    gradient: "linear-gradient(135deg, #1f2937, #111827)",
    textColor: "#f9fafb"
  },
  {
    id: "gamecube",
    name: "Nintendo GameCube",
    generation: "gen6",
    manufacturer: "Nintendo",
    year: 2001,
    media: "MiniDVD (GOL)",
    description: "Una consola extremadamente potente y compacta con un mando legendario por su ergonomía. Usaba discos ópticos propietarios de 8cm.",
    gradient: "linear-gradient(135deg, #7c3aed, #4c1d95)",
    textColor: "#ede9fe"
  },
  {
    id: "xbox",
    name: "Microsoft Xbox",
    generation: "gen6",
    manufacturer: "Microsoft",
    year: 2001,
    media: "DVD-ROM",
    description: "La primera consola de Microsoft. Hardware similar a un PC (Pentium III y gráfica Nvidia), disco duro interno de serie y el pionero servicio Xbox Live.",
    gradient: "linear-gradient(135deg, #15803d, #14532d)",
    textColor: "#f0fdf4"
  },
  {
    id: "gba",
    name: "Game Boy Advance",
    generation: "gen6",
    manufacturer: "Nintendo",
    year: 2001,
    media: "Cartucho portátil",
    description: "El equivalente portátil a tener una Super Nintendo vitaminada. Con maravillosos gráficos pixel-art en 2D y ports fantásticos.",
    gradient: "linear-gradient(135deg, #0284c7, #075985)",
    textColor: "#f0f9ff"
  }
];

// Export to make it accessible in both ES modules and globally if script tag is used
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONSOLE_GENERATIONS, CONSOLES_DATABASE };
}
