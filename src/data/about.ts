// Timeline: institutional page archived on 2026-09-24,
// auditoria-habitare/evidencias/sobre-a-habitare.html. The visible timeline
// confirms 2000; its contradictory old meta description is not reused.
export const timeline = [
  {year: '1999', text: 'Conclusão do mestrado de Tereza Marques de Oliveira e início da dedicação ao projeto que daria origem à Habitare.'},
  {year: '2000', text: 'Fundação da ONG Habitare, com foco em pesquisas e atendimentos em psicanálise e psicossomática.'},
  {year: '2003', text: 'Início do desenvolvimento da tese de doutorado a partir da experiência clínica com consultas terapêuticas oferecidas a gestantes.'},
  {year: '2004', text: 'Implantação do Projeto Parentalidade — Ser Mãe em Paraisópolis, em parceria com o Hospital Albert Einstein, por meio do Programa Einstein na Comunidade Paraisópolis.'},
];
export const pillars = [
  {name:'Cuidado', title:'Atendimento que acolhe', image:'cuidado', text:'Oferecemos escuta e cuidado psicológico especializado, criando espaços onde mães possam falar sobre a experiência real da maternidade sem julgamento.'},
  {name:'Conhecimento', title:'Ciência que chega a quem precisa', image:'conhecimento', text:'Produzimos e compartilhamos conhecimento para tornar a psicanálise e a saúde mental perinatal mais acessíveis, aproximando teoria, prática clínica e realidade social.'},
  {name:'Formação', title:'Profissionais que multiplicam o cuidado', image:'formacao', text:'Formamos e supervisionamos psicólogos e psicanalistas para uma atuação clínica responsável, sensível às particularidades da parentalidade e dos diferentes contextos sociais.'},
];
export const values = [
  ['Acolhimento', 'Escutar sem julgar. Cada história é recebida com respeito à singularidade de quem a vive.'],
  ['Ética', 'Cuidar preservando dignidade, autonomia, privacidade e os limites de cada relação.'],
  ['Responsabilidade social', 'Trabalhar para que o acesso à saúde mental não seja privilégio de poucos.'],
  ['Acessibilidade', 'Traduzir conhecimento sem perder rigor e aproximar o cuidado de quem precisa dele.'],
  ['Fortalecimento de vínculos', 'Reconhecer nas relações uma dimensão fundamental do desenvolvimento humano.'],
  ['Cuidado', 'Cuidar de quem é atendida, de quem atende e da qualidade do trabalho que construímos.'],
  ['Formação', 'Preparar profissionais para que o conhecimento e o cuidado possam chegar ainda mais longe.'],
  ['Estudo', 'Manter teoria, pesquisa e prática em diálogo permanente.'],
];
// Names confirmed in the supplied briefing and institutional archive.
// Dates, descriptions and active/closed statuses intentionally await validation.
export const projects = ['Caminhos do Cuidar','Mãe Social','Ser Mãe','Capão Cidadão','Amor de Mãe','Oficina Boneca Flor','Acolhida Amparo Maternal','Clínica Social','Casa Ângela'];
// TODO: approve current roster and match names/roles to screenshot filenames.
// Only verified people should be added here. An empty list emits no empty UI.
export const professionals: {name: string; role: string; image: string}[] = [];
