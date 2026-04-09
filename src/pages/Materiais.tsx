import { useState, useEffect } from 'react';
import { 
  FaImages, 
  FaVideo, 
  FaFilePdf, 
  FaDownload, 
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUsers,
  FaFilm,
  FaChevronLeft,
  FaChevronRight,
  FaPlayCircle,
  FaTimes,
  FaSearch,
  FaFilter,
  FaSun,
  FaMoon,
  FaArrowLeft
} from 'react-icons/fa';
import styles from '../styles/Materiais.module.css';

// Imagens para as fotos dos debates (usando Unsplash para exemplo)
const imagensFilmes = {
  "AINDA ESTOU AQUI": [
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "BACURAU": [
    "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "A HORA DA ESTRELA": [
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "BICHO DE SETE CABEÇAS": [
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "TERRA ESTRANGEIRA": [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "A JANGADA DE WELLES": [
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "ONDE OS FRACOS NÃO TÊM VEZ": [
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "CORRA!": [
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "MEDIDA PROVISÓRIA": [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "NÓS QUE AQUI ESTAMOS POR VÓS ESPERAMOS": [
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "O ÚLTIMO PULP": [
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  "O AGENTE SECRETO": [
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

// Dados dos materiais para cada debate/filme
const materiaisPorDebate = [
  {
    id: 1,
    filmeId: 1,
    tituloFilme: "AINDA ESTOU AQUI",
    diretor: "Walter Carvalho",
    ano: 2015,
    dataDebate: "05/10/2024",
    participantes: 42,
    descricao: "Debate sobre o documentário que explora a trajetória de Walter Carvalho no cinema nacional",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["AINDA ESTOU AQUI"][0],
        titulo: "ABERTURA DO DEBATE",
        descricao: "Introdução sobre a obra de Walter Carvalho",
        data: "05/10/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["AINDA ESTOU AQUI"][1],
        titulo: "MOMENTO DE REFLEXÃO",
        descricao: "Discussão sobre fotografia e cinema",
        data: "05/10/2024",
        tipo: "foto"
      },
      {
        id: 3,
        url: imagensFilmes["AINDA ESTOU AQUI"][2],
        titulo: "PARTICIPANTES ATENTOS",
        descricao: "Público engajado durante o debate",
        data: "05/10/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Gravação integral do debate sobre Walter Carvalho",
        duracao: "1:45:00",
        data: "05/10/2024",
        tipo: "video"
      },
      {
        id: 2,
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
        titulo: "MELHORES MOMENTOS",
        descricao: "Highlights da discussão sobre documentário",
        duracao: "12:30",
        data: "05/10/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/ainda-estou-aqui-apresentacao.pdf",
        titulo: "APRESENTAÇÃO COMPLETA",
        descricao: "Slides sobre a carreira de Walter Carvalho",
        tamanho: "3.8 MB",
        tipo: "pdf",
        paginas: 24
      },
      {
        id: 2,
        url: "/materiais/ainda-estou-aqui-referencias.pdf",
        titulo: "BIBLIOGRAFIA",
        descricao: "Referências sobre documentário brasileiro",
        tamanho: "2.1 MB",
        tipo: "pdf",
        paginas: 16
      }
    ]
  },
  {
    id: 2,
    filmeId: 2,
    tituloFilme: "BACURAU",
    diretor: "Kleber Mendonça Filho e Juliano Dornelles",
    ano: 2019,
    dataDebate: "12/10/2024",
    participantes: 56,
    descricao: "Discussão sobre o filme premiado que mistura ficção científica e crítica social",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["BACURAU"][0],
        titulo: "DEBATE SOBRE O FILME",
        descricao: "Análise coletiva de Bacurau",
        data: "12/10/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["BACURAU"][1],
        titulo: "INTERAÇÃO DO PÚBLICO",
        descricao: "Participantes compartilhando suas visões",
        data: "12/10/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE BACURAU",
        descricao: "Análise completa do filme (2h)",
        duracao: "2:00:00",
        data: "12/10/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/bacurau-analise.pdf",
        titulo: "ANÁLISE CRÍTICA",
        descricao: "Análise detalhada do filme Bacurau",
        tamanho: "4.2 MB",
        tipo: "pdf",
        paginas: 28
      },
      {
        id: 2,
        url: "/materiais/bacurau-contexto.pdf",
        titulo: "CONTEXTO POLÍTICO",
        descricao: "Análise do contexto brasileiro no filme",
        tamanho: "3.1 MB",
        tipo: "pdf",
        paginas: 20
      }
    ]
  },
  {
    id: 3,
    filmeId: 3,
    tituloFilme: "A HORA DA ESTRELA",
    diretor: "Suzana Amaral",
    ano: 1985,
    dataDebate: "19/10/2024",
    participantes: 48,
    descricao: "Debate sobre a adaptação cinematográfica da obra de Clarice Lispector",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["A HORA DA ESTRELA"][0],
        titulo: "EXPOSIÇÃO SOBRE CLARICE",
        descricao: "Momento sobre a literatura de Clarice Lispector",
        data: "19/10/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["A HORA DA ESTRELA"][1],
        titulo: "DEBATE LITERATURA/CINEMA",
        descricao: "Discussão sobre adaptação literária",
        data: "19/10/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Gravação integral sobre A Hora da Estrela",
        duracao: "1:50:00",
        data: "19/10/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/hora-estrela-clarice.pdf",
        titulo: "CLARICE LISPECTOR",
        descricao: "Estudo sobre a autora e sua obra",
        tamanho: "3.5 MB",
        tipo: "pdf",
        paginas: 22
      },
      {
        id: 2,
        url: "/materiais/hora-estrela-adaptacao.pdf",
        titulo: "ANÁLISE DA ADAPTAÇÃO",
        descricao: "Como o livro virou filme",
        tamanho: "2.8 MB",
        tipo: "pdf",
        paginas: 18
      }
    ]
  },
  {
    id: 4,
    filmeId: 4,
    tituloFilme: "BICHO DE SETE CABEÇAS",
    diretor: "Laís Bodanzky",
    ano: 2000,
    dataDebate: "26/10/2024",
    participantes: 39,
    descricao: "Discussão sobre saúde mental e a crítica ao sistema psiquiátrico",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["BICHO DE SETE CABEÇAS"][0],
        titulo: "DEBATE SOBRE SAÚDE MENTAL",
        descricao: "Reflexões sobre o tema do filme",
        data: "26/10/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["BICHO DE SETE CABEÇAS"][1],
        titulo: "MEDIADORES EM AÇÃO",
        descricao: "Coordenação do debate",
        data: "26/10/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Discussão sobre saúde mental no cinema",
        duracao: "1:40:00",
        data: "26/10/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/bicho-sete-cabecas-saude.pdf",
        titulo: "SAÚDE MENTAL NO BRASIL",
        descricao: "Contexto histórico e atual",
        tamanho: "4.0 MB",
        tipo: "pdf",
        paginas: 26
      }
    ]
  },
  {
    id: 5,
    filmeId: 5,
    tituloFilme: "TERRA ESTRANGEIRA",
    diretor: "Walter Salles e Daniela Thomas",
    ano: 1995,
    dataDebate: "02/11/2024",
    participantes: 41,
    descricao: "Debate sobre emigração e identidade nacional",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["TERRA ESTRANGEIRA"][0],
        titulo: "ANÁLISE DO FILME",
        descricao: "Discussão sobre a obra de Walter Salles",
        data: "02/11/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["TERRA ESTRANGEIRA"][1],
        titulo: "TEMA EMIGRAÇÃO",
        descricao: "Reflexão sobre identidade brasileira",
        data: "02/11/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Análise de Terra Estrangeira",
        duracao: "1:45:00",
        data: "02/11/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/terra-estrangeira-analise.pdf",
        titulo: "ESTUDO DO FILME",
        descricao: "Análise cinematográfica completa",
        tamanho: "3.2 MB",
        tipo: "pdf",
        paginas: 21
      }
    ]
  },
  {
    id: 6,
    filmeId: 6,
    tituloFilme: "A JANGADA DE WELLES",
    diretor: "Rogério Sganzerla",
    ano: 2004,
    dataDebate: "09/11/2024",
    participantes: 37,
    descricao: "Discussão sobre documentário e a história do cinema",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["A JANGADA DE WELLES"][0],
        titulo: "HISTÓRIA DO CINEMA",
        descricao: "Momento sobre Orson Welles no Brasil",
        data: "09/11/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["A JANGADA DE WELLES"][1],
        titulo: "DEBATE DOCUMENTÁRIO",
        descricao: "Discussão sobre cinema documental",
        data: "09/11/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Sobre a obra de Rogério Sganzerla",
        duracao: "1:35:00",
        data: "09/11/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/jangada-welles-doc.pdf",
        titulo: "ORSON WELLES NO BRASIL",
        descricao: "Pesquisa histórica",
        tamanho: "3.0 MB",
        tipo: "pdf",
        paginas: 19
      }
    ]
  },
  {
    id: 7,
    filmeId: 7,
    tituloFilme: "ONDE OS FRACOS NÃO TÊM VEZ",
    diretor: "Joel e Ethan Coen",
    ano: 2007,
    dataDebate: "16/11/2024",
    participantes: 52,
    descricao: "Análise do filme dos irmãos Coen e adaptação de Cormac McCarthy",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["ONDE OS FRACOS NÃO TÊM VEZ"][0],
        titulo: "DEBATE INTERNACIONAL",
        descricao: "Análise do cinema norte-americano",
        data: "16/11/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["ONDE OS FRACOS NÃO TÊM VEZ"][1],
        titulo: "ADAPTAÇÃO LITERÁRIA",
        descricao: "Discussão sobre o livro de McCarthy",
        data: "16/11/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Análise dos irmãos Coen",
        duracao: "2:10:00",
        data: "16/11/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/fracos-nao-tem-vez-coen.pdf",
        titulo: "ESTILO DOS IRMÃOS COEN",
        descricao: "Análise da filmografia",
        tamanho: "4.5 MB",
        tipo: "pdf",
        paginas: 30
      },
      {
        id: 2,
        url: "/materiais/fracos-nao-tem-vez-mccarthy.pdf",
        titulo: "CORMAC MCCARTHY",
        descricao: "Estudo do autor",
        tamanho: "3.3 MB",
        tipo: "pdf",
        paginas: 22
      }
    ]
  },
  {
    id: 8,
    filmeId: 8,
    tituloFilme: "CORRA!",
    diretor: "Jordan Peele",
    ano: 2017,
    dataDebate: "23/11/2024",
    participantes: 61,
    descricao: "Debate sobre racismo e horror social na obra de Jordan Peele",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["CORRA!"][0],
        titulo: "DEBATE ACALORADO",
        descricao: "Discussão sobre racismo estrutural",
        data: "23/11/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["CORRA!"][1],
        titulo: "ANÁLISE DO HORROR",
        descricao: "O terror como crítica social",
        data: "23/11/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Análise de Corra! (2h 15min)",
        duracao: "2:15:00",
        data: "23/11/2024",
        tipo: "video"
      },
      {
        id: 2,
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
        titulo: "ENTREVISTA ESPECIAL",
        descricao: "Convidado especial sobre o filme",
        duracao: "45:30",
        data: "23/11/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/corra-analise.pdf",
        titulo: "ANÁLISE COMPLETA",
        descricao: "Estudo detalhado do filme",
        tamanho: "5.2 MB",
        tipo: "pdf",
        paginas: 35
      },
      {
        id: 2,
        url: "/materiais/corra-jordan-peele.pdf",
        titulo: "JORDAN PEELE",
        descricao: "Carreira e estilo do diretor",
        tamanho: "3.8 MB",
        tipo: "pdf",
        paginas: 25
      },
      {
        id: 3,
        url: "/materiais/corra-racismo-cinema.pdf",
        titulo: "RACISMO NO CINEMA",
        descricao: "Contexto histórico e social",
        tamanho: "4.0 MB",
        tipo: "pdf",
        paginas: 27
      }
    ]
  },
  {
    id: 9,
    filmeId: 9,
    tituloFilme: "MEDIDA PROVISÓRIA",
    diretor: "Lázaro Ramos",
    ano: 2022,
    dataDebate: "30/11/2024",
    participantes: 49,
    descricao: "Discussão sobre distopia racial e política no cinema brasileiro",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["MEDIDA PROVISÓRIA"][0],
        titulo: "DEBATE POLÍTICO",
        descricao: "Discussão sobre o contexto brasileiro",
        data: "30/11/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["MEDIDA PROVISÓRIA"][1],
        titulo: "DISTOPIA RACIAL",
        descricao: "Análise do tema central do filme",
        data: "30/11/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Sobre Medida Provisória e Lázaro Ramos",
        duracao: "1:55:00",
        data: "30/11/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/medida-provisoria-analise.pdf",
        titulo: "ANÁLISE DO FILME",
        descricao: "Estudo da distopia brasileira",
        tamanho: "3.6 MB",
        tipo: "pdf",
        paginas: 23
      }
    ]
  },
  {
    id: 10,
    filmeId: 10,
    tituloFilme: "NÓS QUE AQUI ESTAMOS POR VÓS ESPERAMOS",
    diretor: "Marcelo Masagão",
    ano: 1999,
    dataDebate: "07/12/2024",
    participantes: 35,
    descricao: "Debate sobre documentário experimental e memória do século XX",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["NÓS QUE AQUI ESTAMOS POR VÓS ESPERAMOS"][0],
        titulo: "EXPERIMENTAL E HISTÓRIA",
        descricao: "Discussão sobre formato inovador",
        data: "07/12/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["NÓS QUE AQUI ESTAMOS POR VÓS ESPERAMOS"][1],
        titulo: "MEMÓRIA DO SÉCULO XX",
        descricao: "Reflexão sobre arquivo histórico",
        data: "07/12/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Sobre documentário experimental",
        duracao: "1:30:00",
        data: "07/12/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/nos-que-aqui-estamos-doc.pdf",
        titulo: "DOCUMENTÁRIO EXPERIMENTAL",
        descricao: "Estudo do gênero",
        tamanho: "2.9 MB",
        tipo: "pdf",
        paginas: 18
      }
    ]
  },
  {
    id: 11,
    filmeId: 11,
    tituloFilme: "O ÚLTIMO PULP",
    diretor: "Sergio Bianchi",
    ano: 2002,
    dataDebate: "14/12/2024",
    participantes: 38,
    descricao: "Discussão sobre sátira da indústria cultural brasileira",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["O ÚLTIMO PULP"][0],
        titulo: "SÁTIRA DO CINEMA",
        descricao: "Análise do humor no filme",
        data: "14/12/2024",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["O ÚLTIMO PULP"][1],
        titulo: "INDÚSTRIA CULTURAL",
        descricao: "Crítica ao sistema cultural",
        data: "14/12/2024",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "DEBATE COMPLETO",
        descricao: "Sobre Sergio Bianchi e sua obra",
        duracao: "1:40:00",
        data: "14/12/2024",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/ultimo-pulp-sergio-bianchi.pdf",
        titulo: "SERGIO BIANCHI",
        descricao: "Trajetória do diretor",
        tamanho: "3.1 MB",
        tipo: "pdf",
        paginas: 20
      }
    ]
  },
  {
    id: 12,
    filmeId: 12,
    tituloFilme: "O AGENTE SECRETO",
    diretor: "Kleber Mendonça Filho", 
    ano: 2025,
    dataDebate: "06/11/2025",
    participantes: 0,
    descricao: "Próximo debate sobre o novo filme de Kleber Mendonça Filho",
    fotos: [
      {
        id: 1,
        url: imagensFilmes["O AGENTE SECRETO"][0],
        titulo: "PRÉVIA DO DEBATE",
        descricao: "Preparativos para o próximo evento",
        data: "06/11/2025",
        tipo: "foto"
      },
      {
        id: 2,
        url: imagensFilmes["O AGENTE SECRETO"][1],
        titulo: "EXPECTATIVA",
        descricao: "Aguardando o lançamento do filme",
        data: "06/11/2025",
        tipo: "foto"
      },
      {
        id: 3,
        url: imagensFilmes["O AGENTE SECRETO"][2],
        titulo: "KLEBER MENDONÇA FILHO",
        descricao: "Estudo sobre o diretor",
        data: "06/11/2025",
        tipo: "foto"
      }
    ],
    videos: [
      {
        id: 1,
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        titulo: "TRAILER OFICIAL",
        descricao: "Trailer do novo filme",
        duracao: "2:30",
        data: "06/11/2025",
        tipo: "video"
      },
      {
        id: 2,
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
        titulo: "ENTREVISTA COM O DIRETOR",
        descricao: "Kleber fala sobre o novo projeto",
        duracao: "15:45",
        data: "06/11/2025",
        tipo: "video"
      }
    ],
    documentos: [
      {
        id: 1,
        url: "/materiais/agente-secreto-dossie.pdf",
        titulo: "DOSSIÊ DO FILME",
        descricao: "Informações sobre a produção",
        tamanho: "2.5 MB",
        tipo: "pdf",
        paginas: 15
      },
      {
        id: 2,
        url: "/materiais/agente-secreto-kleber.pdf",
        titulo: "KLEBER MENDONÇA FILHO",
        descricao: "Filmografia e estilo",
        tamanho: "4.2 MB",
        tipo: "pdf",
        paginas: 28
      },
      {
        id: 3,
        url: "/materiais/agente-secreto-ditadura.pdf",
        titulo: "DITADURA NO CINEMA",
        descricao: "Representação no cinema brasileiro",
        tamanho: "3.8 MB",
        tipo: "pdf",
        paginas: 24
      }
    ]
  }
];

