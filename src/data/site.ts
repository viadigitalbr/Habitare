export const site = {
  name: 'Rede Habitare',
  email: 'ohabitare@gmail.com',
  instagram: 'https://www.instagram.com/rede.habitare/',
  cnpj: '05.407.750/0001-04',
  address: 'Largo Padre Péricles, 145 — CJ 81, Barra Funda, São Paulo — SP',
  legalName: 'Centro de Atendimento, Estudo e Pesquisa em Psicanálise e Psicossomática — Habitare',
};

// Patricia manages these forms. Keep the audited destinations until she provides replacements.
export const forms = {
  gratuito: 'https://docs.google.com/forms/d/e/1FAIpQLSeplR2VKaCKz6jEYrGGlZsUkQUUcaa3xj6sXYuDKzwA7paIkA/viewform',
  clinica: 'https://forms.gle/Zw17QmrChNraHybL7',
  membro: 'https://forms.gle/EgzsqDg22MhYUcEH9',
  maeSocial: 'https://docs.google.com/forms/d/e/1FAIpQLSfH3aGN4lhrx2ZQQM0dQUku8XKSYuyGQw72o274upsE8tfUzA/viewform',
  apadrinhamento: 'https://forms.gle/G2XstMpdePR5vLYx5',
};

export const paths = {
  atendimento: '/quero-ser-atendida-saude-mental-materna',
  apoio: '/faca-parte',
  // Courses remain linked to the institutional reference during local preview.
  sobre: '/sobre-a-habitare',
  cursos: 'https://redehabitare.org.br/cursos',
};

export const support = [
  {
    slug: 'quero-ser-membro-saude-mental',
    title: 'Seja membro da Habitare',
    heading: 'Faça parte do nosso time',
    summary: 'Junte-se a nós e faça parte de uma rede que transforma vidas de mães e bebês.',
    image: '/images/facaparte-sejamembro.png', alt: 'Ilustração de uma mulher participando de uma conversa pelo computador.',
    theme: 'rose', label: 'Inscreva-se', href: forms.membro,
    paragraphs: [
      'Nosso trabalho é possível graças a uma rede de profissionais comprometidos com questões da parentalidade, oferecendo acolhimento, escuta e suporte.',
      'Ao se voluntariar, você fará parte de uma equipe que atua com base na psicanálise, recebe supervisão qualificada e participa de uma rede de aprendizado e troca constante, sempre com o objetivo de fortalecer vínculos familiares.',
      'Se você deseja exercer a sua cidadania e responsabilidade social trabalhando junto à uma população em vulnerabilidade social, junte-se a nós!',
    ],
    points: [],
  },
  {
    slug: 'doe-doacoes', title: 'Faça uma Doação', heading: 'Doe amor em forma de cuidado',
    summary: 'Invista em nossos projetos',
    image: '/images/facaparte-facadoacao.png', alt: 'Ilustração de mãos acolhendo um coração.',
    theme: 'green', label: 'FAÇA SUA DOAÇÃO', href: '#como-doar',
    paragraphs: ['Sua contribuição ajuda a prevenir a depressão pós-parto, o abandono e a violência familiar.'],
    points: [],
  },
  {
    slug: 'mae-social', title: 'Seja uma Mãe Social', heading: 'Seja rede de apoio para quem mais precisa.',
    summary: 'Ofereça cuidado e acolhimento a mães e bebês que não têm rede de apoio e cuidados.',
    image: '/images/facaparte-maesocial.png', alt: 'Ilustração de uma mãe com seu bebê e uma mulher oferecendo apoio em casa.',
    theme: 'lilac', label: 'SEJA UMA MÃE SOCIAL', href: forms.maeSocial,
    paragraphs: [
      'O programa Mãe Social da Habitare é uma oportunidade de você oferecer cuidado e acolhimento a mães e bebês em situação de vulnerabilidade, por meio de visitas domiciliares remuneradas.',
      'Durante o puerpério, muitas mulheres não contam com uma rede familiar ou social de apoio. A presença de um suporte faz toda a diferença, oferecendo suporte prático e emocional nesse período delicado.',
      'Ao se tornar uma Mãe Social, você não está apenas oferecendo tempo e cuidado — está ajudando mães a se sentirem amparadas, fortalecendo vínculos e contribuindo para um começo de vida mais saudável e protegido.',
      'Preencha o formulário abaixo para se candidatar:',
    ],
    points: [],
  },
  {
    slug: 'madrinha-social-e-apadrinhamento-social', title: 'Apadrinhe uma Mãe', heading: 'Apadrinhamento social',
    summary: 'Apadrinhe uma mãe por 4 meses: sua doação garante atendimento terapêutico gratuito, acolhimento e prevenção de riscos.',
    image: '/images/facaparte-apadrinhe.png', alt: 'Ilustração de uma mulher acolhendo um bebê.',
    theme: 'rose', label: 'PREENCHA AQUI O FORMULÁRIO DE INTERESSE', href: forms.apadrinhamento,
    paragraphs: [
      'Ao apadrinhar uma mãe, você não está apenas fazendo uma doação: está oferecendo um recomeço, construindo memórias seguras e saudáveis e ajudando a escrever uma nova história para essa família.',
      'O programa de apadrinhamento da Habitare oferece a oportunidade de você apoiar uma mãe e seu bebê durante 4 meses de atendimento terapêutico gratuito que engloba:',
    ],
    points: [
      'Atendimento psicológico especializado, fortalecendo o vínculo mãe-bebê',
      'Acolhimento para a mãe em um momento de intensas mudanças',
      'Prevenção de problemas como depressão pós-parto, abandono, violência familiar e mortalidade infantil',
    ],
  },
] as const;
