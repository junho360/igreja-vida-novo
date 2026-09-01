import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client.js'
import bcrypt from 'bcryptjs'

const isTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
const adapter = new PrismaLibSql({
  url: isTurso ? process.env.TURSO_DATABASE_URL! : 'file:./dev.db',
  authToken: isTurso ? process.env.TURSO_AUTH_TOKEN! : undefined,
})
const prisma = new PrismaClient({ adapter })

interface DevocionalSeed {
  titulo: string
  conteudo: string
  autor: string
}

const devocionaisBase: DevocionalSeed[] = [
  {
    titulo: 'A Força da Oração',
    conteudo:
      'A oração é uma das ferramentas mais poderosas que Deus nos deu. Quando oramos, conectamos nosso espírito com o Criador do universo.\n\n"Orem sem cessar." — 1 Tessalonicenses 5:17',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Perdão que Liberta',
    conteudo:
      'Perdoar não é esquecer o que aconteceu, mas escolher não carregar mais o peso do ressentimento.\n\n"Perdoai-vos uns aos outros, como também Deus vos perdoou em Cristo." — Efésios 4:32',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Confiança em Deus',
    conteudo:
      'Mesmo quando o caminho parece incerto, Deus está no controle. Confiar Nele é escolher a paz em meio à tempestade.\n\n"Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento." — Provérbios 3:5',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'A Graça Suficiente',
    conteudo:
      'Não precisamos ser perfeitos para receber o amor de Deus. Sua graça é suficiente para nos cobrir em todas as circunstâncias.\n\n"Minha graça é suficiente para você, pois o meu poder se aperfeiçoa na fraqueza." — 2 Coríntios 12:9',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Amor Incondicional',
    conteudo:
      'O amor de Deus não depende dos nossos erros ou acertos. Ele nos ama como somos, mas não nos deixa como estamos.\n\n"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito." — João 3:16',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Paz que Excede o Entendimento',
    conteudo:
      'A paz de Deus não faz sentido aos olhos do mundo. Ela vem mesmo quando as circunstâncias dizem o contrário.\n\n"E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos." — Filipenses 4:7',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Força nas Adversidades',
    conteudo:
      'As dificuldades não vêm para nos destruir, mas para nos fortalecer. Deus usa cada prova para nos moldar.\n\n"Posso todas as coisas naquele que me fortalece." — Filipenses 4:13',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Luz no Caminho',
    conteudo:
      'Quando não sabemos que rumo tomar, Deus ilumina nossos passos. Sua palavra é uma lâmpada para os nossos pés.\n\n"Eu sou a luz do mundo. Quem me segue não andará em trevas." — João 8:12',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Alegria do Senhor',
    conteudo:
      'A alegria cristã não depende das circunstâncias. Ela vem do conhecimento de que Deus está conosco.\n\n"Alegrei-vos sempre no Senhor; outra vez digo, alegrai-vos." — Filipenses 4:4',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Coragem para Avançar',
    conteudo:
      'Deus não nos deu espírito de covardia, mas de poder, amor e equilíbrio. É hora de avançar com fé.\n\n"Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus." — Isaías 41:10',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Fé que Move Montanhas',
    conteudo:
      'A fé pequena já move montanhas. Imagine o que uma fé grande pode fazer na sua vida.\n\n"Se tiverdes fé como um grão de mostarda, direis a esta montanha: muda-te daqui para ali, e ela se mudará." — Mateus 17:20',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Descanso em Deus',
    conteudo:
      'Carregar o peso do mundo nos esgota. Deus convida a todos que estão cansados a encontrarem descanso Nele.\n\n"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." — Mateus 11:28',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Gratidão em Tudo',
    conteudo:
      'A gratidão transforma nossa perspectiva. Quando agradecemos, percebemos quantas bênçãos Deus nos dá todos os dias.\n\n"Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco." — 1 Tessalonicenses 5:18',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'A Palavra Viva',
    conteudo:
      'A Bíblia não é apenas um livro antigo. É a palavra viva de Deus que fala ao nosso coração hoje.\n\n"Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção, para a educação na justiça." — 2 Timóteo 3:16',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Comunhão e Unidade',
    conteudo:
      'Deus nos fez para viver em comunidade. Quando nos unimos em nome de Jesus, Sua presença se manifesta com poder.\n\n"Onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles." — Mateus 18:20',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Misericórdia Renovada',
    conteudo:
      'Cada manhã é uma nova chance de receber a misericórdia de Deus. Suas misericórdias se renovam a cada dia.\n\n"As misericórdias do Senhor se renovam a cada manhã; grande é a tua fidelidade." — Lamentações 3:22-23',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Vitória em Cristo',
    conteudo:
      'Não importa o que esteja enfrentando, em Cristo você já é vencedor. A cruz derrotou o poder da morte e do pecado.\n\n"Mas graças a Deus que nos dá a vitória pelo nosso Senhor Jesus Cristo." — 1 Coríntios 15:57',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Coração Curado',
    conteudo:
      'Deus é o restaurador dos corações feridos. Ele sana as feridas que ninguém mais consegue ver.\n\n"O Senhor se aproxima dos que têm o coração quebrantado e salva os de espírito abatido." — Salmo 34:18',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Propósito Divino',
    conteudo:
      'Deus tem um plano para a sua vida. Mesmo quando não entendemos, Ele está trabalhando tudo para o nosso bem.\n\n"Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal." — Jeremias 29:11',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Liberdade em Cristo',
    conteudo:
      'Para a liberdade Cristo nos libertou. Não voltemos ao jugo da escravidão, mas vivamos na plenitude da graça.\n\n"Para a liberdade Cristo nos libertou; permanecei, pois, firmes e não vos sujeiteis again ao jugo da escravidão." — Gálatas 5:1',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Vida Abundante',
    conteudo:
      'Jesus veio para que tivéssemos vida e a tivéssemos com abundância. Não basta sobreviver, é preciso viver plenamente.\n\n"Eu vim para que tenham vida, e a tenham com abundância." — João 10:10',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Rocha Firmíssima',
    conteudo:
      'Quando fundamos nossa vida em Cristo, temos uma base que não se abala. Ele é a rocha que resiste a qualquer tempestade.\n\n"Quem ouve minhas palavras e as pratica é como um homem prudente que edificou sua casa sobre a rocha." — Mateus 7:24',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Espírito Santo em Nós',
    conteudo:
      'O Espírito Santo não é apenas um conceito. Ele é uma pessoa que habita em nós e nos guia a toda verdade.\n\n"Quando vier o Espírito da verdade, ele vos guiará a toda a verdade." — João 16:13',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Oração que Transforma',
    conteudo:
      'A oração não muda apenas as circunstâncias ao nosso redor. Ela muda primeiro o nosso coração.\n\n"A oração fervente do justo pode muito em seus efeitos." — Tiago 5:16',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Esperança Viva',
    conteudo:
      'A esperança cristã não é um desejo vago. É a certeza de que Deus cumprirá cada uma de Suas promessas.\n\n"Vivendo, porém, não para si mesmos, mas para aquele que por eles morreu e ressuscitou." — 2 Coríntios 5:15',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Justiça e bondade',
    conteudo:
      'Deus nos chama para praticarmos justiça eandarmos em humildade. Nossa vida deve refletir Seu caráter.\n\n"Ele te mostrou, ó homem, o que é bom; e que é o que o Senhor pede de ti, senão que pratiques a justiça, e ames a beneficência, e andes humildemente com o teu Deus?" — Miquéias 6:8',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Corpo de Cristo',
    conteudo:
      'Somos muitos membros, mas um corpo. Cada cristão tem uma função importante no Reino de Deus.\n\n"Vós sois o corpo de Cristo, e individualmente, membros dele." — 1 Coríntios 12:27',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Temor do Senhor',
    conteudo:
      'O temor do Senhor é o princípio da sabedoria. Reconhecer a grandeza de Deus nos conduz a uma vida sábia.\n\n"O temor do Senhor é o princípio da sabedoria." — Provérbios 9:10',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Semente da Palavra',
    conteudo:
      'A palavra de Deus plantada no nosso coração produz frutos para a eternidade. Cultive-a todos os dias.\n\n"Mas o que caiu em boa terra são os que ouvem a palavra, a compreendem e produzem fruto." — Mateus 13:23',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Mãos Estendidas',
    conteudo:
      'Deus estende Suas mãos para nos acolher. Não importa onde estejamos, Ele sempre está ao nosso alcance.\n\n"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." — Mateus 11:28',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Fogo que Acende',
    conteudo:
      'O Espírito Santo é como fogo que acende nosso coração para Deus. Deixe-Se incendiar pelo Seu amor.\n\n"E apareceram-lhes língas repartidas, como de fogo, as quais pousaram sobre cada um deles." — Atos 2:3',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Pedra Angular',
    conteudo:
      'Jesus é a pedra angular da nossa fé. Nele tudo se sustenta e tudo se conecta.\n\n"Esta pedra que vós, os edificadores, rejeitastes, veio a ser a pedra angular." — Atos 4:11',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Vida Nova',
    conteudo:
      'Quando aceitamos a Cristo, tudo se torna novo. O passado não define mais quem somos.\n\n"Se, porém, algum está em Cristo, nova criatura é; as coisas velhas já passaram; eis que se fizeram novas." — 2 Coríntios 5:17',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Mana do Céu',
    conteudo:
      'Assim como Deus alimentou o povo no deserto, Ele provê nossas necessidades todos os dias. Confie na provisão divina.\n\n"Mas buscai primeiro o Reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas." — Mateus 6:33',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Água Viva',
    conteudo:
      'Jesus é a água viva que satisfaz nossa sede eterna. Beba d\'Ele e nunca mais terá sede.\n\n"Quem beber da água que eu lhe der nunca mais terá sede." — João 4:14',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Aclamação ao Rei',
    conteudo:
      'Jesus é o Rei dos reis e Senhor dos senhores. Toda joelho se dobrará diante Dele. Aclame-O hoje!\n\n"Todo o joelho se dobrará, e toda a língua confessará que Jesus Cristo é o Senhor." — Filipenses 2:10-11',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Guardião dos Nosso Coração',
    conteudo:
      'Deus guarda nosso coração com um cuidado infinito. Entregue-Lhe seus medos e ansiedades.\n\n"Guarda o teu coração, porque dele procedem as fontes da vida." — Provérbios 4:23',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Palavra Acesa',
    conteudo:
      'A palavra de Deus é como uma lâmpada que ilumina nosso caminho. Não ande nas trevas, ilumine-se com a Bíblia.\n\n"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." — Salmo 119:105',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Chamados para Servir',
    conteudo:
      'Deus nos chamou não para sermos servidos, mas para servirmos. O serviço é a marca do discípulo.\n\n"Assim também o Filho do Homem não veio para ser servido, mas para servir e dar a sua vida em resgate por muitos." — Marcos 10:45',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Acolhimento Divino',
    conteudo:
      'Não importa quantos erros tenhamos cometido. Deus nos acolhe de braços abertos quando voltamos para Ele.\n\n"Lançando sobre vós toda a vossa ansiedade, porque ele cuida de vós." — 1 Pedro 5:7',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Ressurreição e Vida',
    conteudo:
      'A ressurreição de Jesus mudou tudo. A morte não tem mais poder sobre aqueles que creem Nele.\n\n"Eu sou a ressurreição e a vida; quem crê em mim, ainda que morra, viverá." — João 11:25',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Caminho, Verdade e Vida',
    conteudo:
      'Jesus é o único caminho que leva ao Pai. Nele encontramos a verdade que liberta e a vida eterna.\n\n"Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim." — João 14:6',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Ovelhas do Pastor',
    conteudo:
      'Somos ovelhas do bom Pastor. Ele conhece cada uma por nome e nunca nos abandona.\n\n"Eu sou o bom Pastor. O bom Pastor dá a sua vida pelas ovelhas." — João 10:11',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Colheita Abundante',
    conteudo:
      'Deus promete uma colheita abundante para aqueles que semeiam com fé. Não desista de semear bondade.\n\n"Semeai para vós mesmos em justiça, e colhereis em misericórdia." — Oséias 10:12',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Neve branca',
    conteudo:
      'Deus limpa nossos pecados e nos faz brancos como a neve. Sua graça transforma completamente.\n\n"Aunque os vossos pecados sejam como a escarlata, eles se tornarão brancos como a neve." — Isaías 1:18',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Refúgio e Fortaleza',
    conteudo:
      'Deus é o nosso refúgio e fortaleza. Em Ele encontramos proteção em todos os momentos da vida.\n\n"Deus é o nosso refúgio e fortaleza, socorro muito presente na angústia." — Salmo 46:1',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Sonhos de Deus',
    conteudo:
      'Deus tem sonhos para a sua vida. Não se conforme com menos do que Ele preparou para você.\n\n"Porque os meus pensamentos não são os vossos pensamentos, nem os vossos caminhos são os meus caminhos." — Isaías 55:8',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Bondade Sem Limites',
    conteudo:
      'A bondade de Deus não tem limites. Ela se renova a cada manhã e nunca se esgota.\n\n"Ó quão abundantes são as tuas bondades, que tens guardado para os que te temem!" — Salmo 31:19',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Prisioneiros da Esperança',
    conteudo:
      'Mesmo nas correntes da vida, podemos ser prisioneiros da esperança. A esperança em Deus nunca decepciona.\n\n"Porque eu sou prisioneiro da esperança." — Sofonias 3:17',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Fogo Consumidor',
    conteudo:
      'O amor de Deus é um fogo que consome todo o mal e purifica nosso coração. Deixe-Se consumir pelo Seu amor.\n\n"O teu Deus é fogo consumidor, Deus zeloso." — Deuteronômio 4:24',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Eterna Aliança',
    conteudo:
      'Deus fez uma aliança eterna conosco pelo sangue de Jesus. Nada pode separar-nos do Seu amor.\n\n"Porque estou certo de que nem a morte, nem a vida... poderão separar-nos do amor de Deus." — Romanos 8:38-39',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Renovação diária',
    conteudo:
      'A cada manhã, Deus nos dá a chance de recomeçar. Sua misericórdia é nova a cada dia.\n\n"Renovai-vos, pois, diariamente pela Palavra de Deus." — referência inspirada em Lamentações 3:22-23',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Generosidade que Multiplica',
    conteudo:
      'Quando partilhamos o que temos, Deus multiplica. A generosidade é um princípio do Reino.\n\n"Dai, e vos será dado; medida boa, apertada, transbordante vos darão." — Lucas 6:38',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Paz Interior',
    conteudo:
      'O mundo oferece distrações, mas Deus oferece paz. Uma paz que passa todo o entendimento.\n\n"Deixo-vos a paz, a minha paz vos dou." — João 14:27',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Coração Generoso',
    conteudo:
      'Deus ama o dador alegre. Quando damos com alegria, Recebemos muito mais do que esperávamos.\n\n"Cada um contribua conforme propôs no coração, não com tristeza ou por necessidade; porque Deus ama o dador alegre." — 2 Coríntios 9:7',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Proteção Divina',
    conteudo:
      'Deus é o nosso escudo e proteção. Sob Suas asas estamos seguros, mesmo nos momentos mais difíceis.\n\n"Deus é para nós refúgio e fortaleza, um auxílio muito presente na angústia." — Salmo 46:1',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Transformação Contínua',
    conteudo:
      'A santificação é um processo contínuo. Cada dia Deus nos transforma mais à imagem de Cristo.\n\n"Mas nós todos, com a cara descoberta, refletindo como em espelho a glória do Senhor, somos transformados de glória em glória." — 2 Coríntios 3:18',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Herdeiros da Promessa',
    conteudo:
      'Em Cristo, somos herdeiros de todas as promessas de Deus. O que Ele prometeu, cumprirá.\n\n"Se sois de Cristo, então sois semente de Abraão e herdeiros segundo a promessa." — Gálatas 3:29',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Fonte de Sabedoria',
    conteudo:
      'Deus é a fonte de toda sabedoria. Peça-Lhe sabedoria e Ele dará generosamente.\n\n"Se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e o não lança em rosto." — Tiago 1:5',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Espiadas de Céu',
    conteudo:
      'A comunhão com Deus é uma prévia do céu. Cada momento de oração é uma espiada na eternidade.\n\n"Mas, como está escrito: As coisas que o olho não viu, nem o ouvido ouviu, nem subiram ao coração do homem, são as que Deus preparou para os que o amam." — 1 Coríntios 2:9',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Perseverança na Fé',
    conteudo:
      'A perseverança produz caráter, e o caráter produz esperança. Não desista, Deus está trabalhando.\n\n"Não vos canbes, porém, de fazer o bem; porque, se não desfalecermos, a seu tempo ceifaremos." — Gálatas 6:9',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Coração Sensível',
    conteudo:
      'Deus quer um coração sensível à Sua voz. Aprenda a ouvi-Lo nas coisas pequenas do dia a dia.\n\n"Ouve, Israel: o Senhor, o nosso Deus, é o único Senhor." — Deuteronômio 6:4',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Lâmpada Acesa',
    conteudo:
      'Nossa vida deve ser como uma lâmpada acesa que ilumina a escuridão ao redor. Seja luz onde estiver.\n\n"Vós sois a luz do mundo. Não se pode esconder uma cidade edificada sobre um monte." — Mateus 5:14',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Lava-Mentos do Batismo',
    conteudo:
      'O batismo é mais do que água. É uma declaração pública de uma transformação interior que Deus operou.\n\n"Mas fostes lavados, fostes santificados, fostes justificados em nome do Senhor Jesus Cristo." — 1 Coríntios 6:11',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Aliança de Sangue',
    conteudo:
      'O sangue de Jesus selou uma aliança nova e eterna. Somos perdoados e livres para sempre.\n\n"Porque isto é o meu sangue, o sangue da nova aliança, que é derramado por muitos para remissão dos pecados." — Mateus 26:28',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Caminhos de Justiça',
    conteudo:
      'Deus nos mostra o caminho da justiça. Andar n\'Ele é a escolha mais sábia que podemos fazer.\n\n"Guia-me pelo teu conselho, e depois me recebes na glória." — Salmo 73:24',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Trevas e Luz',
    conteudo:
      'Deus não nos tira das trevas de uma vez. Ele caminha conosco nelas até nos guiar à luz.\n\n"Embora eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo." — Salmo 23:4',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Pão da Vida',
    conteudo:
      'Jesus é o pão que desceu do céu. Quem come d\'Ele nunca mais terá fome espiritual.\n\n"Eu sou o pão da vida; quem vier a mim não terá fome, e quem crer em mim nunca terá sede." — João 6:35',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Curador dos Feridos',
    conteudo:
      'Deus é o médico que cura nossas feridas mais profundas. Entregue-Lhe suas dores.\n\n"O Senhor é junto do que tem o coração quebrantado, e salva os de espírito humilde." — Salmo 34:18',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Somos Dele',
    conteudo:
      'Somos propriedade de Deus. Comprados pelo sangue de Cristo, pertencemos a Ele para sempre.\n\n"Porque fostes comprados por certo preço; glorificai, pois, a Deus no vosso corpo e no vosso espírito." — 1 Coríntios 6:20',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'A Marcha da Fé',
    conteudo:
      'A fé é uma jornada, não um destino. Cada passo com Deus nos leva mais perto da glória.\n\n"Portanto, já que estamos rodeados de uma tão grande nuvem de testemunhas, suportemos com paciência o que nos resta a sofrer." — Hebreus 12:1',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Música no Deserto',
    conteudo:
      'Deus faz brotar música no deserto da nossa vida. Até nas secas, Ele prepara uma canção de júbilo.\n\n"Em vez de espinhos, subirá cipreste; em vez de urtiga, subirá murta; e isso será para glória do Senhor." — Isaías 55:13',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Perdão Radical',
    conteudo:
      'Jesus ensinou a perdoar setenta vezes sete. O perdão não é fraqueza, é a maior demonstração de força espiritual.\n\n"Se sete vezes ao dia te pecar contra ti, e sete vezes ao dia se converter, e disser: Arrependo-me, perdoa-lhe." — Lucas 17:4',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Vinde e Vede',
    conteudo:
      'Deus convida cada pessoa a experimentar o Seu amor. Não basta ouvir falar, é preciso Experimentar.\n\n"Vinde e vede que bom é o Senhor!" — Salmo 34:8',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Deus das Segundas Chance',
    conteudo:
      'Deus nunca desiste de nós. Quantas vezes quebramos Sua aliança, Ele sempre volta com um novo começo.\n\n"Não é pela morte do torcedor que a vingança se apaga; não há esquecimento no abismo." — por outro lado, a graça de Deus é infinita.',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Oração da Manhã',
    conteudo:
      'Comece o dia orando. A manhã é o momento de alinhar nosso coração com os propósitos de Deus.\n\n"De manhã cedo eu te buscarei." — Salmo 63:1',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Verdadeiro Adorador',
    conteudo:
      'Deus busca adoradores em espírito e em verdade. A adoração vai além da música, é uma vida inteira dedicada a Ele.\n\n"Deus é espírito, e é necessário que os que o adoram o adorem em espírito e em verdade." — João 4:24',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Deserto Fértil',
    conteudo:
      'Deus pode transformar o deserto da sua vida em um jardim. Ele é especialista em fazer o impossível.\n\n"Eu abrirei caminhos no deserto, e rios no deserto." — Isaías 43:19',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Mãos de Cura',
    conteudo:
      'As mãos de Jesus curam as feridas que nenhum médico alcança. Entregue-Lhe o que dói.\n\n"Curou todos os que tinham necessidade de cura." — Lucas 6:19',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Despertar Espiritual',
    conteudo:
      'Está na hora de despertar espiritualmente. Deus tem algo novo para você, mas é preciso estar atento.\n\n"Desperta, tu que dormes, e ressuscita dentre os mortos, e Cristo te iluminará." — Efésios 5:14',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Monte das Oliveiras',
    conteudo:
      'Jesus orou no Getsêmane e nos ensinou a perseverar na oração, mesmo quando a carne é fraca.\n\n"Vigiai e orai, para que não entreis em tentação." — Mateus 26:41',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Promessas Firmes',
    conteudo:
      'As promessas de Deus são Sim e Amém. Não há nele sombra de variação.\n\n"Porquantas são as promessas de Deus, todas são nele Sim; e por ele, o Amém, para a glória de Deus por meio de nós." — 2 Coríntios 1:20',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Descanso Eterno',
    conteudo:
      'Um dia descansaremos para sempre na presença do Pai. Enquanto isso, vivemos com esperança da glória.\n\n"Há agora restos de repouso para o povo de Deus." — Hebreus 4:9',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Semente Pequena',
    conteudo:
      'O Reino de Deus começa como uma semente pequena. Não despreze os pequenos começos, pois Deus faz coisas grandes.\n\n"O Reino dos céus é semelhante a um grão de mostarda, que um homem tomou e plantou no seu campo." — Mateus 13:31-32',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Sob as Asas de Deus',
    conteudo:
      'Deus nos cobre com Suas asas como uma águia cobre seus filhos. Em sua proteção estamos seguros.\n\n"Debaixo das suas penas te acolherás; as suas asas serão o teu refúgio." — Salmo 91:4',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Juízo e Graça',
    conteudo:
      'Deus é justo e misericordioso. Embora mereçamos julgamento, Ele nos oferece graça abundante.\n\n"Se fiéis forem os vossos pecados como a escarlata, como a neve se tornarão brancos." — Isaías 1:18',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Coração de Pai',
    conteudo:
      'Deus é o nosso Pai celestial. Ele nos ama com um amor que nenhum pai humano consegue igualar.\n\n"Se vós, sendo maus, sabeis dar boas dádivas aos vossos filhos, quanto mais o vosso Pai que está nos céus dará coisas boas." — Mateus 7:11',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Pé na Rocha',
    conteudo:
      'Quando tudo desmorona ao nosso redor, Cristo é a rocha que permanece firme para sempre.\n\n"Ele é como um homem que, edificando uma casa, cavou, aprofundou e pôs o fundamento sobre a rocha." — Lucas 6:48',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Leite e Mel',
    conteudo:
      'Deus conduz seu povo à terra que mana leite e mel. Ele tem uma vida abundante preparada para você.\n\n"Eu vim para que tenham vida, e a tenham com abundância." — João 10:10',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Olhos nos Montes',
    conteudo:
      'De onde vem o nosso socorro? Dos montes? Não. Nosso socorro vem do Senhor, que fez céus e terra.\n\n"Os meus olhos estão postos nos montes; de onde me virá o socorro?" — Salmo 121:1',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Pedras de Memória',
    conteudo:
      'Assim como Israel levantou pedras de memória, precisamos nos lembrar do que Deus fez na nossa vida.\n\n"Estas pedras serão por memória para os filhos de Israel, para sempre." — Josué 4:7',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Voando Alto',
    conteudo:
      'Deus quer que voemos alto como águias. Não se contente em andar rastejando quando Ele fez você para voar.\n\n"Mas aqueles que esperam no Senhor renovarão as suas forças; subirão com asas como águias." — Isaías 40:31',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Obediência que Abençoa',
    conteudo:
      'A obediência a Deus abre as portas das bênçãos. Seguir Seus mandamentos é caminho de prosperidade.\n\n"Se ouvires a voz do Senhor, teu Deus, guardando e fazendo todos os seus mandamentos." — Deuteronômio 28:1',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Tempestade e Calmaria',
    conteudo:
      'Jesus calmou a tempestade com uma palavra. Ele pode acalmar as tempestades da sua vida também.\n\n"Por que tendes medo, homens de pouca fé? Então, levantando-se, repreendeu os ventos e o mar, e houve grande bonança." — Mateus 8:26',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Justiça que Flui',
    conteudo:
      'Deus quer que a justiça flua como rio perene da nossa vida. Pratique a justiça todos os dias.\n\n"Mas buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas." — Mateus 6:33',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Tentação e Queda',
    conteudo:
      'Todos enfrentamos tentações, mas Deus sempre provides um caminho de escape. Não há tentação sem saída.\n\n"Não vos sobreveio nenhuma tentação que não fosse humana; mas Deus é fiel e não deixará que sejais tentados além do que podeis suportar." — 1 Coríntios 10:13',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Joias de Deus',
    conteudo:
      'Os filhos de Deus são como joias preciosas. Cada um é único e valioso aos olhos do Pai.\n\n"Vós sois a eleição real, o sacerdócio real, a nação santa, o povo adquirido." — 1 Pedro 2:9',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Canção Nova',
    conteudo:
      'Deus quer colocar uma canção nova no seu coração. Deixe que Ele cante por meio de você.\n\n"Cantai ao Senhor um cântico novo; cantai ao Senhor, ó terra inteira." — Salmo 96:1',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Amor que Tudo Sustenta',
    conteudo:
      'O amor de Deus sustenta o universo. É esse mesmo amor que nos sustenta em cada momento.\n\n"O amor é paciente, o amor é bondoso." — 1 Coríntios 13:4',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Fé que Persevera',
    conteudo:
      'A verdadeira fé persevera até o fim. Não desista nos momentos difíceis, pois Deus é fiel.\n\n"O justo viverá pela fé, mas se recuar, não tem prazer nele." — Hebreus 10:38',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Rios de Água Viva',
    conteudo:
      'De Jesus brotam rios de água viva. Deixe que esse rio inunde sua vida toda.\n\n"Se algum tem sede, venha a mim e beba. Quem crer em mim, como diz a Escritura, rios de água viva correrão do seu ventre." — João 7:37-38',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Justiça e Misericórdia',
    conteudo:
      'Deus pratica justiça e misericórdia. Somos chamados a sermos agentes dessa dupla virtude no mundo.\n\n"Julgai com justiça, fazei misericórdia umas com as outras." — Zacarias 7:9',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Férea Fornalha',
    conteudo:
      'Deus nos usa na fornalha da provação para nos purificar. Saimos mais fortes e puros do que entramos.\n\n"Porque nós lançamos fogo na fornalha da aflição, mas Deus nos trouxe à liberdade." — referência inspirada em Daniel 3',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Pastor Gentil',
    conteudo:
      'Deus é o bom Pastor que cuida de cada ovelha com carinho. Ele nunca perde nenhuma.\n\n"Eu sou o bom Pastor; e conheço as minhas ovelhas, e as minhas ovelhas me conhecem." — João 10:14',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Queda e Ressurreição',
    conteudo:
      'Embora caibos mil vezes, o Senhor nos levanta. Sua graça é mais forte que nossas quedas.\n\n"Sete vezes cairá o justo, e se levantará." — Provérbios 24:16',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Estrela da Manhã',
    conteudo:
      'Jesus é a estrela da manhã que brilha mesmo quando a noite é mais escura.\n\n"Eu sou a estrela resplandecente da manhã." — Apocalipse 22:16',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Pedra Rolada',
    conteudo:
      'Deus remove os obstáculos da nossa vida como uma pedra que é retirada do caminho.\n\n"Remove a pedra." — João 11:39',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Vinho Novo',
    conteudo:
      'Deus renova tudo na nossa vida. Ele transforma o velho em algo novo e cheio de sabor.\n\n"Ninguém deita vinho novo em odres velhos; de outro modo os odres se rompem." — Mateus 9:17',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Ressurreição Poderosa',
    conteudo:
      'O mesmo poder que ressuscitou Jesus de entre os mortos vive em nós. Vivamos nessa realidade.\n\n"De que modo o imenso poder dele se exercita para conosco, que cremos." — Efésios 1:19-20',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Lâmpadas Acesas',
    conteudo:
      'Somos como铭 lamps acesas neste mundo. Não nos escondamos, mas brilhemos para a glória de Deus.\n\n"Vós sois a luz do mundo." — Mateus 5:14',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Árvores Plantadas',
    conteudo:
      'Quando plantados junto a águas de Deus, frutificamos em todo tempo. Não seque a nossa raiz.\n\n"Será como uma árvore plantada junto a correntes de águas, que dá o seu fruto no seu tempo." — Salmo 1:3',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Tesouros no Céu',
    conteudo:
      'Acumulemos tesouros no céu, onde a traça não destrói e o ladrão não fura.\n\n"Não acumuleis para vós mesmos tesouros na terra, onde a traça e o ferrugem consomem." — Mateus 6:19-20',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Compassivo e Forte',
    conteudo:
      'Deus é compassivo e forte. Ele se compadece da nossa fraqueza e nos dá força para seguir em frente.\n\n"O Senhor é compassivo e misericordioso, tardo em irar-se e grande em benignidade." — Salmo 103:8',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Deus Conosco',
    conteudo:
      'Emmanuel significa Deus conosco. Em cada momento, Ele está ao nosso lado.\n\n" Eis que uma virgem conceberá e dará à luz um filho, e chamarás o seu nome Emmanuel." — Isaías 7:14',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Chamas de Amor',
    conteudo:
      'O amor de Deus é como chamas que não se apagam. Ele nos ama com um amor eterno e inabalável.\n\n"Colocai-me como um selo sobre o teu coração, como um selo sobre o teu braço; porque o amor é forte como a morte." — Cânticos 8:6',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Enxerto em Cristo',
    conteudo:
      'Em Cristo somos enxertados na videira verdadeira. Nele temos vida e produzimos frutos.\n\n"Eu sou a videira, vós os Ramais." — João 15:5',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Mão Poderosa',
    conteudo:
      'A mão de Deus é poderosa para salvar e libertar. Nenhum problema é grande demais para ela.\n\n"O braço do Senhor está estendido? Não tem mais poder para salvar?" — Isaías 59:1',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Conselheiro e Amigo',
    conteudo:
      'Jesus nos chamou de amigos. Ele é o conselheiro que nunca erra e o amigo que nunca nos abandona.\n\n"Já não vos chamo servos... chamei-vos amigos." — João 15:15',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Príncipe da Paz',
    conteudo:
      'Jesus é o Príncipe da Paz. Nele encontramos a paz que o mundo não pode dar.\n\n"E o governo será sobre os seus ombros, e o seu nome será: Maravilhoso, Conselheiro, Deus Forte, Pai eterno, Príncipe da Paz." — Isaías 9:6',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Semente de Abraão',
    conteudo:
      'Somos herdeiros da promessa feita a Abraão. As bênçãos de Deus se estendem a todos os que creem.\n\n"Se sois de Cristo, então sois semente de Abraão e herdeiros segundo a promessa." — Gálatas 3:29',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Sossego Interior',
    conteudo:
      'No meio da correria do mundo, Deus nos dá um sossego que transcende o entendimento humano.\n\n"Em paz me deitarei e também dormirei, porque só tu, Senhor, me fazes habitar em segurança." — Salmo 4:8',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Mão da Providência',
    conteudo:
      'A mão de Deus nos guia e sustenta. Não caminhamos sozinhos, Ele está sempre nos conduzindo.\n\n"O teu ouvido ouvirá a palavra atrás de ti, dizendo: Este é o caminho, andai nele." — Isaías 30:21',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Cordeiro de Deus',
    conteudo:
      'Jesus, o Cordeiro de Deus, tira o pecado do mundo. Nele temos a remissão completa.\n\n"Eis o Cordeiro de Deus, que tira o pecado do mundo." — João 1:29',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Pérola de Grande Preço',
    conteudo:
      'O Reino de Deus é como uma pérola de grande preço. Vale a pena vender tudo para possuí-lo.\n\n"O Reino dos céus é semelhante a um negociante que busca boas péloas." — Mateus 13:45',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Resgate Eterno',
    conteudo:
      'Cristo nos resgatou com seu sangue precioso. Somos livres para sempre das correntes do pecado.\n\n"Sabendo que fostes resgatados... não com coisas corruptíveis, como ouro ou prata." — 1 Pedro 1:18-19',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Aurora da Justiça',
    conteudo:
      'A justiça de Deus brilha como a aurora. Cada dia é uma nova chance de vivermos na justiça divina.\n\n"Mas para vós, que temeis o meu nome, nascerá o sol da justiça, e na sua há saúde nas suas asas." — Malaquias 4:2',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Deserto em Jardim',
    conteudo:
      'Deus transforma os desertos da nossa vida em jardins florescentes. Ele é o Deus do impossível.\n\n"O deserto se alegrará, e o ermo florescerá e florescerá como o lírio." — Isaías 35:1',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Rocha Fenda',
    conteudo:
      'Quando Moisés golpeou a rocha, brotou água. De Cristo, a Rocha, brota vida eterna.\n\n"Beberam de um acompanharam a Rocha espiritual que os acompanhava, e essa Rocha era Cristo." — 1 Coríntios 10:4',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Cetro de Justiça',
    conteudo:
      'O cetro de Cristo é justo e reto. Seu governo traz justiça e paz para todos os que Nele creem.\n\n"Do broto de Jessai se levantará um varão, e sobre ele repousará o Espírito do Senhor; com justiça julgará." — Isaías 11:2-4',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Aleluia!',
    conteudo:
      'Aleluia! O Senhor Deus Todo-Poderoso reinou. Alegremo-nos e demos-Lhe gloria porque Ele venceu.\n\n"Aleluia! Porque o Senhor nosso Deus, o Todo-Poderoso, reina." — Apocalipse 19:6',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Arca da Aliança',
    conteudo:
      'A presença de Deus habita entre nós. Assim como a arca, somos vasos da Sua glória.\n\n"E habitarei no meio dos filhos de Israel, e serei o seu Deus." — Êxodo 29:45',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Fonte selada',
    conteudo:
      'O Espírito selado em nós é uma promessa de herança. Ele garante que Deus completará a obra começou.\n\n"Em quem vós também, depois que ouvistes a palavra da verdade, o evangelho da vossa salvação, tendes crido, fostes selados com o Espírito Santo da promessa." — Efésios 1:13',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Lâmpada e Sal',
    conteudo:
      'Somos a luz e o sal da terra. Sem nós, o mundo perde sabor e brilho.\n\n"Vós sois o sal da terra... Vós sois a luz do mundo." — Mateus 5:13-14',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Deserto Sedento',
    conteudo:
      'Assim como o povo no deserto sedentou por água, nosso coração anseia por Deus.\n\n"Como a corça anseia por águas correntes, assim a minha alma anseia por ti, ó Deus." — Salmo 42:1',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Sonda-me e Sabe',
    conteudo:
      'Deus nos conhece profundamente. Peça-Lhe que examine seu coração e o purifique.\n\n"Ó Deus, sonda-me, e conhece o meu coração." — Salmo 139:23',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Mão Aberta',
    conteudo:
      'Deus abre Sua mão e satisfaz o desejo de toda criatura. Ele é generoso com quem Lhe busca.\n\n"Abres a tua mão, e satisfazes o desejo de todo vivente." — Salmo 145:16',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Construtor de Pontes',
    conteudo:
      'Deus constrói pontes onde vemos muros. Ele faz caminhos no impossível.\n\n"Eis que farei coisa nova, sucederá já; não percebereis? Farei no deserto um caminho, e rios no ermo." — Isaías 43:19',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Cordeiro e Leão',
    conteudo:
      'Jesus é o Cordeiro que perdoa e o Leão que vence. Nele temos misericórdia e poder.\n\n"Triunfou o Leão da tribo de Judá." — Apocalipse 5:5',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Vassoura de Graça',
    conteudo:
      'Deus limpa o nosso coração com a vassoura da Sua graça. Ele remove a sujeira do pecado.\n\n"Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça." — 1 João 1:9',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Vai e Não Peques Mais',
    conteudo:
      'Deus perdoa e nos liberta do ciclo do pecado. Sua graça não é licença para pecar, mas poder para vivermos santos.\n\n"Vai, e desde agora não peques mais." — João 8:11',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Pó da Terra',
    conteudo:
      'Embora sejamos feitos de pó, Deus nos imbuiu com Sua imagem. Somos preciosos aos Seus olhos.\n\n"Então formou o Senhor Deus o homem do pó da terra." — Gênesis 2:7',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Nova Criatura',
    conteudo:
      'Em Cristo somos uma nova criatura. O homem velho passou, e一切 se fez novo.\n\n"Se, porém, algum está em Cristo, nova criatura é." — 2 Coríntios 5:17',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Minha Força',
    conteudo:
      'O Senhor é a minha força e o meu cântico. Ele se tornou minha salvação.\n\n"O Senhor é a minha força e o meu cântico; ele se tornou a minha salvação." — Êxodo 15:2',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Deus Consola',
    conteudo:
      'Deus consola os que choram. Ele enxuga cada lágrima com Seu amor paternal.\n\n"Bem-aventurados os que choram, porque eles serão consolados." — Mateus 5:4',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Lâmpada dos Meus Pés',
    conteudo:
      'A Palavra de Deus ilumina cada passo. Não ande na escuridão, guie-se pela Bíblia.\n\n"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." — Salmo 119:105',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Água que Salta',
    conteudo:
      'Deus faz brotar água no deserto da nossa vida. Ele nunca nos deixa sem suprimento.\n\n"Naquele dia, brotarão águas vivas de Jerusalém." — Zacarias 14:8',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Olho do Dono',
    conteudo:
      'Deus vigia sobre a Sua Palavra para cumpri-la. O que Ele prometeu, realizará.\n\n"Eu vigio, para que cumpra a minha palavra." — Jeremias 1:12',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Palavra Proferida',
    conteudo:
      'A Palavra de Deus não volta vazia. Ela cumpre o para que foi enviada.\n\n"Assim será a minha palavra que sair da minha boca; não voltará para mim vazia." — Isaías 55:11',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Deus Compõe',
    conteudo:
      'Deus compõe as coisas que o homem desfez. Ele é o restaurador de tudo aquilo que foi quebrado.\n\n"Eu restituirei os anos consumidos pelo gafanhoto." — Joel 2:25',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Alto Refúgio',
    conteudo:
      'Deus é o nosso alto refúgio. Quando as águas da vida sobem, Ele nos levanta acima delas.\n\n"O Senhor é o meu rochedo, o meu baluarte e o meu libertador." — Salmo 18:2',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Volta ao Pai',
    conteudo:
      'Não importa quanto tempo estejamos afastados. O Pai sempre nos espera de braços abertos.\n\n"Levantar-me-ei, irrei a meu pai, e lhe direi: Pai, pequei contra o céu." — Lucas 15:18',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Irmãos de Cristo',
    conteudo:
      'Em Cristo somos irmãos e irmãs. A família de Deus é maior que qualquer laço humano.\n\n"Porque todos vós sois filhos de Deus pela fé em Cristo Jesus." — Gálatas 3:26',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Invisível mas Real',
    conteudo:
      'Deus é invisível, mas sua presença é a coisa mais real que existe. Sinta-O hoje.\n\n"Deus é espírito." — João 4:24',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Palavra Encarnada',
    conteudo:
      'O Verbo se fez carne e habitou entre nós. Deus não ficou distante, veio ser um de nós.\n\n"E o Verbo se fez carne, e habitou entre nós." — João 1:14',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Torre de Salvação',
    conteudo:
      'Deus é a torre de salvação para os que Lhe fogem. Ninguém alcança quem Ele protege.\n\n"O Senhor é a minha torre de salvação." — Salmo 18:2',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Rocha que Fende',
    conteudo:
      'Quando Cristo foi ferido na cruz, brotaram sangue e água. Da Sua ferida nasceu nossa cura.\n\n"Porque pelas suas pancadas fomos curados." — 1 Pedro 2:24',
    autor: 'Pastora Rachel',
  },
  {
    titulo: 'Espera Ativa',
    conteudo:
      'Esperar em Deus não é ficar parado. É confiar enquanto agimos com fé no que Ele revelou.\n\n"Esperai no Senhor; esforçai-vos, e se anime o vosso coração." — Salmo 27:14',
    autor: 'Pastor Lucas',
  },
  {
    titulo: 'Lâmpada acesa para todos',
    conteudo:
      'A luz de Cristo em nós não é para esconder. É para guiar outros ao caminho da salvação.\n\n"Brilhai como luzes no meio de uma geração corrompida." — Filipenses 2:15',
    autor: 'Pastora Rachel',
  },
]

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

