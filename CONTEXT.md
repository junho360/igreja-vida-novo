# Context - Igreja Vida

## Glossário de Domínio

| Termo               | Definição                                                           | Exemplo de uso                    |
| ------------------- | ------------------------------------------------------------------- | --------------------------------- |
| **Ministério**      | Frente de atuação da igreja (louvor, infantil, casais, etc.)        | `ministerio.louvor`               |
| **Célula**          | Pequeno grupo que se reúne fora do templo, com líder responsável    | _Não implementado ainda_          |
| **Devocional**      | Texto curto tipo blog, publicado com frequência                     | `devocional.titulo`               |
| **Estudo**          | Material de discipulado/ensino, categorizado, preenchido aos poucos | `estudo.categoria`                |
| **Pregação**        | Vídeo de culto/mensagem, hospedado no YouTube                       | `preGacao.urlYoutube`             |
| **Configuracao**    | Par chave-valor editável pelo admin (telefone, PIX, endereço)       | `configuracao.chave = 'telefone'` |
| **PedidoOracao**    | Solicitação de oração enviada por visitante                         | `pedidoOracao.mensagem`           |
| **MensagemContato** | Mensagem enviada pelo formulário de contato                         | `mensagemContato.assunto`         |
| **Evento**          | Programação da igreja (cultos, encontros, conferências)             | `evento.data`                     |

## Convenções de Nomenclatura

- **Variáveis e funções**: camelCase (`ministerioAtual`, `buscarEventos`)
- **Componentes**: PascalCase (`MinisterioCard`, `EventoList`)
- **Rotas**: kebab-case (`/ministerios`, `/devocionais`)
- **Tabelas do banco**: PascalCase no Prisma (`Ministerio`, `Evento`)
- **Variáveis de ambiente**: UPPER_SNAKE_CASE (`DATABASE_URL`, `NEXTAUTH_SECRET`)

## Estrutura do Projeto

```
igreja-vida/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (public)/         # Rotas públicas
│   │   ├── admin/            # Área administrativa
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── ui/               # Componentes genéricos
│   │   ├── public/           # Componentes das páginas públicas
│   │   └── admin/            # Componentes do admin
│   ├── lib/
│   │   ├── prisma.ts         # Cliente Prisma
│   │   └── auth.ts           # Config NextAuth
│   └── types/
│       └── index.ts          # Tipos compartilhados
├── public/
│   └── images/               # Imagens estáticas
└── .opencode/
    └── skills/               # Skills do opencode
```

## Stack Tecnológica

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4
- **Banco**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **ORM**: Prisma
- **Autenticação**: NextAuth.js
- **Language**: TypeScript

## Regras de Negócio

1. **Configuracao** nunca deve ser hardcode no código - sempre buscar do banco
2. **Devocionais** são diferentes de **Estudos** -前者 são posts curtos,后者 são materiais estruturados
3. **Ministério** não é o mesmo que **Célula** -前者 são frentes oficiais,后者 são grupos pequenos
4. **Pregação** sempre tem URL do YouTube - não armazenar vídeo localmente
5. **PedidoOracao** precisa de aprovação antes de ser público
