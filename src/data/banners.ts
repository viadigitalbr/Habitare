// Campaigns and course banners can be added here without changing the component.
// No dates or course availability are assumed during the first implementation phase.
export const banners = [
  {
    id: 'institucional', active: true, eyebrow: 'Rede Habitare',
    title: 'Cuidando de quem cuida na parentalidade.',
    text: 'Acolhimento, escuta e cuidado para mães, bebês e famílias.',
    cta: 'Faça parte dessa rede', href: '/faca-parte',
    secondaryCta: 'Preciso de atendimento', secondaryHref: '/quero-ser-atendida-saude-mental-materna',
    desktop: '/images/banner-institucional1-desktop-0ebc3909fe.png', mobile: '/images/banner-institucional1-mobile.png', position: 'center center', theme: 'neutral',
  },
  {
    id: 'apadrinhamento', active: true, eyebrow: 'Apadrinhamento social',
    title: 'Um começo de vida com mais acolhimento.',
    text: 'Apadrinhe uma mãe por quatro meses de atendimento terapêutico gratuito.',
    cta: 'Quero apadrinhar', href: '/madrinha-social-e-apadrinhamento-social',
    secondaryCta: '', secondaryHref: '',
    desktop: '/images/banner-apadrinhamento.webp', mobile: '/images/apadrinhamento.webp', position: '80% center', theme: 'lilac',
  },
  {
    id: 'doacao', active: true, eyebrow: 'Apoie nossos projetos',
    title: 'Doe amor em forma de cuidado.',
    text: 'Sua contribuição ajuda a sustentar o cuidado psicológico de mães e bebês.',
    cta: 'Fazer uma doação', href: '/doe-doacoes',
    secondaryCta: '', secondaryHref: '',
    desktop: '/images/banner-doacao.webp', mobile: '/images/doacao.webp', position: '82% center', theme: 'green',
  },
];