export default function Materiais() {
  // Estado para controlar o fluxo
  const [telaAtiva, setTelaAtiva] = useState<'selecao' | 'materiais'>('selecao');
  const [debateSelecionado, setDebateSelecionado] = useState(materiaisPorDebate[0]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<'todos' | 'fotos' | 'videos' | 'documentos'>('todos');
  const [visualizadorAtivo, setVisualizadorAtivo] = useState(false);
  const [midiaSelecionada, setMidiaSelecionada] = useState<any>(null);
  const [busca, setBusca] = useState('');
  const [filtroAno, setFiltroAno] = useState<string>('todos');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [themeChanging, setThemeChanging] = useState(false);

  const toggleTheme = () => {
    setThemeChanging(true);
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    setTimeout(() => setThemeChanging(false), 300);
  };

  // Obter anos únicos para filtro
  const anosUnicos = ['todos', ...Array.from(new Set(materiaisPorDebate.map(d => d.dataDebate.split('/')[2])))];

  // Filtrar debates
  const debatesFiltrados = materiaisPorDebate.filter(debate => {
    const buscaMatch = busca === '' || 
      debate.tituloFilme.toLowerCase().includes(busca.toLowerCase()) ||
      debate.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      debate.diretor.toLowerCase().includes(busca.toLowerCase());
    
    const anoMatch = filtroAno === 'todos' || debate.dataDebate.split('/')[2] === filtroAno;
    
    return buscaMatch && anoMatch;
  });

  // Função para selecionar um debate
  const selecionarDebate = (debate: any) => {
    setDebateSelecionado(debate);
    setTelaAtiva('materiais');
    setCategoriaAtiva('todos');
  };

  // Função para voltar para a seleção de debates
  const voltarParaSelecao = () => {
    setTelaAtiva('selecao');
  };

  // Abrir visualizador de mídia
  const abrirVisualizador = (midia: any) => {
    setMidiaSelecionada(midia);
    setVisualizadorAtivo(true);
    document.body.style.overflow = 'hidden';
  };

  // Fechar visualizador
  const fecharVisualizador = () => {
    setVisualizadorAtivo(false);
    setMidiaSelecionada(null);
    document.body.style.overflow = 'auto';
  };

  // Navegar entre mídias
  const navegarMidia = (direcao: 'anterior' | 'proximo') => {
    const todosMateriais = [
      ...debateSelecionado.fotos,
      ...debateSelecionado.videos,
      ...debateSelecionado.documentos
    ];
    
    const indexAtual = todosMateriais.findIndex(m => m.id === midiaSelecionada.id && m.tipo === midiaSelecionada.tipo);
    
    if (direcao === 'anterior') {
      const anterior = indexAtual > 0 ? todosMateriais[indexAtual - 1] : todosMateriais[todosMateriais.length - 1];
      setMidiaSelecionada(anterior);
    } else {
      const proximo = indexAtual < todosMateriais.length - 1 ? todosMateriais[indexAtual + 1] : todosMateriais[0];
      setMidiaSelecionada(proximo);
    }
  };

  // Download de documento
  const baixarDocumento = (url: string, titulo: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = titulo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Contar materiais por tipo
  const contarMateriais = (tipo: 'fotos' | 'videos' | 'documentos') => {
    return debateSelecionado[tipo].length;
  };

  // Obter status do debate baseado na data
  const getStatusDebate = (dataDebate: string) => {
    const hoje = new Date();
    const [dia, mes, ano] = dataDebate.split('/').map(Number);
    const dataDebateObj = new Date(ano, mes - 1, dia);
    
    if (dataDebateObj > hoje) return 'PRÓXIMO';
    if (dataDebateObj.toDateString() === hoje.toDateString()) return 'HOJE';
    return 'REALIZADO';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={`${styles.materiaisContainer} ${styles[theme]} ${themeChanging ? styles.themeChanging : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.title}>
              <h1 className={styles.titulo}>MATERIAIS DOS DEBATES</h1>
              <p className={styles.subtitulo}>
                Fotos, vídeos e documentos dos debates dos filmes do CineMar
              </p>
            </div>
            
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Tela de Seleção de Debates */}
        {telaAtiva === 'selecao' && (
          <>
            {/* Filtros e Busca */}
            <div className={styles.filtrosContainer}>
              <div className={styles.buscaContainer}>
                <FaSearch className={styles.buscaIcon} />
                <input
                  type="text"
                  placeholder="BUSCAR FILME, DIRETOR..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className={styles.buscaInput}
                />
              </div>
              
              <div className={styles.filtros}>
                <div className={styles.filtroGrupo}>
                  <FaFilter className={styles.filtroIcon} />
                  <select 
                    value={filtroAno}
                    onChange={(e) => setFiltroAno(e.target.value)}
                    className={styles.filtroSelect}
                  >
                    {anosUnicos.map(ano => (
                      <option key={ano} value={ano}>
                        {ano === 'todos' ? 'TODOS OS ANOS' : `ANO ${ano}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de Debates */}
            <div className={styles.debatesGrid}>
              <h2 className={styles.selecaoTitulo}>SELECIONE UM DEBATE PARA VER OS MATERIAIS</h2>
              
              <div className={styles.debatesListSelecao}>
                {debatesFiltrados.map(debate => {
                  const status = getStatusDebate(debate.dataDebate);
                  
                  return (
                    <div
                      key={debate.id}
                      className={styles.debateCardSelecao}
                      onClick={() => selecionarDebate(debate)}
                    >
                      <div className={styles.debateCardHeader}>
                        <div className={styles.debateCardHeaderTop}>
                          <h3 className={styles.debateCardTitulo}>{debate.tituloFilme}</h3>
                          <span className={`${styles.debateCardStatus} ${styles[status.toLowerCase()]}`}>
                            {status}
                          </span>
                        </div>
                        <span className={styles.debateCardData}>
                          <FaCalendarAlt /> {debate.dataDebate}
                        </span>
                      </div>
                      
                      <div className={styles.debateCardInfo}>
                        <p className={styles.debateCardDiretor}>
                          <FaFilm /> {debate.diretor}
                        </p>
                        <p className={styles.debateCardDescricao}>{debate.descricao}</p>
                      </div>
                      
                      <div className={styles.debateCardStats}>
                        <div className={styles.statItem}>
                          <FaUsers className={styles.statIcon} />
                          <span>
                            {debate.participantes > 0 
                              ? `${debate.participantes} participantes`
                              : 'Próximo debate'
                            }
                          </span>
                        </div>
                        
                        <div className={styles.statItem}>
                          <FaImages className={styles.statIcon} />
                          <span>{debate.fotos.length} fotos</span>
                        </div>
                        
                        <div className={styles.statItem}>
                          <FaVideo className={styles.statIcon} />
                          <span>{debate.videos.length} vídeos</span>
                        </div>
                        
                        <div className={styles.statItem}>
                          <FaFilePdf className={styles.statIcon} />
                          <span>{debate.documentos.length} documentos</span>
                        </div>
                      </div>
                      
                      <div className={styles.debateCardFooter}>
                        <button 
                          className={styles.verMateriaisButton}
                          onClick={() => selecionarDebate(debate)}
                        >
                          {status === 'PRÓXIMO' ? 'VER PRÉVIA' : 'VER MATERIAIS'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Tela de Materiais do Debate Selecionado */}
        {telaAtiva === 'materiais' && (
          <>
            {/* Cabeçalho do Debate com botão de voltar */}
            <div className={styles.materiaisHeader}>
              <button 
                className={styles.voltarButton}
                onClick={voltarParaSelecao}
              >
                <FaArrowLeft /> VOLTAR PARA LISTA DE DEBATES
              </button>
              
              <div className={styles.debateInfoSelecionado}>
                <div className={styles.debateHeaderSelecionado}>
                  <h2 className={styles.debateTituloSelecionado}>
                    {debateSelecionado.tituloFilme}
                  </h2>
                  <span className={`${styles.debateStatusSelecionado} ${styles[getStatusDebate(debateSelecionado.dataDebate).toLowerCase()]}`}>
                    {getStatusDebate(debateSelecionado.dataDebate)}
                  </span>
                </div>
                
                <div className={styles.debateInfoDetalhes}>
                  <div className={styles.debateInfoLinha}>
                    <span className={styles.debateInfoItemSelecionado}>
                      <FaFilm /> {debateSelecionado.diretor} • {debateSelecionado.ano}
                    </span>
                    <span className={styles.debateInfoItemSelecionado}>
                      <FaCalendarAlt /> DEBATE: {debateSelecionado.dataDebate}
                    </span>
                    <span className={styles.debateInfoItemSelecionado}>
                      <FaUsers /> 
                      {debateSelecionado.participantes > 0 
                        ? `${debateSelecionado.participantes} PARTICIPANTES`
                        : 'PRÓXIMO DEBATE'
                      }
                    </span>
                  </div>
                  <p className={styles.debateDescricaoSelecionado}>
                    {debateSelecionado.descricao}
                  </p>
                </div>
              </div>
              
              <div className={styles.categoriasNavegacao}>
                <button
                  className={`${styles.categoriaButton} ${categoriaAtiva === 'todos' ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva('todos')}
                >
                  TODOS OS MATERIAIS
                </button>
                <button
                  className={`${styles.categoriaButton} ${categoriaAtiva === 'fotos' ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva('fotos')}
                >
                  FOTOS ({contarMateriais('fotos')})
                </button>
                <button
                  className={`${styles.categoriaButton} ${categoriaAtiva === 'videos' ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva('videos')}
                >
                  VÍDEOS ({contarMateriais('videos')})
                </button>
                <button
                  className={`${styles.categoriaButton} ${categoriaAtiva === 'documentos' ? styles.ativa : ''}`}
                  onClick={() => setCategoriaAtiva('documentos')}
                >
                  DOCUMENTOS ({contarMateriais('documentos')})
                </button>
              </div>
            </div>

            {/* Galeria de Fotos */}
            {(categoriaAtiva === 'todos' || categoriaAtiva === 'fotos') && debateSelecionado.fotos.length > 0 && (
              <section className={styles.materiaisSection}>
                <h3 className={styles.sectionTitulo}>
                  GALERIA DE FOTOS
                </h3>
                
                <div className={styles.galeriaGrid}>
                  {debateSelecionado.fotos.map(foto => (
                    <div 
                      key={foto.id}
                      className={styles.galeriaItem}
                      onClick={() => abrirVisualizador(foto)}
                    >
                      <div className={styles.galeriaImagemContainer}>
                        <img 
                          src={foto.url} 
                          alt={foto.titulo}
                          className={styles.galeriaImagem}
                        />
                        <div className={styles.galeriaOverlay}>
                          <FaExternalLinkAlt className={styles.overlayIcon} />
                        </div>
                      </div>
                      
                      <div className={styles.galeriaInfo}>
                        <h4 className={styles.galeriaTitulo}>{foto.titulo}</h4>
                        <p className={styles.galeriaDescricao}>{foto.descricao}</p>
                        <span className={styles.galeriaData}>{foto.data}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vídeos */}
            {(categoriaAtiva === 'todos' || categoriaAtiva === 'videos') && debateSelecionado.videos.length > 0 && (
              <section className={styles.materiaisSection}>
                <h3 className={styles.sectionTitulo}>
                  VÍDEOS DO DEBATE
                </h3>
                
                <div className={styles.videosGrid}>
                  {debateSelecionado.videos.map(video => (
                    <div key={video.id} className={styles.videoCard}>
                      <div className={styles.videoPlayerContainer}>
                        <iframe
                          src={video.url}
                          title={video.titulo}
                          className={styles.videoIframe}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      
                      <div className={styles.videoInfo}>
                        <h4 className={styles.videoTitulo}>{video.titulo}</h4>
                        <p className={styles.videoDescricao}>{video.descricao}</p>
                        
                        <div className={styles.videoMeta}>
                          <span>{video.duracao}</span>
                          <span>{video.data}</span>
                        </div>
                        
                        <button 
                          className={styles.assistirButton}
                          onClick={() => abrirVisualizador(video)}
                        >
                          <FaPlayCircle /> ASSISTIR EM TELA CHEIA
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Documentos */}
            {(categoriaAtiva === 'todos' || categoriaAtiva === 'documentos') && debateSelecionado.documentos.length > 0 && (
              <section className={styles.materiaisSection}>
                <h3 className={styles.sectionTitulo}>
                  DOCUMENTOS PARA DOWNLOAD
                </h3>
                
                <div className={styles.documentosGrid}>
                  {debateSelecionado.documentos.map(documento => (
                    <div key={documento.id} className={styles.documentoCard}>
                      <div className={styles.documentoIcon}>
                        <FaFilePdf />
                      </div>
                      
                      <div className={styles.documentoInfo}>
                        <h4 className={styles.documentoTitulo}>{documento.titulo}</h4>
                        <p className={styles.documentoDescricao}>{documento.descricao}</p>
                        
                        <div className={styles.documentoMeta}>
                          <span>{documento.tamanho}</span>
                          <span>{documento.paginas} PÁGINAS</span>
                        </div>
                      </div>
                      
                      <button 
                        className={styles.downloadButton}
                        onClick={() => baixarDocumento(documento.url, documento.titulo)}
                      >
                        <FaDownload /> DOWNLOAD
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Mensagem se não houver materiais */}
            {((categoriaAtiva === 'fotos' && debateSelecionado.fotos.length === 0) ||
              (categoriaAtiva === 'videos' && debateSelecionado.videos.length === 0) ||
              (categoriaAtiva === 'documentos' && debateSelecionado.documentos.length === 0)) && (
              <div className={styles.semMateriais}>
                <p>NÃO HÁ MATERIAIS DISPONÍVEIS NESTA CATEGORIA</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Visualizador de Mídia em Tela Cheia */}
      {visualizadorAtivo && midiaSelecionada && (
        <div className={styles.visualizadorOverlay}>
          <div className={styles.visualizadorContent}>
            <button 
              className={styles.fecharVisualizador} 
              onClick={fecharVisualizador}
              aria-label="Fechar visualizador"
            >
              <FaTimes />
            </button>
            
            <div className={styles.visualizadorNavegacao}>
              <button 
                className={styles.navegacaoButton}
                onClick={() => navegarMidia('anterior')}
                aria-label="Mídia anterior"
              >
                <FaChevronLeft />
              </button>
              
              <div className={styles.visualizadorPrincipal}>
                {midiaSelecionada.tipo === 'foto' && (
                  <img 
                    src={midiaSelecionada.url} 
                    alt={midiaSelecionada.titulo}
                    className={styles.visualizadorImagem}
                  />
                )}
                
                {midiaSelecionada.tipo === 'video' && (
                  <div className={styles.visualizadorVideoContainer}>
                    <iframe
                      src={midiaSelecionada.url}
                      title={midiaSelecionada.titulo}
                      className={styles.visualizadorVideo}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                {midiaSelecionada.tipo === 'pdf' && (
                  <div className={styles.visualizadorDocumento}>
                    <FaFilePdf className={styles.documentoVisualizadorIcon} />
                    <h3>{midiaSelecionada.titulo}</h3>
                    <p>{midiaSelecionada.descricao}</p>
                    <button 
                      className={styles.downloadVisualizadorButton}
                      onClick={() => baixarDocumento(midiaSelecionada.url, midiaSelecionada.titulo)}
                    >
                      <FaDownload /> DOWNLOAD ({midiaSelecionada.tamanho})
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                className={styles.navegacaoButton}
                onClick={() => navegarMidia('proximo')}
                aria-label="Próxima mídia"
              >
                <FaChevronRight />
              </button>
            </div>
            
            <div className={styles.visualizadorInfo}>
              <h3 className={styles.visualizadorTitulo}>{midiaSelecionada.titulo}</h3>
              <p className={styles.visualizadorDescricao}>{midiaSelecionada.descricao}</p>
              <div className={styles.visualizadorMeta}>
                <span>{midiaSelecionada.data}</span>
                {midiaSelecionada.duracao && (
                  <span>{midiaSelecionada.duracao}</span>
                )}
                {midiaSelecionada.tamanho && (
                  <span>{midiaSelecionada.tamanho}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}