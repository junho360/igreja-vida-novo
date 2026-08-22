import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Sugestao {
  titulo: string
  categoria: string
  prioridade: 'alta' | 'media' | 'baixa'
}

function gerarSugestoes(
  avaliacoes: {
    custo: number | null
    receita: number | null
    presenca: number | null
    satisfacao: number | null
    pros: string | null
    contras: string | null
    evento: { titulo: string; valor: number | null } | null
  }[]
): Sugestao[] {
  const sugestoes: Sugestao[] = []
  const avaliacoesValidas = avaliacoes.filter((a) => a.evento)
  if (avaliacoesValidas.length === 0) return sugestoes

  const custoMedio =
    avaliacoesValidas.reduce((s, a) => s + (a.custo ?? 0), 0) /
    avaliacoesValidas.length
  const receitaMedia =
    avaliacoesValidas.reduce((s, a) => s + (a.receita ?? 0), 0) /
    avaliacoesValidas.length
  const presencaMedia =
    avaliacoesValidas.reduce((s, a) => s + (a.presenca ?? 0), 0) /
    avaliacoesValidas.length
  const satisfacaoMedia =
    avaliacoesValidas.reduce((s, a) => s + (a.satisfacao ?? 0), 0) /
    avaliacoesValidas.length
  const custoPorPessoa = presencaMedia > 0 ? custoMedio / presencaMedia : 0
  const lucroMedio = receitaMedia - custoMedio

  if (custoPorPessoa > 50) {
    sugestoes.push({
      titulo: `Custo por participante alto (R$ ${custoPorPessoa.toFixed(2)}). Considere reduzir custos fixos ou aumentar a meta de inscritos.`,
      categoria: 'custo',
      prioridade: 'alta',
    })
  }

  if (lucroMedio < 0) {
    sugestoes.push({
      titulo: `Eventos estão com prejuízo médio de R$ ${Math.abs(lucroMedio).toFixed(2)}. Revise valores de inscrição ou cortes de custo.`,
      categoria: 'custo',
      prioridade: 'alta',
    })
  }

  if (satisfacaoMedia > 0 && satisfacaoMedia < 3.5) {
    sugestoes.push({
      titulo: `Satisfação média baixa (${satisfacaoMedia.toFixed(1)}/5). Revise os pontos negativos dos eventos anteriores.`,
      categoria: 'qualidade',
      prioridade: 'alta',
    })
  }

  if (presencaMedia > 0) {
    const inscritosMedios =
      avaliacoesValidas.reduce((s, a) => {
        const total = a.evento?.valor ? (a.receita ?? 0) / a.evento.valor : 0
        return s + total
      }, 0) / avaliacoesValidas.length

    if (inscritosMedios > 0) {
      const taxaComparecimento = (presencaMedia / inscritosMedios) * 100
      if (taxaComparecimento < 70) {
        sugestoes.push({
          titulo: `Taxa de comparecimento de ${taxaComparecimento.toFixed(0)}% (média: ${presencaMedia.toFixed(0)} presentes). Envie lembretes antes do evento.`,
          categoria: 'divulgacao',
          prioridade: 'media',
        })
      }
    }
  }

  if (satisfacaoMedia >= 4.5) {
    sugestoes.push({
      titulo: `Excelente satisfação (${satisfacaoMedia.toFixed(1)}/5)! Repita os formatos e abordagens bem-sucedidas.`,
      categoria: 'qualidade',
      prioridade: 'baixa',
    })
  }

  const todosContras = avaliacoesValidas
    .map((a) => a.contras)
    .filter(Boolean)
    .join('; ')

  if (
    todosContras.includes('estacionamento') ||
    todosContras.includes('parking')
  ) {
    sugestoes.push({
      titulo:
        'Problemas recorrentes com estacionamento. Considere local com mais vagas ou transporte alternativo.',
      categoria: 'logistica',
      prioridade: 'media',
    })
  }

  if (
    todosContras.includes('som') ||
    todosContras.includes('áudio') ||
    todosContras.includes('audio')
  ) {
    sugestoes.push({
      titulo:
        'Problemas com áudio/som mencionados. Invista em equipamento ou profissional de som.',
      categoria: 'infraestrutura',
      prioridade: 'media',
    })
  }

  const todosPros = avaliacoesValidas
    .map((a) => a.pros)
    .filter(Boolean)
    .join('; ')

  if (todosPros.includes('louvor') || todosPros.includes('worship')) {
    sugestoes.push({
      titulo:
        'Louvor foi destaque positivo. Mantenha a equipe de louvor e repita o repertório.',
      categoria: 'qualidade',
      prioridade: 'baixa',
    })
  }

  if (sugestoes.length === 0) {
    sugestoes.push({
      titulo:
        'Registre avaliações de mais eventos para obter sugestões detalhadas.',
      categoria: 'geral',
      prioridade: 'baixa',
    })
  }

  return sugestoes
}

export async function GET() {
  const avaliacoes = await prisma.eventoAvaliacao.findMany({
    include: { evento: { select: { titulo: true, valor: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const sugestoes = gerarSugestoes(avaliacoes)

  return NextResponse.json(sugestoes)
}
