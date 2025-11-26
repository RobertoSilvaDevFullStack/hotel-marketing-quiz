import { Question, Shape } from './types';
import { Triangle, Diamond, Circle, Square } from 'lucide-react';

export const COLORS = {
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  yellow: 'bg-yellow-600',
  green: 'bg-green-600',
};

export const SHAPES: Record<string, Shape> = {
  red: 'triangle',
  blue: 'diamond',
  yellow: 'circle',
  green: 'square',
};

// Data transcribed from user images
export const QUIZ_DATA: Question[] = [
  {
    id: 1,
    question: "Possui anúncios no Google ADS?",
    options: [
      { id: 'opt1', text: "Não utilizo Google Ads para meu hotel ou pousada", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Utilizo, inclusive investimento em pesquisas com o nome do próprio hotel", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Utilizo, mas não com o nome do próprio hotel", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Aumenta a visibilidade do hotel", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 2,
    question: "Possui website com motor de reservas?",
    options: [
      { id: 'opt1', text: "Possuo website, mas sem motor de reservas", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Possuo website com links para motor de reservas", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Não utilizo motor de reservas", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Não possuo website", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 3,
    question: "Se tem motor de reservas, tem link do Google Hotel?",
    options: [
      { id: 'opt1', text: "Eu não sei o que é Google Hotel", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Possuo link do Google Hotel", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Possuo link do Google Hotel, inclusive sendo divulgado no Google Ads", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Apenas por boca a boca", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 4,
    question: "Você mantém seu hotel disponível na Booking.com durante alta temporada, ou foca em reservas diretas?",
    options: [
      { id: 'opt1', text: "Diminuo minha disponibilidade na Booking.com, mas não fecho", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Eu não altero a disponibilidade na Booking.com", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Reservo apenas de forma direta", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Eu fecho minha disponibilidade na Booking.com", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 5,
    question: "Você utiliza Chatbot?",
    options: [
      { id: 'opt1', text: "Eu utilizo chatbot para atendimento rápido", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Prefiro atendimento 100% humano", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Eu não utilizo chatbot", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Eu utilizo chatbot apenas fora do horário comercial", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 6,
    question: "Você tem um campo de promoções em seu website, durante alta temporada?",
    options: [
      { id: 'opt1', text: "Sim, mantenho promoções no website para que fique comercial e atrativo", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Não, eu prefiro não abordar promoções ou qualquer oferta no website", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Sim, eu tenho uma área de pacotes, mas sem dar desconto", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Não faço promoções", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 7,
    question: "Qual a frequência de postagens?",
    options: [
      { id: 'opt1', text: "Sem frequência definida", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Mensalmente", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Uma vez por semana", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Diariamente", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 8,
    question: "Como você divulga serviços extras?",
    options: [
      { id: 'opt1', text: "Apenas por e-mail", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Apenas em folhetos", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Não divulgo serviços extras", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Através das redes sociais", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 9,
    question: "Qual a sua estratégia de reservas?",
    options: [
      { id: 'opt1', text: "Apenas reservas por telefone", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Uso apenas plataformas de terceiros", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Não tenho estratégia definida", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Foco em reservas diretas", shape: 'square', color: 'green', icon: Square },
    ]
  },
  {
    id: 10,
    question: "Qual a sua opinião sobre Chatbots?",
    options: [
      { id: 'opt1', text: "Acho desnecessário", shape: 'triangle', color: 'red', icon: Triangle },
      { id: 'opt2', text: "Prefiro atendimento humano", shape: 'diamond', color: 'blue', icon: Diamond },
      { id: 'opt3', text: "Acho útil para atendimento", shape: 'circle', color: 'yellow', icon: Circle },
      { id: 'opt4', text: "Não tenho opinião formada", shape: 'square', color: 'green', icon: Square },
    ]
  }
];

export const TIMERS = {
  READING: 5,
  ANSWERING: 20,
  BUFFER: 10,
  RESULTS: 20,
};