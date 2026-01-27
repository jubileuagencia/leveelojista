Com base na metodologia combinada das fontes (Arthur Marquez, Empreendedor Serial e Renato Asse), aqui está o roadmap completo para construir um aplicativo profissional usando o **Google Antigravity** (ou ferramentas similares de *Vibe Coding*).  
O segredo não é apenas "pedir para a IA fazer", mas estruturar o ambiente para que ela trabalhe com **regras, contexto e habilidades pré-definidas**.

### Roadmap: Construção de App com Antigravity

#### Fase 1: "Afiar o Machado" (Planejamento Obrigatório)

Antes de abrir o Antigravity, você precisa definir o que será construído. Pular esta etapa é a principal causa de projetos falhos ("Frankensteins").

* **Crie o PRD (Documento de Requisitos do Projeto):**  
* Não envie prompts amadores como "crie um app de fotos". Use um **PRD** que contenha: objetivo, funcionalidades, estrutura do banco de dados, fluxo de telas e histórias de usuário 1, 2\.  
* **Ferramenta:** Use o *Vibe Planner* ou um agente de IA específico para gerar esse documento técnico para você. O PRD transforma "sorte" em "método" 3, 4\.

#### Fase 2: Configuração do "Cérebro" do Antigravity

O Antigravity é um fork do VS Code turbinado pelo Google. Para ele funcionar melhor que 99% dos usuários, você deve instalar **Skills** e **Design Systems** antes de codar 5, 6\.

* **Instale e Configure o Antigravity:**  
* Baixe e instale a ferramenta. Instale a extensão de tradução para português se necessário 7\.  
* Conecte ao GitHub para versionamento desde o primeiro dia 8\.  
* **Implemente as "Skills" (O conceito "I Know Kung Fu"):**  
* **O que é:** Arquivos que ensinam o agente a realizar tarefas complexas sem precisar raciocinar do zero toda vez (ex: "Como criar uma autenticação segura") 6, 9\.  
* **Como fazer:** Crie a estrutura de pastas: .agent/skills/NomeDaSkill. Dentro dela, crie um arquivo skill.md com as instruções passo a passo, boas práticas e templates de código 10\.  
* **Dica Pro:** Você pode criar uma skill que "ensina a criar outras skills" baseada em projetos que deram certo 11\.  
* **Implemente o Design System (Regras Visuais):**  
* **Problema:** Sem regras, a IA cria botões e cards diferentes a cada tela, deixando o app com "cara de amador" 12, 13\.  
* **Solução:** Crie um arquivo (ex: design-system.md) contendo tokens semânticos (cores, espaçamentos, tipografia, regras de botões). Coloque esse arquivo nas configurações de regras (*customizations/rules*) do Antigravity ou na raiz do projeto 14, 15\.  
* **Automação:** Peça para a IA gerar esse Design System inicial baseado em uma identidade visual que você goste ou usando um prompt específico de geração de tokens 16, 17\.

#### Fase 3: Desenvolvimento do Frontend (Visual)

Agora que o ambiente tem regras (Skills e Design System), comece a construção.

* **Gere a Base do Projeto:**  
* Solicite a criação de um projeto (ex: Next.js com Tailwind CSS). A IA entende muito bem essa stack 18, 19\.  
* Use o terminal integrado (npm run dev) e o *Simple Browser* do Antigravity para visualizar o app em tempo real ao lado do código 20, 21\.  
* **Crie os Componentes com Referência:**  
* Ao pedir para criar uma tela ou componente (ex: Card de Produto), **sempre referencie o Design System**.  
* **Exemplo de Prompt:** "Crie um card de usuário seguindo rigorosamente os tokens do @design-system.md" 22, 23\.  
* Isso garante que bordas, sombras e cores sejam idênticas em todo o aplicativo, mesmo que você mude de conversa (chat) com a IA 24, 25\.  
* **Validação Visual (Dados MOC):**  
* Nesta etapa, não conecte o banco de dados ainda. Peça para a IA usar dados fictícios (MOC) para validar se a navegação e o layout estão corretos 26\.  
* Checklist: Todas as telas existem? A navegação funciona? O design está consistente? 27\.

#### Fase 4: Backend e Integrações (O Motor)

Com o visual aprovado, conecte a lógica real.

* **Autenticação Rápida (Hack de Produtividade):**  
* Não perca tempo criando sistemas de login do zero. Use a **Clerk** (camada de autenticação).  
* Crie uma *Skill* de autenticação com Clerk ou forneça a documentação para o Antigravity. Ele integra o login, cadastro e recuperação de senha automaticamente 28, 29\.  
* **Conexão com Banco de Dados e Lógica:**  
* Use o **Supabase** para o banco de dados (PostgreSQL). Ele é robusto e permite escala 30, 31\.  
* Se precisar de automações complexas (ex: disparar e-mail, processar dados com outra IA), use o protocolo **MCP (Model Context Protocol)** para conectar o Antigravity ao **N8N** 32\.  
* Exemplo: O Antigravity pode "conversar" com seus fluxos do N8N para buscar vídeos no YouTube ou processar dados sem você sair do editor 33, 34\.  
* **Paralelismo (Agent Manager):**  
* Use o *Agent Manager* do Google para rodar tarefas em paralelo. Enquanto um agente cria o código da página de perfil, outro agente pode estar escrevendo a documentação ou pesquisando concorrentes 35\.

#### Fase 5: Refinamento e Deploy

A etapa final é onde o app se torna profissional.

* **Correção e Testes (Ciclo 90%):**  
* A maior parte do tempo será gasta corrigindo erros. Use o chat para pedir planos de correção para bugs teimosos ("Crie um plano para corrigir o erro X, depois execute") 36\.  
* Teste fluxos críticos: O usuário consegue deletar a conta? O pagamento bloqueia o acesso se falhar? 37\.  
* **Publicação (Deploy):**  
* Para projetos rápidos/simples: Use o **Horizons** (da Hostinger) ou Vercel. Conecte seu repositório GitHub e publique com um clique 38, 39\.  
* Se estiver usando GitHub desde o início (Fase 2), cada atualização no código (commit) atualizará automaticamente seu site no ar 40\.

### Resumo das Ferramentas Recomendadas no Roadmap

Etapa,Ferramenta Principal,Função,Fonte  
Planejamento,Vibe Planner / ChatGPT,Criar o PRD,3  
IDE / IA,Google Antigravity,Editor de código com IA,5  
Consistência,Arquivo .md (Skills/Design),Ensinar regras e design à IA,"10, 22"  
Auth,Clerk,Login/Cadastro pronto,28  
Backend,Supabase / N8N (via MCP),Banco de dados e Automação,"30, 32"  
Hospedagem,Vercel ou Horizons,Colocar o site no ar,"38, 41"  
