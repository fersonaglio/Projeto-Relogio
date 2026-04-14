// Array com dias da semana em PT-BR
const diasSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

// Array com meses em PT-BR
const meses = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
]

// Variável para rastrear a última hora que tocou som
let ultimaHoraSom = -1

// Variável para rastrear o horário anterior
let horarioAnterior = ""

// Função para criar tom de notificação (sine wave)
function tocarSom() {
  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )()
    const oscilador = audioContext.createOscillator()
    const ganho = audioContext.createGain()

    oscilador.connect(ganho)
    ganho.connect(audioContext.destination)

    // 3 beeps rápidos
    const agora = audioContext.currentTime

    oscilador.frequency.value = 800
    ganho.gain.setValueAtTime(0.3, agora)
    ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.1)
    oscilador.start(agora)
    oscilador.stop(agora + 0.1)

    // Segundo beep
    oscilador.frequency.value = 1000
    ganho.gain.setValueAtTime(0.3, agora + 0.15)
    ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.25)
    oscilador.start(agora + 0.15)
    oscilador.stop(agora + 0.25)

    // Terceiro beep
    oscilador.frequency.value = 1200
    ganho.gain.setValueAtTime(0.3, agora + 0.3)
    ganho.gain.exponentialRampToValueAtTime(0.01, agora + 0.4)
    oscilador.start(agora + 0.3)
    oscilador.stop(agora + 0.4)
  } catch (e) {
    console.log("Web Audio API não disponível")
  }
}

// Função para determinar o tema baseado na hora
function determinarTema(agora) {
  const hora = agora.getHours()
  let tema = "noite"

  if (hora >= 5 && hora < 7) {
    tema = "amanhecer"
  } else if (hora >= 7 && hora < 12) {
    tema = "manha"
  } else if (hora >= 12 && hora < 18) {
    tema = "tarde"
  } else if (hora >= 18 && hora < 21) {
    tema = "noite"
  } else {
    tema = "madrugada"
  }

  return tema
}

// Função para aplicar o tema
function aplicarTema(tema) {
  // Remove todas as classes de tema antigas
  document.body.classList.remove(
    "madrugada",
    "amanhecer",
    "manha",
    "tarde",
    "noite",
  )
  // Adiciona a nova classe de tema
  document.body.classList.add(tema)
}

// Função para formatar a data
function formatarData(data) {
  const dia = data.getDate()
  const mes = meses[data.getMonth()]
  return `${dia} de ${mes}`
}

// Função para corrigir o horário (adicionar zero à esquerda)
function corrigirHorario(numero) {
  return numero.toString().padStart(2, '0')
}

// Função principal para atualizar o tempo
function atualizarTempo() {
  const diaSemanaElement = document.querySelector("#diaSemana")
  const dataElement = document.querySelector("#data")

  const agora = new Date()

  // Atualizar hora - formato sem separadores para comparação
  const horarioNovo =
    corrigirHorario(agora.getHours()) +
    corrigirHorario(agora.getMinutes()) +
    corrigirHorario(agora.getSeconds())

  // IDs dos elementos de dígitos
  const digitosIds = ["h1", "h2", "m1", "m2", "s1", "s2"]

  // Se o horário mudou, atualizar apenas os dígitos que mudaram
  if (!horarioAnterior || horarioNovo !== horarioAnterior) {
    for (let i = 0; i < digitosIds.length; i++) {
      const elemento = document.querySelector("#" + digitosIds[i])

      // Verificar se o elemento existe
      if (!elemento) continue

      // Na primeira carga ou se o dígito mudou
      if (!horarioAnterior || horarioNovo[i] !== horarioAnterior[i]) {
        // Remover animação anterior
        elemento.classList.remove("mudar")
        // Atualizar o texto
        elemento.textContent = horarioNovo[i]
        // Forçar reflow para reiniciar animação
        void elemento.offsetWidth
        // Adicionar classe de animação
        elemento.classList.add("mudar")
      }
    }
    // Atualizar o horário anterior
    horarioAnterior = horarioNovo
  }

  // Atualizar data
  const diaSemanaAtual = diasSemana[agora.getDay()]
  const dataAtual = formatarData(agora)

  diaSemanaElement.textContent = diaSemanaAtual
  dataElement.textContent = dataAtual

  // Atualizar tema baseado na hora
  const tema = determinarTema(agora)
  aplicarTema(tema)

  // Tocar som a cada hora cheia (00:00:00)
  const horaAtual = agora.getHours()
  if (
    agora.getMinutes() === 0 &&
    agora.getSeconds() === 0 &&
    horaAtual !== ultimaHoraSom
  ) {
    ultimaHoraSom = horaAtual
    tocarSom()
  }

  // Reset do controle de som quando não está na hora cheia
  if (agora.getMinutes() !== 0 || agora.getSeconds() !== 0) {
    ultimaHoraSom = -1
  }
}

// Inicializar na primeira carga
atualizarTempo()

// Atualizar a cada 1000ms (1 segundo)
setInterval(atualizarTempo, 1000)