async function main() {
  console.log('Limpando dados anteriores...')
  await prisma.configuracao.deleteMany()
  await prisma.mensagemContato.deleteMany()
  await prisma.pedidoOracao.deleteMany()
  await prisma.preGacao.deleteMany()
  await prisma.estudo.deleteMany()
  await prisma.devocional.deleteMany()
  await prisma.evento.deleteMany()
  await prisma.ministerio.deleteMany()
  await prisma.usuario.deleteMany()

  const louvor = await prisma.ministerio.create({
    data: {
      nome: 'Ministério de Louvor',
      descricao: 'Responsável pela adoração nos cultos e eventos da igreja.',
      responsavel: 'Carlos Silva',
    },
  })

  await prisma.ministerio.create({
    data: {
      nome: 'Ministério Infantil',
      descricao: 'Cuidando das crianças com amor e ensinando sobre Jesus.',
      responsavel: 'Maria Santos',
    },
  })

  const jovens = await prisma.ministerio.create({
    data: {
      nome: 'Ministério de Jovens',
      descricao: 'Encontros e atividades para jovens da igreja.',
      responsavel: 'Pedro Oliveira',
    },
  })

  await prisma.ministerio.create({
    data: {
      nome: 'Ministério de Casais',
      descricao: 'Fortalecendo casamentos e relacionamentos familiares.',
      responsavel: 'Ana Costa',
    },
  })

  const casais = await prisma.ministerio.findFirst({
    where: { nome: 'Ministério de Casais' },
  })

  await prisma.evento.create({
    data: {
      titulo: 'Culto de Domingo',
      descricao: 'Culto principal da semana com louvor, palavra e comunhão.',
      data: addDays(new Date(), (7 - new Date().getDay()) % 7 || 7),
      horario: '10:00',
      local: 'Templo Principal',
      ministerioId: louvor.id,
    },
  })

  await prisma.evento.create({
    data: {
      titulo: 'Reunião de Jovens',
      descricao: 'Encontro semanal dos jovens com dinâmicas, estudo e louvor.',
      data: addDays(new Date(), (5 - new Date().getDay() + 7) % 7 || 7),
      horario: '19:30',
      local: 'Salão de Eventos',
      ministerioId: jovens.id,
    },
  })

  await prisma.evento.create({
    data: {
      titulo: 'Encontro de Casais',
      descricao:
        'Noite especial para casais com workshops e momentos de conexão.',
      data: addDays(new Date(), 30),
      horario: '19:00',
      local: 'Salão de Eventos',
      ministerioId: casais?.id ?? jovens.id,
    },
  })

  console.log(`Criando ${devocionaisBase.length} devocionais...`)

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  for (let i = 0; i < devocionaisBase.length; i++) {
    const dev = devocionaisBase[i]
    await prisma.devocional.create({
      data: {
        titulo: dev.titulo,
        conteudo: dev.conteudo,
        autor: dev.autor,
        publicado: true,
        publicadoEm: addDays(hoje, i),
      },
    })
  }

  console.log(`${devocionaisBase.length} devocionais criados com sucesso!`)

  await prisma.estudo.create({
    data: {
      titulo: 'Fundamentos da Fé',
      descricao: 'Série de estudos sobre os pilares fundamentais da fé cristã.',
      conteudo:
        'Neste estudo, vamos explorar os fundamentos que sustentam a nossa fé.',
      categoria: 'Discipulado',
      ordem: 1,
      publicado: true,
    },
  })

  await prisma.estudo.create({
    data: {
      titulo: 'O Livro de Romanos',
      descricao: 'Estudo versículo a versículo da epístola aos Romanos.',
      conteudo: 'Romanos é uma das epístolas mais ricas do apóstolo Paulo.',
      categoria: 'Bíblia',
      ordem: 1,
      publicado: true,
    },
  })

  await prisma.preGacao.create({
    data: {
      titulo: 'O Poder da Graça',
      descricao:
        'Mensagem sobre a graça transformadora de Deus em nossas vidas.',
      urlYoutube: 'https://www.youtube.com/watch?v=exemple1',
      data: addDays(new Date(), -3),
      pregador: 'Pastor Lucas',
      duracao: '45:00',
    },
  })

  await prisma.preGacao.create({
    data: {
      titulo: 'Vivendo com Propósito',
      descricao: 'Descubrindo o propósito de Deus para a sua vida.',
      urlYoutube: 'https://www.youtube.com/watch?v=exemple2',
      data: addDays(new Date(), -10),
      pregador: 'Pastora Rachel',
      duracao: '38:00',
    },
  })

  const configuracoes = [
    {
      chave: 'telefone',
      valor: '(11) 99999-1234',
      descricao: 'Telefone da igreja',
    },
    {
      chave: 'email',
      valor: 'contato@igrejavida.com.br',
      descricao: 'E-mail de contato',
    },
    {
      chave: 'endereco',
      valor: 'Rua da Paz, 123 - Centro - São Paulo/SP',
      descricao: 'Endereço da igreja',
    },
    {
      chave: 'horario_funcionamento',
      valor: 'Dom 10h | Qua 19h30 | Sex 19h',
      descricao: 'Horários dos cultos',
    },
    {
      chave: 'pix',
      valor: 'igrejavida@cnpj.com',
      descricao: 'Chave PIX para dízimos e ofertas',
    },
    {
      chave: 'pix_inscricao',
      valor: '',
      descricao: 'Chave PIX para inscrições em eventos',
    },
    {
      chave: 'instagram',
      valor: '@igrejavida',
      descricao: 'Perfil do Instagram',
    },
    { chave: 'youtube', valor: '@igrejavida', descricao: 'Canal do YouTube' },
    {
      chave: 'nome_igreja',
      valor: 'Igreja Vida',
      descricao: 'Nome da igreja (usado no QR Code PIX)',
    },
    {
      chave: 'cidade',
      valor: 'Sao Paulo',
      descricao: 'Cidade da igreja (usado no QR Code PIX)',
    },
  ]

  for (const config of configuracoes) {
    await prisma.configuracao.create({ data: config })
  }

  const senhaHash = await bcrypt.hash('admin123', 10)
  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@igrejavida.com.br',
      senha: senhaHash,
      role: 'admin',
    },
  })

  console.log('Seed criado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
