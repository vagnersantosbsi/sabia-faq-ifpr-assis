<template>
    <div class="chat-container">
        <div class="background-image"></div>
        <div class="chat-box">
            <div v-for="message in mensagensVisiveis" :key="message.id" :class="{
                'user-message': message.sender === 'user',
                'ai-message': message.sender === 'model',
                message: true,
                clearfix: true,
            }" ref="messageElements">
                <div v-html="message.text"></div>

                <!-- {{ message.text }} -->
            </div>
            <div v-if="loading" class="loading-indicator">
                Aguarde... ⏳
            </div>
        </div>
        <div class="input-area">
            <textarea v-model="userInput" placeholder="Digite sua mensagem..." rows="3"></textarea>
            <button @click="sendMessage">Enviar</button>
        </div>
    </div>
</template>

<script>
// import { ref, onMounted } from 'vue';
//import { ref, onMounted, nextTick } from 'vue';
import { ref, onMounted, nextTick, computed } from 'vue'; // Importe 'computed' aqui

import { GoogleGenerativeAI } from '@google/generative-ai';

//import axios from 'axios';


export default {
    setup() {
        const userInput = ref('');
        const chatBox = ref(null);
        const messageElements = ref([]); // Referências para cada elemento de mensagem
        const loading = ref(false); // Variável para controlar o loading

        const history = [
            // ... outros prompts internos
        ];

        var messages = ref([
            {
                id: 0,
                sender: 'user',
                text: 'Pssssiu! 🐦 Sou o Sabiá, e cheguei voando para te ajudar no Processo Seletivo do IFPR Campus Assis Chateaubriand! O que te traz por aqui? 😉',
            },

        ]);
        //const messages = ref([]); // Inicie o array vazio

        const API_KEY = 'AIzaSyAZiRcKQnUxl8KmDmux1KUreqnjRD_10Ew';
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Substitua pelo modelo desejado

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain',
        };

        const sendMessage = async () => {
            if (userInput.value.trim() === '') return;

            var edital1 = `Edital N°87, de 20 de setembro de 2024 PROCESSO SELETIVO IFPR 2025 - CURSOS TÉCNICOS INTEGRADOS AO ENSINO MÉDIO

                        O Reitor do Instituto Federal de Educação, Ciência e Tecnologia do Paraná, no uso da competência que lhe confere o Decreto de 06 de fevereiro de 2024, publicado no Diário Oficial da União no dia 07 de fevereiro de 2024, seção 2, página 01, torna público as normas que regem o Processo Seletivo IFPR 2025 para ingresso nos Cursos Técnicos Integrados ao Ensino Médio, na modalidade presencial, ofertados para o ano de 2025, considerando a política de inclusão do IFPR para o ingresso de estudantes nos cursos. As inscrições estarão abertas de 03 de outubro a 01 de novembro de 2024.

                        BASE LEGAL

                        Lei nº 9.394, de 20 de dezembro de 1996 - Estabelece as diretrizes e bases da educação nacional.

                        Decreto nº 3.298, de 20 de dezembro de 1999 - Regulamenta a Lei no 7.853, de 24 de outubro de 1989, dispõe sobre a Política Nacional para a Integração da Pessoa Portadora de Deficiência, consolida as normas de proteção, e dá outras providências.

                        Decreto nº 5.296, de 02 de dezembro de 2004 - Regulamenta as Leis nos 10.048, de 8 de novembro de 2000, que dá prioridade de atendimento às pessoas que especifica, e 10.098, de 19 de dezembro de 2000, que estabelece normas gerais e critérios básicos para a promoção da acessibilidade das pessoas portadoras de deficiência ou com mobilidade reduzida, e dá outras providências.

                        Decreto nº 6.593/2008 - Regulamenta o art. 11 da Lei no 8.112, de 11 de dezembro de 1990, quanto à isenção de pagamento de taxa de inscrição em concursos públicos realizados no âmbito do Poder Executivo federal.

                        Lei nº 12.711, de 29 de agosto de 2012 - Dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio e dá outras providências.

                        Lei nº 12.764, de 27 de dezembro de 2012 - Institui a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista; e altera o § 3º do art. 98 da Lei nº 8.112, de 11 de dezembro de 1990.

                        Decreto nº 7.824, de 11 de outubro de 2012 - Regulamenta a Lei nº 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

                        Lei nº 13.146, de 06 de julho de 2015 - Institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência).

                        Lei nº 13.409, de 28 de dezembro de 2016 - Altera a Lei nº 12.711, de 29 de agosto de 2012, para dispor sobre a reserva de vagas para pessoas com deficiência nos cursos técnico de nível médio e superior das instituições federais de ensino.

                        Decreto nº 9.034, de 20 de abril de 2017 - Altera o Decreto n º 7.824, de 11 de outubro de 2012, que regulamenta a Lei n º 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

                        Lei nº 14.126 de 22 de março de 2021 - Classifica a visão monocular como deficiência sensorial, do tipo visual.

                        Decreto nº 11.016/2022 - Regulamenta o Cadastro Único para Programas Sociais do Governo Federal, instituído pelo art. 6º-F da Lei nº 8.742, de 7 de dezembro de 1993.

                        Lei nº 14.723 de 13 de novembro de 2023 - Altera a Lei nº 12.711, de 29 de agosto de 2012, para dispor sobre o programa especial para o acesso às instituições federais de educação superior e de ensino técnico de nível médio de estudantes pretos, pardos, indígenas e quilombolas e de pessoas com deficiência, bem como daqueles que tenham cursado integralmente o ensino médio ou fundamental em escola pública.

                        Decreto nº 11.781 de 14 de novembro de 2023 - Altera o Decreto nº 7.824, de 11 de outubro de 2012, que regulamenta a Lei nº 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

                        Decreto Nº 11.864, de 27 de dezembro de 2023 - Dispõe sobre o valor do salário mínimo a vigorar a partir de 1º de janeiro de 2024.

                        Portaria Normativa MEC nº 18, de 11 de outubro de 2012 - Dispõe sobre a implementação das reservas de vagas em instituições federais de ensino de que tratam a Lei no 12.711, de 29 de agosto de 2012, e o Decreto no 7.824, de 11 de outubro de 2012.

                        Portaria Normativa nº 2.027 de 16 de novembro de 2023 - Altera a Portaria Normativa MEC nº 18, de 11 de outubro de 2012, que dispõe sobre a implementação das reservas de vagas em instituições federais de ensino de que tratam a Lei nº 12.711, de 29 de agosto de 2012, e a Portaria Normativa MEC nº 21, de 5 de novembro de 2012, que dispõe sobre o Sistema de Seleção Unificada - Sisu.

                        Resolução Consup/IFPR nº 190/2024 – Dispõe sobre a Organização Didático-Pedagógica dos Cursos Técnicos de Nível Médio na modalidade presencial do Instituto Federal de Educação, Ciência e Tecnologia do Paraná.

                        Resolução Consup/IFPR nº 55/2011 – Dispõe sobre a Organização Didático Pedagógica da Educação Superior no âmbito do Instituto Federal do Paraná – IFPR.

                        DAS DISPOSIÇÕES PRELIMINARES

                        1.1. Os Cursos Técnicos Integrado ao Ensino Médio, objeto deste certame, são públicos, gratuitos e presenciais, devendo o(a) candidato(a) ter disponibilidade de tempo para realizar atividades no contraturno e/ou aos sábados, conforme o calendário acadêmico do campus e o projeto pedagógico do curso.

                        1.1.1 Para acessar tutoriais em vídeo sobre o processo seletivo (com acessibilidade), utilize o endereço eletrônico https://ifpr.edu.br/estude-conosco/processo-seletivo-2025/tutoriais/.

                        1.1.2 Para acessar formulários e outros documentos editáveis, utilize o endereço eletrônico https://ifpr.edu.br/estude-conosco/processo-seletivo-2025/documentos/.

                        1.1.3 Para acessar o Portal do Candidato do IFPR, utilize o endereço eletrônico https://portaldocandidato.ifpr.edu.br/.

                        1.2. Ao término do curso, o estudante fará jus, com apenas uma matrícula, ao diploma de Ensino Médio com uma habilitação profissional técnica.

                        1.3. Para ingresso nos Cursos Técnicos Integrados ao Ensino Médio o candidato deverá ter concluído, imprescindivelmente, o Ensino Fundamental e ter, no máximo, 17 anos, até a data da matrícula.

                        1.4. O processo seletivo será realizado em uma única etapa, que consistirá na classificação do(a) candidato(a) pelo seu desempenho (notas/conceitos) nas disciplinas de Língua Portuguesa e Matemática do 7º (sétimo) e do 8º (oitavo) anos do Ensino Fundamental, conforme indicado no item 6, deste Edital.

                        1.4.1. Para os candidatos aos cursos técnicos integrados ao Ensino Médio que tenham cursado o Ensino Fundamental em outro país será considerada a nota/conceito obtido na língua materna do país de origem, em substituição a Língua Portuguesa.

                        1.5 É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação de todos os atos, editais e comunicados referentes ao Processo Seletivo regido por este edital.

                        1.6 O(A) candidato(a) que se inscrever pelo Sistema de Ações Afirmativas (cotas) automaticamente autoriza a divulgação dos resultados do Processo Seletivo referente a este edital de acordo com a classificação gerada pelo Sistema de Ações Afirmativas (cotas), nos termos da Lei nº 12.711, de 29 de agosto de 2012, do Decreto nº 7.824, de 11 de outubro de 2012, da Portaria Normativa MEC nº 18, de 11 de outubro de 2012, da Lei nº 13.409, de 28 de dezembro de 2016, do Decreto nº 9.034, de 20 de abril de 2017, da Lei nº 14.723 de 13 de novembro de 2023, do Decreto nº 11.781 de 14 de novembro de 2023 e da Portaria Normativa nº 2.027 de 16 de novembro de 2023.

                        1.7 O(A) candidato(a) deverá possuir Carteira de Identidade(CI) e CPF para participar do referido processo seletivo.

                        1.8 Serão considerados documentos de identificação: Carteira de Identidade expedida pelas Secretarias de Segurança Pública, pelas Forças Armadas Brasileiras, por países que possuem acordos diplomáticos com o Brasil, Polícias Militares, Ordens ou Conselhos que, por Lei Federal, tenha validade como documento de identidade e possibilite a conferência da foto e da assinatura; Carteira de Identidade Nacional - CIN; Carteira de Trabalho e Previdência Social(CTPS); Passaporte; ou Carteira Nacional de Habilitação com fotografia – na forma da Lei nº 9.503/97 e o Documento de Identidade Nacional de Estrangeiro (Carteira de Registro Nacional Migratório - CRNM).

                        1.8.1. A CTPS Digital apenas tem validade como documento para fins de acompanhamento do contrato de trabalho, não sendo válida como documento de identificação.

                        1.9 Ao se inscrever para este Processo Seletivo, o(a) candidato(a) declara conhecer e aceitar todas as condições descritas neste edital. Declara, ainda, estar ciente de que qualquer omissão ou falsidade, bem como o não atendimento das exigências impostas, culminará com a sua desclassificação do processo.

                        DA FORMA DE OFERTA

                        2.1 Os Cursos Técnicos Integrados ao Ensino Médio ofertados neste Edital, na modalidade presencial, são caracterizados pelas formas de oferta integrada – oferecida a quem já tenha concluído o Ensino Fundamental. Os cursos são organizados de modo que o estudante, a partir de única matrícula no IFPR, conclua o Ensino Médio juntamente a uma habilitação profissional técnica de nível médio.

                        2.1.1. O calendário letivo, com datas de início e término do ano letivo, será divulgado no site de cada câmpus do IFPR, considerando suas especificidades.

                        DOS CURSOS E VAGAS

                        3.1 A distribuição das vagas nos diversos cursos e campi do IFPR e nas diferentes ações afirmativas (cotas de inclusão) e ampla concorrência encontram-se, respectivamente, no Anexo I e no Anexo II deste Edital.

                        3.2 O total das vagas ofertadas para cada curso e turma será disponibilizado da seguinte forma:

                        3.2.1 60% (sessenta por cento) do total das vagas ofertadas para cada curso e turma, para cursos com forma de oferta integrada, são reservadas aos candidatos que tenham cursado integralmente o Ensino Fundamental em escolas públicas do Brasil, em cursos regulares ou no âmbito da modalidade de Educação de Jovens e Adultos (EJA), ou tenham obtido certificado de conclusão com base no resultado do exame nacional para certificação de competências de jovens e adultos(Encceja) ou de exames de certificação de competência ou de avaliação de jovens e adultos realizados pelos sistemas estaduais de ensino. Esse percentual será distribuído da seguinte maneira:

                        3.2.1.1 50% (cinquenta por cento) serão destinados aos candidatos que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário - mínimo nacional per capita (R$ 1.412,00), havendo reserva de vagas para candidatos:

                        3.2.1.1.1 BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas.

                        3.2.1.1.2 BR-EP-Q - Autodeclarados quilombolas.

                        3.2.1.1.3 BR-EP-PCD - Pessoas com deficiência.

                        3.2.1.1.4 BR-EP - Demais candidatos.

                        3.2.1.2 50% (cinquenta por cento) serão destinados aos candidatos que, independentemente de renda familiar, havendo reserva de vagas para candidatos:

                        3.2.1.2.1 EP-PPI - Autodeclarados pretos, pardos ou indígenas.

                        3.2.1.2.2 EP-Q - Autodeclarados quilombolas.

                        3.2.1.2.3 EP-PCD - Pessoas com deficiência.

                        3.2.1.2.4 EP - Demais candidatos

                        3.3.1 IFPR-PPI - 10% (dez por cento) do total das vagas ofertadas para cada curso e turma são reservadas aos candidatos autodeclarados pretos, pardos ou indígenas.

                        3.3.2 IFPR-PCD - 5% (cinco por cento) do total das vagas ofertadas para cada curso e turma são reservadas aos candidatos com deficiência.

                        3.3.3 25% (vinte por cento) do total das vagas ofertadas para cada curso e turma são reservadas à Ampla Concorrência (AC). Nesta forma de oferta estão incluídos estudantes que estudaram qualquer tempo em escolas particulares mesmo sendo bolsistas.

                        3.4 Os Processos Seletivos do IFPR realizam reserva de vagas através do Sistema de Ações Afirmativas (cotas), estabelecidas nos termos da Lei nº 12.711, de 29 de agosto de 2012, do Decreto nº 7.824, de 11 de outubro de 2012, da Portaria Normativa MEC nº 18, de 11 de outubro de 2012, da Lei nº 13.409, de 28 de dezembro de 2016, do Decreto nº 9.034, de 20 de abril de 2017, da Lei nº 14.723 de 13 de novembro de 2023, do Decreto nº 11.781 de 14 de novembro de 2023 e da Portaria Normativa nº 2.027 de 16 de novembro de 2023 mediante a comprovação das respectivas condições por meio de documentos.

                        3.4.1 O cálculo para a distribuição de vagas, seus possíveis arredondamentos e redistribuições, segue o disposto na Portaria MEC nº 2027 de 16 de novembro de 2023, o que pode fazer com que algumas ações afirmativas (cotas), bem como a ampla concorrência não atendam exatamente os percentuais indicados.

                        3.4.2 A base para a distribuição de vagas em cada ação afirmativa (cota) e na Ampla Concorrência encontra-se no Anexo II deste edital.

                        3.4.3. Candidatos(as) estrangeiros, que não sejam naturalizados, ou que tenham feito parte de seu estudo no exterior, não poderão participar do processo seletivo na reserva de vagas para estudantes de escola pública, devendo, portanto, responder NÃO à pergunta de número 1 (um) do Questionário Socioeconômico no momento da inscrição.

                        3.5. As ações afirmativas às quais o(a) candidato(a) poderá concorrer durante o processo seletivo serão definidas mediante preenchimento de questionário socioeconômico, durante a realização da inscrição.

                        3.5.1. O questionário socioeconômico a que se refere o item 3.5 possuirá as seguintes questões:

                        a) QUESTÃO 01 - Você concluiu TODA a etapa de ensino anterior à modalidade de curso para a qual está se inscrevendo em uma instituição pública?

                        b) QUESTÃO 02 - De acordo com as condições estabelecidas no edital do processo seletivo, a sua renda per capta familiar é igual ou inferior a 1 salário mínimo atualmente? (Renda familiar per capita é calculada dividindo-se o total de renda familiar pelo número de moradores de uma residência).

                        c) QUESTÃO 03 - Você se identifica como pessoa preta, parda ou indígena?

                        d) QUESTÃO 04 - Você é membro ou reside em alguma comunidade remanescente de quilombo?

                        e) QUESTÃO 05 - Você possui alguma deficiência que se enquadra nas condições estabelecidas no edital do processo seletivo para o qual está se inscrevendo e que pode ser comprovada por meio de laudo médico?

                        3.6. As vagas da Ampla Concorrência são destinadas a todos(as) os(as) candidatos(as) que se julgarem aptos(as) a participar do certame, independentemente da condição social, racial, de deficiência ou de terem cursado o ensino fundamental em escola pública ou privada.

                        3.7. Quando ocorrer a existência de vagas em uma determinada ação afirmativa (cota) e a falta de candidatos inscritos para ocupá-las, ocorrerá a convocação de candidatos de outras listas de concorrência, a partir da migração da referida vaga, respeitando a ordem constante no Anexo III.

                        DO SISTEMA DE AÇÕES AFIRMATIVAS (COTAS)

                        4.1 Cotas para Escola Pública

                        4.1.1. Os(As) candidatos(as) inscritos(as) por alguma ação afirmativa de escola pública devem apresentar, no momento da matrícula, histórico escolar por meio do qual comprovem ter cursado e concluído todo o ensino fundamental (1º ao 9º anos ou outra forma prevista em Lei) exclusivamente na rede pública de ensino do Brasil.

                        4.1.2. Não poderá ser matriculado(a), nas vagas reservadas para as ações Afirmativas (cotas) de Escola Pública, o(a) candidato(a) que tenha cursado o ensino fundamental, integralmente ou em parte, em escolas particulares, inclusive com bolsa de estudos parcial ou integral (Art. 5º, Inciso II b, § 1º da Portaria Normativa nº 18 de 2012). Identificadas disciplinas isoladas realizadas na rede privada de ensino, o(a) candidato(a) também estará impossibilitado(a) de se matricular nestas vagas.

                        4.1.3. De acordo com o Art. 19, inciso I da Lei nº 9.394, de 20 de dezembro de 1996, considera-se Escola Pública a instituição criada ou incorporada, mantida e administrada pelo poder público. As escolas pertencentes ao Sistema S (SENAI, SESI, SENAC), escolas conveniadas, escolas filantrópicas ou, ainda, fundações ou instituições similares (mesmo que mantenham educação gratuita) não são consideradas instituições da rede pública de ensino.

                        4.1.4 Caso, no momento da matrícula, o documento a que se refere o item 4.1.1 não seja apresentado ou não comprove a condição de o estudante ter realizado todo o Ensino Fundamental em escola pública, requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

                        4.1.4.1 Ocorrendo a situação prevista no item 4.1.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VIII que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

                        4.1.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.1.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

                        4.2. Cotas para Baixa Renda

                        4.2.1. Os(As) candidatos(as) inscritos(as) por alguma ação afirmativa de Baixa Renda deverão comprovar renda familiar bruta igual ou inferior a 1(um) salário-mínimo per capita (equivalente a R$ 1.412,00, de acordo com o DECRETO Nº 11.864, DE 27 DE DEZEMBRO DE 2023).

                        4.2.2. Para atendimento da condição de baixa renda, deve-se considerar:

                        a) Família: a unidade nuclear composta por uma ou mais pessoas, eventualmente ampliada por outras pessoas que contribuam para o rendimento ou tenham suas despesas atendidas por aquela unidade familiar, todas moradoras em um mesmo domicílio;

                        b) Morador: a pessoa que tem o domicílio como local habitual de residência e nele reside na data de inscrição do estudante no processo seletivo da instituição federal de ensino;

                        c) Renda familiar bruta mensal: a soma dos rendimentos brutos auferidos por todas as pessoas da família, calculada na forma do disposto no Art. 7º da Portaria Normativa nº 18/2012 do MEC.

                        d) Renda familiar bruta mensal per capita: a razão entre a renda familiar bruta mensal e o total de pessoas da família, calculada na forma do art. 7º da Portaria Normativa Nº 18, de 11 de outubro de 2012 - MEC.

                        4.2.3. No momento da matrícula, os documentos comprobatórios para análise da renda deverão ser referentes aos 3 meses anteriores ao período de inscrições (julho, agosto e setembro de 2024).

                        4.2.3.1 Os documentos a que se refere o item 4.2.3 constam no Anexo VII e deverão ser enviados, em um único arquivo, através do Portal do Candidato do IFPR no item “Documentos Comprobatórios de Renda”.

                        4.2.4. Caso, no momento da matrícula, os documentos a que se refere o item 4.2.3 não sejam apresentados ou não comprovem a condição de renda requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

                        4.2.4.1 Ocorrendo a situação prevista no item 4.2.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VIII que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

                        4.2.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.2.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

                        4.3 Cotas para Pretos, Pardos ou Indígenas

                        4.3.1. Os(As) candidatos(as) inscritos(as) e preliminarmente aprovados em alguma ação afirmativa de Pretos, Pardos ou Indígenas serão convocados(as), obrigatoriamente, a passar pelo procedimento de heteroidentificação, por meio de edital próprio.

                        4.3.2. O procedimento de heteroidentificação será realizado anteriormente à fase de matrícula.

                        4.3.2.1. Para os candidatos autodeclarados indígenas, quando convocados para a heteroidentificação, deverão apresentar:

                        a) cópia digitalizada do RANI (Registro de Nascimento Indígena); e/ou

                        b) declaração de residência/pertencimento à comunidade indígena assinada por 3 (três) autoridades indígenas, com os respectivos contatos telefônicos das 3 (três) autoridades conforme Anexo X; e/ou

                        c) histórico escolar emitido por escola indígena.

                        4.3.2.2 As demais orientações para a realização do procedimento de heteroidentificação estarão descritas em edital específico a ser publicado conforme cronograma do item 5.

                        4.3.3. Caso, após o procedimento de heteroidentificação, seja indeferida a autodeclaração como pessoa preta, parda ou indígena, o(a) candidato(a) somente poderá ser convocado em qualquer das chamadas, pela Ampla Concorrência e ou por outras ações afirmativas (cotas) que não sejam direcionadas a pessoas pretas, pardas ou indígenas.

                        4.4 Cotas para Pessoa com Deficiência

                        4.4.1. Considerar-se-á Pessoa com Deficiência (PcD) aquela que possui impedimento de longo prazo, de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais barreiras, pode obstruir sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas, conforme artigo 2º da Lei nº 13.146, de 06 de julho de 2015, e a pessoa com transtorno do espectro autista, de acordo com art. 1º, § 2 o da Lei nº 12.764, de 27 de dezembro de 2012.

                        4.4.2. Os(As) candidatos(as) inscritos(as) pelo Sistema de Ações Afirmativas (cota) Pessoa com Deficiência deverão se enquadrar:

                        a) No art. 4º do Decreto nº 3.298, de 20 de dezembro de 1999, atualizado pelo art. 5º, § 1º, inciso I, do Decreto nº 5.296, de 02 de dezembro de 2004, o qual apresenta as seguintes definições:

                        I - deficiência física: alteração completa ou parcial de um ou mais segmentos do corpo humano, acarretando o comprometimento da função física, apresentando-se sob a forma de paraplegia, paraparesia, monoplegia, monoparesia, tetraplegia, tetraparesia, triplegia, triparesia, hemiplegia, hemiparesia, ostomia, amputação ou ausência de membro, paralisia cerebral, nanismo, membros com deformidade congênita ou adquirida, exceto as deformidades estéticas e as que não produzam dificuldades para o desempenho de funções;

                        II - deficiência auditiva: perda bilateral, parcial ou total, de quarenta e um decibéis (dB) ou mais, aferida por audiograma nas frequências de 500Hz, 1.000Hz, 2.000Hz e 3.000Hz;

                        III - deficiência visual: cegueira, na qual a acuidade visual é igual ou menor que 0,05 no melhor olho, com a melhor correção óptica; a baixa visão, que significa acuidade visual entre 0,3 e 0,05 no melhor olho, com a melhor correção óptica; os casos nos quais a somatória da medida do campo visual em ambos os olhos for igual ou menor que 60º; ou a ocorrência simultânea de quaisquer das condições anteriores; visão monocular como deficiência sensorial, do tipo visual (conforme definido na lei nº 14.126 de 22 de março de 2021) .

                        IV - deficiência intelectual: funcionamento intelectual significativamente inferior à média, com manifestação antes dos dezoito anos e limitações associadas a duas ou mais áreas de habilidades adaptativas, tais como: 1. comunicação; 2. cuidado pessoal; 3. habilidades sociais; 4. utilização dos recursos da comunidade; 5. saúde e segurança; 6. habilidades acadêmicas; 7. lazer; e 8. trabalho;

                        V - deficiência múltipla - associação de duas ou mais deficiências.

                        b) No art. 1º, § 1º, incisos I e II, e § 2º, da Lei nº 12.764, de 27 de dezembro de 2012, que apresenta as seguintes definições acerca do Transtorno do Espectro Autista: § 1º Para os efeitos desta Lei, é considerada pessoa com transtorno do espectro autista aquela portadora de síndrome clínica caracterizada na forma dos seguintes incisos I ou II:

                        I - deficiência persistente e clinicamente significativa da comunicação e da interação sociais,manifestada por deficiência marcada de comunicação verbal e não verbal usada para interação social; ausência de reciprocidade social; falência em desenvolver e manter relações apropriadas ao seu nível de desenvolvimento;

                        II - padrões restritivos e repetitivos de comportamentos, interesses e atividades, manifestados por comportamentos motores ou verbais estereotipados ou por comportamentos sensoriais incomuns; excessiva aderência a rotinas e padrões de comportamento ritualizados; interesses restritos e fixos. § 2º A pessoa com transtorno do espectro autista é considerada pessoa com deficiência, para todos os efeitos legais.

                        4.4.3. O(A) candidato(a) aprovado(a) nas vagas reservadas para Pessoas com Deficiência deverá apresentar, no momento da matrícula através do Portal do Candidato do IFPR, laudo médico assinado por médico responsável que ateste alguma das condições descritas no item 4.4.2.

                        4.4.3.1. O laudo médico deverá:

                        a) Conter a classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID);

                        b) Relatar a deficiência do candidato, que deverá se enquadrar em uma das categorias mencionadas no item 4.4.2;

                        c) Ser emitido em papel timbrado e conter carimbo com o CRM e assinatura do médico.

                        4.4.3.2. O(A) candidato(a) inscrito(a) nas vagas reservadas para Pessoas com Deficiência autoriza a utilização pelo IFPR do laudo médico entregue no momento da matrícula.

                        4.4.4. Caso, no momento da matrícula, os documentos a que se refere o item 4.2.3 não sejam apresentados ou não comprovem a condição de renda requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

                        4.4.4.1 Ocorrendo a situação prevista no item 4.4.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VIII que deverá ser preenchido e enviado ao e-mail: recursos@ifpr.edu.br.

                        4.4.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.4.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

                        4.4.5. Caso seja constatada inexatidão ou irregularidade de informações, ainda que posteriormente ao processo seletivo e/ou à matrícula, o(a) candidato(a) será eliminado(a) do Processo Seletivo, declarando-se nulos todos os atos decorrentes de sua inscrição.

                        4.5 Cotas para Quilombolas

                        4.5.1. Os(As) candidatos(as) inscritos(as) pela ação afirmativa destinada a quilombolas são aqueles que comprovem residência/pertencimento às comunidades remanescentes de quilombo.

                        4.5.2. Os(As) candidatos(as) inscritos(as) e preliminarmente aprovados em alguma ação afirmativa para quilombolas serão convocados(as), obrigatoriamente, a passar pelo procedimento de heteroidentificação, por meio de edital próprio.

                        4.5.3. O procedimento de heteroidentificação será realizado anteriormente à fase de matrícula.

                        4.5.4. Caso, após o procedimento de heteroidentificação, seja indeferida a autodeclaração como pessoa quilombola, o(a) candidato(a) somente poderá ser convocado em qualquer das chamadas, pela Ampla Concorrência e ou por outras ações afirmativas (cotas) que não sejam direcionadas a pessoas quilombolas.

                        4.5.5. O(A) candidato(a) autodeclarado Quilombola, quando da convocação para a heteroidentificação, deverá apresentar, obrigatoriamente, os seguintes documentos:

                        a) Autodeclaração étnico-racial devidamente preenchida e assinada (disponível aqui);

                        b) Cópia frente e verso de documento de identificação com foto;

                        c) Declaração de residência/pertencimento às comunidades remanescentes de quilombo assinada por 3 (três) autoridades de Associação Quilombola reconhecida pela Fundação Palmares, com os respectivos contatos telefônicos das 3 (três) autoridades conforme Anexo XI.

                        4.5.6. As comunidades remanescentes de quilombos são apenas aquelas certificadas pela Fundação Cultural Palmares, nos termos do Decreto 4.887/03, de 20/11/2003.

                        4.5.7. Demais orientações para a realização do procedimento de heteroidentificação estarão descritas em edital específico a ser publicado conforme cronograma do item 5.

                        4.6. Todos os(as) candidatos(as) optantes pelo Sistema de Ações Afirmativas (cotas) concorrerão, primeiramente, na Ampla Concorrência e, se não classificados, concorrerão em seu respectivo grupo de Ações Afirmativas (cotas), de acordo com a sequência de prioridades abaixo:

                        a) IFPR-PPI - candidatos autodeclarados pretos, pardos ou indígenas, independentemente de renda familiar e de ter cursado a etapa anterior em escola pública.

                        b) IFPR-PCD - candidatos com deficiência, independentemente de renda familiar e de ter cursado a etapa anterior integralmente em escola pública.

                        c) EP - estudantes que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        d) EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        e) EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        f) EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        g) BR-EP - candidatos que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        h) BR-EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        i) BR-EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        j) BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        4.7 Caso o curso em questão possua número de candidatos(as) igual ou inferior ao número de vagas, todos os(as) candidatos(as) constarão apenas na lista geral da Ampla Concorrência, não precisando fazer qualquer comprovação quanto às ações afirmativas para as quais foi previamente classificado.

                        DO CRONOGRAMA

                        PERÍODOS/DATAS

                        ETAPAS

                        20/09/2024

                        Publicação do Edital no site institucional

                        03/10/2024

                        01/11/2024

                        Período de inscrição on-line

                        03/10/2024

                        25/10/2024

                        Período de isenção de taxa de inscrição

                        30/10/2024

                        Divulgação da Relação Nominal com resultado preliminar do pedido de isenções concedidas

                        31/10/2024

                        31/10/2024

                        Prazo para interposição de recursos contra Relação Nominal com resultado do pedido de isenções concedidas

                        4/11/2024

                        Divulgação da Relação Nominal com resultado definitivo do pedido de isenções concedidas

                        06/11/2024

                        Prazo final para pagamento da taxa de inscrição

                        13/11/2024

                        Publicação da lista preliminar das inscrições homologadas no Processo Seletivo

                        14/11/2024

                        14/11/2024

                        Prazo para interposição de recurso referente à homologação de inscrições

                        18/11/2024

                        18/11/2024

                        Análise dos recursos contra o Resultado da lista preliminar dos inscritos no Processo Seletivo

                        19/11/2024

                        Publicação final das inscrições homologadas

                        19/11/2024

                        27/11/2024

                        Análise dos históricos

                        28/11/2024

                        Publicação da classificação preliminar

                        29/11/2024

                        29/11/2024

                        Prazo para interposição de recurso referente à classificação preliminar

                        03/12/2024

                        Publicação do resultado dos recursos referentes à classificação preliminar

                        Convocação dos candidatos inscritos nas vagas das ações afirmativas/cotas sociais para realização do processo de heteroidentificação e entrega de documentos para comprovação da condição de cotista

                        05/12/2024

                        16/12/2024

                        Bancas de heteroidentificação e análise pelas comissões dos documentos entregues

                        17/12/2024

                        Publicação do resultado preliminar da heteroidentificação e análise documental

                        19/12/2024

                        19/12/2024

                        Prazo para interposição de recurso contra o resultado preliminar da heteroidentificação e análise documental

                        20/12/2024

                        Análise dos recursos pela Coordenação de Ações Inclusivas e comissão recursal de heteroidentificação

                        23/12/2024

                        Publicação do resultado final do processo de heteroidentificação

                        23/12/2024

                        Publicação do Resultado Final do Processo Seletivo

                        Convocação para matrícula da 1o chamada

                        20/01/2025

                        24/01/2025

                        Período de matrícula para os candidatos convocados na 1o chamada.

                        28/01/2025

                        Divulgação do resultado provisório das matrículas

                        29/01/2025

                        Prazo para recurso contra o resultado provisório das matrículas

                        31/01/2025

                        Divulgação do resultado definitivo das matrículas

                        DAS INSCRIÇÕES

                        6.1 As inscrições devem ser feitas através do Portal do Candidato do IFPR que pode ser acessado através link https://portaldocandidato.ifpr.edu.br/.

                        6.1.1 Para fazer seu login no Portal do Candidato do IFPR, o candidato deverá utilizar sua conta pessoal gov.br.

                        6.1.2 Caso não possua conta gov.br, o candidato deverá realizar o seu cadastro, conforme tutorial que pode ser acessado a partir do link dos vídeos tutoriais disponível no item 1.1.1.

                        6.2 A inscrição do(a) candidato(a) implicará ciência e aceitação das normas e condições estabelecidas no inteiro teor deste edital, das quais não poderá alegar desconhecimento.

                        6.3 No ato da inscrição, o(a) candidato(a) deverá realizar integralmente o procedimento de inscrição, de modo a:

                        a) responder ao questionário a que se refere o item 3.5.1 deste Edital;

                        b) conferir e confirmar as ações afirmativas para as quais estará concorrendo;

                        c) preencher todos os demais dados solicitados;

                        d) informar a média de Língua Portuguesa e de Matemática, relativas aos 7º e 8º anos do Ensino Fundamental, conforme o histórico escolar apresentado ou conforme exame nacional para certificação de competências de jovens e adultos (Encceja).

                        e) realizar o upload do comprovante oficial de notas do Ensino Fundamental;

                        f) confirmar a inscrição.

                        6.4 O(A) candidato(a) deverá seguir as orientações dispostas no Anexo IV para indicar a sua média.

                        6.4.1 Para a indicação da média dos componentes curriculares Língua Portuguesa e Matemática devem ser considerados o sétimo e oitavo anos, como disposto no ANEXO IV.

                        6.4.2 Nos casos em que o histórico escolar expressa os resultados através de conceitos ou quaisquer outras formas de indicação, o(a) candidato(a) deverá utilizar a seguinte tabela de conversão:

                        INDICAÇÃO DE APRENDIZAGEM

                        NOTA

                        Aprovado

                        10,00

                        A ou A+

                        10,00

                        A-

                        9,00

                        B ou B+

                        8,50

                        B-

                        7,50

                        C ou C+

                        7,00

                        C-

                        6,00

                        6.4.3 Na modalidade Ensino Fundamental via Certificação do Encceja (Exame Nacional para Certificação de Competências de Jovens e Adultos), o(a) candidato(a) deverá considerar a pontuação obtida nas áreas de conhecimento Linguagens, Códigos e suas Tecnologias e Matemática e suas Tecnologias.

                        6.5 O(A) candidato(a) deve atentar-se ao correto preenchimento dos campos de notas e médias, conforme orientações do Anexo IV, a depender do caso.

                        6.6 As informações fornecidas no formulário de inscrição e o seu correto preenchimento são de responsabilidade do(a) candidato(a), dispondo o IFPR do direito de excluir do processo de ingresso aquele que não preencher a solicitação de inscrição de forma completa e correta, bem como aquele que fornecer dados comprovadamente inverídicos.

                        6.7 Após o preenchimento dos formulários o candidato deverá realizar o pagamento da taxa no valor de R$30,00 (trinta reais) ou solicitar a isenção de inscrição.

                        6.7.1 Para realizar o pagamento da taxa de inscrição, o candidato deverá gerar, no Portal do Candidato do IFPR, boleto de pagamento em nome da FUNTEF-PR - Fundação de Apoio à UTFPR.

                        6.7.2 Caso o candidato solicite isenção do valor da inscrição, deverá seguir as instruções constantes no item 7 do Edital.

                        6.7.2.1 Em caso de indeferimento no pedido de isenção, o candidato deverá pagar a taxa de inscrição, conforme dispõe os itens 6.6 e 6.6.1, respeitados os prazos constantes no cronograma deste edital.

                        DAS ISENÇÕES DE TAXA DE INSCRIÇÃO

                        7.1 A solicitação de isenção da taxa de inscrição se dará conforme o disposto no Decreto nº 6.593/2008.

                        7.2. São requisitos para o(a) candidato(a) solicitar a isenção de pagamento da taxa de inscrição:

                        a) estar inscrito(a) no Cadastro Único para Programas Sociais do Governo Federal (CadÚnico);

                        b) conforme disposto no Decreto nº 11.016/2022, ter perfil de família com renda mensal per capita (por pessoa) de até meio salário mínimo (R$ 706,00).

                        7.3. Para solicitar a isenção da taxa de inscrição, o(a) candidato(a) deverá realizar os seguintes procedimentos:

                        a) realizar sua inscrição no Portal do Candidato, conforme descrito no item 6.1;

                        b) preencher o formulário de requerimento de isenção, disponível no Anexo VI. O formulário deverá ser assinado pelo(a) responsável do(a) candidato(a);

                        c) providenciar os documentos comprobatórios solicitados no Anexo VI;

                        d) digitalizar a carteira de identificação (CI) com foto do(a) candidato(a);

                        e) enviar o formulário, a digitalização da carteira de identificação e os demais documentos comprobatórios no local indicado no Portal do Candidato.

                        7.3.1. Serão aceitos os documentos enviados até a data limite para solicitar a isenção, definida no cronograma do item 5 deste edital.

                        7.3.2. Candidatos(as) oriundos(as) da mesma família deverão preencher o formulário de requerimento de forma individual.

                        7.3.3. Não será permitido o envio de quaisquer itens/documentos por correio postal ou e-mail que não seja o formulário online disponível no Portal do Candidato.

                        7.4. Terá o seu requerimento de isenção da taxa de inscrição indeferido o(a) candidato(a) que:

                        a) não apresentar, de forma completa, a documentação exigida no item 7.3;

                        b) preencher de forma incorreta o formulário de requerimento (Anexo VI).

                        7.5. A análise das solicitações será executada pela Equipe de Assessoramento do Processo Seletivo 2025 do IFPR, que irá avaliar as informações prestadas no formulário de requerimento e demais documentos anexados.

                        7.5.1. O resultado das solicitações será publicado conforme data definida no cronograma do item 5 deste edital.

                        7.6 Caso o candidato tenha entregado os documentos corretos, mas por algum motivo seu pedido tenha sido indeferido ele poderá fazer recurso através do formulário (Anexo VIII) e enviá-lo através do e-mail recursos@ifpr.edu.br.

                        7.6.1. O recurso será avaliado pela Equipe de Assessoramento do Processo Seletivo 2025 do IFPR.

                        7.7. A concessão de isenção da taxa de inscrição é pessoal e intransferível.

                        7.8. O(A) candidato(a), cuja solicitação de isenção da taxa de inscrição for indeferida, deverá realizar o pagamento da taxa de inscrição, até a data limite, conforme orientações contidas nos itens 6.7 e 6.8.

                        DA CLASSIFICAÇÃO

                        8.1 A classificação será realizada em ordem decrescente da média gerada a partir das notas de Língua Portuguesa e Matemática informadas pelos(as) candidatos(as).

                        8.1.1 A média a que se refere o item 8.1 se dará numa escala de 0,00 (zero vírgula zero) a 10,00 (dez vírgula zero) e será calculada automaticamente pelo Portal do Candidato a partir das notas lançadas pelo(a) candidato(a).

                        8.1.2 Todos(as) os(as) candidatos(as) constarão na lista de classificação da Ampla Concorrência.

                        8.1.3 Além da lista da Ampla Concorrência, os(as) candidatos(as) constarão nas listas de todas as ações afirmativas as quais tenham sido enquadrados conforme item 3.5 deste edital.

                        8.1.4 Caso o curso em questão possua número de candidatos(as) igual ou inferior ao número de vagas, todos os(as) candidatos(as) serão classificados(as) apenas na lista geral da Ampla Concorrência.

                        8.2 No caso de empate, será considerada a seguinte regra para o desempate:

                        a) maior idade; e

                        b) persistindo o empate, sorteio.

                        8.3 Anteriormente à publicação da classificação preliminar, as médias e notas informadas serão conferidas com o comprovante oficial de notas submetido no formulário de inscrição.

                        8.3.1 Se constatado divergência nas notas ou média informada, devido ao não atendimento das orientações do Anexo IV, a média do(a) candidato(a) poderá ser recalculada pela Equipe de Assessoramento, para que sejam atendidas na íntegra as referidas orientações.

                        8.3.2 Se constatados equívocos na média ou notas informadas pelo candidato, a média final do(a) candidato(a) será ajustada com o valor correto.

                        8.3.2.1 Caso o documento oficial contendo as notas impossibilite a devida conferência, a nota do(a) candidato(a) será definida como 0 (zero).

                        DOS RESULTADOS

                        9.1. O resultado preliminar do Processo Seletivo será divulgado em data definida pelo cronograma disponível no item 5 deste edital, no Portal do Candidato (https://portaldocandidato.ifpr.edu.br/).

                        9.2. Caberá recurso contra a classificação preliminar. O recurso deverá ser protocolado de forma online através do Portal do Candidato (https://portaldocandidato.ifpr.edu.br/) em datas definidas no cronograma disponível no item 5 deste edital.

                        9.2.2. A Equipe de Assessoramento do Processo Seletivo 2025 do IFPR avaliará as informações prestadas no formulário de recurso referente à classificação, deferindo ou não o pedido.

                        9.3. O resultado final será constituído da lista geral de classificação pela ampla concorrência e por cada uma das ações afirmativas (cotas), para cada campus e curso.

                        9.3.1. A lista geral de classificação em cada uma das ações afirmativas poderá sofrer alterações durante o processo de heteroidentificação e da análise dos documentos de matrícula dos(as) candidatos(as) inscritos(as) nas ações afirmativas de Baixa Renda, PcD e Escola Pública.

                        9.4. Respeitado o disposto no item 4.6 deste edital, os candidatos aprovados dentro das vagas previstas, serão convocados para matrícula em primeira chamada.

                        9.4.1 Após as matrículas a que se refere o item 9.4 e que estão descritas no título 10, poderão ocorrer chamadas complementares, caso algum candidato previamente convocado não confirme sua matrícula.

                        DAS MATRÍCULAS

                        10.1. A matrícula será permitida ao(à) candidato(a) que apresentar toda a documentação exigida e tenha concluído o Ensino Fundamental.

                        10.2. A matrícula dos candidatos(as) aprovados(as) nas chamadas do Processo Seletivo ocorrerá respeitando as vagas disponíveis, a ordem de classificação estabelecida conforme resultado do Exame de Classificação e o Sistema de Ações Afirmativas (cotas).

                        10.3. As matrículas dos(as) candidatos(as) aprovados(as) deverão ser realizadas de forma online, exclusivamente no Portal do Candidato do IFPR(https://portaldocandidato.ifpr.edu.br/), por meio do login na conta individual de cada candidato(a).

                        10.3.1. O(A) candidato(a) deverá acessar o Portal do Candidato e realizar o upload dos documentos solicitados conforme o período definido no cronograma.

                        10.4. É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação do edital e as chamadas de candidatos(as) aprovados(as).

                        10.5. O(A) candidato(a) que não realizar sua matrícula, conforme datas e definições do edital, perderá o direito à vaga, possibilitando que o(a) próximo(a) candidato(a) da lista de classificação seja convocado(a).

                        10.5.1 Ocorrendo a situação prevista no item 10.5, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VII que deverá ser preenchido e enviado ao e-mail: recursos@ifpr.edu.br.

                        10.6. Os documentos para matrícula, comuns a todos(as) os(as) candidatos(as), são:

                        10.6.1 Carteira de identidade;

                        10.6.1.1 Se candidato(a) estrangeiro(a), em substituição ao documento previsto no item 10.6.1, deve ser apresentado: documento de identidade nacional de estrangeiro (Carteira de Registro Nacional Migratório - CRNM) ou Residência Mercosul, emitida por autoridade brasileira, válida à data da matrícula;

                        10.6.2 Certidão de nascimento ou Certidão de Casamento;

                        10.6.3 Declaração de vacinação (para candidatos com menos de 18 (dezoito) anos) emitida e assinada por profissional de saúde, atestando que o adolescente está com o seu esquema vacinal de acordo com a recomendação estabelecida no Programa Nacional de Imunização – PNI, do Ministério da Saúde e da Secretaria de Estado da Saúde;

                        10.6.4 Certificado de conclusão do Ensino Fundamental ou equivalente que comprove a conclusão do Ensino Fundamental;

                        10.6.4.1 Poderá ser apresentada Declaração de Conclusão do Ensino Fundamental, desde que, num prazo de 60 (sessenta) dias, o histórico seja apresentado à Secretaria Acadêmica do campus;

                        10.6.4.2 O candidato que realizou seus estudos em instituições estrangeiras, além da documentação e procedimentos definidos neste Edital, também deve entregar Comprovante de Conclusão de Ensino Fundamental, revalidado no Brasil na forma da lei.
                        10.6.4.2.1 É dispensada a revalidação se o comprovante de conclusão de estudos pertencer a um país integrante do Mercosul.

                        10.6.5 Formulário de Requerimento de Matrícula devidamente preenchido pelo responsável legal (conforme Anexo IX); e

                        10.6.6 Documento de Identificação do Responsável Legal.

                        10.7. Os documentos necessários para comprovação das Ações Afirmativas (cotas) de Baixa Renda, Pessoa com Deficiência e Escola Pública são:

                        10.7.1 AÇÃO AFIRMATIVA DE ESCOLA PÚBLICA: Os candidatos devem apresentar, no momento da matrícula, Histórico Escolar por meio do qual comprovem ter cursado e concluído todo o ensino fundamental (1ª a 8ª séries – regime antigo –, 1º ao 9º anos – regime novo –, modalidade Educação de Jovens e Adultos – EJA; Exame Nacional para Certificação de Competências de Jovens e Adultos – ENCCEJA – ou outra forma prevista em Lei) exclusivamente na rede pública de ensino do Brasil.

                        10.7.2 AÇÃO AFIRMATIVA DE PESSOA COM DEFICIÊNCIA: Laudo médico atestando a espécie e o grau da deficiência. O laudo deverá:

                        a) Conter a classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID);

                        b) Relatar a deficiência do candidato, que deverá se enquadrar em uma das categorias mencionadas no edital do processo seletivo;

                        c) Ser emitido em papel timbrado e conter carimbo com o CRM e assinatura do médico.

                        10.7.3 AÇÃO AFIRMATIVA DE BAIXA RENDA: documentos especificados no Anexo VII deste Edital.

                        10.8 O estudante que ingressar mediante processo seletivo tendo efetuado seu registro acadêmico, deverá realizar a confirmação de sua matrícula devendo possuir frequência a pelo menos uma das aulas previstas para os 5 (cinco) primeiros dias letivos do calendário acadêmico do campus.

                        10.8.1 A não realização da confirmação de matrícula pelo estudante ou de pessoa por ele autorizada para tal, caracterizar-se-á como desistência, o que ocasionará o cancelamento do seu registro acadêmico.

                        DAS DISPOSIÇÕES FINAIS

                        11.1. A Comissão Central do Processo Seletivo, a Equipe de Assessoramento do Processo Seletivo e o IFPR não se responsabilizam por solicitação de inscrição via internet não efetivada por motivos de ordem técnica, falhas de comunicação, congestionamento de linhas de comunicação ou quaisquer outros fatores de ordem técnica que impossibilitem a transferência dos dados ou a impressão de documentos.

                        11.2. A inscrição do(a) candidato(a) implicará a aceitação total e incondicional das normas e instruções constantes neste edital.

                        11.3. É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação dos resultados das etapas do Processo Seletivo pelo Portal do Candidato do IFPR (https://portaldocandidato.ifpr.edu.br/).

                        11.4. A inexatidão ou irregularidade de informações, ainda que constatada posteriormente ao processo seletivo e/ou à matrícula, eliminará o(a) candidato(a) do Processo de Seleção, declarando-se nulos todos os atos decorrentes de sua inscrição.

                        11.5 Após esgotadas as chamadas complementares previstas no item 9.4.1 e persistindo a existência de vagas não ocupadas, novo processo seletivo será realizado com regramento a ser publicado em edital próprio.

                        11.6 Os candidatos que não têm acesso a equipamento e/ou internet poderão dirigir-se a um dos campi do IFPR (de acordo com os endereços indicados no Anexo V), de segunda-feira a sexta-feira, no horário de funcionamento do campus, no período destinado às inscrições.

                        11.7. Os casos omissos e as situações não previstas no presente edital serão analisados pela Comissão Central do Processo Seletivo e pela Equipe de Assessoramento do Processo Seletivo.

                        Curitiba, 20 de setembro de 2024.

                        Assinado:

                        logotipo
                        Documento assinado eletronicamente por ADRIANO WILLIAN DA SILVA VIANA PEREIRA, Reitor, em 20/09/2024, às 21:20, conforme horário oficial de Brasília, com fundamento no art. 6º, caput, do Decreto nº 8.539, de 8 de outubro de 2015.

                        QRCode Assinatura
                        A autenticidade deste documento pode ser conferida no site https://sei.ifpr.edu.br/sei/controlador_externo.php?acao=documento_conferir&id_orgao_acesso_externo=0, informando o código verificador 3185070 e o código CRC 509D8EE8.

                        ANEXO I - EDITAL Nº 87, DE 20 DE SETEMBRO DE 2024

                        QUADRO DE OFERTAS DE CURSOS TÉCNICOS INTEGRADOS AO ENSINO MÉDIO

                        Campus

                        Curso

                        Nível de Ensino

                        Forma de Oferta

                        Turmas

                        Turno

                        Vagas

                        Duração do Curso

                        ASSIS CHATEAUBRIAND

                        Técnico em Agropecuária

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 3 tardes por semana)¹

                        40

                        3 anos

                        ASSIS CHATEAUBRIAND

                        Técnico em Comércio

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 1 tarde por semana)²

                        40

                        3 anos

                        ASSIS CHATEAUBRIAND

                        Técnico em Eletromecânica

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        ASSIS CHATEAUBRIAND

                        Técnico em Informática para Internet

                        Médio

                        Integrado

                        1

                        Diurno (manhã + 2 tardes por semana)¹

                        40

                        3 anos

                        ASTORGA

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        BARRACÃO

                        Técnico em Administração

                        Médio

                        Integrado

                        2

                        Matutino

                        80

                        4 anos

                        BARRACÃO

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        CAMPO LARGO

                        Técnico em Administração

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        CAMPO LARGO

                        Técnico em Agroecologia

                        Médio

                        Integrado

                        1

                        Vespertino

                        40

                        4 anos

                        CAMPO LARGO

                        Técnico em Automação Industrial

                        Médio

                        Integrado

                        1

                        Vespertino

                        40

                        4 anos

                        CAMPO LARGO

                        Técnico em Mecânica

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        CAPANEMA

                        Técnico em Cooperativismo

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        CAPANEMA

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Matutino¹

                        40

                        4 anos

                        CAPANEMA

                        Técnico em Agroecologia

                        Médio

                        Integrado

                        1

                        Diurno (manhã e tarde)¹

                        40

                        3 anos

                        CASCAVEL

                        Técnico em Edificações

                        Médio

                        Integrado

                        1

                        Diurno (manhã+duas tardes)¹

                        40

                        3 anos

                        CASCAVEL

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Diurno (manhã+duas tardes)¹

                        40

                        3 anos

                        CASCAVEL

                        Técnico em Química

                        Médio

                        Integrado

                        1

                        Diurno (manhã+duas tardes)¹

                        40

                        3 anos

                        COLOMBO

                        Técnico em Administração

                        Médio

                        Integrado

                        1

                        Matutino + duas tardes por semana¹

                        40

                        3 anos

                        COLOMBO

                        Técnico em Alimentos

                        Médio

                        Integrado

                        1

                        Vespertino

                        40

                        4 anos

                        COLOMBO

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        CORONEL VIVIDA

                        Técnico em Administração

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 2 tardes)¹

                        40

                        3 anos

                        CORONEL VIVIDA

                        Técnico em Cooperativismo

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 2 tardes)¹

                        40

                        3 anos

                        CR PONTA GROSSA

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Integral

                        35

                        4 anos

                        CR TOLEDO

                        Técnico em Informática para Internet

                        Médio

                        Integrado

                        1

                        Diurno (manhã + 2 tardes por semana)¹

                        40

                        3 anos

                        CURITIBA

                        Técnico em Administração

                        Médio

                        Integrado

                        1

                        Matutino

                        30

                        3 anos

                        CURITIBA

                        Técnico em Contabilidade

                        Médio

                        Integrado

                        1

                        Matutino

                        30

                        3 anos

                        CURITIBA

                        Técnico em Eletrônica

                        Médio

                        Integrado

                        1

                        Vespertino

                        30

                        3 anos

                        CURITIBA

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Vespertino

                        30

                        4 anos

                        CURITIBA

                        Técnico em Mecânica

                        Médio

                        Integrado

                        1

                        Vespertino

                        30

                        3 anos

                        CURITIBA

                        Técnico em Petróleo e Gás

                        Médio

                        Integrado

                        1

                        Matutino

                        30

                        3 anos

                        CURITIBA

                        Técnico em Processos Fotográficos

                        Médio

                        Integrado

                        1

                        Vespertino

                        30

                        3 anos

                        CURITIBA

                        Técnico em Programação de Jogos Digitais

                        Médio

                        Integrado

                        1

                        Matutino

                        30

                        4 anos

                        FOZ IGUAÇU

                        Técnico em Aquicultura

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 1 tarde)²

                        40

                        3 anos

                        FOZ IGUAÇU

                        Técnico em Desenvolvimento de Sistemas

                        Médio

                        Integrado

                        1

                        Integral

                        40

                        4 anos

                        FOZ IGUAÇU

                        Técnico em Edificações

                        Médio

                        Integrado

                        1

                        Integral

                        40

                        4 anos

                        FOZ IGUAÇU

                        Técnico em Meio Ambiente

                        Médio

                        Integrado

                        1

                        Integral

                        40

                        4 anos

                        GOIOERÊ

                        Técnico em Informática

                        Médio

                        Integrado

                        2

                        Matutino

                        80

                        4 anos

                        IRATI

                        Técnico em Agroecologia

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        3 anos

                        IRATI

                        Técnico em Agroecologia

                        Médio

                        Integrado

                        1

                        Vespertino

                        40

                        3 anos

                        IRATI

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        3 anos

                        IRATI

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Vespertino

                        40

                        3 anos

                        IVAIPORÃ

                        Técnico em Agropecuária

                        Média

                        Integrado

                        1

                        Diurno (Matutino + 1 tarde)²

                        35

                        3 anos

                        IVAIPORÃ

                        Técnico em Eletrotécnica

                        Médio

                        Integrado

                        1

                        Diurno (Matutino + 1 tarde)²

                        40

                        3 anos

                        IVAIPORÃ

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Diurno (Matutino + 1 tarde)²

                        40

                        3 anos

                        JACAREZINHO

                        Técnico em Alimentos

                        Médio

                        Integrado

                        1

                        Diurno

                        40

                        3,5 a 4 anos

                        JACAREZINHO

                        Técnico em Eletrotécnica

                        Médio

                        Integrado

                        1

                        Diurno

                        20

                        4 anos

                        JACAREZINHO

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Diurno

                        40

                        4 anos

                        JACAREZINHO

                        Técnico em Mecânica

                        Médio

                        Integrado

                        1

                        Diurno

                        20

                        4 anos

                        JAGUARIAÍVA

                        Técnico em Alimentos

                        Médio

                        Integrado

                        1

                        Diurno (manhã e tarde)¹

                        40

                        4 anos

                        JAGUARIAÍVA

                        Técnico em Biotecnologia

                        Médio

                        Integrado

                        1

                        Diurno (manhã e tarde)¹

                        40

                        4 anos

                        LONDRINA

                        Técnico em Biotecnologia

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        LONDRINA

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Vespertino

                        40

                        4 anos

                        PALMAS

                        Técnico em Alimentos

                        Médio

                        Integrado

                        1

                        Diurno (Vespertino + 2 manhãs por semana)¹

                        40

                        3 anos

                        PALMAS

                        Técnico em Informática para Internet

                        Médio

                        Integrado

                        1

                        Diurno (Vespertino + 2 manhãs por semana)¹

                        40

                        3 anos

                        PALMAS

                        Técnico em Serviços Jurídicos

                        Médio

                        Integrado

                        1

                        Diurno (Vespertino + 2 manhãs por semana)¹

                        40

                        3 anos

                        PARANAGUÁ

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Vespertino

                        40

                        4 anos

                        PARANAGUÁ

                        Técnico em Mecânica

                        Médio

                        Integrado

                        1

                        Diurno (tarde e manhã)¹

                        40

                        4 anos

                        PARANAGUÁ

                        Técnico em Meio Ambiente

                        Médio

                        Integrado

                        1

                        Vespertino

                        40

                        4 anos

                        PARANAGUÁ

                        Técnico em Produção Cultural

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        PARANAVAÍ

                        Técnico em Agroindústria

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        PARANAVAÍ

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        PARANAVAÍ

                        Técnico em Mecatrônica

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        PINHAIS

                        Técnico em Administração

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        PINHAIS

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        PITANGA

                        Técnico em Alimentos

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        PITANGA

                        Técnico em Cooperativismo

                        Médio

                        Integrado

                        1

                        Matutino

                        40

                        4 anos

                        QUEDAS DO IGUAÇU

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 2 tardes por semana)¹

                        38

                        3 anos

                        QUEDAS DO IGUAÇU

                        Técnico em Meio Ambiente

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 2 tardes por semana)¹

                        38

                        3 anos

                        TELÊMACO BORBA

                        Técnico em Automação Industrial

                        Médio

                        Integrado

                        1

                        Matutino/Vespertino¹

                        40

                        4 anos

                        TELÊMACO BORBA

                        Técnico em Informática para Internet

                        Médio

                        Integrado

                        1

                        Matutino/Vespertino¹

                        40

                        4 anos

                        TELÊMACO BORBA

                        Técnico em Mecânica

                        Médio

                        Integrado

                        1

                        Matutino/Vespertino¹

                        40

                        4 anos

                        TELÊMACO BORBA

                        Técnico em Programação de Jogos Digitais

                        Médio

                        Integrado

                        1

                        Matutino/Vespertino¹

                        40

                        4 anos

                        UMUARAMA

                        Técnico em Edificações

                        Médio

                        Integrado

                        1

                        Matutino/Vespertino¹

                        40

                        4 anos

                        UMUARAMA

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Matutino/Vespertino¹

                        40

                        4 anos

                        UMUARAMA

                        Técnico em Química

                        Médio

                        Integrado

                        1

                        Matutino/Vespertino¹

                        40

                        4 anos

                        UNIÃO DA VITÓRIA

                        Técnico em Informática

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 2 tardes)¹

                        40

                        3 anos

                        UNIÃO DA VITÓRIA

                        Técnico em Meio Ambiente

                        Médio

                        Integrado

                        1

                        Diurno (Manhã + 2 tardes)¹

                        40

                        3 anos

                        ¹Os cursos cujos turnos estão assinalados como sendo “Diurno (matutino e vespertino)”, “Diurno (manhã e tarde)”, “Diurno (manhã+duas tardes)”, “Matutino e Vespertino”, “Matutino + duas tardes por semana”, “Diurno”, “Matutino/Vespertino” e “Diurno (Vespertino + 2 manhãs por semana)”, “Diurno (Manhã + 2 tardes por semana)” aparecerão no Portal do Candidato do IFPR como turno “Integral”, sem prejuízo à informação deste quadro de vagas e a consequente necessidade de o estudante cumpri-la.

                        ² Os cursos cujos turnos estão assinalados como sendo “Manhã + 1 tarde por semana”,” Diurno (Manhã + 1 tarde)”, “Diurno (Matutino + 1 tarde)” aparecerão no Portal do Candidato do IFPR como turno “Matutino”, sem prejuízo à informação deste quadro de vagas e a consequente necessidade de o estudante cumpri-la.

                        ANEXO II - EDITAL Nº 87, DE 20 DE SETEMBRO DE 2024

                        DISTRIBUIÇÃO DAS VAGAS POR FAIXAS DE AÇÃO AFIRMATIVA

                        Estudantes que tenham cursado a etapa anterior integralmente em Escola Pública (60% das vagas)

                        Ações afirmativas - IFPR (15% das vagas)

                        Ampla Concorrência (25% das vagas)

                        Estudantes que possuam renda bruta familiar per capita igual ou inferior a 1 salário mínimo (30% das vagas)

                        Estudantes que possuam renda bruta familiar per capita superior a 1 salário mínimo (30% das vagas)

                        NÚMERO DE VAGAS OFERTADAS POR CAMPUS, CURSO E TURNO

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        BR-EP1

                        EP-PPI

                        EP-Q

                        EP-PCD

                        EP

                        IFPR-PPI

                        IFPR-PCD

                        AC

                        80

                        9

                        1

                        3

                        11

                        9

                        0

                        3

                        12

                        8

                        4

                        20

                        40

                        5

                        1

                        2

                        5

                        5

                        0

                        2

                        5

                        3

                        2

                        10

                        38

                        4

                        1

                        2

                        5

                        4

                        0

                        2

                        5

                        3

                        2

                        10

                        35

                        4

                        1

                        1

                        5

                        4

                        0

                        1

                        5

                        3

                        2

                        9

                        30

                        4

                        1

                        1

                        4

                        4

                        0

                        1

                        4

                        3

                        1

                        7

                        20

                        3

                        1

                        1

                        2

                        3

                        0

                        1

                        2

                        1

                        1

                        5

                        OBSERVAÇÃO: O cálculo para a distribuição de vagas, seus possíveis arredondamentos e redistribuições, seguem o disposto na Portaria MEC nº 2027 de 16 de novembro de 2023, o que pode fazer com que algumas cotas não atendam os percentuais indicados no título.

                        ANEXO III - EDITAL Nº 87, DE 20 DE SETEMBRO DE 2024

                        MAPA DE MIGRAÇÃO DAS VAGAS EM AÇÕES AFIRMATIVAS SEM CANDIDATOS APTOS A OCUPÁ-LAS

                        SOBROU VAGA AQUI

                        1º VAI PARA:

                        2º VAI PARA:

                        3º VAI PARA:

                        4º VAI PARA:

                        5º VAI PARA:

                        6º VAI PARA:

                        7º VAI PARA:

                        8º VAI PARA:

                        9º VAI PARA:

                        10º VAI PARA:

                        IFPR-PPI

                        IFPR-PCD

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        BR-EP

                        EP-PPI

                        EP-Q

                        EP-PCD

                        EP

                        AC

                        IFPR-PCD

                        IFPR-PPI

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        BR-EP

                        EP-PPI

                        EP-Q

                        EP-PCD

                        EP

                        AC

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        BR-EP

                        EP-PPI

                        EP-Q

                        EP-PCD

                        EP

                        AC

                        BR-EP-Q

                        BR-EP-PPI

                        BR-EP-PCD

                        BR-EP

                        EP-PPI

                        EP-Q

                        EP-PCD

                        EP

                        AC

                        BR-EP-PCD

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP

                        EP-PPI

                        EP-Q

                        EP-PCD

                        EP

                        AC

                        BR-EP

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        EP-PPI

                        EP-Q

                        EP-PCD

                        EP

                        AC

                        EP-PPI

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        BR-EP

                        EP-Q

                        EP-PCD

                        EP

                        AC

                        EP-Q

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        BR-EP

                        EP-PPI

                        EP-PCD

                        EP

                        AC

                        EP-PCD

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        BR-EP

                        EP-PPI

                        EP-Q

                        EP

                        AC

                        EP

                        BR-EP-PPI

                        BR-EP-Q

                        BR-EP-PCD

                        BR-EP

                        EP-PPI

                        EP-Q

                        EP-PCD

                        AC

                        ANEXO IV EDITAL Nº 87, DE 20 DE SETEMBRO DE 2024

                        ORIENTAÇÕES PARA INSCRIÇÃO E CÁLCULO DA MÉDIA DOS COMPONENTES CURRICULARES DE MATEMÁTICA E LÍNGUA PORTUGUESA DE CONCLUSÃO DO ENSINO FUNDAMENTAL

                        A média final deverá ser expressa de 0,00 (zero) a 10,00 (dez), utilizando-se duas casas após a vírgula.

                        a) Deve-se indicar as notas de Língua Portuguesa e Matemática do sétimo ano.

                        b) Deve-se indicar as notas de Língua Portuguesa e Matemática do oitavo ano.

                        c) O sistema fará a média das notas.

                        d) Ao indicar suas médias, o(a) candidato(a) deverá considerar as seguintes situações:

                        e) Caso o histórico contenha notas em escalas diferentes de 0(zero) a 10(dez), as notas devem ser convertidas antes de realizar o cálculo da média geral. Por exemplo, no caso da nota estar representada no formato 88, esta deve ser transformada para 8,8(88 ÷ 10).

                        f) Caso o histórico venha com conceitos e não notas, respeitar a tabela indicada no item 6.4.3 deste edital.

                        g) Estudantes que possuem em seu histórico escolar registro de disciplinas (Português e/ou Matemática) com dependência, deverão considerar a nota obtida após aprovação na referida disciplina de dependência. Por exemplo, o estudante ficou em dependência na disciplina A em seu 7º ano do ensino médio, vindo a cursar a dependência desta disciplina no 8º ano. Ao calcular a média do sétimo ano, deverá ser considerada, para a disciplina A, a nota obtida na dependência cursada durante o oitavo ano.

                        Para a modalidade Ensino Fundamental via Certificação do Encceja (Exame Nacional para Certificação de Competências de Jovens e Adultos):

                        a) O(A) candidato(a) deverá informar a pontuação obtida nas áreas de conhecimento Linguagens, Códigos e suas Tecnologias e Matemática e suas Tecnologias.

                        b) O sistema fará a média.

                        ANEXO V - EDITAL Nº 87, DE 20 DE SETEMBRO DE 2024

                        ENDEREÇOS DOS CAMPI DO IFPR

                        CAMPUS

                        ENDEREÇO

                        PÁGINA ELETRÔNICA

                        ARAPONGAS

                        Rua Surucuá Açu, 321 – Vila Araponguinha

                        https://ifpr.edu.br/arapongas/

                        ASTORGA

                        Rodovia PR 454, Contorno Norte

                        https://ifpr.edu.br/astorga/

                        ASSIS CHATEAUBRIAND

                        Av. Cívica, 475 – Centro Cívico

                        https://ifpr.edu.br/assis-chateaubriand/

                        BARRACÃO

                        Rodovia BR 163, nº 2115 - Industrial, Barracão

                        https://ifpr.edu.br/barracao/

                        CAMPO LARGO

                        R. Eng. Tourinho, 829 - Vila Solene

                        https://ifpr.edu.br/campo-largo/

                        CAPANEMA

                        Rua Cariris nº 750 Bairro Santa Bárbara

                        https://ifpr.edu.br/capanema/

                        CASCAVEL

                        Avenida das Pombas, 2020 - Floresta

                        https://ifpr.edu.br/cascavel/

                        COLOMBO

                        Rua Antonio Chemin, 28, São Gabriel

                        https://ifpr.edu.br/colombo/

                        CORONEL VIVIDA

                        PR 562, Flor da Serra

                        https://ifpr.edu.br/coronel-vivida/

                        CURITIBA

                        R. João Negrão, 1285

                        https://ifpr.edu.br/curitiba/

                        FOZ DO IGUAÇU

                        Avenida Araucária, 780, Bairro Vila A

                        https://ifpr.edu.br/foz-do-iguacu/

                        GOIOERÊ

                        Rodovia Luiz Dechiche, s/nº

                        https://ifpr.edu.br/goioere/

                        IRATI

                        Rua Pedro Koppe, 100 – Vila Matilde

                        https://ifpr.edu.br/irati/

                        IVAIPORÃ

                        Rua Max Arthur Greipel, nº 505

                        https://ifpr.edu.br/ivaipora/

                        JACAREZINHO

                        Avenida Dr. Tito nº: 801 – Jardim Panorama

                        https://ifpr.edu.br/jacarezinho/

                        JAGUARIAÍVA

                        Av. Eloa Martins Passos Felix – Rod. 151 Km 213,7

                        https://ifpr.edu.br/jaguariaiva/

                        LONDRINA

                        Rua João XXIII, nº 600, Jardim Dom Bosco

                        https://ifpr.edu.br/londrina/

                        PALMAS

                        Av. Bento Munhoz da Rocha Neto, s/nº

                        https://ifpr.edu.br/palmas/

                        PARANAGUÁ

                        Rua Antonio Carlos Rodrigues, n.º 453 – Porto Seguro

                        https://ifpr.edu.br/paranagua/

                        PARANAVAÍ

                        Rua José Felipe Tequinha, 1400 – Jardim das Nações

                        https://ifpr.edu.br/paranavai/

                        PINHAIS

                        Rua Humberto de Alencar Castelo Branco, 1575 Jardim Amélia

                        https://ifpr.edu.br/pinhais/

                        PITANGA

                        Rua José de Alencar, 1.080 – Vila Planalto

                        https://ifpr.edu.br/pitanga/

                        QUEDAS DO IGUAÇU

                        Rua, Marginal Imbirama, 300 - linha Tapuí

                        https://ifpr.edu.br/quedas-do-iguacu/

                        TELÊMACO BORBA

                        Rodovia PR 160 – km 19,5 – Jardim Bandeirantes

                        https://ifpr.edu.br/telemaco-borba/

                        UMUARAMA

                        Rodovia PR 323, KM 302, Parque Industrial

                        https://ifpr.edu.br/umuarama/

                        UNIÃO DA VITÓRIA

                        Av. Paula Freitas, 2800 - São Braz

                        https://ifpr.edu.br/uniao-da-vitoria/

                        ANEXO VI - EDITAL Nº 87, DE 20 DE SETEMBRO DE 2024

                        FORMULÁRIO PARA ISENÇÃO DA TAXA DE INSCRIÇÃO DE PROCESSO SELETIVO

                        IDENTIFICAÇÃO DO CANDIDATO

                        Nome completo:

                        Número de Identificação Social do candidato(NIS):

                        Nº da Carteira de Identidade:

                        CPF:

                        Email:

                        Telefone:

                        Curso e Campus para qual está inscrito(a):

                        O(A) candidato(a) declara estar inscrito(a) no Cadastro único para programas Sociais do Governo Federal e possuir perfil de de renda bruta familiar de até meio(0,5) salário mínimo per capita.

                        ( )SIM ( )NÃO

                        Documentos a serem enviados junto a este formulário:

                        a) Digitalização da carteira de identificação(CI) do(a) candidato(a);

                        b) Comprovante de inscrição no Cadastro Único para Programas Sociais do Governo Federal – Cadastro Único.

                        ____________________________(PR), ____de _____________________de 20.

                        Assinatura do(a) declarante ou responsável legal (quando o(a) declarante tiver idade inferior a 18 anos)

                        **Ratifico serem verdadeiras as informações prestadas, estando ciente de que a informação falsa incorrerá nas penas do crime do art. 299 do Código Penal (falsidade ideológica);

                        ANEXO VII - EDITAL Nº 87, DE 20 DE setembro DE 2024

                        COMPROVAÇÃO DOCUMENTAL DA RENDA BRUTA MENSAL PARA AVALIAÇÃO DE COTAS BAIXA RENDA

                        Os/as candidatos/as aprovados/as nas ações afirmativas de escola pública e baixa renda (BR-EP; BR-EP-PCD; BR-EP-Q; BR-EP-PPI) deverão comprovar renda familiar bruta mensal per capita (por pessoa) igual ou inferior a 1 (um) salário-mínimo nacional - (R$ 1.412,00).

                        Para essa comprovação, você poderá proceder de 2 formas distintas:

                        a) Apresentar comprovante de inscrição do CadÚnico (Programa de Cadastro único do Governo Federal) que deverá estar atualizado nos últimos 24 (vinte e quatro) meses anteriores à data de inscrição no Processo Seletivo.

                        OU como alternativa aos que não possuem inscrição no CadÚnico:

                        b) Enviar os comprovantes exigidos em edital para todos os membros da família:

                        1: Preencher e assinar a Declaração de Núcleo Familiar Renda Bruta Familiar disponível no link indicado no item 1.1.2 deste edital.

                        2: ANEXAR DOCUMENTAÇÃO COMUM A TODOS OS MEMBROS DO NÚCLEO FAMILIAR E AO CANDIDATO:

                        a) Certidão de Nascimento ou Cédula de Identidade (RG) ou Passaporte ou Carteira Nacional de Habilitação, de todos os integrantes do núcleo familiar;

                        b) CPF de todos os integrantes do núcleo familiar, com mais de 18 anos;

                        c) Comprovante de residência;

                        d) Carteira de Trabalho e Previdência Social (CTPS) física, para todos os integrantes com mais de 18 anos, a qual deverá conter as páginas da: foto, qualificação civil, contratos de trabalho e a próxima página em branco de contrato de trabalho. Ou, Carteira de Trabalho Digital em PDF Único atualizada, contendo todos os dados pessoais e contratos de trabalho. Caso não possua CTPS, preencher e assinar Declaração De Não Possuir Carteira De Trabalho E Previdência Social (CTPS) disponível no link indicado no item 1.1.2 deste edital.

                        e) Declaração de Imposto de Renda completa COM recibo (Exercício 2024, ano calendário 2023), aos componentes do núcleo familiar com mais de 18 anos, caso seja declarante. Aos componentes do núcleo familiar, com mais de 18 anos não declarantes de Imposto de Renda, apresentar comprovante, disponível no link abaixo para consulta: Disponível em: https://www.restituicao.receita.fazenda.gov.br

                        3: DOCUMENTAÇÃO DE RENDA PARA TODOS OS INTEGRANTES DO NÚCLEO FAMILIAR COM MAIS DE 18 ANOS: (Caso o núcleo familiar seja composto por integrantes de diferentes categorias (assalariados, autônomos etc.), a documentação deverá ser apresentada em acordo com cada realidade de trabalho e renda).

                        3.1. DESEMPREGADOS, ESTUDANTES OU DONA(O) DE CASA:

                        a) Em caso de desemprego recente, apresentar Rescisão de Contrato e comprovante de recebimento do seguro desemprego, e/ou;

                        b) Preencher e assinar a Declaração – Não Possui Renda Mensal disponível no link indicado no item 1.1.2 deste edital.

                        3.2. TRABALHADORES ASSALARIADOS (celetistas, servidores públicos, empregado doméstico, aprendizes):

                        a) Contracheques/holerites dos três meses anteriores à inscrição (julho, agosto e setembro de 2024).

                        3.3. APOSENTADOS, PENSIONISTAS E DEMAIS BENEFICIÁRIOS DO INSS:

                        a) Comprovante do benefício do INSS (aposentado, pensionista ou demais beneficiários), demonstrando o valor bruto recebido dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024); OU

                        b) Comprovante de aposentadoria (caso não seja INSS).

                        3.4. AUTÔNOMOS E PROFISSIONAIS LIBERAIS:

                        a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

                        b) Preencher e assinar declaração da atividade desenvolvida como autônomo ou liberal e a renda bruta mensal (Declaração Renda variável) disponível no link indicado no item 1.1.2 deste edital.

                        c) Guias de recolhimento ao INSS com comprovante de pagamento dos três meses anteriores à inscrição.

                        3.5. EMPRESÁRIO OU PESSOAS COM PARTICIPAÇÃO EM COTAS DE EMPRESAS OU MICROEMPRESAS:

                        a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

                        b) Preencher e assinar declaração da atividade desenvolvida e a renda como empresário/microempreendedor (Declaração Renda variável) disponível no link indicado no item 1.1.2 deste edital.

                        c) Pró-labores dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

                        d) Declaração completa de Imposto de Renda de Pessoa Jurídica – DIPJ, exercício 2024 ano calendário 2023, acompanhado do recibo de entrega, quando houver;

                        e) Declaração completa de Informações socioeconômicas e Fiscais (DEFIS- Simples Nacional) para Microempresários e Empresários de Pequeno Porte, quando houver;

                        f) Declaração Comprobatória de Percepção de Rendimentos (DECORE), quando houver,

                        3.6. MICROEMPREENDEDOR INDIVIDUAL:

                        a) Extratos bancários dos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

                        b) Preencher e assinar declaração relatando a atividade desenvolvida como microempreendedor e a renda mensal (Declaração Renda variável), disponível no link indicado no item 1.1.2 deste edital; e

                        c) Declaração Anual CNPJ MEI (DASN-SIMEI).

                        3.7. TRABALHADORES DO MERCADO INFORMAL: (atividade sem vínculo empregatício, não possui contrato de trabalho, não contribui com INSS).

                        a) Preencher e assinar declaração relatando a renda bruta mensal e a atividade desenvolvida como trabalhador informal (Declaração Renda variável), disponível no link indicado no item 1.1.2 deste edital.

                        3.8. ESTAGIÁRIOS ou BOLSISTAS:

                        a) Contrato de estágio/bolsa, ou Termo de Compromisso de estágio/bolsa.

                        3.9. RENDIMENTOS DE ALUGUEL OU ARRENDAMENTO DE BENS MÓVEIS E IMÓVEIS:

                        a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

                        b) Contrato(s) de locação ou arrendamento(s) devidamente registrado(s) em cartório, acompanhado(s) dos recibos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), ou;

                        c) Preencher e assinar declaração de próprio punho relatando o valor recebido, acompanhada dos recibos dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024).

                        3.10. PARA CASOS DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA:

                        a) Decisão judicial discriminando o nome do(s) beneficiários e o valor a ser pago, ou;

                        b) Preencher e assinar declaração do beneficiário e o valor mensal recebido de pensão, (Declaração Renda variável), disponível no link indicado no item 1.1.2 deste edital.

                        3.11. ATIVIDADE RURAL:

                        a) Extratos bancários dos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

                        b) Declaração do sindicato rural, associação, cooperativa ou prefeitura, contendo o valor recebido mensalmente ou anualmente e informações detalhadas atividade desenvolvida, ou

                        c) Preencher e assinar declaração, contendo o valor recebido mensalmente ou anualmente, e informações da atividade desenvolvida, anexando as 3 (três últimas) notas fiscais de vendas de produtos, (Declaração Renda variável), disponível no link indicado no item 1.1.2 deste edital; e

                        d) Declaração de Imposto de Renda Pessoa Jurídica - IRPJ, quando houver;

                        e) Quaisquer declarações tributárias referentes a pessoas jurídicas vinculadas ao candidato ou a membros da família, quando for o caso.

                        ANEXO VIII - EDITAL Nº 87, DE 20 DE SETEMBRO DE 2024

                        FORMULÁRIO DE SOLICITAÇÃO DE RECURSO

                        Nome do candidato(a):

                        Curso e campus para o qual se inscreveu:

                        CPF do candidato(a):

                        Selecione o tipo de recurso que você deseja protocolar (assinale apenas uma opção)

                        ( ) Recurso contra homologação de inscrição.

                        ( ) Recurso contra o indeferimento da solicitação de isenção da taxa de inscrição.

                        ( ) Recurso contra o indeferimento da autodeclaração étnico-racial.

                        ( ) Recurso contra o indeferimento da matrícula.

                        Justificativa do recurso:

                        _____________________-PR, ____ de ____________________ de 20.

                        Assinatura do(a) Candidato(a) ou do Responsável Legal

                        Justificativa da decisão:

                        ANEXO IX - EDITAL Nº 87, DE 20 DE SETEMBRO DE 2024

                        REQUERIMENTO DE MATRÍCULA

                        CURSO:________________________________________________________________

                        ( ) Integrado ( ) Subsequente ( ) Licenciatura ( ) Bacharelado ( ) Tecnologia

                        CAMPUS:_______________________________________________________________

                        PERÍODO DE INGRESSO: 2025

                        SEMESTRE:TURNO:_____________________

                        AÇÃO AFIRMATIVA DE CONCORRÊNCIA/COTA: _______________ (Ver Código Quadro Abaixo)

                        IFPR-PPI - candidatos autodeclarados pretos, pardos ou indígenas, independentemente de renda familiar e de ter cursado a etapa anterior em escola pública.

                        IFPR-PCD - candidatos com deficiência, independentemente de renda familiar e de ter cursado a etapa anterior integralmente em escola pública.

                        EP - estudantes que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        BR-EP - candidatos que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        BR-EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        BR-EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        AC - Ampla Concorrência.

                        DADOS DO ESTUDANTE:

                        NOME:_________________________________________________________________

                        RG______________________ ORG./UF:________ CPF__________________________

                        NOME DO RESPONSÁVEL LEGAL: _________________________________________________________________

                        PARENTESCO DO RESPONSÁVEL LEGAL COM O ESTUDANTE: ___________________________________________

                        (Nos casos de guarda, tutela ou outro documento de responsabilidade incluir junto ao requerimento o documento comprobatório).

                        TELEFONE DO ESTUDANTE:________________________ TELEFONE DO RESPONSÁVEL:_______________________

                        EMAIL:_________________________________________________________________

                        ENDEREÇO RESIDENCIAL: ________________________________________________________________ CEP: _________________________

                        ( ) DECLARO, sob as penas da lei, que não possuo escolaridade de nível superior (Para os candidatos que concorrem às vagas de inclusão).

                        ( ) DECLARO, para os devidos fins, que assumo total responsabilidade sobre as informações contidas neste documento. Por ser expressão da verdade, dato e assino o presente documento, ficando ciente de que no caso de inveracidade comprovada estarei sujeito às penalidades cabíveis.

                        _____________________, __________ de _______________________ de 20

                        Assinatura da(o) estudante                                 Assinatura da(o) responsável legal
                        content_copy
                        Use code with caution.

                        ANEXO X - EDITAL IFPR Nº 87 DE 20 de setembro de 2024

                        DECLARAÇÃO DA COMUNIDADE ÍNDIGENA

                        Declaramos para os devidos fins que o(a) candidato(a) __________________________________________ portador(a) do CPF n.º _______________________________, reside/pertence à Comunidade Indígena de ___________________________________ do município de ______________________________ , Estado ________________________.

                        DADOS DA LIDERANÇA 1

                        Nome completo:

                        CPF:

                        Telefone (com código de área): (____) _____________________

                        Função que exerce na Comunidade Indígena:

                        Assinatura

                        DADOS DA LIDERANÇA 2

                        Nome completo:

                        CPF:

                        Telefone (com código de área): (____) _____________________

                        Função que exerce na Comunidade Indígena:

                        Assinatura

                        DADOS DA LIDERANÇA 3

                        Nome completo:

                        CPF:

                        Telefone (com código de área): (____) _____________________

                        Função que exerce na Comunidade Indígena:

                        Assinatura

                        ANEXO XI - EDITAL IFPR Nº 87 DE 20 de setembro de 2024

                        DECLARAÇÃO DA COMUNIDADE QUILOMBOLA

                        Declaramos para os devidos fins que o(a) candidato(a) __________________________________________ portador(a) do CPF n.º _______________________________, reside/pertence à Comunidade Quilombola de ___________________________________ do município de ______________________________ , Estado ________________________.

                        DADOS DA LIDERANÇA 1

                        Nome completo:

                        CPF:

                        Telefone (com código de área): (____) _____________________

                        Função que exerce na Comunidade Quilombola:

                        Assinatura

                        DADOS DA LIDERANÇA 2

                        Nome completo:

                        CPF:

                        Telefone (com código de área): (____) _____________________

                        Função que exerce na Comunidade Quilombola:

                        Assinatura

                        DADOS DA LIDERANÇA 3

                        Nome completo:

                        CPF:

                        Telefone (com código de área): (____) _____________________

                        Função que exerce na Comunidade Quilombola:

                        Assinatura

                        Referência: Processo nº 23411.007465/2024-31 SEI nº 3185070
                        INSTITUTO FEDERAL DO PARANÁ | GR/DEAC/IFPR-DEAC/GR
                        Rua Emilio Bertolini, nº 54, Curitiba - PR | CEP CEP 82920-030 - Brasil
`;
            var edital2 = `Edital N°88, de 20 de setembro de 2024

                        PROCESSO SELETIVO IFPR 2025 - CURSOS TÉCNICOS SUBSEQUENTES AO ENSINO MÉDIO

                        

                        O Reitor do Instituto Federal de Educação, Ciência e Tecnologia do Paraná, no uso da competência que lhe confere o Decreto de 06 de fevereiro de 2024, publicado no Diário Oficial da União no dia 07 de fevereiro de 2024, seção 2, página 01, torna público as normas que regem o Processo Seletivo IFPR 2025 para ingresso nos Cursos Técnicos Subsequentes ao Ensino Médio, na modalidade presencial, ofertados para o ano de 2025, considerando a política de inclusão do IFPR para o ingresso de estudantes nos cursos. As inscrições estarão abertas de 03 de outubro a 01 de novembro de 2024.

                        

                        BASE LEGAL

                        Lei nº 9.394, de 20 de dezembro de 1996 - Estabelece as diretrizes e bases da educação nacional.

                        Decreto nº 3.298, de 20 de dezembro de 1999 - Regulamenta a Lei no 7.853, de 24 de outubro de 1989, dispõe sobre a Política Nacional para a Integração da Pessoa Portadora de Deficiência, consolida as normas de proteção, e dá outras providências.

                        Decreto nº 5.296, de 02 de dezembro de 2004 - Regulamenta as Leis nos 10.048, de 8 de novembro de 2000, que dá prioridade de atendimento às pessoas que especifica, e 10.098, de 19 de dezembro de 2000, que estabelece normas gerais e critérios básicos para a promoção da acessibilidade das pessoas portadoras de deficiência ou com mobilidade reduzida, e dá outras providências.

                        Decreto nº 6.593/2008 - Regulamenta o art. 11 da Lei no 8.112, de 11 de dezembro de 1990, quanto à isenção de pagamento de taxa de inscrição em concursos públicos realizados no âmbito do Poder Executivo federal.

                        Lei nº 12.711, de 29 de agosto de 2012 - Dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio e dá outras providências.

                        Lei nº 12.764, de 27 de dezembro de 2012 - Institui a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista; e altera o § 3º do art. 98 da Lei nº 8.112, de 11 de dezembro de 1990.

                        Decreto nº 7.824, de 11 de outubro de 2012 - Regulamenta a Lei nº 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

                        Lei nº 13.146, de 06 de julho de 2015 - Institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência).

                        Lei nº 13.409, de 28 de dezembro de 2016 - Altera a Lei nº 12.711, de 29 de agosto de 2012, para dispor sobre a reserva de vagas para pessoas com deficiência nos cursos técnico de nível médio e superior das instituições federais de ensino.

                        Decreto nº 9.034, de 20 de abril de 2017 - Altera o Decreto n º 7.824, de 11 de outubro de 2012, que regulamenta a Lei n º 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

                        Lei nº 14.126 de 22 de março de 2021 - Classifica a visão monocular como deficiência sensorial, do tipo visual.

                        Decreto nº 11.016/2022 - Regulamenta o Cadastro Único para Programas Sociais do Governo Federal, instituído pelo art. 6º-F da Lei nº 8.742, de 7 de dezembro de 1993.

                        Lei nº 14.723 de 13 de novembro de 2023 - Altera a Lei nº 12.711, de 29 de agosto de 2012, para dispor sobre o programa especial para o acesso às instituições federais de educação superior e de ensino técnico de nível médio de estudantes pretos, pardos, indígenas e quilombolas e de pessoas com deficiência, bem como daqueles que tenham cursado integralmente o ensino médio ou fundamental em escola pública.

                        Decreto nº 11.781 de 14 de novembro de 2023 - Altera o Decreto nº 7.824, de 11 de outubro de 2012, que regulamenta a Lei nº 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

                        Decreto Nº 11.864, de 27 de dezembro de 2023 - Dispõe sobre o valor do salário mínimo a vigorar a partir de 1º de janeiro de 2024.

                        Portaria Normativa MEC nº 18, de 11 de outubro de 2012 - Dispõe sobre a implementação das reservas de vagas em instituições federais de ensino de que tratam a Lei no 12.711, de 29 de agosto de 2012, e o Decreto no 7.824, de 11 de outubro de 2012.

                        Portaria Normativa nº 2.027 de 16 de novembro de 2023 - Altera a Portaria Normativa MEC nº 18, de 11 de outubro de 2012, que dispõe sobre a implementação das reservas de vagas em instituições federais de ensino de que tratam a Lei nº 12.711, de 29 de agosto de 2012, e a Portaria Normativa MEC nº 21, de 5 de novembro de 2012, que dispõe sobre o Sistema de Seleção Unificada - Sisu.

                        Resolução Consup/IFPR nº 190/2024 – Dispõe sobre a Organização Didático-Pedagógica dos Cursos Técnicos de Nível Médio na modalidade presencial do Instituto Federal de Educação, Ciência e Tecnologia do Paraná.

                        Resolução Consup IFPR nº 55/2011 – Dispõe sobre a Organização Didático Pedagógica da Educação Superior no âmbito do Instituto Federal do Paraná – IFPR.

                        

                        1. DAS DISPOSIÇÕES PRELIMINARES

                        1.1. Os Cursos Técnicos Subsequentes ao Ensino Médio, objeto deste certame, são públicos, gratuitos e presenciais, devendo o(a) candidato(a) ter disponibilidade de tempo para realizar atividades no contraturno e/ou aos sábados, conforme o calendário acadêmico do campus e o projeto pedagógico do curso.

                        1.1.1 Para acessar tutoriais em vídeo sobre o processo seletivo (com acessibilidade), utilize o endereço eletrônico https://ifpr.edu.br/estude-conosco/processo-seletivo-2025/tutoriais/.

                        1.1.2 Para acessar formulários e outros documentos editáveis, utilize o endereço eletrônico https://ifpr.edu.br/estude-conosco/processo-seletivo-2025/documentos/.

                        1.1.3 Para acessar o Portal do Candidato do IFPR, utilize o endereço eletrônico https://portaldocandidato.ifpr.edu.br/.

                        1.2. Ao término do curso, o estudante fará jus ao diploma de uma habilitação profissional técnica.

                        1.3. Para ingresso nos Cursos Técnicos Subsequentes ao Ensino Médio o candidato deverá ter concluído, imprescindivelmente, o Ensino Médio. 

                        1.4. O processo seletivo será realizado em uma única etapa, que consistirá na classificação do(a) candidato(a) pelo seu desempenho (notas/conceitos) nas disciplinas de Língua Portuguesa e Matemática do 1º (primeiro) e do 2º (segundo) ano do Ensino Médio, conforme indicado no item 6, deste Edital.

                        1.4.1. Para os candidatos aos Cursos Técnicos Subsequentes que tenham cursado o Ensino Médio em outro país será considerada a nota/conceito obtido na língua materna do país de origem, em substituição a Língua Portuguesa.

                        1.5 É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação de todos os atos, editais e comunicados referentes ao Processo Seletivo regido por este edital. 

                        1.6 O(A) candidato(a) que se inscrever pelo Sistema de Ações Afirmativas (cotas) automaticamente autoriza a divulgação dos resultados do Processo Seletivo referente a este edital de acordo com a classificação gerada pelo Sistema de Ações Afirmativas (cotas), nos termos da Lei nº 12.711, de 29 de agosto de 2012, do Decreto nº 7.824, de 11 de outubro de 2012, da Portaria Normativa MEC nº 18, de 11 de outubro de 2012, da Lei nº 13.409, de 28 de dezembro de 2016, do Decreto nº 9.034, de 20 de abril de 2017, da Lei nº 14.723 de 13 de novembro de 2023, do Decreto nº 11.781 de 14 de novembro de 2023 e da Portaria Normativa nº 2.027 de 16 de novembro de 2023. 

                        1.7 O(A) candidato(a) deverá possuir Carteira de Identidade(CI) e CPF para participar do referido processo seletivo. 

                        1.8 Serão considerados documentos de identificação: Carteira de Identidade expedida pelas Secretarias de Segurança Pública, pelas Forças Armadas Brasileiras, por países que possuem acordos diplomáticos com o Brasil, Polícias Militares, Ordens ou Conselhos que, por Lei Federal, tenha validade como documento de identidade e possibilite a conferência da foto e da assinatura; Carteira de Identidade Nacional - CIN; Carteira de Trabalho e Previdência Social(CTPS); Passaporte; ou Carteira Nacional de Habilitação com fotografia – na forma da Lei nº 9.503/97 e o Documento de Identidade Nacional de Estrangeiro (Carteira de Registro Nacional Migratório - CRNM).

                        1.8.1. A CTPS Digital apenas tem validade como documento para fins de acompanhamento do contrato de trabalho, não sendo válida como documento de identificação. 

                        1.9 Ao se inscrever para este Processo Seletivo, o(a) candidato(a) declara conhecer e aceitar todas as condições descritas neste edital. Declara, ainda, estar ciente de que qualquer omissão ou falsidade, bem como o não atendimento das exigências impostas, culminará com a sua desclassificação do processo.

                        

                        2. DA FORMA DE OFERTA

                        2.1 Os Cursos Técnicos Subsequentes ao Ensino Médio ofertados neste Edital, na modalidade presencial, são oferecidos a quem já tenha concluído o Ensino Médio. Os cursos são organizados de modo que o estudante conclua o curso com uma habilitação profissional técnica de nível médio.

                        2.1.1 O calendário letivo, com datas de início e término do ano letivo,  será divulgado no site de cada campus do IFPR, considerando suas especificidades.

                        

                        3. DOS CURSOS E VAGAS

                        3.1 A distribuição das vagas nos diversos cursos e campi do IFPR e nas diferentes ações afirmativas (cotas de inclusão) e ampla concorrência encontram-se, respectivamente, no Anexo I e no Anexo II deste Edital.

                        3.2 O total das vagas ofertadas para cada curso e turma será disponibilizado da seguinte forma:

                        3.2.1 60% (sessenta por cento) do total das vagas ofertadas para cada curso e turma, para cursos com forma de oferta integrada, são reservadas aos candidatos que tenham cursado integralmente o Ensino Fundamental em escolas públicas do Brasil, em cursos regulares ou no âmbito da modalidade de Educação de Jovens e Adultos (EJA), ou tenham obtido certificado de conclusão com base no resultado do exame nacional para certificação de competências de jovens e adultos(Encceja) ou de exames de certificação de competência ou de avaliação de jovens e adultos realizados pelos sistemas estaduais de ensino. Esse percentual será distribuído da seguinte maneira:

                        3.2.1.1 50% (cinquenta por cento) serão destinados aos candidatos que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário - mínimo nacional per capita (R$ 1.412,00), havendo reserva de vagas para candidatos:

                        3.2.1.1.1 BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas.

                        3.2.1.1.2  BR-EP-Q - Autodeclarados quilombolas.

                        3.2.1.1.3 BR-EP-PCD - Pessoas com deficiência.

                        3.2.1.1.4 BR-EP - Demais candidatos.

                        3.2.1.2 50% (cinquenta por cento) serão destinados aos candidatos que, independentemente de renda familiar, havendo reserva de vagas para candidatos:

                        3.2.1.2.1 EP-PPI -  Autodeclarados pretos, pardos ou indígenas.

                        3.2.1.2.2 EP-Q - Autodeclarados quilombolas.

                        3.2.1.2.3 EP-PCD - Pessoas com deficiência.

                        3.2.1.2.4 EP - Demais candidatos

                        3.3.1 IFPR-PPI - 10% (dez por cento) do total das vagas ofertadas para cada curso e turma são reservadas aos candidatos autodeclarados pretos, pardos ou indígenas.

                        3.3.2 IFPR-PCD - 5% (cinco por cento) do total das vagas ofertadas para cada curso e turma são reservadas aos candidatos com deficiência.

                        3.3.3 25% (vinte por cento) do total das vagas ofertadas para cada curso e turma são reservadas à Ampla Concorrência (AC). Nesta forma de oferta estão incluídos estudantes que estudaram qualquer tempo em escolas particulares, mesmo sendo bolsistas.

                        3.4 Os Processos Seletivos do IFPR realizam reserva de vagas através do Sistema de Ações Afirmativas (cotas), estabelecidas nos termos da Lei nº 12.711, de 29 de agosto de 2012, do Decreto nº 7.824, de 11 de outubro de 2012, da Portaria Normativa MEC nº 18, de 11 de outubro de 2012, da Lei nº 13.409, de 28 de dezembro de 2016, do Decreto nº 9.034, de 20 de abril de 2017, da Lei nº 14.723 de 13 de novembro de 2023, do Decreto nº 11.781 de 14 de novembro de 2023 e da Portaria Normativa nº 2.027 de 16 de novembro de 2023 mediante a comprovação das respectivas condições por meio de documentos.

                        3.4.1 O cálculo para a distribuição de vagas, seus possíveis arredondamentos e redistribuições, segue o disposto na Portaria MEC nº 2027 de 16 de novembro de 2023, o que pode fazer com que algumas ações afirmativas (cotas), bem como a ampla concorrência não atendam exatamente os percentuais indicados.

                        3.4.2 A base para a distribuição de vagas em cada ação afirmativa (cota) e na Ampla Concorrência encontra-se no Anexo II deste edital.

                        3.4.3. Candidatos(as) estrangeiros, que não sejam naturalizados, ou que tenham feito parte de seu estudo no exterior, não poderão participar do processo seletivo na reserva de vagas para estudantes de escola pública, devendo, portanto, responder NÃO à pergunta de número 1 (um) do Questionário Socioeconômico no momento da inscrição. 

                        3.5. As ações afirmativas às quais o(a) candidato(a) poderá concorrer durante o processo seletivo serão definidas mediante preenchimento de questionário socioeconômico, durante a realização da inscrição.

                        3.5.1. O questionário socioeconômico a que se refere o item 3.5 possuirá as seguintes questões:

                        a) QUESTÃO 01 - Você concluiu TODA a etapa de ensino anterior à modalidade de curso para a qual está se inscrevendo em uma instituição pública?

                        b) QUESTÃO 02 - De acordo com as condições estabelecidas no edital do processo seletivo, a sua renda per capta familiar é igual ou inferior a 1 salário mínimo atualmente? (Renda familiar per capita é calculada dividindo-se o total de renda familiar pelo número de moradores de uma residência).

                        c) QUESTÃO 03 - Você se identifica como pessoa preta, parda ou indígena?

                        d) QUESTÃO 04 - Você é membro ou reside em alguma comunidade remanescente de quilombo?

                        e) QUESTÃO 05 - Você possui alguma deficiência que se enquadra nas condições estabelecidas no edital do processo seletivo para o qual está se inscrevendo e que pode ser comprovada por meio de laudo médico?

                        3.6. As vagas da Ampla Concorrência são destinadas a todos(as) os(as) candidatos(as) que se julgarem aptos(as) a participar do certame, independentemente da condição social, racial, de deficiência ou de terem cursado o Ensino Fundamental em escola pública ou privada. 

                        3.6.1 Os(as) candidatos(as) que já possuam escolaridade de nível superior somente podem concorrer nas vagas de da Ampla Concorrência.

                        3.7. Quando ocorrer a existência de vagas em uma determinada ação afirmativa (cota) e a falta de candidatos inscritos para ocupá-las, ocorrerá a convocação de candidatos de outras listas de concorrência, a partir da migração da referida vaga, respeitando a ordem constante no Anexo III.

                        

                        4. DO SISTEMA DE AÇÕES AFIRMATIVAS (COTAS) 

                        4.1 Cotas para Escola Pública 

                        4.1.1. Os(As) candidatos(as) inscritos(as) por alguma ação afirmativa de escola pública devem apresentar, no momento da matrícula, histórico escolar por meio do qual comprovem ter cursado e concluído todo o ensino fundamental (1º ao 9º anos ou outra forma prevista em Lei) exclusivamente na rede pública de ensino do Brasil.

                        4.1.2. Não poderá ser matriculado(a), nas vagas reservadas para as ações Afirmativas (cotas) de Escola Pública, o(a) candidato(a) que tenha cursado o ensino fundamental, integralmente ou em parte, em escolas particulares, inclusive com bolsa de estudos parcial ou integral (Art. 5º, Inciso II b, § 1º da Portaria Normativa nº 18 de 2012). Identificadas disciplinas isoladas realizadas na rede privada de ensino, o(a) candidato(a) também estará impossibilitado(a) de se matricular nestas vagas.

                        4.1.3. De acordo com o Art. 19, inciso I da Lei nº 9.394, de 20 de dezembro de 1996, considera-se Escola Pública a instituição criada ou incorporada, mantida e administrada pelo poder público. As escolas pertencentes ao Sistema S (SENAI, SESI, SENAC), escolas conveniadas, escolas filantrópicas ou, ainda, fundações ou instituições similares (mesmo que mantenham educação gratuita) não são consideradas instituições da rede pública de ensino.

                        4.1.4 Caso, no momento da matrícula, o documento a que se refere o item 4.1.1 não seja apresentado ou não comprove a condição de o estudante ter realizado todo o Ensino Fundamental em escola pública, requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado. 

                        4.1.4.1 Ocorrendo a situação prevista no item 4.1.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VIII que deverá ser preenchido e enviado ao e-mail: recursos@ifpr.edu.br.

                        4.1.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.1.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

                        

                        4.2. Cotas para Baixa Renda

                        4.2.1. Os(As) candidatos(as) inscritos(as) por alguma ação afirmativa de Baixa Renda deverão comprovar renda familiar bruta igual ou inferior a 1(um) salário-mínimo per capita (equivalente a R$ 1.412,00, de acordo com o DECRETO Nº 11.864, DE 27 DE DEZEMBRO DE 2023). 

                        4.2.2. Para atendimento da condição de baixa renda, deve-se considerar: 

                        a) Família: a unidade nuclear composta por uma ou mais pessoas, eventualmente ampliada por outras pessoas que contribuam para o rendimento ou tenham suas despesas atendidas por aquela unidade familiar, todas moradoras em um mesmo domicílio; 

                        b) Morador: a pessoa que tem o domicílio como local habitual de residência e nele reside na data de inscrição do estudante no processo seletivo da instituição federal de ensino; 

                        c) Renda familiar bruta mensal: a soma dos rendimentos brutos auferidos por todas as pessoas da família, calculada na forma do disposto no Art. 7º da Portaria Normativa nº 18/2012 do MEC. 

                        d) Renda familiar bruta mensal per capita: a razão entre a renda familiar bruta mensal e o total de pessoas da família, calculada na forma do art. 7º da Portaria Normativa Nº 18, de 11 de outubro de 2012 - MEC.

                        4.2.3. No momento da matrícula, os documentos comprobatórios para análise da renda deverão ser referentes aos 3 meses anteriores ao período de inscrições (julho, agosto e setembro de 2024). 

                        4.2.3.1 Os documentos a que se refere o item 4.2.3 constam no Anexo VII e deverão ser enviados, em um único arquivo, através do Portal do Candidato do IFPR no item “Documentos Comprobatórios de Renda”.

                        4.2.4. Caso, no momento da matrícula, os documentos a que se refere o item 4.2.3 não sejam apresentados ou não comprovem a condição de renda requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

                        4.2.4.1 Ocorrendo a situação prevista no item 4.2.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VIII que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

                        4.2.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.2.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

                        

                        4.3 Cotas para Pretos, Pardos ou Indígenas 

                        4.3.1. Os(As) candidatos(as) inscritos(as) e preliminarmente aprovados em alguma ação afirmativa de Pretos, Pardos ou Indígenas serão convocados(as), obrigatoriamente, a passar pelo procedimento de heteroidentificação, por meio de edital próprio.

                        4.3.2. O procedimento de heteroidentificação será realizado anteriormente à fase de matrícula.

                        4.3.2.1. Para os candidatos autodeclarados indígenas, quando convocados para a heteroidentificação, deverão apresentar:

                        a) cópia digitalizada do RANI (Registro de Nascimento Indígena); e/ou 

                        b) declaração de residência/pertencimento à comunidade indígena assinada por 3 (três) autoridades indígenas, com os respectivos contatos telefônicos das 3 (três) autoridades conforme Anexo X; e/ou 

                        c) histórico escolar emitido por escola indígena.

                        4.3.2.2 As demais orientações para a realização do procedimento de heteroidentificação estarão descritas em edital específico a ser publicado conforme cronograma do item 5.

                        4.3.3. Caso, após o procedimento de heteroidentificação, seja indeferida a autodeclaração como pessoa preta, parda ou indígena, o(a) candidato(a) somente poderá ser convocado em qualquer das chamadas, pela Ampla Concorrência e ou por outras ações afirmativas (cotas) que não sejam direcionadas a pessoas pretas, pardas ou indígenas. 

                        

                        4.4 Cotas para Pessoa com Deficiência 

                        4.4.1. Considerar-se-á Pessoa com Deficiência (PcD) aquela que possui impedimento de longo prazo, de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais barreiras, pode obstruir sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas, conforme artigo 2º da Lei nº 13.146, de 06 de julho de 2015, e a pessoa com transtorno do espectro autista, de acordo com art. 1º, § 2 o da Lei nº 12.764, de 27 de dezembro de 2012. 

                        4.4.2. Os(As) candidatos(as) inscritos(as) pelo Sistema de Ações Afirmativas (cota) Pessoa com Deficiência deverão se enquadrar: 

                        a) No art. 4º do Decreto nº 3.298, de 20 de dezembro de 1999, atualizado pelo art. 5º, § 1º, inciso I, do Decreto nº 5.296, de 02 de dezembro de 2004, o qual apresenta as seguintes definições: 

                        I - deficiência física: alteração completa ou parcial de um ou mais segmentos do corpo humano, acarretando o comprometimento da função física, apresentando-se sob a forma de paraplegia, paraparesia, monoplegia, monoparesia, tetraplegia, tetraparesia, triplegia, triparesia, hemiplegia, hemiparesia, ostomia, amputação ou ausência de membro, paralisia cerebral, nanismo, membros com deformidade congênita ou adquirida, exceto as deformidades estéticas e as que não produzam dificuldades para o desempenho de funções; 

                        II - deficiência auditiva: perda bilateral, parcial ou total, de quarenta e um decibéis (dB) ou mais, aferida por audiograma nas frequências de 500Hz, 1.000Hz, 2.000Hz e 3.000Hz; 

                        III - deficiência visual: cegueira, na qual a acuidade visual é igual ou menor que 0,05 no melhor olho, com a melhor correção óptica; a baixa visão, que significa acuidade visual entre 0,3 e 0,05 no melhor olho, com a melhor correção óptica; os casos nos quais a somatória da medida do campo visual em ambos os olhos for igual ou menor que 60º; ou a ocorrência simultânea de quaisquer das condições anteriores; visão monocular como deficiência sensorial, do tipo visual (conforme definido na lei nº 14.126 de 22 de março de 2021) . 

                        IV - deficiência intelectual: funcionamento intelectual significativamente inferior à média, com manifestação antes dos dezoito anos e limitações associadas a duas ou mais áreas de habilidades adaptativas, tais como: 1. comunicação; 2. cuidado pessoal; 3. habilidades sociais; 4. utilização dos recursos da comunidade; 5. saúde e segurança; 6. habilidades acadêmicas; 7. lazer; e 8. trabalho; 

                        V - deficiência múltipla - associação de duas ou mais deficiências.

                        b) No art. 1º, § 1º, incisos I e II, e § 2º, da Lei nº 12.764, de 27 de dezembro de 2012, que apresenta as seguintes definições acerca do Transtorno do Espectro Autista: § 1º Para os efeitos desta Lei, é considerada pessoa com transtorno do espectro autista aquela portadora de síndrome clínica caracterizada na forma dos seguintes incisos I ou I: 

                        I - deficiência persistente e clinicamente significativa da comunicação e da interação sociais, manifestada por deficiência marcada de comunicação verbal e não verbal usada para interação social; ausência de reciprocidade social; falência em desenvolver e manter relações apropriadas ao seu nível de desenvolvimento; 

                        II - padrões restritivos e repetitivos de comportamentos, interesses e atividades, manifestados por comportamentos motores ou verbais estereotipados ou por comportamentos sensoriais incomuns; excessiva aderência a rotinas e padrões de comportamento ritualizados; interesses restritos e fixos. § 2º A pessoa com transtorno do espectro autista é considerada pessoa com deficiência, para todos os efeitos legais. 

                        4.4.3. O(A) candidato(a) aprovado(a) nas vagas reservadas para Pessoas com Deficiência deverá apresentar, no momento da matrícula  através do Portal do Candidato do IFPR, laudo médico assinado por médico responsável que ateste alguma das condições descritas no item 4.4.2. 

                        4.4.3.1. O laudo médico deverá: 

                        a) Conter a classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID); 

                        b) Relatar a deficiência do candidato, que deverá se enquadrar em uma das categorias mencionadas no item 4.4.2; 

                        c) Ser emitido em papel timbrado e conter carimbo com o CRM e assinatura do médico. 

                        4.4.3.2. O(A) candidato(a) inscrito(a) nas vagas reservadas para Pessoas com Deficiência autoriza a utilização pelo IFPR do laudo médico entregue no momento da matrícula. 

                        4.4.4. Caso, no momento da matrícula, os documentos a que se refere o item 4.2.3 não sejam apresentados ou não comprovem a condição de renda requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

                        4.4.4.1 Ocorrendo a situação prevista no item 4.4.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VIII que deverá ser preenchido e enviado ao e-mail: recursos@ifpr.edu.br.

                        4.4.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.4.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

                        4.4.5. Caso seja constatada inexatidão ou irregularidade de informações, ainda que posteriormente ao processo seletivo e/ou à matrícula, o(a) candidato(a) será eliminado(a) do Processo Seletivo, declarando-se nulos todos os atos decorrentes de sua inscrição. 

                        

                        4.5 Cotas para Quilombolas

                        4.5.1. Os(As) candidatos(as) inscritos(as) pela ação afirmativa destinada a quilombolas são aqueles que comprovem residência/pertencimento às comunidades remanescentes de quilombo. 

                        4.5.2. Os(As) candidatos(as) inscritos(as) e preliminarmente aprovados em alguma ação afirmativa para quilombolas serão convocados(as), obrigatoriamente, a passar pelo procedimento de heteroidentificação, por meio de edital próprio.

                        4.5.3. O procedimento de heteroidentificação será realizado anteriormente à fase de matrícula.

                        4.5.4. Caso, após o procedimento de heteroidentificação, seja indeferida a autodeclaração como pessoa quilombola, o(a) candidato(a) somente poderá ser convocado em qualquer das chamadas, pela Ampla Concorrência e ou por outras ações afirmativas (cotas) que não sejam direcionadas a pessoas quilombolas. 

                        4.5.5. O(A) candidato(a) autodeclarado Quilombola, quando da convocação para a heteroidentificação, deverá apresentar, obrigatoriamente, os seguintes documentos:

                        a) Autodeclaração étnico-racial devidamente preenchida e assinada conforme Anexo XI; 

                        b) Cópia frente e verso de documento de identificação com foto; 

                        c) Declaração de residência/pertencimento às comunidades remanescentes de quilombo assinada por 3 (três) autoridades de Associação Quilombola reconhecida pela Fundação Palmares, com os respectivos contatos telefônicos das 3 (três) autoridades (modelo disponível aqui). 

                        4.5.6. As comunidades remanescentes de quilombos são apenas aquelas certificadas pela Fundação Cultural Palmares, nos termos do Decreto 4.887/03, de 20/11/2003. 

                        4.5.7. Demais orientações para a realização do procedimento de heteroidentificação estarão descritas em edital específico a ser publicado conforme cronograma do item 5.

                        

                        4.6. Todos os(as) candidatos(as) optantes pelo Sistema de Ações Afirmativas (cotas) concorrerão, primeiramente, na Ampla Concorrência e, se não classificados, concorrerão em seu respectivo grupo de Ações Afirmativas (cotas), de acordo com a sequência de prioridades abaixo:

                        a) IFPR-PPI - candidatos autodeclarados pretos, pardos ou indígenas, independentemente de renda familiar e de ter cursado a etapa anterior em escola pública.

                        b) IFPR-PCD - candidatos com deficiência, independentemente de renda familiar e de ter cursado a etapa anterior integralmente em escola pública.

                        c) EP - estudantes que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        d) EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        e) EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        f) EP-PPI -  Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        g) BR-EP - candidatos que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        h) BR-EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        i) BR-EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        j) BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        4.7 Caso o curso em questão possua número de candidatos(as) igual ou inferior ao número de vagas, todos os(as) candidatos(as) constarão apenas na lista geral da Ampla Concorrência, não precisando fazer qualquer comprovação quanto às ações afirmativas para as quais foi previamente classificado.

                        

                        5. DO CRONOGRAMA

                        PERÍODOS/DATAS
                            

                        ETAPAS

                        20/09/2024
                            

                        Publicação do Edital no site institucional

                        03/10/2024
                            

                        01/11/2024
                            

                        Período de inscrição on-line

                        03/10/2024
                            

                        25/10/2024
                            

                        Período de isenção de taxa de inscrição

                        30/10/2024
                            

                        Divulgação da Relação Nominal com resultado preliminar do pedido de isenções concedidas

                        31/10/2024
                            

                        31/10/2024
                            

                        Prazo para interposição de recursos contra Relação Nominal com resultado do pedido de isenções concedidas

                        4/11/2024
                            

                        Divulgação da Relação Nominal com resultado definitivo do pedido de isenções concedidas

                        06/11/2024
                            

                        Prazo final para pagamento da taxa de inscrição

                        13/11/2024
                            

                        Publicação da lista preliminar das inscrições homologadas no Processo Seletivo

                        14/11/2024
                            

                        14/11/2024
                            

                        Prazo para interposição de recurso referente à homologação de inscrições

                        18/11/2024
                            

                        18/11/2024
                            

                        Análise dos recursos contra o Resultado da lista preliminar dos inscritos no Processo Seletivo

                        19/11/2024
                            

                        Publicação final das inscrições homologadas

                        19/11/2024
                            

                        27/11/2024
                            

                        Análise dos históricos

                        28/11/2024
                            

                        Publicação da classificação preliminar

                        29/11/2024
                            

                        29/11/2024
                            

                        Prazo para interposição de recurso referente à classificação preliminar

                        03/12/2024
                            

                        Publicação do resultado dos recursos referentes à classificação preliminar

                        

                        Convocação dos candidatos inscritos nas vagas das ações afirmativas/cotas sociais para realização do processo de heteroidentificação e entrega de documentos para comprovação da condição de cotista.

                        05/12/2024
                            

                        16/12/2024
                            

                        Bancas de heteroidentificação e análise pelas comissões dos documentos entregues

                        17/12/2024
                            

                        Publicação do resultado preliminar da heteroidentificação e análise documental

                        19/12/2024
                            

                        19/12/2024
                            

                        Prazo para interposição de recurso contra o resultado preliminar da heteroidentificação e análise documental

                        20/12/2024
                            

                        Análise dos recursos pela Coordenação de Ações Inclusivas e comissão recursal de heteroidentificação

                        23/12/2024
                            

                        Publicação do resultado final do processo de heteroidentificação

                        23/12/2024
                            

                        Publicação do Resultado Final do Processo Seletivo.

                        

                        Convocação para matrícula da 1o chamada

                        20/01/2025
                            

                        24/01/2025
                            

                        Período de matrícula para os candidatos convocados na 1o chamada

                        28/01/2025
                            

                        Divulgação do resultado provisório das matrículas

                        29/01/2025
                            

                        Prazo para recurso contra o resultado provisório das matrículas

                        31/01/2025
                            

                        Divulgação do resultado definitivo das matrículas

                        

                        6. DAS INSCRIÇÕES

                        6.1 As inscrições devem ser feitas através do Portal do Candidato do IFPR que pode ser acessado através link https://portaldocandidato.ifpr.edu.br/. 

                        6.1.1 Para fazer seu login no Portal do Candidato do IFPR, o candidato deverá utilizar sua conta pessoal gov.br.

                        6.1.2 Caso não possua conta gov.br, o candidato deverá realizar o seu cadastro, conforme tutorial que pode ser acessado a partir do link dos vídeos tutoriais disponível no item 1.1.1.

                        6.2 A inscrição do(a) candidato(a) implicará ciência e aceitação das normas e condições estabelecidas no inteiro teor deste edital, das quais não poderá alegar desconhecimento. 

                        6.3 No ato da inscrição, o(a) candidato(a) deverá preencher integralmente o formulário de inscrição e indicar: 

                        a) responder ao questionário a que se refere o item 3.5.1 deste Edital;

                        b) conferir e confirmar as ações afirmativas para as quais estará concorrendo;

                        c) preencher todos os dados solicitados; 

                        d) informar a média de Língua Portuguesa e de Matemática, relativas aos 1º e 2º  do Ensino Médio, conforme o histórico escolar apresentado ou conforme exame nacional para certificação de competências de jovens e adultos (Encceja) ou de exames de certificação de competência ou de avaliação de jovens e adultos realizados pelos sistemas estaduais de ensino ou provas do Exame Nacional do Ensino Médio - Enem: Matemática e suas Tecnologias; Linguagens, Códigos e suas Tecnologias

                        e) realizar o upload do comprovante oficial de notas do Ensino Médio; 

                        f) confirmar a inscrição.

                        6.4 O(A) candidato(a) deverá seguir as orientações dispostas no Anexo IV  para indicar  a sua média. 

                        6.4.1 Para a indicação da média dos componentes curriculares Língua Portuguesa e Matemática devem ser considerados os dois primeiros anos do Ensino Médio, como disposto no ANEXO IV.

                        6.4.2 Nos casos em que o histórico escolar expressa os resultados por meio de conceitos ou quaisquer outras formas de indicação, o(a) candidato(a) deverá utilizar a seguinte tabela de conversão: 

                        INDICAÇÃO DE APRENDIZAGEM
                            

                        NOTA

                        Aprovado
                            

                        10

                        A ou A+
                            

                        10

                        A-
                            

                        9

                        B ou B+
                            

                        8,5

                        B-
                            

                        7,5

                        C ou C+
                            

                        7

                        C-
                            

                        6

                        6.4.3 Na modalidade Ensino Médio via Certificação do Encceja (Exame Nacional para Certificação de Competências de Jovens e Adultos) ou ENEM (Exame Nacional do Ensino Médio), o(a) candidato(a) deverá considerar a pontuação obtida nas áreas de conhecimento Linguagens, Códigos e suas Tecnologias e Matemática e suas Tecnologias. 

                        6.5 O(A) candidato(a) deve atentar-se ao correto preenchimento dos campos de notas, conforme orientações do Anexo IV, a depender do caso. 

                        6.6 As informações fornecidas no formulário de inscrição e o seu correto preenchimento são de responsabilidade do(a) candidato(a), dispondo o IFPR do direito de excluir do processo de ingresso aquele que não preencher a solicitação de inscrição de forma completa e correta, bem como aquele que fornecer dados comprovadamente inverídicos. 

                        6.7 Após o preenchimento dos formulários o candidato deverá realizar o pagamento da taxa no valor de R$30,00 (trinta reais) ou solicitar a isenção de inscrição.

                        6.7.1 Para realizar o pagamento da taxa de inscrição, o candidato deverá gerar, no Portal do Candidato do IFPR, boleto de pagamento em nome da FUNTEF-PR - Fundação de Apoio à UTFPR.

                        6.7.2 Caso o candidato solicite isenção do valor da inscrição, deverá seguir as instruções constantes no item 7 do Edital.

                        6.7.2.1 Em caso de indeferimento no pedido de isenção, o candidato deverá pagar a taxa de inscrição, conforme dispõe os itens 6.6 e 6.6.1, respeitados os prazos constantes no cronograma deste edital.

                        

                        7. DAS ISENÇÕES DE TAXA DE INSCRIÇÃO

                        7.1 A solicitação de isenção da taxa de inscrição se dará conforme o disposto no Decreto nº 6.593/2008. 

                        7.2. São requisitos para o(a) candidato(a) solicitar a isenção de pagamento da taxa de inscrição: 

                        a) estar inscrito(a) no Cadastro Único para Programas Sociais do Governo Federal (CadÚnico); 

                        b) conforme disposto no Decreto nº 11.016/2022, ter perfil de família com renda mensal per capita (por pessoa) de até meio salário mínimo (R$ 706,00).

                        7.3. Para solicitar a isenção da taxa de inscrição, o(a) candidato(a) deverá realizar os seguintes procedimentos: 

                        a) realizar sua inscrição no Portal do Candidato, conforme descrito no item 6.1; 

                        b) preencher o formulário de requerimento de isenção, disponível no Anexo VI. O formulário deverá ser assinado pelo(a) responsável do(a) candidato(a); 

                        c) providenciar os documentos comprobatórios solicitados no Anexo VI; 

                        d) digitalizar a carteira de identificação (CI) com foto do(a) candidato(a); 

                        e) enviar o formulário, a digitalização da carteira de identificação e os demais documentos comprobatórios no local indicado no Portal do Candidato. 

                        7.3.1. Serão aceitos os documentos enviados até a data limite para solicitar a isenção, definida no cronograma do item 5 deste edital.

                        7.3.2. Candidatos(as) oriundos(as) da mesma família deverão preencher o formulário de requerimento de forma individual.

                        7.3.3. Não será permitido o envio de quaisquer itens/documentos por correio postal ou e-mail que não seja o formulário online disponível no Portal do Candidato. 

                        7.4. Terá o seu requerimento de isenção da taxa de inscrição indeferido o(a) candidato(a) que: 

                        a) não apresentar, de forma completa, a documentação exigida no item 7.3; 

                        b) preencher de forma incorreta o formulário de requerimento (Anexo VI). 

                        7.5. A análise das solicitações será executada pela Equipe de Assessoramento do Processo Seletivo 2025 do IFPR, que irá avaliar as informações prestadas no formulário de requerimento e demais documentos anexados. 

                        7.5.1. O resultado das solicitações será publicado conforme data definida no cronograma do item 5 deste edital. 

                        7.6 Caso o candidato tenha entregado os documentos corretos, mas por algum motivo seu pedido tenha sido indeferido ele poderá fazer recurso através do formulário (Anexo VII) e enviá-lo através do e-mail: recursos@ifpr.edu.br.

                        7.6.1. O recurso será avaliado pela Equipe de Assessoramento do Processo Seletivo 2025 do IFPR.

                        7.7. A concessão de isenção da taxa de inscrição é pessoal e intransferível. 

                        7.8. O(A) candidato(a), cuja solicitação de isenção da taxa de inscrição for indeferida, deverá realizar o pagamento da taxa de inscrição, até a data limite, conforme orientações contidas nos itens 6.7 e 6.8 deste edital.

                        

                        8. DA CLASSIFICAÇÃO

                        8.1 A classificação será realizada em ordem decrescente da média gerada a partir das notas de Língua Portuguesa e Matemática informadas pelos(as) candidatos(as).

                        8.1.1 A média a que se refere o item 8.1 se dará numa escala de 0,00 (zero vírgula zero) a 10,00 (dez vírgula zero) e será calculada automaticamente pelo Portal do Candidato a partir das notas lançadas pelo(a) candidato(a).

                        8.1.2 Todos(as) os(as) candidatos(as) constarão na lista de classificação da Ampla Concorrência.

                        8.1.3 Além da lista da Ampla Concorrência, os(as) candidatos(as) constarão nas listas de todas as ações afirmativas as quais tenham sido enquadrados conforme item 3.5 deste edital.

                        8.1.4 Caso o curso em questão possua número de candidatos(as) igual ou inferior ao número de vagas, todos os(as) candidatos(as) serão classificados(as) apenas na lista geral da Ampla Concorrência.

                        8.2 No caso de empate, será considerada a seguinte regra para o desempate: 

                        a) maior idade; e

                        b) persistindo o empate, sorteio.

                        8.3 Anteriormente à publicação da classificação preliminar, as médias e notas informadas serão conferidas com o comprovante oficial de notas, submetido no formulário de inscrição. 

                        8.3.1 Se constatada divergência nas notas ou média informada, devido ao não atendimento das orientações do Anexo IV, a média do(a) candidato(a) poderá ser recalculada pela subcomissão de matrícula do campus, para que sejam atendidas na íntegra as referidas orientações.

                        8.3.2 Se constatados equívocos na média ou notas informadas pelo candidato, a média final do(a) candidato(a) será ajustada com o valor correto. 

                        8.3.2.1 Caso o documento oficial contendo as notas impossibilite a devida conferência, a nota do(a) candidato(a) será definida como 0 (zero). 

                        

                        

                        9. DOS RESULTADOS

                        9.1. O resultado preliminar do Processo Seletivo será divulgado em data definida pelo cronograma disponível no item 5 deste edital, no Portal do Candidato (https://portaldocandidato.ifpr.edu.br/)

                        9.2. Caberá recurso contra a classificação preliminar. O recurso deverá ser protocolado de forma online através do Portal do Candidato (https://portaldocandidato.ifpr.edu.br/) em datas definidas no cronograma disponível no item 5 deste edital. 

                        9.2.1. A Equipe de Assessoramento do Processo Seletivo 2025 do IFPR avaliará as informações prestadas no formulário de recurso referente à classificação, deferindo ou não o pedido. 

                        9.3. O resultado final será constituído da lista geral de classificação pela ampla concorrência e por cada uma das ações afirmativas (cotas), para cada campus e curso. 

                        9.3.1. A lista geral de classificação em cada uma das ações afirmativas poderá sofrer alterações durante o processo de heteroidentificação e da análise dos documentos de matrícula dos(as) candidatos(as) inscritos(as) nas ações afirmativas de Baixa Renda, PcD e Escola Pública. 

                        9.4. Respeitado o disposto no item 4.6 deste edital, os candidatos aprovados dentro das vagas previstas serão convocados para matrícula em primeira chamada.

                        9.4.1 Após as matrículas a que se refere o item 9.4 e que estão descritas no título 10, poderão ocorrer chamadas complementares, caso algum candidato previamente convocado não confirme sua matrícula.

                        

                        10. DAS MATRÍCULAS

                        10.1. A matrícula será permitida ao(à) candidato(a) que apresentar toda a documentação exigida e tenha concluído o Ensino Médio. 

                        10.2. A matrícula dos candidatos(as) aprovados(as) nas chamadas do Processo Seletivo ocorrerá respeitando as vagas disponíveis, a ordem de classificação estabelecida conforme resultado do Exame de Classificação e o Sistema de Ações Afirmativas (cotas).

                        10.3. As matrículas dos(as) candidatos(as) aprovados(as) deverão ser realizadas de forma online, exclusivamente no Portal do Candidato do IFPR (https://portaldocandidato.ifpr.edu.br/), por meio do login na conta individual de cada candidato(a). 

                        10.3.1. O(A) candidato(a) deverá acessar o Portal do Candidato e realizar o upload dos documentos solicitados conforme o período definido no cronograma. 

                        10.4. É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação do edital e as chamadas de candidatos(as) aprovados(as). 

                        10.5. O(A) candidato(a) que não realizar sua matrícula, conforme datas e definições do edital, perderá o direito à vaga, possibilitando que o(a) próximo(a) candidato(a) da lista de classificação seja convocado(a). 

                        10.5.1 Ocorrendo a situação prevista no item 10.5, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VII que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

                        10.6. Os documentos para matrícula, comuns a todos(as) os(as) candidatos(as), são:

                        10.6.1 Carteira de identidade;

                        10.6.1.1 Se candidato(a) estrangeiro(a), em substituição ao documento previsto no item 10.6.1, deve ser apresentado: documento de identidade nacional de estrangeiro (Carteira de Registro Nacional Migratório - CRNM) ou Residência Mercosul, emitida por autoridade brasileira, válida à data da matrícula;

                        10.6.2 Certidão de nascimento ou Certidão de Casamento;

                        10.6.3 Certificado de Alistamento Militar, de Dispensa de Incorporação ou de Reservista, no caso dos candidatos do sexo masculino maiores de 18 anos e com idade até 45 anos;

                        10.6.4 Declaração de vacinação (para candidatos com menos de 18 (dezoito) anos) emitida e assinada por profissional de saúde, atestando que o adolescente está com o seu esquema vacinal de acordo com a recomendação estabelecida no Programa Nacional de Imunização – PNI, do Ministério da Saúde e da Secretaria de Estado da Saúde;

                        10.6.5. Uma via impressa da certidão de quitação eleitoral (para candidatos com mais de 18 (dezoito) anos que já possuem titulo eleitoral), que poderá ser obtida em qualquer Cartório Eleitoral e também na página eletrônica www.tse.jus.br.

                        10.6.6 Certificado de conclusão do Ensino Médio ou equivalente que comprove a conclusão do Ensino Médio;

                        10.6.6.1 Poderá ser apresentada Declaração de Conclusão do Ensino Médio, desde que, num prazo de 60 (sessenta) dias, o histórico seja apresentado à Secretaria Acadêmica do campus;

                        10.6.6.2 O candidato que realizou seus estudos em instituições estrangeiras, além da documentação e procedimentos definidos neste Edital, também deve entregar Comprovante de Conclusão de Ensino Médio, revalidado no Brasil na forma da lei.
                        10.6.6.2.1 É dispensada a revalidação se o comprovante de conclusão de estudos pertencer a um país integrante do Mercosul.

                        10.6.7 Formulário de Requerimento de Matrícula devidamente preenchido pelo responsável legal em caso de candidatos menores de 18 anos (conforme Anexo IX); e

                        10.6.8 Documento de Identificação do Responsável Legal para menores de 18 anos.

                        10.7. Os documentos necessários para comprovação das Ações Afirmativas (cotas) de Baixa Renda, Pessoa com Deficiência e Escola Pública são:

                        10.7.1 AÇÃO AFIRMATIVA DE ESCOLA PÚBLICA: Os candidatos deverão apresentar, no momento da matrícula, Histórico Escolar por meio do qual comprovem ter cursado e concluído todo o ensino médio (do primeiro ao terceiro anos, ou equivalente) exclusivamente na rede pública de ensino do Brasil.

                        10.7.2 AÇÃO AFIRMATIVA DE PESSOA COM DEFICIÊNCIA: Laudo médico atestando a espécie e o grau da deficiência. O laudo deverá:

                        a) Conter a classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID);

                        b) Relatar a deficiência do candidato, que deverá se enquadrar em uma das categorias mencionadas no edital do processo seletivo;

                        c) Ser emitido em papel timbrado e conter carimbo com o CRM e assinatura do médico.

                        10.7.3 AÇÃO AFIRMATIVA DE BAIXA RENDA: documentos especificados no Anexo VII deste Edital.

                        10.8  O estudante que ingressar mediante processo seletivo tendo efetuado seu registro acadêmico, deverá realizar a confirmação de sua matrícula devendo possuir frequência a pelo menos uma das aulas previstas para os 5 (cinco) primeiros dias letivos do calendário acadêmico do campus. 

                        10.8.1 A não realização da confirmação de matrícula pelo estudante ou de pessoa por ele autorizada para tal, caracterizar-se-á como desistência, o que ocasionará o cancelamento do seu registro acadêmico.

                        

                        11. DAS DISPOSIÇÕES FINAIS

                        11.1. A Comissão Central do Processo Seletivo, a  Equipe de Assessoramento do Processo Seletivo e o IFPR não se responsabilizam por solicitação de inscrição via internet não efetivada por motivos de ordem técnica, falhas de comunicação, congestionamento de linhas de comunicação ou quaisquer outros fatores de ordem técnica que impossibilitem a transferência dos dados ou a impressão de documentos.

                        11.2. A inscrição do(a) candidato(a) implicará a aceitação total e incondicional das normas e instruções constantes neste edital.

                        11.3. É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação dos resultados das etapas do Processo Seletivo através do Portal do Candidato do IFPR (https://portaldocandidato.ifpr.edu.br/).

                        11.4. A inexatidão ou irregularidade de informações, ainda que constatada posteriormente ao processo seletivo e/ou à matrícula, eliminará o(a) candidato(a) do Processo Seletivo, declarando-se nulos todos os atos decorrentes de sua inscrição.

                        11.5 Após esgotadas as chamadas complementares previstas no item 9.4.1 e persistindo a existência de vagas não ocupadas, novo processo seletivo será realizado com regramento a ser publicado em edital próprio.

                        11.6 Os candidatos que não têm acesso a equipamento e/ou internet poderão dirigir-se a um dos campi do IFPR (de acordo com os endereços indicados no Anexo V), de segunda-feira a sexta-feira, no horário de funcionamento do campus, no período destinado às inscrições. 

                        11.7. Os casos omissos e as situações não previstas no presente edital serão analisados pela Comissão Central do Processo Seletivo e pela Equipe de Assessoramento do Processo Seletivo.

                        Curitiba, 20 de setembro de 2024.

                        

                        

                        

                        Assinado:
                        logotipo 	

                        Documento assinado eletronicamente por ADRIANO WILLIAN DA SILVA VIANA PEREIRA, Reitor, em 20/09/2024, às 21:20, conforme horário oficial de Brasília, com fundamento no art. 6º, caput, do Decreto nº 8.539, de 8 de outubro de 2015.
                        QRCode Assinatura 	

                        A autenticidade deste documento pode ser conferida no site https://sei.ifpr.edu.br/sei/controlador_externo.php?acao=documento_conferir&id_orgao_acesso_externo=0, informando o código verificador 3185078 e o código CRC 3103DDC4.

                        ANEXO I - EDITAL Nº 88, DE 20 DE SETEMBRO DE 2024

                        QUADRO DE OFERTAS DE CURSOS TÉCNICOS SUBSEQUENTES AO ENSINO MÉDIO 

                        Campus
                            

                        Curso
                            

                        Nível de Ensino
                            

                        Forma de Oferta
                            

                        Turmas
                            

                        Turno
                            

                        Vagas
                            

                        Duração do Curso

                        ARAPONGAS
                            

                        Técnico em Melhoria de Processos
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        ASSIS CHATEAUBRIAND
                            

                        Técnico em Agropecuária
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        ASSIS CHATEAUBRIAND
                            

                        Técnico em Alimentos
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        ASSIS CHATEAUBRIAND
                            

                        Técnico em Eletromecânica
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        ASSIS CHATEAUBRIAND
                            

                        Técnico em Eletrotécnica
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        ASTORGA
                            

                        Técnico em Desenvolvimento de Sistemas
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        CAMPO LARGO
                            

                        Técnico em Mecânica
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Condomínio
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        1 ano

                        CURITIBA
                            

                        Técnico em Edificações
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Eletromecânica
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        30
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Eletrotécnica
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        35
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Enfermagem
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Matutino
                            

                        30
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Eventos
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        35
                            

                        1 ano

                        CURITIBA
                            

                        Técnico em Mecânica
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        36
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Processos Fotográficos
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Matutino
                            

                        30
                            

                        1,5 anos

                        CURITIBA
                            

                        Técnico em Produção de Áudio e Vídeo
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        30
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Prótese Dentária
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Vespertino
                            

                        25
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Prótese Dentária
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        25
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Radiologia
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Matutino
                            

                        35
                            

                        2 anos

                        CURITIBA
                            

                        Técnico em Telecomunicações
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        36
                            

                        2 anos

                        FOZ IGUAÇU
                            

                        Técnico em Gastronomia
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Vespertino
                            

                        22
                            

                        1 ano

                        JACAREZINHO
                            

                        Técnico em Teatro
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        30
                            

                        2 anos

                        LONDRINA
                            

                        Técnico em Enfermagem
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Diurno¹
                            

                        30
                            

                        2 anos

                        LONDRINA
                            

                        Técnico em Massoterapia
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Matutino
                            

                        40
                            

                        2 anos

                        LONDRINA
                            

                        Técnico em Prótese Dentária
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        LONDRINA
                            

                        Técnico em Saúde Bucal
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        30
                            

                        2 anos

                        PARANAVAÍ
                            

                        Técnico em Eletromecânica
                            

                        Médio
                            

                        Subsequente
                            

                        1
                            

                        Noturno
                            

                        40
                            

                        2 anos

                        ¹O curso cujo turno está assinalado como sendo “Diurno”, aparece no Portal do Candidato do IFPR como turno “Integral”, sem prejuízo à informação deste quadro de vagas e a consequente necessidade de o estudante cumpri-la.


                        

                        ANEXO II - EDITAL Nº 88, DE 20 DE SETEMBRO DE 2024

                        DISTRIBUIÇÃO DAS VAGAS POR FAIXAS DE AÇÃO AFIRMATIVA

                        
                            

                        Estudantes que tenham cursado a etapa anterior integralmente em Escola Pública (60% das vagas)
                            

                        Ações afirmativas - IFPR (15% das vagas)
                            

                        Ampla Concorrência (25% das vagas)

                        
                            

                        Estudantes que possuam renda bruta familiar per capita igual ou inferior a 1 salário mínimo (30% das vagas)
                            

                        Estudantes que possuam renda bruta familiar per capita superior a 1 salário mínimo (30% das vagas)

                        NÚMERO DE VAGAS OFERTADAS POR CAMPUS, CURSO E TURNO
                            

                        BR-EP-PPI
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-Q
                            

                        EP-PCD
                            

                        EP
                            

                        IFPR-PPI
                            

                        IFPR-PCD
                            

                        AC

                        40
                            

                        5
                            

                        1
                            

                        2
                            

                        5
                            

                        5
                            

                        0
                            

                        2
                            

                        5
                            

                        3
                            

                        2
                            

                        10

                        36
                            

                        4
                            

                        1
                            

                        1
                            

                        5
                            

                        4
                            

                        0
                            

                        2
                            

                        5
                            

                        3
                            

                        2
                            

                        9

                        35
                            

                        4
                            

                        1
                            

                        1
                            

                        5
                            

                        4
                            

                        0
                            

                        1
                            

                        5
                            

                        3
                            

                        2
                            

                        9

                        30
                            

                        4
                            

                        1
                            

                        1
                            

                        4
                            

                        4
                            

                        0
                            

                        1
                            

                        4
                            

                        3
                            

                        1
                            

                        7

                        25
                            

                        3
                            

                        1
                            

                        1
                            

                        3
                            

                        3
                            

                        0
                            

                        1
                            

                        3
                            

                        3
                            

                        1
                            

                        6

                        22
                            

                        3
                            

                        1
                            

                        1
                            

                        2
                            

                        3
                            

                        0
                            

                        1
                            

                        3
                            

                        2
                            

                        1
                            

                        5

                        OBSERVAÇÃO: O cálculo para a distribuição de vagas, seus possíveis arredondamentos e redistribuições, seguem o disposto na Portaria MEC nº 2027 de 16 de novembro de 2023, o que pode fazer com que algumas cotas não atendam os percentuais indicados no título.

                        

                        ANEXO III - EDITAL Nº 88, DE 20 DE SETEMBRO DE 2024

                        MAPA DE MIGRAÇÃO DAS VAGAS EM AÇÕES AFIRMATIVAS SEM CANDIDATOS APTOS A OCUPÁ-LAS

                        SOBROU VAGA AQUI
                            

                        1º VAI PARA:
                            

                        2º VAI PARA:
                            

                        3º VAI PARA:
                            

                        4º VAI PARA:
                            

                        5º VAI PARA:
                            

                        6º VAI PARA:
                            

                        7º VAI PARA:
                            

                        8º VAI PARA:
                            

                        9º VAI PARA:
                            

                        10º VAI PARA:

                        IFPR-PPI
                            

                        IFPR-PCD
                            

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-Q 
                            

                        EP-PCD
                            

                        EP
                            

                        AC

                        IFPR-PCD
                            

                        IFPR-PPI
                            

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-Q 
                            

                        EP-PCD
                            

                        EP
                            

                        AC

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-Q 
                            

                        EP-PCD
                            

                        EP
                            

                        AC

                        BR-EP-Q
                            

                        BR-EP-PPI 
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-Q 
                            

                        EP-PCD
                            

                        EP
                            

                        AC

                        BR-EP-PCD
                            

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-Q 
                            

                        EP-PCD
                            

                        EP
                            

                        AC

                        BR-EP 
                            

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        EP-PPI
                            

                        EP-Q 
                            

                        EP-PCD
                            

                        EP
                            

                        AC

                        EP-PPI
                            

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-Q 
                            

                        EP-PCD
                            

                        EP
                            

                        AC

                        EP-Q 
                            

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-PCD
                            

                        EP
                            

                        AC

                        EP-PCD
                            

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-Q 
                            

                        EP
                            

                        AC

                        EP
                            

                        BR-EP-PPI 
                            

                        BR-EP-Q
                            

                        BR-EP-PCD
                            

                        BR-EP
                            

                        EP-PPI
                            

                        EP-Q 
                            

                        EP-PCD
                            

                        AC

                        

                        ANEXO IV - EDITAL Nº 88, DE 20 DE SETEMBRO DE 2024

                        ORIENTAÇÕES PARA INSCRIÇÃO E CÁLCULO DA MÉDIA DOS COMPONENTES CURRICULARES DE MATEMÁTICA E LÍNGUA PORTUGUESA DE CONCLUSÃO DO ENSINO MÉDIO

                        1. A média final deverá ser expressa de 0,00 (zero) a 10,00 (dez), utilizando-se duas casas após a vírgula. 

                        a) Deve-se indicar as notas de Língua Portuguesa e Matemática do PRIMEIRO ano.

                        b) Deve-se indicar as notas de Língua Portuguesa e Matemática do SEGUNDO  ano.

                        c) O sistema fará a média das notas.

                        d) Ao calcular suas médias, o(a) candidato(a) deverá considerar as seguintes situações:

                        e) Caso o histórico contenha notas em escalas diferentes de 0(zero) a 10(dez), as notas devem ser convertidas antes de realizar o cálculo da média geral. Por exemplo, no caso da nota estar representada no formato 88, esta deve ser transformada para 8,8(88 ÷ 10). 

                        f) Caso o histórico venha com conceitos e não notas, respeitar a tabela indicada no item 6.4.3 deste edital.

                        g) Estudantes que possuem em seu histórico escolar registro de disciplinas (Português e/ou Matemática) com dependência, deverão considerar a nota obtida após aprovação na referida disciplina de dependência. Por exemplo, o estudante ficou em dependência na disciplina A em seu 1º ano do ensino médio, vindo a cursar a dependência desta disciplina no 2º ano. Ao calcular a média do primeiro ano, deverá ser considerada, para a disciplina A, a nota obtida na dependência cursada durante o 2º ano. 

                        

                        2. Para a modalidade Ensino Médio via Certificação do Encceja (Exame Nacional para Certificação de Competências de Jovens e Adultos) ou do Exame Nacional do Ensino Médio (ENEM)

                        a) O(A) candidato(a) deverá informar a pontuação obtida nas áreas de conhecimento Linguagens, Códigos e suas Tecnologias e Matemática e suas Tecnologias. 

                        b) O sistema fará a média.

                        

                        ANEXO V - EDITAL Nº 88, DE 20 DE SETEMBRO DE 2024

                        ENDEREÇOS DOS CAMPI DO IFPR

                        CAMPUS
                            

                        ENDEREÇO
                            

                        PÁGINA ELETRÔNICA

                        ARAPONGAS
                            

                        Rua Surucuá Açu, 321 – Vila Araponguinha
                            

                        https://ifpr.edu.br/arapongas/

                        ASTORGA
                            

                        Rodovia PR 454, Contorno Norte
                            

                        https://ifpr.edu.br/astorga/

                        ASSIS CHATEAUBRIAND
                            

                        Av. Cívica, 475 – Centro Cívico
                            

                        https://ifpr.edu.br/assis-chateaubriand/

                        BARRACÃO
                            

                        Rodovia BR 163, nº 2115 - Industrial, Barracão
                            

                        https://ifpr.edu.br/barracao/

                        CAMPO LARGO
                            

                        R. Eng. Tourinho, 829 - Vila Solene
                            

                        https://ifpr.edu.br/campo-largo/

                        CAPANEMA
                            

                        Rua Cariris nº 750 Bairro Santa Bárbara
                            

                        https://ifpr.edu.br/capanema/

                        CASCAVEL
                            

                        Avenida das Pombas, 2020 - Floresta
                            

                        https://ifpr.edu.br/cascavel/

                        COLOMBO
                            

                        Rua Antonio Chemin, 28, São Gabriel
                            

                        https://ifpr.edu.br/colombo/

                        CORONEL VIVIDA
                            

                        PR 562, Flor da Serra
                            

                        https://ifpr.edu.br/coronel-vivida/

                        CURITIBA
                            

                        R. João Negrão, 1285
                            

                        https://ifpr.edu.br/curitiba/

                        FOZ DO IGUAÇU
                            

                        Avenida Araucária, 780, Bairro Vila A
                            

                        https://ifpr.edu.br/foz-do-iguacu/

                        GOIOERÊ
                            

                        Rodovia Luiz Dechiche, s/nº
                            

                        https://ifpr.edu.br/goioere/

                        IRATI
                            

                        Rua Pedro Koppe, 100 – Vila Matilde
                            

                        https://ifpr.edu.br/irati/

                        IVAIPORÃ
                            

                        Rua Max Arthur Greipel, nº 505
                            

                        https://ifpr.edu.br/ivaipora/

                        JACAREZINHO
                            

                        Avenida Dr. Tito nº: 801 – Jardim Panorama
                            

                        https://ifpr.edu.br/jacarezinho/

                        JAGUARIAÍVA
                            

                        Av. Eloa Martins Passos Felix – Rod. 151 Km 213,7
                            

                        https://ifpr.edu.br/jaguariaiva/

                        LONDRINA
                            

                        Rua João XXIII, nº 600, Jardim Dom Bosco
                            

                        https://ifpr.edu.br/londrina/

                        PALMAS
                            

                        Av. Bento Munhoz da Rocha Neto, s/nº
                            

                        https://ifpr.edu.br/palmas/

                        PARANAGUÁ
                            

                        Rua Antonio Carlos Rodrigues, n.º 453 – Porto Seguro
                            

                        https://ifpr.edu.br/paranagua/

                        PARANAVAÍ
                            

                        Rua José Felipe Tequinha, 1400 – Jardim das Nações
                            

                        https://ifpr.edu.br/paranavai/

                        PINHAIS
                            

                        Rua Humberto de Alencar Castelo Branco, 1575 Jardim Amélia
                            

                        https://ifpr.edu.br/pinhais/

                        PITANGA
                            

                        Rua José de Alencar, 1.080 – Vila Planalto
                            

                        https://ifpr.edu.br/pitanga/

                        QUEDAS DO IGUAÇU
                            

                        Rua, Marginal Imbirama, 300 - linha Tapuí
                            

                        https://ifpr.edu.br/quedas-do-iguacu/

                        TELÊMACO BORBA
                            

                        Rodovia PR 160 – km 19,5 – Jardim Bandeirantes
                            

                        https://ifpr.edu.br/telemaco-borba/

                        UMUARAMA
                            

                        Rodovia PR 323, KM 302, Parque Industrial
                            

                        https://ifpr.edu.br/umuarama/

                        UNIÃO DA VITÓRIA
                            

                        Av. Paula Freitas, 2800 - São Braz
                            

                        https://ifpr.edu.br/uniao-da-vitoria/

                        

                        ANEXO VI - EDITAL Nº 88, DE 20 DE SETEMBRO DE 2024

                        FORMULÁRIO PARA ISENÇÃO DA TAXA DE INSCRIÇÃO DE PROCESSO SELETIVO

                        IDENTIFICAÇÃO DO CANDIDATO

                        

                        Nome completo:

                        

                        Número de Identificação Social do candidato(NIS):

                        

                        Nº da Carteira de Identidade:

                        
                            

                        CPF:

                        Email:

                        
                            

                        Telefone:

                        Curso e Campus para qual está inscrito(a):

                        

                        O(A) candidato(a) declara estar inscrito(a) no Cadastro único para programas Sociais do Governo Federal e possuir perfil de de renda bruta familiar de até meio(0,5) salário mínimo per capita.

                        (   )SIM (  )NÃO

                        Documentos a serem enviados junto a este formulário:

                        a) Digitalização da carteira de identificação(CI) do(a) candidato(a);

                        b) Comprovante de inscrição no Cadastro Único para Programas Sociais do Governo Federal – Cadastro Único.

                        

                        __________________________(PR), ____de _______________________de 20____.

                        

                        ______________________________________________________________________

                        Assinatura do(a) declarante ou responsável legal (quando o(a) declarante tiver idade inferior a 18 anos)

                        **Ratifico serem verdadeiras as informações prestadas, estando ciente de que a informação falsa incorrerá nas penas do crime do art. 299 do Código Penal (falsidade ideológica);

                        

                        ANEXO VII - EDITAL Nº 88, DE 20 DE setembro DE 2024

                        COMPROVAÇÃO DOCUMENTAL DA RENDA BRUTA MENSAL PARA AVALIAÇÃO DE COTAS BAIXA RENDA

                        

                        Os/as candidatos/as aprovados/as nas ações afirmativas de escola pública e baixa renda (BR-EP; BR-EP-PCD; BR-EP-Q; BR-EP-PPI)  deverão comprovar renda familiar bruta mensal per capita (por pessoa) igual ou inferior a 1 (um) salário-mínimo nacional - (R$ 1.412,00).  

                        Para essa comprovação, você poderá proceder de 2 formas distintas:

                        a) Apresentar comprovante de inscrição do CadÚnico (Programa de Cadastro único do Governo Federal) que deverá estar atualizado nos últimos 24 (vinte e quatro) meses anteriores à data de inscrição no Processo Seletivo.

                        

                        OU como alternativa aos que não possuem inscrição no CadÚnico:

                        b) Enviar os comprovantes exigidos em edital para todos os membros da família:

                        

                        1: Preencher e assinar a Declaração de Núcleo Familiar Renda Bruta Familiar disponível no link indicado no item 1.1.2 deste edital.

                        

                        2: ANEXAR DOCUMENTAÇÃO COMUM A TODOS OS MEMBROS DO NÚCLEO FAMILIAR E AO CANDIDATO:

                        a) Certidão de Nascimento ou Cédula de Identidade (RG) ou Passaporte ou Carteira Nacional de Habilitação, de todos os integrantes do núcleo familiar;

                        b) CPF de todos os integrantes do núcleo familiar, com mais de 18 anos;

                        c) Comprovante de residência;

                        d) Carteira de Trabalho e Previdência Social (CTPS) física, para todos os integrantes com mais de 18 anos, a qual deverá conter as páginas da: foto, qualificação civil, contratos de trabalho e a próxima página em branco de contrato de trabalho. Ou, Carteira de Trabalho Digital em PDF Único atualizada, contendo todos os dados pessoais e contratos de trabalho. Caso não possua CTPS, preencher e assinar Declaração De Não Possuir Carteira De Trabalho E Previdência Social (CTPS) disponível no link indicado no item 1.1.2 deste edital.

                        e) Declaração de Imposto de Renda completa COM recibo (Exercício 2024, ano calendário 2023), aos componentes do núcleo familiar com mais de 18 anos, caso seja declarante. Aos componentes do núcleo familiar, com mais de 18 anos não declarantes de Imposto de Renda, apresentar comprovante, disponível no link abaixo para consulta:  Disponível em: <https://www.restituicao.receita.fazenda.gov.br>

                        

                        3: DOCUMENTAÇÃO DE RENDA PARA TODOS OS INTEGRANTES DO NÚCLEO FAMILIAR COM MAIS DE 18 ANOS: (Caso o núcleo familiar seja composto por integrantes de diferentes categorias (assalariados, autônomos etc.), a documentação deverá ser apresentada em acordo com cada realidade de trabalho e renda).

                        3.1.  DESEMPREGADOS, ESTUDANTES OU DONA(O) DE CASA:

                        a) Em caso de desemprego recente, apresentar Rescisão de Contrato e comprovante de recebimento do seguro desemprego, e/ou;

                        b) Preencher e assinar a Declaração – Não Possui Renda Mensal disponível no link indicado no item 1.1.2 deste edital.

                        

                        3.2.  TRABALHADORES ASSALARIADOS (celetistas, servidores públicos, empregado doméstico, aprendizes):

                        a) Contracheques/holerites dos três meses anteriores à inscrição (julho, agosto e setembro de 2024).

                        

                        3.3.  APOSENTADOS, PENSIONISTAS E DEMAIS BENEFICIÁRIOS DO INSS:

                        a) Comprovante do benefício do INSS (aposentado, pensionista ou demais beneficiários), demonstrando o valor bruto recebido dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024); OU

                        b) Comprovante de aposentadoria (caso não seja INSS).

                        

                        3.4.  AUTÔNOMOS E PROFISSIONAIS LIBERAIS:

                        a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

                        b) Preencher e assinar declaração da atividade desenvolvida como autônomo ou liberal e a renda bruta mensal (Declaração Renda variável) disponível no link indicado no item 1.1.2 deste edital.

                        c) Guias de recolhimento ao INSS com comprovante de pagamento dos três meses anteriores à inscrição.

                        

                        3.5.  EMPRESÁRIO OU PESSOAS COM PARTICIPAÇÃO EM COTAS DE EMPRESAS OU MICROEMPRESAS:

                        a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

                        b) Preencher e assinar declaração da atividade desenvolvida e a renda como empresário/microempreendedor (Declaração Renda variável) disponível no link indicado no item 1.1.2 deste edital.

                        c) Pró-labores dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

                        d) Declaração completa de Imposto de Renda de Pessoa Jurídica – DIPJ, exercício 2024 ano calendário 2023, acompanhado do recibo de entrega, quando houver;

                        e) Declaração completa de Informações socioeconômicas e Fiscais (DEFIS- Simples Nacional) para Microempresários e Empresários de Pequeno Porte, quando houver;

                        f)  Declaração Comprobatória de Percepção de Rendimentos (DECORE), quando houver,

                        

                        3.6.  MICROEMPREENDEDOR INDIVIDUAL:

                        a) Extratos bancários dos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

                        b) Preencher e assinar declaração relatando a atividade desenvolvida como microempreendedor e a renda mensal (Declaração Renda variável), disponível no link indicado no item 1.1.2 deste edital; e

                        c) Declaração Anual CNPJ MEI (DASN-SIMEI).

                        

                        3.7.  TRABALHADORES DO MERCADO INFORMAL: (atividade sem vínculo empregatício, não possui contrato de trabalho, não contribui com INSS).

                        a) Preencher e assinar declaração relatando a renda bruta mensal e a atividade desenvolvida como trabalhador informal (Declaração Renda variável), disponível no link indicado no item 1.1.2 deste edital.

                        

                        3.8.  ESTAGIÁRIOS ou BOLSISTAS:

                        a) Contrato de estágio/bolsa, ou Termo de Compromisso de estágio/bolsa.

                        

                        3.9.  RENDIMENTOS DE ALUGUEL OU ARRENDAMENTO DE BENS MÓVEIS E IMÓVEIS:

                        a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

                        b) Contrato(s) de locação ou arrendamento(s) devidamente registrado(s) em cartório, acompanhado(s) dos recibos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), ou;

                        c) Preencher e assinar declaração de próprio punho relatando o valor recebido, acompanhada dos recibos dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024).

                        

                        3.10. PARA CASOS DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA:

                        a) Decisão judicial discriminando o nome do(s) beneficiários e o valor a ser pago, ou;

                        b) Preencher e assinar declaração do beneficiário e o valor mensal recebido de pensão, (Declaração Renda variável), disponível no link indicado no item 1.1.2 deste edital.

                        

                        3.11. ATIVIDADE RURAL:

                        a) Extratos bancários dos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

                        b)  Declaração do sindicato rural, associação, cooperativa ou prefeitura, contendo o valor recebido mensalmente ou anualmente e informações detalhadas atividade desenvolvida, ou

                        c)  Preencher e assinar declaração, contendo o valor recebido mensalmente ou anualmente, e informações da atividade desenvolvida, anexando as 3 (três últimas) notas fiscais de vendas de produtos, (Declaração Renda variável), disponível no link indicado no item 1.1.2 deste edital; e

                        d)  Declaração de Imposto de Renda Pessoa Jurídica - IRPJ, quando houver;

                        e)  Quaisquer declarações tributárias referentes a pessoas jurídicas vinculadas ao candidato ou a membros da família, quando for o caso.

                        

                        ANEXO VIII - EDITAL Nº 88, DE 20 DE SETEMBRO DE 2024

                        FORMULÁRIO DE SOLICITAÇÃO DE RECURSO

                        Nome do candidato(a):

                        

                        Curso e campus para o qual se inscreveu:

                        

                        CPF do candidato(a):

                        

                        Selecione o tipo de recurso que você deseja protocolar (assinale apenas uma opção)

                        

                        (   ) Recurso contra homologação de inscrição.

                        (   ) Recurso contra o indeferimento da solicitação de isenção da taxa de inscrição.

                        (   ) Recurso contra o indeferimento da autodeclaração étnico-racial.

                        (   ) Recurso contra o indeferimento da matrícula.

                        

                        Justificativa do recurso:

                        

                        

                        

                        

                        

                        

                        

                        ________________________ - PR, ____ de ____________________ de 20___.

                        

                        _____________________________________________

                        Assinatura do(a) Candidato(a) ou do Responsável Legal 


                        Justificativa da decisão:

                        








                        

                        

                        ANEXO IX - EDITAL Nº 88, DE 20 DE SETEMBRO DE 2024

                        REQUERIMENTO DE MATRÍCULA

                        CURSO:________________________________________________________________

                        (    ) Integrado    (    ) Subsequente  (   ) Licenciatura  (    ) Bacharelado  (    ) Tecnologia

                        

                        CAMPUS:_______________________________________________________________

                        PERÍODO DE INGRESSO: 2025

                        SEMESTRE:________TURNO:_____________________________

                        AÇÃO AFIRMATIVA DE CONCORRÊNCIA/COTA: _______________ (Ver Código Quadro Abaixo)  

                        IFPR-PPI - candidatos autodeclarados pretos, pardos ou indígenas, independentemente de renda familiar e de ter cursado a etapa anterior em escola pública.

                        IFPR-PCD - candidatos com deficiência, independentemente de renda familiar e de ter cursado a etapa anterior integralmente em escola pública.

                        EP - estudantes que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

                        EP-PPI -  Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.
                            

                        BR-EP - candidatos que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        BR-EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        BR-EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

                        AC - Ampla Concorrência.

                        DADOS DO ESTUDANTE:

                        NOME:_________________________________________________________________

                        RG______________________ ORG./UF:________ CPF__________________________

                        NOME DO RESPONSÁVEL LEGAL: _________________________________________________________________

                        PARENTESCO DO RESPONSÁVEL LEGAL COM O ESTUDANTE: ___________________________________________

                        (Nos casos de guarda, tutela ou outro documento de responsabilidade incluir junto ao requerimento o documento comprobatório).

                        TELEFONE DO ESTUDANTE:________________________ TELEFONE DO RESPONSÁVEL:_______________________ 

                        

                        EMAIL:_________________________________________________________________

                        ENDEREÇO RESIDENCIAL: ________________________________________________________________ CEP: _________________________

                        (   ) DECLARO, sob as penas da lei, que não possuo escolaridade de nível superior (Para os candidatos que  concorrem às vagas de inclusão).

                        ( ) DECLARO, para os devidos fins, que assumo total responsabilidade sobre as informações contidas neste documento. Por ser expressão da verdade, dato e assino o presente documento, ficando ciente de que no caso de inveracidade comprovada estarei sujeito às penalidades cabíveis.

                        _________________________, __________ de _______________________ de 20____

                        

                        _______________________________                       _____________________________

                            Assinatura da(o) estudante                                 Assinatura da(o) responsável legal

                        

                        ANEXO X - EDITAL IFPR Nº 88, DE 20 DE setembro DE 2024

                        DECLARAÇÃO DA COMUNIDADE ÍNDIGENA

                        

                        

                        Declaramos para os devidos fins que o(a) candidato(a) __________________________________________ portador(a) do CPF n.º _______________________________, reside/pertence à Comunidade Indígena de ___________________________________ do município de ______________________________ , Estado ________________________.

                        

                        

                        DADOS DA LIDERANÇA 1

                        Nome completo:
                            

                        CPF:

                        Telefone (com código de área): (____) _____________________
                            

                        Função que exerce na Comunidade Indígena:

                        Assinatura

                        

                        

                        

                        DADOS DA LIDERANÇA 2

                        Nome completo:
                            

                        CPF:

                        Telefone (com código de área): (____) _____________________
                            

                        Função que exerce na Comunidade Indígena:

                        Assinatura

                        

                        

                        DADOS DA LIDERANÇA 3

                        Nome completo:
                            

                        CPF:

                        Telefone (com código de área): (____) _____________________
                            

                        Função que exerce na Comunidade Indígena:

                        Assinatura

                        

                        

                        

                        ANEXO XI - EDITAL IFPR Nº 88, DE 20 DE setembro de 2024

                        DECLARAÇÃO DA COMUNIDADE QUILOMBOLA

                        

                        

                        Declaramos para os devidos fins que o(a) candidato(a) __________________________________________ portador(a) do CPF n.º _______________________________, reside/pertence à Comunidade Quilombola de ___________________________________ do município de ______________________________ , Estado ________________________.

                        

                        

                        DADOS DA LIDERANÇA 1

                        Nome completo:
                            

                        CPF:

                        Telefone (com código de área): (____) _____________________
                            

                        Função que exerce na Comunidade Quilombola:

                        Assinatura

                        

                        

                        

                        DADOS DA LIDERANÇA 2

                        Nome completo:
                            

                        CPF:

                        Telefone (com código de área): (____) _____________________
                            

                        Função que exerce na Comunidade Quilombola:

                        Assinatura

                        

                        

                        DADOS DA LIDERANÇA 3

                        Nome completo:
                            

                        CPF:

                        Telefone (com código de área): (____) _____________________
                            

                        Função que exerce na Comunidade Quilombola:

                        Assinatura

                        

                        

                         `;


            var edital3 = `Edital N°89, de 20 de setembro de 2024

PROCESSO SELETIVO IFPR 2025 - CURSOS SUPERIORES DE LICENCIATURA

 

O Reitor do Instituto Federal de Educação, Ciência e Tecnologia do Paraná, no uso da competência que lhe confere o Decreto de 06 de fevereiro de 2024, publicado no Diário Oficial da União no dia 07 de fevereiro de 2024, seção 2, página 01, torna público as normas que regem o Processo Seletivo IFPR 2025 para ingresso nos Cursos Superiores de Licenciatura, na modalidade presencial, ofertados para o ano de 2025, considerando a política de inclusão do IFPR para o ingresso de estudantes nos cursos. As inscrições estarão abertas de 03 de outubro de 2024 a 17 de janeiro de 2025.

 

BASE LEGAL

Lei nº 9.394, de 20 de dezembro de 1996 - Estabelece as diretrizes e bases da educação nacional.

Decreto nº 3.298, de 20 de dezembro de 1999 - Regulamenta a Lei no 7.853, de 24 de outubro de 1989, dispõe sobre a Política Nacional para a Integração da Pessoa Portadora de Deficiência, consolida as normas de proteção, e dá outras providências.

Decreto nº 5.296, de 02 de dezembro de 2004 - Regulamenta as Leis nos 10.048, de 8 de novembro de 2000, que dá prioridade de atendimento às pessoas que especifica, e 10.098, de 19 de dezembro de 2000, que estabelece normas gerais e critérios básicos para a promoção da acessibilidade das pessoas portadoras de deficiência ou com mobilidade reduzida, e dá outras providências.

Lei nº 12.711, de 29 de agosto de 2012 - Dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio e dá outras providências.

Lei nº 12.764, de 27 de dezembro de 2012 - Institui a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista; e altera o § 3º do art. 98 da Lei nº 8.112, de 11 de dezembro de 1990.

Decreto nº 7.824, de 11 de outubro de 2012 - Regulamenta a Lei nº 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

Lei nº 13.146, de 06 de julho de 2015 - Institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência).

Lei nº 13.409, de 28 de dezembro de 2016 - Altera a Lei nº 12.711, de 29 de agosto de 2012, para dispor sobre a reserva de vagas para pessoas com deficiência nos cursos técnico de nível médio e superior das instituições federais de ensino.

Decreto nº 9.034, de 20 de abril de 2017 - Altera o Decreto n º 7.824, de 11 de outubro de 2012, que regulamenta a Lei n º 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

Lei nº 14.126 de 22 de março de 2021 - Classifica a visão monocular como deficiência sensorial, do tipo visual.

Lei nº 14.723 de 13 de novembro de 2023 - Altera a Lei nº 12.711, de 29 de agosto de 2012, para dispor sobre o programa especial para o acesso às instituições federais de educação superior e de ensino técnico de nível médio de estudantes pretos, pardos, indígenas e quilombolas e de pessoas com deficiência, bem como daqueles que tenham cursado integralmente o ensino médio ou fundamental em escola pública.

Decreto nº 11.781 de 14 de novembro de 2023 - Altera o Decreto nº 7.824, de 11 de outubro de 2012, que regulamenta a Lei nº 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

Decreto Nº 11.864, de 27 de dezembro de 2023 - Dispõe sobre o valor do salário mínimo a vigorar a partir de 1º de janeiro de 2024.

Portaria Normativa MEC nº 18, de 11 de outubro de 2012 - Dispõe sobre a implementação das reservas de vagas em instituições federais de ensino de que tratam a Lei no 12.711, de 29 de agosto de 2012, e o Decreto no 7.824, de 11 de outubro de 2012.

Portaria Normativa nº 2.027 de 16 de novembro de 2023 - Altera a Portaria Normativa MEC nº 18, de 11 de outubro de 2012, que dispõe sobre a implementação das reservas de vagas em instituições federais de ensino de que tratam a Lei nº 12.711, de 29 de agosto de 2012, e a Portaria Normativa MEC nº 21, de 5 de novembro de 2012, que dispõe sobre o Sistema de Seleção Unificada - Sisu.

Resolução Consup/IFPR nº 190/2024 – Dispõe sobre a Organização Didático-Pedagógica dos Cursos Técnicos de Nível Médio na modalidade presencial do Instituto Federal de Educação, Ciência e Tecnologia do Paraná.

Resolução Consup/IFPR nº 55/2011 – Dispõe sobre a Organização Didático Pedagógica da Educação Superior no âmbito do Instituto Federal do Paraná – IFPR.

 

1. DAS DISPOSIÇÕES PRELIMINARES

1.1. Os cursos de licenciatura, objeto deste certame, são públicos, gratuitos e presenciais, devendo o(a) candidato(a) ter disponibilidade de tempo para realizar atividades no contraturno e/ou aos sábados, conforme o calendário acadêmico do campus e o projeto pedagógico do curso.

1.1.1 Alguns cursos podem possuir parte de sua carga horária à distância, conforme a legislação vigente e o seu projeto pedagógico de curso.

1.1.2 Os cursos de Química e de Educação Física do Campus Palmas são cursos de graduação, com dupla possibilidade de formação - bacharelado e licenciatura. Para efeitos de compreensão deste edital, sempre que se citar licenciatura, faz-se referência também a essas duas graduações.

1.1.3 Para acessar tutoriais em vídeo sobre o processo seletivo (com acessibilidade), utilize o endereço eletrônico https://ifpr.edu.br/estude-conosco/processo-seletivo-2025/tutoriais/.

1.1.4 Para acessar formulários e outros documentos editáveis, utilize o endereço eletrônico https://ifpr.edu.br/estude-conosco/processo-seletivo-2025/documentos/.

1.1.5 Para acessar o Portal do Candidato do IFPR, utilize o endereço eletrônico https://portaldocandidato.ifpr.edu.br/.

1.2. Ao término do curso, o estudante fará jus ao diploma de licenciado na respectiva área de conhecimento.

1.2.1 As Graduações em Química e em Educação Física do Campus Palmas possuem possibilidade de diplomação em licenciatura e/ou bacharelado, com critérios para destinação de vagas estabelecidos nos Projetos Pedagógicos de Curso, que podem ser acessados nos links https://ifpr.edu.br/palmas/about/nossos-cursos/about-nossos-cursos-cursos-de-graduacao-regulamentos/educacao-fisica/ppc-educacao-fisica/ e ttps://ifpr.edu.br/palmas/about/nossos-cursos/about-nossos-cursos-cursos-de-graduacao-regulamentos/quimica-9/ppc-quimica/ 

1.3. Para ingresso nos Cursos de Licenciatura, o candidato deverá ter concluído, imprescindivelmente, o Ensino Médio até a data da matrícula.

1.4. O processo seletivo será realizado em uma única etapa, que consistirá na classificação do(a) candidato(a) pelo seu desempenho (notas) obtidas no Exame Nacional de Ensino Médio (ENEM) dos últimos dez anos (entre 2015 e 2024), conforme detalhado no item 6, deste Edital.

1.5 É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação de todos os atos, editais e comunicados referentes ao Processo Seletivo regido por este edital. 

1.6 O(A) candidato(a) que se inscrever pelo Sistema de Ações Afirmativas (cotas) automaticamente autoriza a divulgação dos resultados do Processo Seletivo referente a este edital de acordo com a classificação gerada pelo Sistema de Ações Afirmativas (cotas), nos termos da Lei nº 12.711, de 29 de agosto de 2012, do Decreto nº 7.824, de 11 de outubro de 2012, da Portaria Normativa MEC nº 18, de 11 de outubro de 2012, da Lei nº 13.409, de 28 de dezembro de 2016, do Decreto nº 9.034, de 20 de abril de 2017, da Lei nº 14.723 de 13 de novembro de 2023, do Decreto nº 11.781 de 14 de novembro de 2023 e da Portaria Normativa nº 2.027 de 16 de novembro de 2023. 

1.7 O(A) candidato(a) deverá possuir Carteira de Identidade (CI) e Cadastro de Pessoa Física  (CPF) para participar do referido processo seletivo. 

1.8 Serão considerados documentos de identificação: Carteira de Identidade expedida pelas Secretarias de Segurança Pública, pelas Forças Armadas Brasileiras, por países que possuem acordos diplomáticos com o Brasil, Polícias Militares, Ordens ou Conselhos que, por Lei Federal, tenha validade como documento de identidade e possibilite a conferência da foto e da assinatura; Carteira de Identidade Nacional - CIN; Carteira de Trabalho e Previdência Social(CTPS); Passaporte; ou Carteira Nacional de Habilitação com fotografia – na forma da Lei nº 9.503/97 e o Documento de Identidade Nacional de Estrangeiro (Carteira de Registro Nacional Migratório - CRNM).

1.8.1. A CTPS Digital apenas tem validade como documento para fins de acompanhamento do contrato de trabalho, não sendo válida como documento de identificação. 

1.9 Ao se inscrever para este Processo Seletivo, o(a) candidato(a) declara conhecer e aceitar todas as condições descritas neste edital. Declara, ainda, estar ciente de que qualquer omissão ou falsidade, bem como o não atendimento das exigências impostas, culminará com a sua desclassificação do processo.

 

2. DA FORMA DE OFERTA

2.1 Os cursos de licenciatura ofertados neste Edital, na modalidade presencial, tendo ou não parte de sua carga horária ofertada à distância, nos termos da legislação vigente, são oferecidos a quem já tenha concluído o Ensino Médio. 

2.2 O início das aulas para os estudantes matriculados se dará em data a ser definida no Calendário Acadêmico e Administrativo de cada campus a ser divulgado na página oficial de cada campus, que pode ser consultada no Anexo IV deste Edital.

 

3. DOS CURSOS E VAGAS

3.1 A distribuição das vagas nos diversos cursos e campi do IFPR e nas diferentes cotas de inclusão e ampla concorrência encontram-se, respectivamente, no Anexo I e no Anexo II deste Edital.

3.2 O total das vagas ofertadas para cada curso e turma será disponibilizado da seguinte forma:

3.2.1 60% (sessenta por cento) do total das vagas ofertadas para cada curso e turma, para cursos de licenciatura, são reservadas aos candidatos que tenham cursado integralmente o Ensino Médio em escolas públicas do Brasil, em cursos regulares ou no âmbito da modalidade de Educação de Jovens e Adultos (EJA), ou tenham obtido certificado de conclusão com base no resultado do Exame Nacional do Ensino Médio, do Exame Nacional para Certificação de Competências da Educação de Jovens e Adultos (Encceja) ou de exames de certificação de competência ou de avaliação de jovens e adultos realizados pelos sistemas estaduais de ensino. Esse percentual será distribuído da seguinte maneira:

3.2.1.1 50% (cinquenta por cento) serão destinados, para cada curso e turma,  aos candidatos que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário - mínimo nacional per capita (R$ 1.412,00), havendo reserva de vagas para candidatos:

3.2.1.1.1 BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas.

3.2.1.1.2  BR-EP-Q - Autodeclarados quilombolas.

3.2.1.1.3 BR-EP-PCD - Pessoas com deficiência.

3.2.1.1.4 BR-EP - Demais candidatos.

3.2.1.2 50% (cinquenta por cento) serão destinados, para cada curso e turma, aos candidatos que, independentemente de renda familiar, havendo reserva de vagas para candidatos:

3.2.1.2.1 EP-PPI -  Autodeclarados pretos, pardos ou indígenas.

3.2.1.2.2 EP-Q - Autodeclarados quilombolas.

3.2.1.2.3 EP-PCD - Pessoas com deficiência.

3.2.1.2.4 EP - Demais candidatos

3.3.1 IFPR-PPI - 10% (dez por cento) do total das vagas ofertadas para cada curso e turma são reservadas aos candidatos autodeclarados pretos, pardos ou indígenas.

3.3.2 IFPR-PCD - 5% (cinco por cento) do total das vagas ofertadas para cada curso e turma são reservadas aos candidatos com deficiência.

3.3.3 25% (vinte por cento) do total das vagas ofertadas para cada curso e turma são reservadas à Ampla Concorrência (AC). Nesta forma de oferta estão incluídos estudantes que estudaram qualquer tempo em escolas particulares mesmo sendo bolsistas.

3.4 Os Processos Seletivos do IFPR realizam reserva de vagas através do Sistema de Ações Afirmativas (cotas), estabelecidas nos termos da Lei nº 12.711, de 29 de agosto de 2012, do Decreto nº 7.824, de 11 de outubro de 2012, da Portaria Normativa MEC nº 18, de 11 de outubro de 2012, da Lei nº 13.409, de 28 de dezembro de 2016, do Decreto nº 9.034, de 20 de abril de 2017, da Lei nº 14.723 de 13 de novembro de 2023, do Decreto nº 11.781 de 14 de novembro de 2023 e da Portaria Normativa nº 2.027 de 16 de novembro de 2023 mediante a comprovação das respectivas condições por meio de documentos.

3.4.1 O cálculo para a distribuição de vagas, seus possíveis arredondamentos e redistribuições, segue o disposto na Portaria MEC nº 2027 de 16 de novembro de 2023, o que pode fazer com que algumas ações afirmativas (cotas), bem como a ampla concorrência não atendam exatamente os percentuais indicados.

3.4.2 A base para a distribuição de vagas em cada ação afirmativa (cota) e na Ampla Concorrência encontra-se no Anexo II deste edital.

3.4.1. Candidatos(as) estrangeiros, que não sejam naturalizados, ou que tenham feito parte de seu estudo no exterior, não poderão participar do processo seletivo na reserva de vagas para estudantes de escola pública, devendo, portanto, responder NÃO à pergunta de número 1 (um) do Questionário Socioeconômico no momento da inscrição. 

3.5. As ações afirmativas às quais o(a) candidato(a) poderá concorrer durante o processo seletivo serão definidas mediante preenchimento de questionário socioeconômico, durante a realização da inscrição.

3.5.1. O questionário socioeconômico a que se refere o item 3.5 possuirá as seguintes questões:

a) QUESTÃO 01 - Você concluiu TODA a etapa de ensino anterior à modalidade de curso para a qual está se inscrevendo em uma instituição pública?

b) QUESTÃO 02 - De acordo com as condições estabelecidas no edital do processo seletivo, a sua renda per capta familiar é igual ou inferior a 1 salário mínimo atualmente? (Renda familiar per capita é calculada dividindo-se o total de renda familiar pelo número de moradores de uma residência).

c) QUESTÃO 03 - Você se identifica como pessoa preta, parda ou indígena?

d) QUESTÃO 04 - Você é membro ou reside em alguma comunidade remanescente de quilombo?

e) QUESTÃO 05 - Você possui alguma deficiência que se enquadra nas condições estabelecidas no edital do processo seletivo para o qual está se inscrevendo e que pode ser comprovada por meio de laudo médico?

3.6. As vagas da Ampla Concorrência são destinadas a todos(as) os(as) candidatos(as) que se julgarem aptos(as) a participar do certame, independentemente da condição social, racial, de deficiência ou de terem cursado o ensino fundamental em escola pública ou privada.

3.6.1 Os(as) candidatos(as) que já possuam escolaridade de nível superior somente podem concorrer nas vagas de da Ampla Concorrência.

3.7. Quando ocorrer a existência de vagas em uma determinada ação afirmativa (cota) e a falta de candidatos inscritos para ocupá-las, ocorrerá a convocação de candidatos de outras listas de concorrência, a partir da migração da referida vaga, respeitando a ordem constante no Anexo III.

 

4. DO SISTEMA DE AÇÕES AFIRMATIVAS (COTAS) 

4.1 Cotas para Escola Pública 

4.1.1. Os(As) candidatos(as) inscritos(as) por alguma ação afirmativa de escola pública devem apresentar, no momento da matrícula, histórico escolar por meio do qual comprovem ter cursado e concluído todo o Ensino Médio exclusivamente na rede pública de ensino do Brasil.

4.1.2. Não poderá ser matriculado(a), nas vagas reservadas para as ações Afirmativas (cotas) de Escola Pública, o(a) candidato(a) que tenha cursado o Ensino Médio, integralmente ou em parte, em escolas particulares, inclusive com bolsa de estudos parcial ou integral (Art. 5º, Inciso II b, § 1º da Portaria Normativa nº 18 de 2012). Identificadas disciplinas isoladas realizadas na rede privada de ensino, o(a) candidato(a) também estará impossibilitado(a) de se matricular nestas vagas.

4.1.3. De acordo com o Art. 19, inciso I da Lei nº 9.394, de 20 de dezembro de 1996, considera-se Escola Pública a instituição criada ou incorporada, mantida e administrada pelo poder público. As escolas pertencentes ao Sistema S (SENAI, SESI, SENAC), escolas conveniadas, escolas filantrópicas ou, ainda, fundações ou instituições similares (mesmo que mantenham educação gratuita) não são consideradas instituições da rede pública de ensino.

4.1.4 Caso, no momento da matrícula, o documento a que se refere o item 4.1.1 não seja apresentado ou não comprove a condição de o estudante ter realizado todo o Ensino Médio em escola pública, requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado. 

4.1.4.1 Ocorrendo a situação prevista no item 4.1.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo V que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

4.1.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.1.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

 

4.2. Cotas para Baixa Renda

4.2.1. Os(As) candidatos(as) inscritos(as) por alguma ação afirmativa de Baixa Renda deverão comprovar renda familiar bruta igual ou inferior a 1(um) salário-mínimo per capita (equivalente a R$ 1.412,00, de acordo com o DECRETO Nº 11.864, DE 27 DE DEZEMBRO DE 2023). 

4.2.2. Para atendimento da condição de baixa renda, deve-se considerar: 

a) Família: a unidade nuclear composta por uma ou mais pessoas, eventualmente ampliada por outras pessoas que contribuam para o rendimento ou tenham suas despesas atendidas por aquela unidade familiar, todas moradoras em um mesmo domicílio; 

b) Morador: a pessoa que tem o domicílio como local habitual de residência e nele reside na data de inscrição do estudante no processo seletivo da instituição federal de ensino; 

c) Renda familiar bruta mensal: a soma dos rendimentos brutos auferidos por todas as pessoas da família, calculada na forma do disposto no Art. 7º da Portaria Normativa nº 18/2012 do MEC. 

d) Renda familiar bruta mensal per capita: a razão entre a renda familiar bruta mensal e o total de pessoas da família, calculada na forma do art. 7º da Portaria Normativa Nº 18, de 11 de outubro de 2012 - MEC. 

4.2.3. No momento da matrícula, os documentos comprobatórios para análise da renda deverão ser referentes aos 3 meses anteriores ao período de inscrições (julho, agosto e setembro de 2024).

4.2.3.1 Os documentos a que se refere o item 4.2.3 constam no Anexo VI e deverão ser enviados, em um único arquivo, através do Portal do Candidato do IFPR no item “Documentos Comprobatórios de Renda”.

4.2.4. Caso, no momento da matrícula, os documentos a que se refere o item 4.2.3 não sejam apresentados ou não comprovem a condição de renda requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

4.2.4.1 Ocorrendo a situação prevista no item 4.2.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo V que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

4.2.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.2.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

 

4.3 Cotas para Pretos, Pardos ou Indígenas 

4.3.1. Os(As) candidatos(as) inscritos(as) e preliminarmente aprovados em alguma ação afirmativa de Pretos, Pardos ou Indígenas serão convocados(as), obrigatoriamente, a passar pelo procedimento de heteroidentificação, por meio de edital próprio.

4.3.2. O procedimento de heteroidentificação será realizado anteriormente à fase de matrícula.

4.3.2.1. Para os candidatos autodeclarados indígenas, quando convocados para a heteroidentificação, deverão apresentar:

a) cópia digitalizada do RANI (Registro de Nascimento Indígena); e/ou 

b) declaração de residência/pertencimento à comunidade indígena assinada por 3 (três) autoridades indígenas, com os respectivos contatos telefônicos das 3 (três) autoridades conforme Anexo VIII; e/ou 

c) histórico escolar emitido por escola indígena.

4.3.2.2 As demais orientações para a realização do procedimento de heteroidentificação estarão descritas em edital específico a ser publicado conforme cronograma do item 5.

4.3.3. Caso, após o procedimento de heteroidentificação, seja indeferida a autodeclaração como pessoa preta, parda ou indígena, o(a) candidato(a) somente poderá ser convocado em qualquer das chamadas, pela Ampla Concorrência e ou por outras ações afirmativas (cotas) que não sejam direcionadas a pessoas pretas, pardas ou indígenas. 

 

4.4 Cotas para Pessoa com Deficiência 

4.4.1. Considerar-se-á Pessoa com Deficiência (PcD) aquela que possui impedimento de longo prazo, de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais barreiras, pode obstruir sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas, conforme artigo 2º da Lei nº 13.146, de 06 de julho de 2015, e a pessoa com transtorno do espectro autista, de acordo com art. 1º, § 2 o da Lei nº 12.764, de 27 de dezembro de 2012. 

4.4.2. Os(As) candidatos(as) inscritos(as) pelo Sistema de Ações Afirmativas (cota) Pessoa com Deficiência deverão se enquadrar: 

a) No art. 4º do Decreto nº 3.298, de 20 de dezembro de 1999, atualizado pelo art. 5º, § 1º, inciso I, do Decreto nº 5.296, de 02 de dezembro de 2004, o qual apresenta as seguintes definições: 

I - deficiência física: alteração completa ou parcial de um ou mais segmentos do corpo humano, acarretando o comprometimento da função física, apresentando-se sob a forma de paraplegia, paraparesia, monoplegia, monoparesia, tetraplegia, tetraparesia, triplegia, triparesia, hemiplegia, hemiparesia, ostomia, amputação ou ausência de membro, paralisia cerebral, nanismo, membros com deformidade congênita ou adquirida, exceto as deformidades estéticas e as que não produzam dificuldades para o desempenho de funções; 

II - deficiência auditiva: perda bilateral, parcial ou total, de quarenta e um decibéis (dB) ou mais, aferida por audiograma nas frequências de 500Hz, 1.000Hz, 2.000Hz e 3.000Hz; 

III - deficiência visual: cegueira, na qual a acuidade visual é igual ou menor que 0,05 no melhor olho, com a melhor correção óptica; a baixa visão, que significa acuidade visual entre 0,3 e 0,05 no melhor olho, com a melhor correção óptica; os casos nos quais a somatória da medida do campo visual em ambos os olhos for igual ou menor que 60º; ou a ocorrência simultânea de quaisquer das condições anteriores; visão monocular como deficiência sensorial, do tipo visual (conforme definido na lei nº 14.126 de 22 de março de 2021) . 

IV - deficiência intelectual: funcionamento intelectual significativamente inferior à média, com manifestação antes dos dezoito anos e limitações associadas a duas ou mais áreas de habilidades adaptativas, tais como: 1. comunicação; 2. cuidado pessoal; 3. habilidades sociais; 4. utilização dos recursos da comunidade; 5. saúde e segurança; 6. habilidades acadêmicas; 7. lazer; e 8. trabalho; 

V - deficiência múltipla - associação de duas ou mais deficiências.

b) No art. 1º, § 1º, incisos I e II, e § 2º, da Lei nº 12.764, de 27 de dezembro de 2012, que apresenta as seguintes definições acerca do Transtorno do Espectro Autista: § 1º Para os efeitos desta Lei, é considerada pessoa com transtorno do espectro autista aquela portadora de síndrome clínica caracterizada na forma dos seguintes incisos I ou II: 

I - deficiência persistente e clinicamente significativa da comunicação e da interação sociais,manifestada por deficiência marcada de comunicação verbal e não verbal usada para interação social; ausência de reciprocidade social; falência em desenvolver e manter relações apropriadas ao seu nível de desenvolvimento; 

II - padrões restritivos e repetitivos de comportamentos, interesses e atividades, manifestados por comportamentos motores ou verbais estereotipados ou por comportamentos sensoriais incomuns; excessiva aderência a rotinas e padrões de comportamento ritualizados; interesses restritos e fixos. § 2º A pessoa com transtorno do espectro autista é considerada pessoa com deficiência, para todos os efeitos legais. 

4.4.3. O(A) candidato(a) aprovado(a) nas vagas reservadas para Pessoas com Deficiência deverá apresentar, no momento da matrícula  através do Portal do Candidato do IFPR, laudo médico assinado por médico responsável que ateste alguma das condições descritas no item 4.4.2. 

4.4.3.1. O laudo médico deverá: 

a) Conter a classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID); 

b) Relatar a deficiência do candidato, que deverá se enquadrar em uma das categorias mencionadas no item 4.4.2; 

c) Ser emitido em papel timbrado e conter carimbo com o CRM e assinatura do médico. 

4.4.3.2. O(A) candidato(a) inscrito(a) nas vagas reservadas para Pessoas com Deficiência autoriza a utilização pelo IFPR do laudo médico entregue no momento da matrícula. 

4.4.4. Caso, no momento da matrícula, os documentos a que se refere o item 4.2.3 não sejam apresentados ou não comprovem a condição de renda requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

4.4.4.1 Ocorrendo a situação prevista no item 4.4.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo V que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

4.4.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.4.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

4.4.5. Caso seja constatada inexatidão ou irregularidade de informações, ainda que posteriormente ao processo seletivo e/ou à matrícula, o(a) candidato(a) será eliminado(a) do Processo Seletivo, declarando-se nulos todos os atos decorrentes de sua inscrição. 

 

4.5 Cotas para Quilombolas

4.5.1. Os(As) candidatos(as) inscritos(as) pela ação afirmativa destinada a quilombolas são aqueles que comprovem residência/pertencimento às comunidades remanescentes de quilombo. 

4.5.2. Os(As) candidatos(as) inscritos(as) e preliminarmente aprovados em alguma ação afirmativa para quilombolas serão convocados(as), obrigatoriamente, a passar pelo procedimento de heteroidentificação, por meio de edital próprio.

4.5.3. O procedimento de heteroidentificação será realizado anteriormente à fase de matrícula.

4.5.4. Caso, após o procedimento de heteroidentificação, seja indeferida a autodeclaração como pessoa quilombola, o(a) candidato(a) somente poderá ser convocado em qualquer das chamadas, pela Ampla Concorrência e ou por outras ações afirmativas (cotas) que não sejam direcionadas a pessoas quilombolas. 

4.5.5. O(A) candidato(a) autodeclarado Quilombola, quando da convocação para a heteroidentificação, deverá apresentar, obrigatoriamente, os seguintes documentos:

a) Autodeclaração étnico-racial devidamente preenchida e assinada (disponível aqui); 

b)Cópia frente e verso de documento de identificação com foto; 

c) Declaração de residência/pertencimento às comunidades remanescentes de quilombo assinada por 3 (três) autoridades de Associação Quilombola reconhecida pela Fundação Palmares, com os respectivos contatos telefônicos das 3 (três) autoridades conforme Anexo IX.

4.5.6. As comunidades remanescentes de quilombos são apenas aquelas certificadas pela Fundação Cultural Palmares, nos termos do Decreto 4.887/03, de 20/11/2003. 

4.5.7. Demais orientações para a realização do procedimento de heteroidentificação estarão descritas em edital específico a ser publicado conforme cronograma do item 5.

4.6. Todos os(as) candidatos(as) optantes pelo Sistema de Ações Afirmativas (cotas) concorrerão, primeiramente, na Ampla Concorrência e, se não classificados, concorrerão em seu respectivo grupo de Ações Afirmativas (cotas), de acordo com a sequência de prioridades abaixo:

a) IFPR-PPI - candidatos autodeclarados pretos, pardos ou indígenas, independentemente de renda familiar e de ter cursado a etapa anterior em escola pública.

b) IFPR-PCD - candidatos com deficiência, independentemente de renda familiar e de ter cursado a etapa anterior integralmente em escola pública.

c) EP - estudantes que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

d) EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

e) EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

f) EP-PPI -  Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

g) BR-EP - candidatos que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

h) BR-EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

i) BR-EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

j) BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

4.7 Caso o curso em questão possua número de candidatos(as) igual ou inferior ao número de vagas, todos os(as) candidatos(as) constarão apenas na lista geral da Ampla Concorrência, não precisando fazer qualquer comprovação quanto às ações afirmativas para as quais foi previamente classificado.

 

5. DO CRONOGRAMA  

PERÍODOS/DATAS
	

ETAPAS

20/09/2024
	

Publicação do Edital no site institucional

03/10/2024
	

17/01/2025
	

Período de inscrição on-line

03/10/2024
	

15/01/2025
	

Período de isenção de taxa de inscrição

17/01/2025
	

Divulgação da Relação Nominal com resultado preliminar do pedido de isenções concedidas

20/01/2025
	

20/01/2025
	

Prazo para interposição de recursos contra Relação Nominal com resultado do pedido de isenções concedidas

21/01/2025
	

Divulgação da Relação Nominal com resultado definitivo do pedido de isenções concedidas

22/01/2025
	

Prazo final para pagamento da taxa de inscrição

28/01/2025
	

Publicação da lista preliminar das inscrições homologadas no Processo Seletivo

29/01/2025
	

29/01/2025
	

Prazo para interposição de recurso referente à homologação de inscrições

30/01/2025
	

30/01/2025
	

Análise dos recursos contra o Resultado da lista preliminar dos inscritos no Processo Seletivo

31/01/2025
	

Publicação final das inscrições homologadas

31/01/2025
	

05/02/2025
	

Análise das notas do Enem

06/02/2025
	

Publicação da classificação preliminar

07/02/2025
	

07/02/2025
	

Prazo para interposição de recurso referente à classificação preliminar

11/02/2025
	

Publicação do resultado dos recursos referentes à classificação preliminar

 

Convocação dos candidatos inscritos nas vagas das ações afirmativas/cotas sociais para realização do processo de heteroidentificação e entrega de documentos para comprovação da condição de cotista

12/02/2025
	

19/2/2025
	

Bancas de heteroidentificação e análise pelas comissões dos documentos entregues

20/02/2025
	

Publicação do resultado preliminar da heteroidentificação e análise documental

21/02/2025
	

23/02/2025
	

Prazo para interposição de recurso contra o resultado preliminar da heteroidentificação e análise documental

24/02/2025
	

Análise dos recursos pela Coordenação de Ações Inclusivas e comissão recursal de heteroidentificação

25/02/2025
	

Publicação do resultado final do processo de heteroidentificação

25/02/2025
	

Publicação do Resultado Final do Processo Seletivo

 

Convocação para matrícula da 1o chamada

26/02/2025
	

07/03/2025
	

Período de matrícula para os candidatos convocados na 1o chamada

10/03/2025
	

Divulgação do resultado provisório das matrículas

11/03/2025
	

Prazo para recurso contra o resultado provisório das matrículas

12/03/2025
	

Divulgação do resultado definitivo das matrículas


 

6. DAS INSCRIÇÕES

6.1 As inscrições devem ser feitas através do Portal do Candidato do IFPR que pode ser acessado através link: https://portaldocandidato.ifpr.edu.br/. 

6.1.1 Para fazer seu login no Portal do Candidato do IFPR, o candidato deverá utilizar sua conta pessoal gov.br.

6.1.2 Caso não possua conta gov.br, o candidato deverá realizar o seu cadastro, conforme tutorial que pode ser acessado a partir do link dos vídeos tutoriais disponível no item 1.1.3.

6.2 A inscrição do(a) candidato(a) implicará ciência e aceitação das normas e condições estabelecidas no inteiro teor deste edital, das quais não poderá alegar desconhecimento. 

6.3 No ato da inscrição, o(a) candidato(a) deverá realizar integralmente o procedimento de inscrição, de modo a: 

a) responder ao questionário a que se refere o item 3.5.1 deste Edital;

b) conferir e confirmar as ações afirmativas para as quais estará concorrendo;

c) preencher todos os demais dados solicitados; 

d) informar a nota obtida em cada uma das provas do Exame Nacional do Ensino Médio - Enem: Ciências da Natureza e suas Tecnologias; Ciências Humanas e suas Tecnologias; Matemática e suas Tecnologias; Linguagens, Códigos e suas Tecnologias; e Redação.

e) realizar o upload do comprovante oficial de notas (Boletim Individual de Desempenho) do Exame Nacional do Ensino Médio - Enem; e

f) confirmar a inscrição.

6.4 O(A) candidato(a) poderá assistir ao vídeo explicativo disponível no link, para ajudar com o procedimento de inscrição.

6.5 As informações fornecidas no formulário de inscrição e o seu correto preenchimento são de responsabilidade do(a) candidato(a), dispondo o IFPR do direito de excluir do processo de ingresso aquele que não preencher a solicitação de inscrição de forma completa e correta, bem como aquele que fornecer dados comprovadamente inverídicos.

 

7. DAS ISENÇÕES DE TAXA DE INSCRIÇÃO

7.1 Todos os estudantes inscritos para cursos de licenciatura estarão automaticamente isentos de qualquer valor referente à inscrição.

 

8. DA CLASSIFICAÇÃO

8.1 A classificação será realizada em ordem decrescente da média geral derivada das notas das provas de Ciências da Natureza e suas Tecnologias; Ciências Humanas e suas Tecnologias; Matemática e suas Tecnologias; Linguagens, Códigos e suas Tecnologias; e Redação do Exame Nacional do Ensino Médio - ENEM informadas pelos candidatos(as).

8.1.1 A média a que se refere o item 8.1 se dará numa escala de 0,00 (zero pontos) a 1000,00 (mil pontos) e será calculada automaticamente pelo Portal do Candidato a partir das notas lançadas pelo(a) candidato(a).

8.1.2 Todos(as) os(as) candidatos(as) constarão na lista de classificação da Ampla Concorrência.

8.1.3 Além da lista da Ampla Concorrência, os(as) candidatos(as) constarão nas listas de todas as ações afirmativas as quais tenham sido enquadrados conforme item 3.5 deste edital.

8.1.4 Caso o curso em questão possua número de candidatos(as) igual ou inferior ao número de vagas, todos os(as) candidatos(as) serão classificados(as) apenas na lista geral da Ampla Concorrência.

8.2 No caso de empate, será considerado para o desempate: 

a) maior idade 

e

b) persistindo o empate, sorteio.

8.3 Anteriormente à publicação da classificação preliminar, a média gerada e as notas informadas serão conferidas com o comprovante oficial de notas submetido no procedimento de inscrição. 

8.3.1 Se constatada divergência nas notas lançadas pelo candidato, resultando em média incorreta, esta será relançada pela Equipe de Assessoramento do Processo Seletivo responsável pelo curso em questão, sendo a média do(a) candidato(a) recalculada pelo Portal do Candidato do IFPR.

8.3.1.1 Caso a condição do comprovante oficial de notas (Boletim Individual de Desempenho) do Exame Nacional do Ensino Médio - Enem impossibilite a devida conferência, a nota do(a) candidato(a) será definida como 0 (zero). 

 

9. DOS RESULTADOS

9.1. O resultado preliminar do Processo Seletivo será divulgado na data definida pelo cronograma disponível no item 5 deste edital, no Portal do Candidato do IFPR (https://portaldocandidato.ifpr.edu.br/).

9.2. Caberá recurso contra a classificação preliminar. O recurso deverá ser protocolado de forma online através do Portal do Candidato (https://portaldocandidato.ifpr.edu.br/) em datas definidas no cronograma disponível no item 5 deste edital. 

9.2.1. A Equipe de Assessoramento do Processo Seletivo 2025 do IFPR avaliará as informações prestadas no formulário de recurso referente à classificação, deferindo ou não o pedido. 

9.3. O resultado final será constituído da lista geral de classificação pela ampla concorrência e por cada uma das ações afirmativas (cotas), para cada campus e curso. 

9.3.1. A lista geral de classificação em cada uma das ações afirmativas poderá sofrer alterações durante o processo de heteroidentificação e da análise dos documentos de matrícula dos(as) candidatos(as) inscritos(as) nas ações afirmativas de Baixa Renda, PcD e Escola Pública. 

9.4. Respeitado o disposto no item 4.6 deste edital, os candidatos aprovados dentro das vagas previstas, serão convocados para matrícula em primeira chamada.

9.4.1 Após as matrículas a que se refere o item 9.4 e que estão descritas no título 10, poderão ocorrer chamadas complementares, caso algum candidato previamente convocado não confirme sua matrícula.

 

10. DAS MATRÍCULAS

10.1. A matrícula será permitida ao(à) candidato(a) que apresentar toda a documentação exigida e tenha concluído o Ensino Médio. 

10.2. A matrícula dos candidatos(as) aprovados(as) nas chamadas do Processo Seletivo ocorrerá respeitando as vagas disponíveis, a ordem de classificação estabelecida conforme resultado.

10.3. As matrículas dos(as) candidatos(as) aprovados(as) deverão ser realizadas exclusivamente de forma online, através do Portal do Candidato do IFPR (https://portaldocandidato.ifpr.edu.br/).

10.3.1. O(A) candidato(a) deverá acessar o Portal do Candidato e realizar o upload dos documentos solicitados conforme o período definido no cronograma.

10.4. É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação do edital e as chamadas de candidatos(as) aprovados(as). 

10.5. O(A) candidato(a) que não realizar sua matrícula, conforme datas e definições do edital, perderá o direito à vaga, possibilitando que o(a) próximo(a) candidato(a) da lista de classificação seja convocado(a). 

10.5.1 Ocorrendo a situação prevista no item 10.5, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo V que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

10.6. Os documentos para matrícula, comuns a todos(as) os(as) candidatos(as), são:

10.6.1 Carteira de identidade;

10.6.1.1 Se candidato(a) estrangeiro(a), em substituição ao documento previsto no item 10.6.1, deve ser apresentado: documento de identidade nacional de estrangeiro (Carteira de Registro Nacional Migratório - CRNM) ou Residência Mercosul, emitida por autoridade brasileira, válida à data da matrícula;

10.6.2 Certidão de nascimento ou Certidão de Casamento;

10.6.3 Certificado de Alistamento Militar, de Dispensa de Incorporação ou de Reservista, no caso dos candidatos do sexo masculino maiores de 18 anos e com idade até 45 anos;

10.6.4 Declaração de vacinação (para candidatos com menos de 18 (dezoito) anos) emitida e assinada por profissional de saúde, atestando que o adolescente está com o seu esquema vacinal de acordo com a recomendação estabelecida no Programa Nacional de Imunização – PNI, do Ministério da Saúde e da Secretaria de Estado da Saúde;

10.6.5. Uma via impressa da certidão de quitação eleitoral (para candidatos com mais de 18 (dezoito) anos que já possuem titulo eleitoral), que poderá ser obtida em qualquer Cartório Eleitoral e também na página eletrônica www.tse.jus.br.

10.6.6 Certificado de conclusão do Ensino Médio ou equivalente que comprove a conclusão do Ensino Médio;

10.6.6.1 Poderá ser apresentada Declaração de Conclusão do Ensino Médio, desde que, num prazo de 60 (sessenta) dias, o histórico seja apresentado à Secretaria Acadêmica do campus;

10.6.6.2 O candidato que realizou seus estudos em instituições estrangeiras, além da documentação e procedimentos definidos neste Edital, também deve entregar Comprovante de Conclusão de Ensino Médio, revalidado no Brasil na forma da lei.
10.6.6.2.1 É dispensada a revalidação se o comprovante de conclusão de estudos pertencer a um país integrante do Mercosul.

10.6.7 Formulário de Requerimento de Matrícula devidamente preenchido pelo responsável legal em caso de candidatos menores de 18 anos (conforme Anexo VII); e

10.6.8 Documento de Identificação do Responsável Legal para menores de 18 anos.

10.7. Os documentos necessários para comprovação das Ações Afirmativas (cotas) de Baixa Renda, Pessoa com Deficiência e Escola Pública são:

10.7.1 AÇÃO AFIRMATIVA DE ESCOLA PÚBLICA: Os candidatos deverão apresentar, no momento da matrícula, Histórico Escolar por meio do qual comprovem ter cursado e concluído todo o ensino médio (do primeiro ao terceiro anos, ou equivalente) exclusivamente na rede pública de ensino do Brasil.

10.7.2 AÇÃO AFIRMATIVA DE PESSOA COM DEFICIÊNCIA: Laudo médico atestando a espécie e o grau da deficiência. O laudo deverá:

a) Conter a classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID);

b) Relatar a deficiência do candidato, que deverá se enquadrar em uma das categorias mencionadas no edital do processo seletivo;

c) Ser emitido em papel timbrado e conter carimbo com o CRM e assinatura do médico.

10.7.3 AÇÃO AFIRMATIVA DE BAIXA RENDA: documentos especificados no Anexo VI deste Edital.

10.8  O estudante que ingressar mediante processo seletivo tendo efetuado seu registro acadêmico, deverá realizar a confirmação de sua matrícula devendo possuir frequência a pelo menos uma das aulas previstas para os 5 (cinco) primeiros dias letivos do calendário acadêmico do campus. 

10.8.1 A não realização da confirmação de matrícula pelo estudante ou de pessoa por ele autorizada para tal, caracterizar-se-á como desistência, o que ocasionará o cancelamento do seu registro acadêmico.

 

11. DAS DISPOSIÇÕES FINAIS

11.1. A Comissão Central do Processo Seletivo, a  Equipe de Assessoramento do Processo Seletivo e o IFPR não se responsabilizam por solicitação de inscrição via internet não efetivada por motivos de ordem técnica, falhas de comunicação, congestionamento de linhas de comunicação ou quaisquer outros fatores de ordem técnica que impossibilitem a transferência dos dados ou a impressão de documentos.

11.2. A inscrição do(a) candidato(a) implicará a aceitação total e incondicional das normas e instruções constantes neste edital.

11.3. É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação dos resultados das etapas do Processo Seletivo, que serão realizadas através do endereço eletrônico https://portaldocandidato.ifpr.edu.br/.

11.4. A inexatidão ou irregularidade de informações, ainda que constatada posteriormente ao processo seletivo e/ou à matrícula, eliminará o(a) candidato(a) do Processo de Seleção, declarando-se nulos todos os atos decorrentes de sua inscrição.

11.5 Após esgotadas as chamadas complementares previstas no item 9.4.1 e persistindo a existência de vagas não ocupadas, novo processo seletivo será realizado com regramento a ser publicado em edital próprio.

11.6 Os candidatos que não têm acesso a equipamento e/ou internet poderão dirigir-se a um dos campi do IFPR (de acordo com os endereços indicados no Anexo V), de segunda-feira a sexta-feira, no horário de funcionamento do campus, no período destinado às inscrições. 

11.7. Os casos omissos e as situações não previstas no presente edital serão analisados pela Comissão Central do Processo Seletivo e pela Equipe de Assessoramento do Processo Seletivo.

 

Curitiba, 20 de setembro de 2024.

 

 

 

Assinado:
logotipo 	

Documento assinado eletronicamente por ADRIANO WILLIAN DA SILVA VIANA PEREIRA, Reitor, em 20/09/2024, às 21:20, conforme horário oficial de Brasília, com fundamento no art. 6º, caput, do Decreto nº 8.539, de 8 de outubro de 2015.
QRCode Assinatura 	

A autenticidade deste documento pode ser conferida no site https://sei.ifpr.edu.br/sei/controlador_externo.php?acao=documento_conferir&id_orgao_acesso_externo=0, informando o código verificador 3185080 e o código CRC AA4C2607.

ANEXO I - EDITAL IFPR Nº 89, DE 20 DE setembro DE 2024

QUADRO DE OFERTAS DE CURSOS DE LICENCIATURA 

Campus
	

Curso 
	

Nível de Ensino
	

Forma de Oferta
	

Turmas
	

Turno
	

Vagas
	

Duração do Curso

ASTORGA
	

Pedagogia
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

CAMPO LARGO
	

Matemática
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

CAPANEMA
	

Matemática
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

CASCAVEL
	

Química
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

COLOMBO
	

História
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

COLOMBO
	

Pedagogia
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

CURITIBA
	

Pedagogia
	

Superior
	

Licenciatura
	

1
	

Vespertino
	

40
	

4 anos

FOZ DO IGUAÇU
	

Física
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4,5 anos

IRATI
	

Química
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

IVAIPORÃ
	

Física
	

Superior
	

Licenciatura
	

1
	

Noturno
	

36
	

4,5 anos

JACAREZINHO
	

Química
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

LONDRINA
	

Ciências Biológicas
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

PALMAS
	

Educação Física¹
	

Superior
	

Graduação
	

1
	

Até o 4º período - Noturno + 1 tarde²;

A partir do 5º período: Licenciatura - Noturno; Bacharelado - Vespertino
	

50
	

4 anos

PALMAS
	

Química¹
	

Superior
	

Graduação
	

1
	

Noturno + 1 tarde²
	

40
	

4 anos

PALMAS
	

Artes Visuais
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

PALMAS
	

Ciências Biológicas
	

Superior
	

Licenciatura
	

1
	

Noturno + 1 tarde²
	

40
	

4 anos

PALMAS
	

Letras - Português/Inglês
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

PALMAS
	

Pedagogia
	

Superior
	

Licenciatura
	

1
	

Noturno + 1 tarde²
	

40
	

4 anos

PARANAGUÁ
	

Ciências Sociais
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

PARANAGUÁ
	

Física
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

PARANAVAÍ
	

Química
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

PITANGA
	

Pedagogia
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

PITANGA
	

Química
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

TELÊMACO BORBA
	

Física
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

UMUARAMA
	

Ciências Biológicas
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

UMUARAMA
	

Química
	

Superior
	

Licenciatura
	

1
	

Noturno
	

40
	

4 anos

¹ As Graduações em Química e em Educação Física do Campus Palmas possuem formação em Bacharelado e Licenciatura. A Graduação em Química destina 20 vagas para bacharelado e 20 vagas para licenciatura. A escolha ocorre a partir do 5º semestre do curso. Na Graduação em Educação Física, havendo disponibilidade de vagas, o estudante poderá optar no 5º semestre entre o bacharelado, a licenciatura, ou ambas as formações. Os critérios completos para a destinação de vagas estabelecidos nos Projetos Pedagógicos de Curso, que podem ser acessados nos links https://ifpr.edu.br/palmas/about/nossos-cursos/about-nossos-cursos-cursos-de-graduacao-regulamentos/educacao-fisica/ppc-educacao-fisica/ e https://ifpr.edu.br/palmas/about/nossos-cursos/about-nossos-cursos-cursos-de-graduacao-regulamentos/quimica-9/ppc-quimica/ 

² Os cursos cujos turnos estão assinalados como sendo “Noturno + 1 tarde” aparecerão no Portal do Candidato do IFPR como turno “Noturno”, sem prejuízo à informação deste quadro de vagas e a consequente necessidade de o estudante cumpri-la.


 

ANEXO II -EDITAL IFPR Nº 89, DE 20 DE setembro DE 2024

DISTRIBUIÇÃO DAS VAGAS POR FAIXAS DE AÇÃO AFIRMATIVA

 
	

Estudantes que tenham cursado a etapa anterior integralmente em Escola Pública (60% das vagas)
	

Ações afirmativas - IFPR (15% das vagas)
	

Ampla Concorrência (25% das vagas)

 
	

Estudantes que possuam renda bruta familiar per capita igual ou inferior a 1 salário mínimo (30% das vagas)
	

Estudantes que possuam renda bruta familiar per capita superior a 1 salário mínimo (30% das vagas)

NÚMERO DE VAGAS OFERTADAS POR CAMPUS, CURSO E TURNO
	

BR-EP-PPI
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q
	

EP-PCD
	

EP
	

IFPR-PPI
	

IFPR-PCD
	

AC

50
	

6
	

1
	

2
	

6
	

6
	

0
	

2
	

7
	

5
	

3
	

12

40
	

5
	

1
	

2
	

5
	

5
	

0
	

2
	

5
	

3
	

2
	

10

36
	

4
	

1
	

1
	

5
	

4
	

0
	

2
	

5
	

3
	

2
	

9

OBSERVAÇÃO: O cálculo para a distribuição de vagas, seus possíveis arredondamentos e redistribuições, seguem o disposto na Portaria MEC nº 2027 de 16 de novembro de 2023, o que pode fazer com que algumas cotas não atendam os percentuais indicados no título.


 

ANEXO III - EDITAL IFPR Nº 89, DE 20 DE setembro DE 2024

MAPA DE MIGRAÇÃO DAS VAGAS EM AÇÕES AFIRMATIVAS SEM CANDIDATOS APTOS A OCUPÁ-LAS

SOBROU VAGA AQUI
	

1º VAI PARA:
	

2º VAI PARA:
	

3º VAI PARA:
	

4º VAI PARA:
	

5º VAI PARA:
	

6º VAI PARA:
	

7º VAI PARA:
	

8º VAI PARA:
	

9º VAI PARA:
	

10º VAI PARA:

IFPR-PPI
	

IFPR-PCD
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

IFPR-PCD
	

IFPR-PPI
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

BR-EP-Q
	

BR-EP-PPI 
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

BR-EP-PCD
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

BR-EP 
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

EP-PPI
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-Q 
	

EP-PCD
	

EP
	

AC

EP-Q 
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-PCD
	

EP
	

AC

EP-PCD
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP
	

AC

EP
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

AC


 

ANEXO IV - EDITAL IFPR Nº 89, DE 20 DE setembro DE 2024

ENDEREÇOS DOS CAMPI DO IFPR

CAMPUS
	

ENDEREÇO
	

PÁGINA ELETRÔNICA

ARAPONGAS
	

Rua Surucuá Açu, 321 – Vila Araponguinha
	

https://ifpr.edu.br/arapongas/

ASTORGA
	

Rodovia PR 454, Contorno Norte
	

https://ifpr.edu.br/astorga/

ASSIS CHATEAUBRIAND
	

Av. Cívica, 475 – Centro Cívico
	

https://ifpr.edu.br/assis-chateaubriand/

BARRACÃO
	

Rodovia BR 163, nº 2115 - Industrial, Barracão
	

https://ifpr.edu.br/barracao/

CAMPO LARGO
	

R. Eng. Tourinho, 829 - Vila Solene
	

https://ifpr.edu.br/campo-largo/

CAPANEMA
	

Rua Cariris nº 750 Bairro Santa Bárbara
	

https://ifpr.edu.br/capanema/

CASCAVEL
	

Avenida das Pombas, 2020 - Floresta
	

https://ifpr.edu.br/cascavel/

COLOMBO
	

Rua Antonio Chemin, 28, São Gabriel
	

https://ifpr.edu.br/colombo/

CORONEL VIVIDA
	

PR 562, Flor da Serra
	

https://ifpr.edu.br/coronel-vivida/

CURITIBA
	

R. João Negrão, 1285
	

https://ifpr.edu.br/curitiba/

FOZ DO IGUAÇU
	

Avenida Araucária, 780, Bairro Vila A
	

https://ifpr.edu.br/foz-do-iguacu/

GOIOERÊ
	

Rodovia Luiz Dechiche, s/nº
	

https://ifpr.edu.br/goioere/

IRATI
	

Rua Pedro Koppe, 100 – Vila Matilde
	

https://ifpr.edu.br/irati/

IVAIPORÃ
	

Rua Max Arthur Greipel, nº 505
	

https://ifpr.edu.br/ivaipora/

JACAREZINHO
	

Avenida Dr. Tito nº: 801 – Jardim Panorama
	

https://ifpr.edu.br/jacarezinho/

JAGUARIAÍVA
	

Av. Eloa Martins Passos Felix – Rod. 151 Km 213,7
	

https://ifpr.edu.br/jaguariaiva/

LONDRINA
	

Rua João XXIII, nº 600, Jardim Dom Bosco
	

https://ifpr.edu.br/londrina/

PALMAS
	

Av. Bento Munhoz da Rocha Neto, s/nº
	

https://ifpr.edu.br/palmas/

PARANAGUÁ
	

Rua Antonio Carlos Rodrigues, n.º 453 – Porto Seguro
	

https://ifpr.edu.br/paranagua/

PARANAVAÍ
	

Rua José Felipe Tequinha, 1400 – Jardim das Nações
	

https://ifpr.edu.br/paranavai/

PINHAIS
	

Rua Humberto de Alencar Castelo Branco, 1575 Jardim Amélia
	

https://ifpr.edu.br/pinhais/

PITANGA
	

Rua José de Alencar, 1.080 – Vila Planalto
	

https://ifpr.edu.br/pitanga/

QUEDAS DO IGUAÇU
	

Rua, Marginal Imbirama, 300 - linha Tapuí
	

https://ifpr.edu.br/quedas-do-iguacu/

TELÊMACO BORBA
	

Rodovia PR 160 – km 19,5 – Jardim Bandeirantes
	

https://ifpr.edu.br/telemaco-borba/

UMUARAMA
	

Rodovia PR 323, KM 302, Parque Industrial
	

https://ifpr.edu.br/umuarama/

UNIÃO DA VITÓRIA
	

Av. Paula Freitas, 2800 - São Braz
	

https://ifpr.edu.br/uniao-da-vitoria/

 

ANEXO V - EDITAL IFPR Nº 89, DE 20 DE setembro DE 2024

FORMULÁRIO DE SOLICITAÇÃO DE RECURSO

Nome do candidato(a):

 

Curso e campus para o qual se inscreveu:

 

CPF do candidato(a):

 

Selecione o tipo de recurso que você deseja protocolar (assinale apenas uma opção):

 

(   ) Recurso contra homologação de inscrição.

(   ) Recurso contra o indeferimento da solicitação de isenção da taxa de inscrição.

(   ) Recurso contra o indeferimento da autodeclaração étnico-racial.

(   ) Recurso contra o indeferimento da matrícula.

 

Justificativa do recurso:

 

 

 

 

 

 

 

 

________________________ - PR, ____ de ____________________ de 20___.

 

_____________________________________________

Assinatura do(a) Candidato(a) ou do Responsável Legal 

 

Justificativa da decisão:








 


 

ANEXO VII - EDITAL Nº 89, DE 20 DE setembro DE 2024

COMPROVAÇÃO DOCUMENTAL DA RENDA BRUTA MENSAL PARA AVALIAÇÃO DE COTAS BAIXA RENDA

 

Os/as candidatos/as aprovados/as nas ações afirmativas de escola pública e baixa renda (BR-EP; BR-EP-PCD; BR-EP-Q; BR-EP-PPI)  deverão comprovar renda familiar bruta mensal per capita (por pessoa) igual ou inferior a 1 (um) salário-mínimo nacional - (R$ 1.412,00).  

Para essa comprovação, você poderá proceder de 2 formas distintas:

a) Apresentar comprovante de inscrição do CadÚnico (Programa de Cadastro único do Governo Federal) que deverá estar atualizado nos últimos 24 (vinte e quatro) meses anteriores à data de inscrição no Processo Seletivo.

 

OU como alternativa aos que não possuem inscrição no CadÚnico:

b) Enviar os comprovantes exigidos em edital para todos os membros da família:

 

1: Preencher e assinar a Declaração de Núcleo Familiar Renda Bruta Familiar disponível no link indicado no item 1.1.4 deste edital.

 

2: ANEXAR DOCUMENTAÇÃO COMUM A TODOS OS MEMBROS DO NÚCLEO FAMILIAR E AO CANDIDATO:

a) Certidão de Nascimento ou Cédula de Identidade (RG) ou Passaporte ou Carteira Nacional de Habilitação, de todos os integrantes do núcleo familiar;

b) CPF de todos os integrantes do núcleo familiar, com mais de 18 anos;

c) Comprovante de residência;

d) Carteira de Trabalho e Previdência Social (CTPS) física, para todos os integrantes com mais de 18 anos, a qual deverá conter as páginas da: foto, qualificação civil, contratos de trabalho e a próxima página em branco de contrato de trabalho. Ou, Carteira de Trabalho Digital em PDF Único atualizada, contendo todos os dados pessoais e contratos de trabalho. Caso não possua CTPS, preencher e assinar Declaração De Não Possuir Carteira De Trabalho E Previdência Social (CTPS) disponível no link indicado no item 1.1.4 deste edital.

e) Declaração de Imposto de Renda completa COM recibo (Exercício 2024, ano calendário 2023), aos componentes do núcleo familiar com mais de 18 anos, caso seja declarante. Aos componentes do núcleo familiar, com mais de 18 anos não declarantes de Imposto de Renda, apresentar comprovante, disponível no link abaixo para consulta:  Disponível em: <https://www.restituicao.receita.fazenda.gov.br>

 

3: DOCUMENTAÇÃO DE RENDA PARA TODOS OS INTEGRANTES DO NÚCLEO FAMILIAR COM MAIS DE 18 ANOS: (Caso o núcleo familiar seja composto por integrantes de diferentes categorias (assalariados, autônomos etc.), a documentação deverá ser apresentada em acordo com cada realidade de trabalho e renda).

3.1.  DESEMPREGADOS, ESTUDANTES OU DONA(O) DE CASA:

a) Em caso de desemprego recente, apresentar Rescisão de Contrato e comprovante de recebimento do seguro desemprego, e/ou;

b) Preencher e assinar a Declaração – Não Possui Renda Mensal disponível no link indicado no item 1.1.4 deste edital.

 

3.2.  TRABALHADORES ASSALARIADOS (celetistas, servidores públicos, empregado doméstico, aprendizes):

a) Contracheques/holerites dos três meses anteriores à inscrição (julho, agosto e setembro de 2024).

 

3.3.  APOSENTADOS, PENSIONISTAS E DEMAIS BENEFICIÁRIOS DO INSS:

a) Comprovante do benefício do INSS (aposentado, pensionista ou demais beneficiários), demonstrando o valor bruto recebido dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024); OU

b) Comprovante de aposentadoria (caso não seja INSS).

 

3.4.  AUTÔNOMOS E PROFISSIONAIS LIBERAIS:

a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

b) Preencher e assinar declaração da atividade desenvolvida como autônomo ou liberal e a renda bruta mensal (Declaração Renda variável) disponível no link indicado no item 1.1.4 deste edital.

c) Guias de recolhimento ao INSS com comprovante de pagamento dos três meses anteriores à inscrição.

 

3.5.  EMPRESÁRIO OU PESSOAS COM PARTICIPAÇÃO EM COTAS DE EMPRESAS OU MICROEMPRESAS:

a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

b) Preencher e assinar declaração da atividade desenvolvida e a renda como empresário/microempreendedor (Declaração Renda variável) disponível no link indicado no item 1.1.4 deste edital.

c) Pró-labores dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

d) Declaração completa de Imposto de Renda de Pessoa Jurídica – DIPJ, exercício 2024 ano calendário 2023, acompanhado do recibo de entrega, quando houver;

e) Declaração completa de Informações socioeconômicas e Fiscais (DEFIS- Simples Nacional) para Microempresários e Empresários de Pequeno Porte, quando houver;

f)  Declaração Comprobatória de Percepção de Rendimentos (DECORE), quando houver,

 

3.6.  MICROEMPREENDEDOR INDIVIDUAL:

a) Extratos bancários dos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

b) Preencher e assinar declaração relatando a atividade desenvolvida como microempreendedor e a renda mensal (Declaração Renda variável), disponível no link indicado no item 1.1.4 deste edital; e

c) Declaração Anual CNPJ MEI (DASN-SIMEI).

 

3.7.  TRABALHADORES DO MERCADO INFORMAL: (atividade sem vínculo empregatício, não possui contrato de trabalho, não contribui com INSS).

a) Preencher e assinar declaração relatando a renda bruta mensal e a atividade desenvolvida como trabalhador informal (Declaração Renda variável), disponível no link indicado no item 1.1.4 deste edital.

 

3.8.  ESTAGIÁRIOS ou BOLSISTAS:

a) Contrato de estágio/bolsa, ou Termo de Compromisso de estágio/bolsa.

 

3.9.  RENDIMENTOS DE ALUGUEL OU ARRENDAMENTO DE BENS MÓVEIS E IMÓVEIS:

a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

b) Contrato(s) de locação ou arrendamento(s) devidamente registrado(s) em cartório, acompanhado(s) dos recibos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), ou;

c) Preencher e assinar declaração de próprio punho relatando o valor recebido, acompanhada dos recibos dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024).

 

3.10. PARA CASOS DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA:

a) Decisão judicial discriminando o nome do(s) beneficiários e o valor a ser pago, ou;

b) Preencher e assinar declaração do beneficiário e o valor mensal recebido de pensão, (Declaração Renda variável), disponível no link indicado no item 1.1.4 deste edital.

 

3.11. ATIVIDADE RURAL:

a) Extratos bancários dos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

b)  Declaração do sindicato rural, associação, cooperativa ou prefeitura, contendo o valor recebido mensalmente ou anualmente e informações detalhadas atividade desenvolvida, ou

c)  Preencher e assinar declaração, contendo o valor recebido mensalmente ou anualmente, e informações da atividade desenvolvida, anexando as 3 (três últimas) notas fiscais de vendas de produtos, (Declaração Renda variável), disponível no link indicado no item 1.1.4 deste edital; e

d)  Declaração de Imposto de Renda Pessoa Jurídica - IRPJ, quando houver;

e)  Quaisquer declarações tributárias referentes a pessoas jurídicas vinculadas ao candidato ou a membros da família, quando for o caso.

 

 

ANEXO VII - EDITAL IFPR Nº 89, DE 20 DE setembro DE 2024

REQUERIMENTO DE MATRÍCULA

 CURSO:________________________________________________________________

(    ) Integrado    (    ) Subsequente  (   ) Licenciatura  (    ) Bacharelado  (    ) Tecnologia

 

CAMPUS:_______________________________________________________________

PERÍODO DE INGRESSO: 2025

SEMESTRE:________TURNO:_____________________________

AÇÃO AFIRMATIVA DE CONCORRÊNCIA/COTA: _______________ (Ver Código Quadro Abaixo)  

IFPR-PPI - candidatos autodeclarados pretos, pardos ou indígenas, independentemente de renda familiar e de ter cursado a etapa anterior em escola pública.

IFPR-PCD - candidatos com deficiência, independentemente de renda familiar e de ter cursado a etapa anterior integralmente em escola pública.

EP - estudantes que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

EP-PPI -  Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.
	

BR-EP - candidatos que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

BR-EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

BR-EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

AC - Ampla Concorrência.

DADOS DO ESTUDANTE:

NOME:_________________________________________________________________

RG______________________ ORG./UF:________ CPF__________________________

NOME DO RESPONSÁVEL LEGAL: _________________________________________________________________

PARENTESCO DO RESPONSÁVEL LEGAL COM O ESTUDANTE: ___________________________________________

(Nos casos de guarda, tutela ou outro documento de responsabilidade incluir junto ao requerimento o documento comprobatório).

TELEFONE DO ESTUDANTE:________________________ TELEFONE DO RESPONSÁVEL:_______________________ 

 

EMAIL:_________________________________________________________________

ENDEREÇO RESIDENCIAL: ________________________________________________________________ CEP: _________________________

(   ) DECLARO, sob as penas da lei, que não possuo escolaridade de nível superior (Para os candidatos que  concorrem às vagas de inclusão).

( ) DECLARO, para os devidos fins, que assumo total responsabilidade sobre as informações contidas neste documento. Por ser expressão da verdade, dato e assino o presente documento, ficando ciente de que no caso de inveracidade comprovada estarei sujeito às penalidades cabíveis.

 _________________________, __________ de _______________________ de 20____

 

 _______________________________                       _____________________________

       Assinatura da(o) estudante                                 Assinatura da(o) responsável legal

 

ANEXO VIII - EDITAL IFPR Nº 89, DE 20 DE setembro DE 2024

DECLARAÇÃO DA COMUNIDADE ÍNDIGENA

 

Declaramos para os devidos fins que o(a) candidato(a) __________________________________________ portador(a) do CPF n.º _______________________________, reside/pertence à Comunidade Indígena de ___________________________________ do município de ______________________________ , Estado ________________________.

 

 

DADOS DA LIDERANÇA 1

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Indígena:

Assinatura

 

 

 

DADOS DA LIDERANÇA 2

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Indígena:

Assinatura

 

 

DADOS DA LIDERANÇA 3

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Indígena:

Assinatura

 

 

ANEXO IX - EDITAL IFPR Nº 89, DE 20 DE setembro DE 2024

DECLARAÇÃO DA COMUNIDADE QUILOMBOLA

 

Declaramos para os devidos fins que o(a) candidato(a) __________________________________________ portador(a) do CPF n.º _______________________________, reside/pertence à Comunidade Quilombola de ___________________________________ do município de ______________________________ , Estado ________________________.

 

 

DADOS DA LIDERANÇA 1

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Quilombola:

Assinatura

 

 

 

DADOS DA LIDERANÇA 2

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Quilombola:

Assinatura

 

 

DADOS DA LIDERANÇA 3

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Quilombola:

Assinatura

 

 `;

            var edital4 = `Edital N°90, de 20 de setembro de 2024

PROCESSO SELETIVO IFPR 2025 - CURSOS SUPERIORES DE BACHARELADO E TECNOLOGIA

 

O Reitor do Instituto Federal de Educação, Ciência e Tecnologia do Paraná, no uso da competência que lhe confere o Decreto de 06 de fevereiro de 2024, publicado no Diário Oficial da União no dia 07 de fevereiro de 2024, seção 2, página 01, torna público as normas que regem o Processo Seletivo IFPR 2025 para ingresso nos Cursos Superiores de bacharelado e tecnologia, na modalidade presencial, ofertados para o ano de 2025, considerando a política de inclusão do IFPR para o ingresso de estudantes nos cursos. As inscrições, cuja taxa é de R$50,00 (cinquenta reais), estarão abertas de 03 de outubro de 2024 a 17 de janeiro de 2025.

 

BASE LEGAL

Lei nº 9.394, de 20 de dezembro de 1996 - Estabelece as diretrizes e bases da educação nacional.

Decreto nº 3.298, de 20 de dezembro de 1999 - Regulamenta a Lei no 7.853, de 24 de outubro de 1989, dispõe sobre a Política Nacional para a Integração da Pessoa Portadora de Deficiência, consolida as normas de proteção, e dá outras providências.

Decreto nº 5.296, de 02 de dezembro de 2004 - Regulamenta as Leis nos 10.048, de 8 de novembro de 2000, que dá prioridade de atendimento às pessoas que especifica, e 10.098, de 19 de dezembro de 2000, que estabelece normas gerais e critérios básicos para a promoção da acessibilidade das pessoas portadoras de deficiência ou com mobilidade reduzida, e dá outras providências.

Decreto nº 6.593/2008 - Regulamenta o art. 11 da Lei no 8.112, de 11 de dezembro de 1990, quanto à isenção de pagamento de taxa de inscrição em concursos públicos realizados no âmbito do Poder Executivo federal.

Lei nº 12.711, de 29 de agosto de 2012 - Dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio e dá outras providências.

Lei nº 12.764, de 27 de dezembro de 2012 - Institui a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista; e altera o § 3º do art. 98 da Lei nº 8.112, de 11 de dezembro de 1990.

Decreto nº 7.824, de 11 de outubro de 2012 - Regulamenta a Lei nº 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

Lei nº 13.146, de 06 de julho de 2015 - Institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência).

Lei nº 13.409, de 28 de dezembro de 2016 - Altera a Lei nº 12.711, de 29 de agosto de 2012, para dispor sobre a reserva de vagas para pessoas com deficiência nos cursos técnico de nível médio e superior das instituições federais de ensino.

Decreto nº 9.034, de 20 de abril de 2017 - Altera o Decreto n º 7.824, de 11 de outubro de 2012, que regulamenta a Lei n º 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

Lei nº 14.126 de 22 de março de 2021 - Classifica a visão monocular como deficiência sensorial, do tipo visual.

Decreto nº 11.016/2022 - Regulamenta o Cadastro Único para Programas Sociais do Governo Federal, instituído pelo art. 6º-F da Lei nº 8.742, de 7 de dezembro de 1993.

Lei nº 14.723 de 13 de novembro de 2023 - Altera a Lei nº 12.711, de 29 de agosto de 2012, para dispor sobre o programa especial para o acesso às instituições federais de educação superior e de ensino técnico de nível médio de estudantes pretos, pardos, indígenas e quilombolas e de pessoas com deficiência, bem como daqueles que tenham cursado integralmente o ensino médio ou fundamental em escola pública.

Decreto nº 11.781 de 14 de novembro de 2023 - Altera o Decreto nº 7.824, de 11 de outubro de 2012, que regulamenta a Lei nº 12.711, de 29 de agosto de 2012, que dispõe sobre o ingresso nas universidades federais e nas instituições federais de ensino técnico de nível médio.

Decreto Nº 11.864, de 27 de dezembro de 2023 - Dispõe sobre o valor do salário mínimo a vigorar a partir de 1º de janeiro de 2024.

Portaria Normativa MEC nº 18, de 11 de outubro de 2012 - Dispõe sobre a implementação das reservas de vagas em instituições federais de ensino de que tratam a Lei no 12.711, de 29 de agosto de 2012, e o Decreto no 7.824, de 11 de outubro de 2012.

Portaria Normativa nº 2.027 de 16 de novembro de 2023 - Altera a Portaria Normativa MEC nº 18, de 11 de outubro de 2012, que dispõe sobre a implementação das reservas de vagas em instituições federais de ensino de que tratam a Lei nº 12.711, de 29 de agosto de 2012, e a Portaria Normativa MEC nº 21, de 5 de novembro de 2012, que dispõe sobre o Sistema de Seleção Unificada - Sisu.

Resolução Consup/IFPR nº 190/2024 – Dispõe sobre a Organização Didático-Pedagógica dos Cursos Técnicos de Nível Médio na modalidade presencial do Instituto Federal de Educação, Ciência e Tecnologia do Paraná.

Resolução Consup/IFPR nº 55/2011 – Dispõe sobre a Organização Didático Pedagógica da Educação Superior no âmbito do Instituto Federal do Paraná – IFPR.

 

1. DAS DISPOSIÇÕES PRELIMINARES

1.1. Os cursos de bacharelado e tecnologia, objeto deste certame, são públicos, gratuitos e presenciais, devendo o(a) candidato(a) ter disponibilidade de tempo para realizar atividades no contraturno e/ou aos sábados, conforme o calendário acadêmico do campus e o projeto pedagógico do curso.

1.1.1 Alguns cursos podem possuir parte de sua carga horária à distância, conforme a legislação vigente e o seu projeto pedagógico de curso.

1.1.2 Para acessar tutoriais em vídeo sobre o processo seletivo (com acessibilidade), utilize o endereço eletrônico https://ifpr.edu.br/estude-conosco/processo-seletivo-2025/tutoriais/.

1.1.3 Para acessar formulários e outros documentos editáveis, utilize o endereço eletrônico https://ifpr.edu.br/estude-conosco/processo-seletivo-2025/documentos/.

1.1.4 Para acessar o Portal do Candidato do IFPR, utilize o endereço eletrônico https://portaldocandidato.ifpr.edu.br/.

1.2. Ao término do curso, o estudante fará jus ao diploma de bacharel ou tecnólogo na respectiva área de conhecimento.

1.3. Para ingresso nos Cursos de Bacharelado e Tecnologia o candidato deverá ter concluído, imprescindivelmente, o Ensino Médio até a data da matrícula.

1.4. O processo seletivo será realizado em uma única etapa, que consistirá na classificação do(a) candidato(a) pelo seu desempenho (notas) obtidas no Exame Nacional de Ensino Médio (ENEM) dos últimos dez anos (entre 2015 e 2024), conforme detalhado no item 6, deste Edital.

1.5 É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação de todos os atos, editais e comunicados referentes ao Processo Seletivo regido por este edital. 

1.6 O(A) candidato(a) que se inscrever pelo Sistema de Ações Afirmativas (cotas) automaticamente autoriza a divulgação dos resultados do Processo Seletivo referente a este edital de acordo com a classificação gerada pelo Sistema de Ações Afirmativas (cotas), nos termos da Lei nº 12.711, de 29 de agosto de 2012, do Decreto nº 7.824, de 11 de outubro de 2012, da Portaria Normativa MEC nº 18, de 11 de outubro de 2012, da Lei nº 13.409, de 28 de dezembro de 2016, do Decreto nº 9.034, de 20 de abril de 2017, da Lei nº 14.723 de 13 de novembro de 2023, do Decreto nº 11.781 de 14 de novembro de 2023 e da Portaria Normativa nº 2.027 de 16 de novembro de 2023. 

1.7 O(A) candidato(a) deverá possuir Carteira de Identidade (CI) e CPF para participar do referido processo seletivo. 

1.8 Serão considerados documentos de identificação: Carteira de Identidade expedida pelas Secretarias de Segurança Pública, pelas Forças Armadas Brasileiras, por países que possuem acordos diplomáticos com o Brasil, Polícias Militares, Ordens ou Conselhos que, por Lei Federal, tenha validade como documento de identidade e possibilite a conferência da foto e da assinatura; Carteira de Identidade Nacional - CIN; Carteira de Trabalho e Previdência Social(CTPS); Passaporte; ou Carteira Nacional de Habilitação com fotografia – na forma da Lei nº 9.503/97 e o Documento de Identidade Nacional de Estrangeiro (Carteira de Registro Nacional Migratório - CRNM).

1.8.1. A CTPS Digital apenas tem validade como documento para fins de acompanhamento do contrato de trabalho, não sendo válida como documento de identificação. 

1.9 Ao se inscrever para este Processo Seletivo, o(a) candidato(a) declara conhecer e aceitar todas as condições descritas neste edital. Declara, ainda, estar ciente de que qualquer omissão ou falsidade, bem como o não atendimento das exigências impostas, culminará com a sua desclassificação do processo.

 

2. DA FORMA DE OFERTA

2.1 Os cursos de bacharelado e tecnologia ofertados neste Edital, na modalidade presencial, tendo ou não parte de sua carga horária ofertada à distância, nos termos da legislação vigente, são oferecidos a quem já tenha concluído o Ensino Médio.

2.1.1 O IFPR oferta, no campus Palmas, as graduações em Educação Física e Química que contemplam formação em bacharelado e licenciatura. A seleção das turmas de ingresso para o ano de 2025, bem como os critérios para a escolha posterior da formação em bacharelado ou licenciatura, constarão no edital específico para os cursos superiores de licenciatura.

2.2 O início das aulas para os estudantes matriculados se dará em data a ser definida no Calendário Acadêmico e Administrativo de cada campus a ser divulgado na página oficial de cada campus, que pode ser consultada no Anexo IV deste Edital.

 

3. DOS CURSOS E VAGAS

3.1 A distribuição das vagas nos diversos cursos e campi do IFPR e nas diferentes cotas de inclusão e ampla concorrência encontram-se, respectivamente, no Anexo I e no Anexo II deste Edital.

3.2 O total das vagas ofertadas para cada curso e turma será disponibilizado da seguinte forma:

3.2.1 60% (sessenta por cento) do total das vagas ofertadas para cada curso e turma, para cursos de bacharelado e tecnologia, são reservadas aos candidatos que tenham cursado integralmente o Ensino Médio em escolas públicas do Brasil, em cursos regulares ou no âmbito da modalidade de Educação de Jovens e Adultos (EJA), ou tenham obtido certificado de conclusão com base no resultado do Exame Nacional do Ensino Médio, do Exame Nacional para Certificação de Competências da Educação de Jovens e Adultos (Encceja) ou de exames de certificação de competência ou de avaliação de jovens e adultos realizados pelos sistemas estaduais de ensino. Esse percentual será distribuído da seguinte maneira:

3.2.1.1 50% (cinquenta por cento) serão destinados, para cada curso e turma,  aos candidatos que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário - mínimo nacional per capita (R$ 1.412,00), havendo reserva de vagas para candidatos:

3.2.1.1.1 BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas.

3.2.1.1.2  BR-EP-Q - Autodeclarados quilombolas.

3.2.1.1.3 BR-EP-PCD - Pessoas com deficiência.

3.2.1.1.4 BR-EP - Demais candidatos.

3.2.1.2 50% (cinquenta por cento) serão destinados, para cada curso e turma, aos candidatos que, independentemente de renda familiar, havendo reserva de vagas para candidatos:

3.2.1.2.1 EP-PPI -  Autodeclarados pretos, pardos ou indígenas.

3.2.1.2.2 EP-Q - Autodeclarados quilombolas.

3.2.1.2.3 EP-PCD - Pessoas com deficiência.

3.2.1.2.4 EP - Demais candidatos

3.3.1 IFPR-PPI - 10% (dez por cento) do total das vagas ofertadas para cada curso e turma são reservadas aos candidatos autodeclarados pretos, pardos ou indígenas.

3.3.2 IFPR-PCD - 5% (cinco por cento) do total das vagas ofertadas para cada curso e turma são reservadas aos candidatos com deficiência.

3.3.3 25% (vinte por cento) do total das vagas ofertadas para cada curso e turma são reservadas à Ampla Concorrência (AC). Nesta forma de oferta estão incluídos estudantes que estudaram qualquer tempo em escolas particulares mesmo sendo bolsistas.

3.4 Os Processos Seletivos do IFPR realizam reserva de vagas através do Sistema de Ações Afirmativas (cotas), estabelecidas nos termos da Lei nº 12.711, de 29 de agosto de 2012, do Decreto nº 7.824, de 11 de outubro de 2012, da Portaria Normativa MEC nº 18, de 11 de outubro de 2012, da Lei nº 13.409, de 28 de dezembro de 2016, do Decreto nº 9.034, de 20 de abril de 2017, da Lei nº 14.723 de 13 de novembro de 2023, do Decreto nº 11.781 de 14 de novembro de 2023 e da Portaria Normativa nº 2.027 de 16 de novembro de 2023 mediante a comprovação das respectivas condições por meio de documentos.

3.4.1 O cálculo para a distribuição de vagas, seus possíveis arredondamentos e redistribuições, segue o disposto na Portaria MEC nº 2027 de 16 de novembro de 2023, o que pode fazer com que algumas ações afirmativas (cotas), bem como a ampla concorrência não atendam exatamente os percentuais indicados.

3.4.2 A base para a distribuição de vagas em cada ação afirmativa (cota) e na Ampla Concorrência encontra-se no Anexo II deste edital.

3.4.1. Candidatos(as) estrangeiros, que não sejam naturalizados, ou que tenham feito parte de seu estudo no exterior, não poderão participar do processo seletivo na reserva de vagas para estudantes de escola pública, devendo, portanto, responder NÃO à pergunta de número 1 (um) do Questionário Socioeconômico no momento da inscrição. 

3.5. As ações afirmativas às quais o(a) candidato(a) poderá concorrer durante o processo seletivo serão definidas mediante preenchimento de questionário socioeconômico, durante a realização da inscrição.

3.5.1. O questionário socioeconômico a que se refere o item 3.5 possuirá as seguintes questões:

a) QUESTÃO 01 - Você concluiu TODA a etapa de ensino anterior à modalidade de curso para a qual está se inscrevendo em uma instituição pública?

b) QUESTÃO 02 - De acordo com as condições estabelecidas no edital do processo seletivo, a sua renda per capta familiar é igual ou inferior a 1 salário mínimo atualmente? (Renda familiar per capita é calculada dividindo-se o total de renda familiar pelo número de moradores de uma residência).

c) QUESTÃO 03 - Você se identifica como pessoa preta, parda ou indígena?

d) QUESTÃO 04 - Você é membro ou reside em alguma comunidade remanescente de quilombo?

e) QUESTÃO 05 - Você possui alguma deficiência que se enquadra nas condições estabelecidas no edital do processo seletivo para o qual está se inscrevendo e que pode ser comprovada por meio de laudo médico?

3.6. As vagas da Ampla Concorrência são destinadas a todos(as) os(as) candidatos(as) que se julgarem aptos(as) a participar do certame, independentemente da condição social, racial, de deficiência ou de terem cursado o ensino fundamental em escola pública ou privada. 

3.6.1 Os(as) candidatos(as) que já possuam escolaridade de nível superior somente podem concorrer nas vagas de da Ampla Concorrência.

3.7. Quando ocorrer a existência de vagas em uma determinada ação afirmativa (cota) e a falta de candidatos inscritos para ocupá-las, ocorrerá a convocação de candidatos de outras listas de concorrência, a partir da migração da referida vaga, respeitando a ordem constante no Anexo III.

 

4. DO SISTEMA DE AÇÕES AFIRMATIVAS (COTAS) 

4.1 Cotas para Escola Pública 

4.1.1. Os(As) candidatos(as) inscritos(as) por alguma ação afirmativa de escola pública devem apresentar, no momento da matrícula, histórico escolar por meio do qual comprovem ter cursado e concluído todo o Ensino Médio exclusivamente na rede pública de ensino do Brasil.

4.1.2. Não poderá ser matriculado(a), nas vagas reservadas para as ações Afirmativas (cotas) de Escola Pública, o(a) candidato(a) que tenha cursado o Ensino Médio, integralmente ou em parte, em escolas particulares, inclusive com bolsa de estudos parcial ou integral (Art. 5º, Inciso II b, § 1º da Portaria Normativa nº 18 de 2012). Identificadas disciplinas isoladas realizadas na rede privada de ensino, o(a) candidato(a) também estará impossibilitado(a) de se matricular nestas vagas.

4.1.3. De acordo com o Art. 19, inciso I da Lei nº 9.394, de 20 de dezembro de 1996, considera-se Escola Pública a instituição criada ou incorporada, mantida e administrada pelo poder público. As escolas pertencentes ao Sistema S (SENAI, SESI, SENAC), escolas conveniadas, escolas filantrópicas ou, ainda, fundações ou instituições similares (mesmo que mantenham educação gratuita) não são consideradas instituições da rede pública de ensino.

4.1.4 Caso, no momento da matrícula, o documento a que se refere o item 4.1.1 não seja apresentado ou não comprove a condição de o estudante ter realizado todo o Ensino Médio em escola pública, requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado. 

4.1.4.1 Ocorrendo a situação prevista no item 4.1.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VI que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

4.1.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.1.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.


4.2. Cotas para Baixa Renda

4.2.1. Os(As) candidatos(as) inscritos(as) por alguma ação afirmativa de Baixa Renda deverão comprovar renda familiar bruta igual ou inferior a 1(um) salário-mínimo per capita (equivalente a R$ 1.412,00, de acordo com o DECRETO Nº 11.864, DE 27 DE DEZEMBRO DE 2023). 

4.2.2. Para atendimento da condição de baixa renda, deve-se considerar: 

a) Família: a unidade nuclear composta por uma ou mais pessoas, eventualmente ampliada por outras pessoas que contribuam para o rendimento ou tenham suas despesas atendidas por aquela unidade familiar, todas moradoras em um mesmo domicílio; 

b) Morador: a pessoa que tem o domicílio como local habitual de residência e nele reside na data de inscrição do estudante no processo seletivo da instituição federal de ensino; 

c) Renda familiar bruta mensal: a soma dos rendimentos brutos auferidos por todas as pessoas da família, calculada na forma do disposto no Art. 7º da Portaria Normativa nº 18/2012 do MEC. 

d) Renda familiar bruta mensal per capita: a razão entre a renda familiar bruta mensal e o total de pessoas da família, calculada na forma do art. 7º da Portaria Normativa Nº 18, de 11 de outubro de 2012 - MEC.

4.2.3. No momento da matrícula, os documentos comprobatórios para análise da renda deverão ser referentes aos 3 meses anteriores ao período de inscrições (julho, agosto e setembro de 2024). 

4.2.3.1 Os documentos a que se refere o item 4.2.3 constam no Anexo VII e deverão ser enviados, em um único arquivo, através do Portal do Candidato do IFPR no item “Documentos Comprobatórios de Renda”.

4.2.4. Caso, no momento da matrícula, os documentos a que se refere o item 4.2.3 não sejam apresentados ou não comprovem a condição de renda requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

4.2.4.1 Ocorrendo a situação prevista no item 4.2.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VI que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

4.2.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.2.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

 

4.3 Cotas para Pretos, Pardos ou Indígenas 

4.3.1. Os(As) candidatos(as) inscritos(as) e preliminarmente aprovados em alguma ação afirmativa de Pretos, Pardos ou Indígenas serão convocados(as), obrigatoriamente, a passar pelo procedimento de heteroidentificação, por meio de edital próprio.

4.3.2. O procedimento de heteroidentificação será realizado anteriormente à fase de matrícula.

4.3.2.1. Para os candidatos autodeclarados indígenas, quando convocados para a heteroidentificação, deverão apresentar:

a) cópia digitalizada do RANI (Registro de Nascimento Indígena); e/ou 

b) declaração de residência/pertencimento à comunidade indígena assinada por 3 (três) autoridades indígenas, com os respectivos contatos telefônicos das 3 (três) autoridades conforme Anexo IX; e/ou 

c) histórico escolar emitido por escola indígena.

4.3.2.2 As demais orientações para a realização do procedimento de heteroidentificação estarão descritas em edital específico a ser publicado conforme cronograma do item 5.

4.3.3. Caso, após o procedimento de heteroidentificação, seja indeferida a autodeclaração como pessoa preta, parda ou indígena, o(a) candidato(a) somente poderá ser convocado em qualquer das chamadas, pela Ampla Concorrência e ou por outras ações afirmativas (cotas) que não sejam direcionadas a pessoas pretas, pardas ou indígenas. 

 

4.4 Cotas para Pessoa com Deficiência 

4.4.1. Considerar-se-á Pessoa com Deficiência (PcD) aquela que possui impedimento de longo prazo, de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais barreiras, pode obstruir sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas, conforme artigo 2º da Lei nº 13.146, de 06 de julho de 2015, e a pessoa com transtorno do espectro autista, de acordo com art. 1º, § 2 o da Lei nº 12.764, de 27 de dezembro de 2012. 

4.4.2. Os(As) candidatos(as) inscritos(as) pelo Sistema de Ações Afirmativas (cota) Pessoa com Deficiência deverão se enquadrar: 

a) No art. 4º do Decreto nº 3.298, de 20 de dezembro de 1999, atualizado pelo art. 5º, § 1º, inciso I, do Decreto nº 5.296, de 02 de dezembro de 2004, o qual apresenta as seguintes definições: 

I - deficiência física: alteração completa ou parcial de um ou mais segmentos do corpo humano, acarretando o comprometimento da função física, apresentando-se sob a forma de paraplegia, paraparesia, monoplegia, monoparesia, tetraplegia, tetraparesia, triplegia, triparesia, hemiplegia, hemiparesia, ostomia, amputação ou ausência de membro, paralisia cerebral, nanismo, membros com deformidade congênita ou adquirida, exceto as deformidades estéticas e as que não produzam dificuldades para o desempenho de funções; 

II - deficiência auditiva: perda bilateral, parcial ou total, de quarenta e um decibéis (dB) ou mais, aferida por audiograma nas frequências de 500Hz, 1.000Hz, 2.000Hz e 3.000Hz; 

III - deficiência visual: cegueira, na qual a acuidade visual é igual ou menor que 0,05 no melhor olho, com a melhor correção óptica; a baixa visão, que significa acuidade visual entre 0,3 e 0,05 no melhor olho, com a melhor correção óptica; os casos nos quais a somatória da medida do campo visual em ambos os olhos for igual ou menor que 60º; ou a ocorrência simultânea de quaisquer das condições anteriores; visão monocular como deficiência sensorial, do tipo visual (conforme definido na lei nº 14.126 de 22 de março de 2021) . 

IV - deficiência intelectual: funcionamento intelectual significativamente inferior à média, com manifestação antes dos dezoito anos e limitações associadas a duas ou mais áreas de habilidades adaptativas, tais como: 1. comunicação; 2. cuidado pessoal; 3. habilidades sociais; 4. utilização dos recursos da comunidade; 5. saúde e segurança; 6. habilidades acadêmicas; 7. lazer; e 8. trabalho; 

V - deficiência múltipla - associação de duas ou mais deficiências.

b) No art. 1º, § 1º, incisos I e II, e § 2º, da Lei nº 12.764, de 27 de dezembro de 2012, que apresenta as seguintes definições acerca do Transtorno do Espectro Autista: § 1º Para os efeitos desta Lei, é considerada pessoa com transtorno do espectro autista aquela portadora de síndrome clínica caracterizada na forma dos seguintes incisos I ou II: 

I - deficiência persistente e clinicamente significativa da comunicação e da interação sociais,manifestada por deficiência marcada de comunicação verbal e não verbal usada para interação social; ausência de reciprocidade social; falência em desenvolver e manter relações apropriadas ao seu nível de desenvolvimento; 

II - padrões restritivos e repetitivos de comportamentos, interesses e atividades, manifestados por comportamentos motores ou verbais estereotipados ou por comportamentos sensoriais incomuns; excessiva aderência a rotinas e padrões de comportamento ritualizados; interesses restritos e fixos. § 2º A pessoa com transtorno do espectro autista é considerada pessoa com deficiência, para todos os efeitos legais. 

4.4.3. O(A) candidato(a) aprovado(a) nas vagas reservadas para Pessoas com Deficiência deverá apresentar, no momento da matrícula  através do Portal do Candidato do IFPR, laudo médico assinado por médico responsável que ateste alguma das condições descritas no item 4.4.2. 

4.4.3.1. O laudo médico deverá: 

a) Conter a classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID); 

b) Relatar a deficiência do candidato, que deverá se enquadrar em uma das categorias mencionadas no item 4.4.2; 

c) Ser emitido em papel timbrado e conter carimbo com o CRM e assinatura do médico. 

4.4.3.2. O(A) candidato(a) inscrito(a) nas vagas reservadas para Pessoas com Deficiência autoriza a utilização pelo IFPR do laudo médico entregue no momento da matrícula. 

4.4.4. Caso, no momento da matrícula, os documentos a que se refere o item 4.2.3 não sejam apresentados ou não comprovem a condição de renda requerida na ação afirmativa, o(a) candidato(a) não terá sua matrícula efetuada, perdendo o direito à vaga naquela ação afirmativa em que foi chamado.

4.4.4.1 Ocorrendo a situação prevista no item 4.4.4, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VI que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

4.4.4.2 Caso ocorra a manutenção do indeferimento da matrícula descrita no item 4.4.4 o candidato permanecerá na lista de espera da Ampla Concorrência e das outras ações afirmativas (cotas) que tenha sido originalmente classificado, podendo ser convocado em chamadas complementares.

4.4.5. Caso seja constatada inexatidão ou irregularidade de informações, ainda que posteriormente ao processo seletivo e/ou à matrícula, o(a) candidato(a) será eliminado(a) do Processo Seletivo, declarando-se nulos todos os atos decorrentes de sua inscrição. 

 

4.5 Cotas para Quilombolas

4.5.1. Os(As) candidatos(as) inscritos(as) pela ação afirmativa destinada a quilombolas são aqueles que comprovem residência/pertencimento às comunidades remanescentes de quilombo. 

4.5.2. Os(As) candidatos(as) inscritos(as) e preliminarmente aprovados em alguma ação afirmativa para quilombolas serão convocados(as), obrigatoriamente, a passar pelo procedimento de heteroidentificação, por meio de edital próprio.

4.5.3. O procedimento de heteroidentificação será realizado anteriormente à fase de matrícula.

4.5.4. Caso, após o procedimento de heteroidentificação, seja indeferida a autodeclaração como pessoa quilombola, o(a) candidato(a) somente poderá ser convocado em qualquer das chamadas, pela Ampla Concorrência e ou por outras ações afirmativas (cotas) que não sejam direcionadas a pessoas quilombolas. 

4.5.5. O(A) candidato(a) autodeclarado Quilombola, quando da convocação para a heteroidentificação, deverá apresentar, obrigatoriamente, os seguintes documentos:

a) Autodeclaração étnico-racial devidamente preenchida e assinada (disponível aqui); 

b) Cópia frente e verso de documento de identificação com foto; 

c) Declaração de residência/pertencimento às comunidades remanescentes de quilombo assinada por 3 (três) autoridades de Associação Quilombola reconhecida pela Fundação Palmares, com os respectivos contatos telefônicos das 3 (três) autoridades conforme Anexo X.

4.5.6. As comunidades remanescentes de quilombos são apenas aquelas certificadas pela Fundação Cultural Palmares, nos termos do Decreto 4.887/03, de 20/11/2003. 

4.5.7. Demais orientações para a realização do procedimento de heteroidentificação estarão descritas em edital específico a ser publicado conforme cronograma do item 5.

4.6. Todos os(as) candidatos(as) optantes pelo Sistema de Ações Afirmativas (cotas) concorrerão, primeiramente, na Ampla Concorrência e, se não classificados, concorrerão em seu respectivo grupo de Ações Afirmativas (cotas), de acordo com a sequência de prioridades abaixo:

a) IFPR-PPI - candidatos autodeclarados pretos, pardos ou indígenas, independentemente de renda familiar e de ter cursado a etapa anterior em escola pública.

b) IFPR-PCD - candidatos com deficiência, independentemente de renda familiar e de ter cursado a etapa anterior integralmente em escola pública.

c) EP - estudantes que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

d) EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

e) EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

f) EP-PPI -  Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

g) BR-EP - candidatos que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

h) BR-EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

i) BR-EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

j) BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

4.7 Caso o curso em questão possua número de candidatos(as) igual ou inferior ao número de vagas, todos os(as) candidatos(as) constarão apenas na lista geral da Ampla Concorrência, não precisando fazer qualquer comprovação quanto às ações afirmativas para as quais foi previamente classificado.

 

5. DO CRONOGRAMA  

PERÍODOS/DATAS
	

ETAPAS

20/09/2024
	

Publicação do Edital no site institucional

03/10/2024
	

17/01/2025
	

Período de inscrição on-line

03/10/2024
	

15/01/2025
	

Período de isenção de taxa de inscrição

17/01/2025
	

Divulgação da Relação Nominal com resultado preliminar do pedido de isenções concedidas

20/01/2025
	

20/01/2025
	

Prazo para interposição de recursos contra Relação Nominal com resultado do pedido de isenções concedidas

21/01/2025
	

Divulgação da Relação Nominal com resultado definitivo do pedido de isenções concedidas

22/01/2025
	

Prazo final para pagamento da taxa de inscrição

28/01/2025
	

Publicação da lista preliminar das inscrições homologadas no Processo Seletivo

29/01/2025
	

29/01/2025
	

Prazo para interposição de recurso referente à homologação de inscrições

30/01/2025
	

30/01/2025
	

Análise dos recursos contra o Resultado da lista preliminar dos inscritos no Processo Seletivo

31/01/2025
	

Publicação final das inscrições homologadas

31/01/2025
	

05/02/2025
	

Análise das notas do Enem

06/02/2025
	

Publicação da classificação preliminar

07/02/2025
	

07/02/2025
	

Prazo para interposição de recurso referente à classificação preliminar

11/02/2025
	

Publicação do resultado dos recursos referentes à classificação preliminar

 

Convocação dos candidatos inscritos nas vagas das ações afirmativas/cotas sociais para realização do processo de heteroidentificação e entrega de documentos para comprovação da condição de cotista

12/02/2025
	

19/2/2025
	

Bancas de heteroidentificação e análise pelas comissões dos documentos entregues

20/02/2025
	

Publicação do resultado preliminar da heteroidentificação e análise documental

21/02/2025
	

23/02/2025
	

Prazo para interposição de recurso contra o resultado preliminar da heteroidentificação e análise documental

24/02/2025
	

Análise dos recursos pela Coordenação de Ações Inclusivas e comissão recursal de heteroidentificação

25/02/2025
	

Publicação do resultado final do processo de heteroidentificação

25/02/2025
	

Publicação do Resultado Final do Processo Seletivo.

 

Convocação para matrícula da 1o chamada

26/02/2025
	

07/03/2025
	

Período de matrícula para os candidatos convocados na 1o chamada

10/03/2025
	

Divulgação do resultado provisório das matrículas

11/03/2025
	

Prazo para recurso contra o resultado provisório das matrículas

12/03/2025
	

Divulgação do resultado definitivo das matrículas

 

6. DAS INSCRIÇÕES

6.1 As inscrições devem ser feitas através do Portal do Candidato do IFPR que pode ser acessado através link https://portaldocandidato.ifpr.edu.br/. 

6.1.1 Para fazer seu login no Portal do Candidato do IFPR, o candidato deverá utilizar sua conta pessoal gov.br.

6.1.2 Caso não possua conta gov.br, o candidato deverá realizar o seu cadastro, conforme tutorial que pode ser acessado a partir do link dos vídeos tutoriais disponível no item 1.1.3.

6.2 A inscrição do(a) candidato(a) implicará ciência e aceitação das normas e condições estabelecidas no inteiro teor deste edital, das quais não poderá alegar desconhecimento. 

6.3 No ato da inscrição, o(a) candidato(a) deverá realizar integralmente o procedimento de inscrição, de modo a: 

a) responder ao questionário a que se refere o item 3.5.1 deste Edital;

b) conferir e confirmar as ações afirmativas para as quais estará concorrendo;

c) preencher todos os demais dados solicitados; 

d) informar a nota obtida em cada uma das provas do Exame Nacional do Ensino Médio - Enem: Ciências da Natureza e suas Tecnologias; Ciências Humanas e suas Tecnologias; Matemática e suas Tecnologias; Linguagens, Códigos e suas Tecnologias; e Redação.

e) realizar o upload do comprovante oficial de notas (Boletim Individual de Desempenho) do Exame Nacional do Ensino Médio - Enem; e

f) confirmar a inscrição.

6.4 O(A) candidato(a) poderá assistir ao vídeo explicativo disponível no link, para ajudar com o procedimento de inscrição.

6.5 As informações fornecidas no formulário de inscrição e o seu correto preenchimento são de responsabilidade do(a) candidato(a), dispondo o IFPR do direito de excluir do processo de ingresso aquele que não preencher a solicitação de inscrição de forma completa e correta, bem como aquele que fornecer dados comprovadamente inverídicos.

6.6 Após o preenchimento dos formulários o candidato deverá realizar o pagamento da taxa no valor de R$50,00 (cinquenta reais) ou solicitar a isenção de inscrição.

6.6.1 Para realizar o pagamento da taxa de inscrição, o candidato deverá gerar, no Portal do Candidato do IFPR, um boleto de pagamento em nome da FUNTEF-PR - Fundação de Apoio à UTFPR.

6.6.2 Caso o candidato solicite isenção do valor da inscrição, deverá seguir as instruções constantes no item 7 do Edital.

6.6.2.1 Em caso de indeferimento no pedido de isenção, o candidato deverá pagar a taxa de inscrição, conforme dispõe os itens 6.6 e 6.6.1, respeitados os prazos constantes no cronograma deste edital.

 

7. DAS ISENÇÕES DE TAXA DE INSCRIÇÃO

7.1 A solicitação de isenção da taxa de inscrição se dará conforme o disposto no Decreto nº 6.593/2008. 

7.2. São requisitos para o(a) candidato(a) solicitar a isenção de pagamento da taxa de inscrição: 

a) estar inscrito(a) no Cadastro Único para Programas Sociais do Governo Federal (CadÚnico); 

b) conforme disposto no Decreto nº 11.016/2022, ter perfil de família com renda mensal per capita (por pessoa) de até meio salário mínimo (R$ 706,00).

7.3. Para solicitar a isenção da taxa de inscrição, o(a) candidato(a) deverá realizar os seguintes procedimentos: 

a) realizar sua inscrição no Portal do Candidato, conforme descrito no item 6.1; 

b) preencher e assinar o formulário de requerimento de isenção, disponível no Anexo V. Em caso de candidato menor de 18 anos completos, o formulário deverá ser assinado pelo(a) responsável do(a) candidato(a); 

c) providenciar os documentos comprobatórios solicitados no Anexo V; 

d) digitalizar a carteira de identificação (CI) com foto do(a) candidato(a); 

e) enviar o formulário, a digitalização da carteira de identificação e os demais documentos comprobatórios no local indicado no Portal do Candidato. 

7.3.1. Serão aceitos os documentos enviados até a data limite para solicitar a isenção, definida no cronograma do item 5 deste edital.

7.3.2. Candidatos(as) oriundos(as) da mesma família deverão preencher o formulário de requerimento de forma individual.

7.3.3. Não será permitido o envio de quaisquer itens/documentos por correio postal ou e-mail que não seja o formulário online disponível no Portal do Candidato. 

7.4. Terá o seu requerimento de isenção da taxa de inscrição indeferido o(a) candidato(a) que: 

a) não apresentar, de forma completa, a documentação exigida no item 7.3; 

b) preencher de forma incorreta o formulário de requerimento (Anexo V). 

7.5. A análise das solicitações será executada pela Equipe de Assessoramento do Processo Seletivo 2025 do IFPR, que irá avaliar as informações prestadas no formulário de requerimento e demais documentos anexados. 

7.5.1. O resultado das solicitações será publicado conforme data definida no cronograma do item 5 deste edital. 

7.6 Caso o candidato tenha entregado os documentos corretos, mas por algum motivo seu pedido tenha sido indeferido ele poderá fazer recurso através do formulário (Anexo VIII) e enviá-lo através do e-mail recursos@ifpr.edu.br.

7.6.1. O recurso será avaliado pela Equipe de Assessoramento do Processo Seletivo 2025 do IFPR.

7.7. A concessão de isenção da taxa de inscrição é pessoal e intransferível. 

7.8. Em caso de indeferimento no pedido de isenção, o candidato deverá pagar a taxa de inscrição, conforme dispõe os itens 6.6 e 6.6.1, respeitados os prazos constantes no cronograma deste edital.

 

8. DA CLASSIFICAÇÃO

8.1 A classificação será realizada em ordem decrescente da média geral derivada das notas das provas de Ciências da Natureza e suas Tecnologias; Ciências Humanas e suas Tecnologias; Matemática e suas Tecnologias; Linguagens, Códigos e suas Tecnologias; e Redação do Exame Nacional do Ensino Médio - ENEM informadas pelos candidatos(as).

8.1.1 A média a que se refere o item 8.1 se dará numa escala de 0,00 (zero pontos) a 1000,00 (mil pontos) e será calculada automaticamente pelo Portal do Candidato a partir das notas lançadas pelo(a) candidato(a).

8.1.2 Todos(as) os(as) candidatos(as) constarão na lista de classificação da Ampla Concorrência.

8.1.3 Além da lista da Ampla Concorrência, os(as) candidatos(as) constarão nas listas de todas as ações afirmativas as quais tenham sido enquadrados conforme item 3.5 deste edital.

8.1.4 Caso o curso em questão possua número de candidatos(as) igual ou inferior ao número de vagas, todos os(as) candidatos(as) serão classificados(as) apenas na lista geral da Ampla Concorrência.

8.2 No caso de empate, será considerado para o desempate: 

a) maior idade; e

b) persistindo o empate, sorteio.

8.3 Anteriormente à publicação da classificação preliminar, a média gerada e as notas informadas serão conferidas com o comprovante oficial de notas submetido no procedimento de inscrição. 

8.3.1 Se constatada divergência nas notas lançadas pelo candidato, resultando em média incorreta, esta será relançada pela Equipe de Assessoramento do Processo Seletivo responsável pelo curso em questão, sendo a média do(a) candidato(a) recalculada pelo Portal do Candidato do IFPR.

8.3.1.1 Caso a condição do comprovante oficial de notas (Boletim Individual de Desempenho) do Exame Nacional do Ensino Médio - Enem impossibilite a devida conferência, a nota do(a) candidato(a) será definida como 0 (zero). 

 

9. DOS RESULTADOS

9.1. O resultado preliminar do Processo Seletivo será divulgado na data definida pelo cronograma disponível no item 5 deste edital, no Portal do Candidato do IFPR (https://portaldocandidato.ifpr.edu.br/).

9.2. Caberá recurso contra a classificação preliminar. O recurso deverá ser protocolado de forma online através do Portal do Candidato (https://portaldocandidato.ifpr.edu.br/) em datas definidas no cronograma disponível no item 5 deste edital. 

9.2.1. A Equipe de Assessoramento do Processo Seletivo 2025 do IFPR avaliará as informações prestadas no formulário de recurso referente à classificação, deferindo ou não o pedido. 

9.3. O resultado final será constituído da lista geral de classificação pela ampla concorrência e por cada uma das ações afirmativas (cotas), para cada campus e curso. 

9.3.1. A lista geral de classificação em cada uma das ações afirmativas poderá sofrer alterações durante o processo de heteroidentificação e da análise dos documentos de matrícula dos(as) candidatos(as) inscritos(as) nas ações afirmativas de Baixa Renda, PcD e Escola Pública. 

9.4. Respeitado o disposto no item 4.6 deste edital, os candidatos aprovados dentro das vagas previstas, serão convocados para matrícula em primeira chamada.

9.4.1 Após as matrículas a que se refere o item 9.4 e que estão descritas no título 10, poderão ocorrer chamadas complementares, caso algum candidato previamente convocado não confirme sua matrícula.

 

10. DAS MATRÍCULAS

10.1. A matrícula será permitida ao(à) candidato(a) que apresentar toda a documentação exigida e tenha concluído o Ensino Médio. 

10.2. A matrícula dos candidatos(as) aprovados(as) nas chamadas do Processo Seletivo ocorrerá respeitando as vagas disponíveis, a ordem de classificação estabelecida conforme resultado.

10.3. As matrículas dos(as) candidatos(as) aprovados(as) deverão ser realizadas exclusivamente de forma online, através do Portal do Candidato do IFPR, https://portaldocandidato.ifpr.edu.br/.

10.3.1. O(A) candidato(a) deverá acessar o Portal do Candidato e realizar o upload dos documentos solicitados conforme o período definido no cronograma 

10.4. É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação do edital e as chamadas de candidatos(as) aprovados(as). 

10.5. O(A) candidato(a) que não realizar sua matrícula, conforme datas e definições do edital, perderá o direito à vaga, possibilitando que o(a) próximo(a) candidato(a) da lista de classificação seja convocado(a). 

10.5.1 Ocorrendo a situação prevista no item 10.5.1, o estudante poderá submeter recurso contra o indeferimento da matrícula, conforme cronograma do Item 5 deste edital, através do formulário constante no Anexo VI que deverá ser preenchido e enviado ao e-mail recursos@ifpr.edu.br.

10.6. Os documentos para matrícula, comuns a todos(as) os(as) candidatos(as), são:

10.6.1 Carteira de identidade;

10.6.1.1 Se candidato(a) estrangeiro(a), em substituição ao documento previsto no item 10.6.1, deve ser apresentado: documento de identidade nacional de estrangeiro (Carteira de Registro Nacional Migratório - CRNM) ou Residência Mercosul, emitida por autoridade brasileira, válida à data da matrícula;

10.6.2 Certidão de nascimento ou Certidão de Casamento;

10.6.3 Certificado de Alistamento Militar, de Dispensa de Incorporação ou de Reservista, no caso dos candidatos do sexo masculino maiores de 18 anos e com idade até 45 anos;

10.6.4 Declaração de vacinação (para candidatos com menos de 18 (dezoito) anos) emitida e assinada por profissional de saúde, atestando que o adolescente está com o seu esquema vacinal de acordo com a recomendação estabelecida no Programa Nacional de Imunização – PNI, do Ministério da Saúde e da Secretaria de Estado da Saúde;

10.6.5. Uma via impressa da certidão de quitação eleitoral (para candidatos com mais de 18 (dezoito) anos que já possuem titulo eleitoral), que poderá ser obtida em qualquer Cartório Eleitoral e também na página eletrônica www.tse.jus.br.

10.6.6 Certificado de conclusão do Ensino Médio ou equivalente que comprove a conclusão do Ensino Médio;

10.6.6.1 Poderá ser apresentada Declaração de Conclusão do Ensino Médio, desde que, num prazo de 60 (sessenta) dias, o histórico seja apresentado à Secretaria Acadêmica do campus;

10.6.6.2 O candidato que realizou seus estudos em instituições estrangeiras, além da documentação e procedimentos definidos neste Edital, também deve entregar Comprovante de Conclusão de Ensino Médio, revalidado no Brasil na forma da lei.
10.6.6.2.1 É dispensada a revalidação se o comprovante de conclusão de estudos pertencer a um país integrante do Mercosul.

10.6.7 Formulário de Requerimento de Matrícula devidamente preenchido pelo responsável legal em caso de candidatos menores de 18 anos (conforme Anexo VIII); e

10.6.8 Documento de Identificação do Responsável Legal para menores de 18 anos.

10.7. Os documentos necessários para comprovação das Ações Afirmativas (cotas) de Baixa Renda, Pessoa com Deficiência e Escola Pública são:

10.7.1 AÇÃO AFIRMATIVA DE ESCOLA PÚBLICA: Os candidatos deverão apresentar, no momento da matrícula, Histórico Escolar por meio do qual comprovem ter cursado e concluído todo o ensino médio (do primeiro ao terceiro anos, ou equivalente) exclusivamente na rede pública de ensino do Brasil.

10.7.2 AÇÃO AFIRMATIVA DE PESSOA COM DEFICIÊNCIA: Laudo médico atestando a espécie e o grau da deficiência. O laudo deverá:

a) Conter a classificação Internacional de Doenças e Problemas Relacionados à Saúde (CID);

b) Relatar a deficiência do candidato, que deverá se enquadrar em uma das categorias mencionadas no edital do processo seletivo;

c) Ser emitido em papel timbrado e conter carimbo com o CRM e assinatura do médico.

10.7.3 AÇÃO AFIRMATIVA DE BAIXA RENDA: documentos especificados no Anexo VII deste Edital.

10.8  O estudante que ingressar mediante processo seletivo tendo efetuado seu registro acadêmico, deverá realizar a confirmação de sua matrícula devendo possuir frequência a pelo menos uma das aulas previstas para os 5 (cinco) primeiros dias letivos do calendário acadêmico do campus. 

10.8.1 A não realização da confirmação de matrícula pelo estudante ou de pessoa por ele autorizada para tal, caracterizar-se-á como desistência, o que ocasionará o cancelamento do seu registro acadêmico.

 

11. DAS DISPOSIÇÕES FINAIS

11.1. A Comissão Central do Processo Seletivo, a  Equipe de Assessoramento do Processo Seletivo e o IFPR não se responsabilizam por solicitação de inscrição via internet não efetivada por motivos de ordem técnica, falhas de comunicação, congestionamento de linhas de comunicação ou quaisquer outros fatores de ordem técnica que impossibilitem a transferência dos dados ou a impressão de documentos.

11.2. A inscrição do(a) candidato(a) implicará a aceitação total e incondicional das normas e instruções constantes neste edital.

11.3. É de inteira responsabilidade do(a) candidato(a) acompanhar a publicação dos resultados das etapas do Processo Seletivo, que serão realizadas através do endereço eletrônico https://portaldocandidato.ifpr.edu.br/.

11.4. A inexatidão ou irregularidade de informações, ainda que constatada posteriormente ao processo seletivo e/ou à matrícula, eliminará o(a) candidato(a) do Processo de Seleção, declarando-se nulos todos os atos decorrentes de sua inscrição.

11.5 Após esgotadas as chamadas complementares previstas no item 9.4.1 e persistindo a existência de vagas não ocupadas, novo processo seletivo será realizado com regramento a ser publicado em edital próprio.

11.6 Os candidatos que não têm acesso a equipamento e/ou internet poderão dirigir-se a um dos campi do IFPR (de acordo com os endereços indicados no Anexo V), de segunda-feira a sexta-feira, no horário de funcionamento do campus, no período destinado às inscrições. 

11.7. Os casos omissos e as situações não previstas no presente edital serão analisados pela Comissão Central do Processo Seletivo e pela Equipe de Assessoramento do Processo Seletivo.

Curitiba, 20 de setembro de 2024.

 

 

 

Assinado:
logotipo 	

Documento assinado eletronicamente por ADRIANO WILLIAN DA SILVA VIANA PEREIRA, Reitor, em 20/09/2024, às 21:20, conforme horário oficial de Brasília, com fundamento no art. 6º, caput, do Decreto nº 8.539, de 8 de outubro de 2015.
QRCode Assinatura 	

A autenticidade deste documento pode ser conferida no site https://sei.ifpr.edu.br/sei/controlador_externo.php?acao=documento_conferir&id_orgao_acesso_externo=0, informando o código verificador 3185087 e o código CRC E00D4E0C.

 

ANEXO I - EDITAL Nº 90, DE 20 DE setembro DE 2024

QUADRO DE OFERTAS DE CURSOS DE BACHARELADO E TECNOLOGIA

Campus
	

Curso
	

Nível de Ensino
	

Forma de Oferta
	

Turmas
	

Turno
	

Vagas
	

Duração do Curso

ASSIS CHATEAUBRIAND
	

Gestão Comercial
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

2 anos

BARRACÃO
	

Tecnologia em Gestão Ambiental
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

CAMPO LARGO
	

Processos Gerenciais
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

2,5 anos

CAMPO LARGO
	

Materiais
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

CAMPO LARGO
	

Engenharia Elétrica
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

5 anos

CAMPO LARGO
	

Agroecologia
	

Superior
	

Tecnologia
	

1
	

Matutino
	

40
	

3 anos

CASCAVEL
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

CASCAVEL
	

Tecnologia em Gestão Ambiental
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

2 anos

COLOMBO
	

Alimentos
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

COLOMBO
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

COLOMBO
	

Processos Gerenciais
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

2,5 anos

CORONEL VIVIDA
	

Gestão Financeira
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

2,5 anos

CURITIBA
	

Gestão Pública
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

2,5 anos

CURITIBA
	

Massoterapia
	

Superior
	

Tecnologia
	

1
	

Matutino
	

35
	

3 anos

CURITIBA
	

Processos Gerenciais
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

2 anos

CURITIBA
	

Processos Escolares
	

Superior
	

Tecnologia
	

1
	

Vespertino
	

40
	

3 anos

CURITIBA
	

Secretariado
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

2 anos

CURITIBA
	

Ciências Contábeis
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

4 anos

FOZ DO IGUAÇU
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

FOZ DO IGUAÇU
	

Engenharia de Aquicultura
	

Superior
	

Bacharelado
	

1
	

Noturno
	

36
	

5 anos

FOZ DO IGUAÇU
	

Gastronomia
	

Superior
	

Tecnologia
	

1
	

Matutino
	

40
	

2 anos

IRATI
	

Agronomia
	

Superior
	

Bacharelado
	

1
	

Vespertino
	

40
	

5 anos

IRATI
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

IVAIPORÃ
	

Engenharia Agronômica
	

Superior
	

Bacharelado
	

1
	

Integral
	

40
	

5 anos

IVAIPORÃ
	

Sistemas de Informação
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

4 anos

JACAREZINHO
	

Engenharia de Controle e Automação
	

Superior
	

Bacharelado
	

1
	

Noturno¹
	

40
	

5 anos

JACAREZINHO
	

Sistemas para a Internet
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

JAGUARIAÍVA
	

Gestão de Qualidade
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

LONDRINA
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Matutino
	

40
	

3 anos

PALMAS
	

Administração
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

4 anos

PALMAS
	

Agronomia
	

Superior
	

Bacharelado
	

1
	

Matutino e Vespertino²
	

40
	

5 anos

PALMAS
	

Ciências Contábeis
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

4 anos

PALMAS
	

Direito
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

5 anos

PALMAS
	

Enfermagem
	

Superior
	

Bacharelado
	

1
	

Matutino e Vespertino²
	

30
	

5 anos

PALMAS
	

Farmácia
	

Superior
	

Bacharelado
	

1
	

Matutino e Vespertino²
	

40
	

5 anos

PALMAS
	

Sistemas de Informação
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

4 anos

PARANAGUÁ
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Matutino
	

40
	

3 anos

PARANAGUÁ
	

Gestão Ambiental
	

Superior
	

Tecnologia
	

1
	

Matutino
	

40
	

2,5 anos

PARANAVAÍ
	

Engenharia Elétrica
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

5 anos

PARANAVAÍ
	

Engenharia de Software
	

Superior
	

Bacharelado
	

1
	

Integral
	

40
	

4 anos

PINHAIS
	

Administração
	

Superior
	

Bacharelado
	

1
	

Noturno
	

40
	

4 anos

PINHAIS
	

Ciência da Computação
	

Superior
	

Bacharelado
	

1
	

Vespertino e Noturno²
	

35
	

4 anos

PINHAIS
	

Gestão da Tecnologia da Informação
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

PITANGA
	

Agroindústria
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

TELÊMACO BORBA
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

TELÊMACO BORBA
	

Automação Industrial
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

TELÊMACO BORBA
	

Engenharia Elétrica
	

Superior
	

Bacharelado
	

1
	

Integral
	

40
	

5 anos

TELÊMACO BORBA
	

Manutenção Industrial
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

UMUARAMA
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

UMUARAMA
	

Arquitetura e Urbanismo
	

Superior
	

Bacharelado
	

1
	

Vespertino e Noturno²
	

40
	

5 anos

UMUARAMA
	

Gestão do Agronegócio
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

UNIÃO DA VITÓRIA
	

Agronomia
	

Superior
	

Bacharelado
	

1
	

Matutino e Vespertino²
	

40
	

5 anos

UNIÃO DA VITÓRIA
	

Análise e Desenvolvimento de Sistemas
	

Superior
	

Tecnologia
	

1
	

Noturno
	

40
	

3 anos

¹Haverá aulas no período vespertino quando a carga horária semanal exceder 20 horas.

² Os cursos cujos turnos estão assinalados como sendo “Matutino e Vespertino” e “Vespertino e Noturno” aparecerão no Portal do Candidato do IFPR como turno “Integral”, sem prejuízo à informação deste quadro de vagas e a consequente necessidade de o estudante cumpri-la.

 

ANEXO II - EDITAL Nº 90, DE 20 DE setembro DE 2024

DISTRIBUIÇÃO DAS VAGAS POR FAIXAS DE AÇÃO AFIRMATIVA

 
	

Estudantes que tenham cursado a etapa anterior integralmente em Escola Pública (60% das vagas)
	

Ações afirmativas - IFPR (15% das vagas)
	

Ampla Concorrência (25% das vagas)

 
	

Estudantes que possuam renda bruta familiar per capita igual ou inferior a 1 salário mínimo (30% das vagas)
	

Estudantes que possuam renda bruta familiar per capita superior a 1 salário mínimo (30% das vagas)

NÚMERO DE VAGAS OFERTADAS POR CAMPUS, CURSO E TURNO
	

BR-EP-PPI
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q
	

EP-PCD
	

EP
	

IFPR-PPI
	

IFPR-PCD
	

AC

40
	

5
	

1
	

2
	

5
	

5
	

0
	

2
	

5
	

3
	

2
	

10

36
	

4
	

1
	

1
	

5
	

4
	

0
	

2
	

5
	

3
	

2
	

9

35
	

4
	

1
	

1
	

5
	

4
	

0
	

1
	

5
	

3
	

2
	

9

30
	

4
	

1
	

1
	

4
	

4
	

0
	

1
	

4
	

3
	

1
	

7

OBSERVAÇÃO: O cálculo para a distribuição de vagas, seus possíveis arredondamentos e redistribuições, seguem o disposto na Portaria MEC nº 2027 de 16 de novembro de 2023, o que pode fazer com que algumas cotas não atendam os percentuais indicados no título.


 

ANEXO III - EDITAL Nº 90, DE 20 DE setembro DE 2024

MAPA DE MIGRAÇÃO DAS VAGAS EM AÇÕES AFIRMATIVAS SEM CANDIDATOS APTOS A OCUPÁ-LAS

SOBROU VAGA AQUI
	

1º VAI PARA:
	

2º VAI PARA:
	

3º VAI PARA:
	

4º VAI PARA:
	

5º VAI PARA:
	

6º VAI PARA:
	

7º VAI PARA:
	

8º VAI PARA:
	

9º VAI PARA:
	

10º VAI PARA:

IFPR-PPI
	

IFPR-PCD
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

IFPR-PCD
	

IFPR-PPI
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

BR-EP-Q
	

BR-EP-PPI 
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

BR-EP-PCD
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

BR-EP 
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

EP
	

AC

EP-PPI
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-Q 
	

EP-PCD
	

EP
	

AC

EP-Q 
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-PCD
	

EP
	

AC

EP-PCD
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP
	

AC

EP
	

BR-EP-PPI 
	

BR-EP-Q
	

BR-EP-PCD
	

BR-EP
	

EP-PPI
	

EP-Q 
	

EP-PCD
	

AC

 

ANEXO IV - EDITAL Nº 90, DE 20 DE setembro DE 2024

ENDEREÇOS DOS CAMPI DO IFPR

CAMPUS
	

ENDEREÇO
	

PÁGINA ELETRÔNICA

ARAPONGAS
	

Rua Surucuá Açu, 321 – Vila Araponguinha
	

https://ifpr.edu.br/arapongas/

ASTORGA
	

Rodovia PR 454, Contorno Norte
	

https://ifpr.edu.br/astorga/

ASSIS CHATEAUBRIAND
	

Av. Cívica, 475 – Centro Cívico
	

https://ifpr.edu.br/assis-chateaubriand/

BARRACÃO
	

Rodovia BR 163, nº 2115 - Industrial, Barracão
	

https://ifpr.edu.br/barracao/

CAMPO LARGO
	

R. Eng. Tourinho, 829 - Vila Solene
	

https://ifpr.edu.br/campo-largo/

CAPANEMA
	

Rua Cariris nº 750 Bairro Santa Bárbara
	

https://ifpr.edu.br/capanema/

CASCAVEL
	

Avenida das Pombas, 2020 - Floresta
	

https://ifpr.edu.br/cascavel/

COLOMBO
	

Rua Antonio Chemin, 28, São Gabriel
	

https://ifpr.edu.br/colombo/

CORONEL VIVIDA
	

PR 562, Flor da Serra
	

https://ifpr.edu.br/coronel-vivida/

CURITIBA
	

R. João Negrão, 1285
	

https://ifpr.edu.br/curitiba/

FOZ DO IGUAÇU
	

Avenida Araucária, 780, Bairro Vila A
	

https://ifpr.edu.br/foz-do-iguacu/

GOIOERÊ
	

Rodovia Luiz Dechiche, s/nº
	

https://ifpr.edu.br/goioere/

IRATI
	

Rua Pedro Koppe, 100 – Vila Matilde
	

https://ifpr.edu.br/irati/

IVAIPORÃ
	

Rua Max Arthur Greipel, nº 505
	

https://ifpr.edu.br/ivaipora/

JACAREZINHO
	

Avenida Dr. Tito nº: 801 – Jardim Panorama
	

https://ifpr.edu.br/jacarezinho/

JAGUARIAÍVA
	

Av. Eloa Martins Passos Felix – Rod. 151 Km 213,7
	

https://ifpr.edu.br/jaguariaiva/

LONDRINA
	

Rua João XXIII, nº 600, Jardim Dom Bosco
	

https://ifpr.edu.br/londrina/

PALMAS
	

Av. Bento Munhoz da Rocha Neto, s/nº
	

https://ifpr.edu.br/palmas/

PARANAGUÁ
	

Rua Antonio Carlos Rodrigues, n.º 453 – Porto Seguro
	

https://ifpr.edu.br/paranagua/

PARANAVAÍ
	

Rua José Felipe Tequinha, 1400 – Jardim das Nações
	

https://ifpr.edu.br/paranavai/

PINHAIS
	

Rua Humberto de Alencar Castelo Branco, 1575 Jardim Amélia
	

https://ifpr.edu.br/pinhais/

PITANGA
	

Rua José de Alencar, 1.080 – Vila Planalto
	

https://ifpr.edu.br/pitanga/

QUEDAS DO IGUAÇU
	

Rua, Marginal Imbirama, 300 - linha Tapuí
	

https://ifpr.edu.br/quedas-do-iguacu/

TELÊMACO BORBA
	

Rodovia PR 160 – km 19,5 – Jardim Bandeirantes
	

https://ifpr.edu.br/telemaco-borba/

UMUARAMA
	

Rodovia PR 323, KM 302, Parque Industrial
	

https://ifpr.edu.br/umuarama/

UNIÃO DA VITÓRIA
	

Av. Paula Freitas, 2800 - São Braz
	

https://ifpr.edu.br/uniao-da-vitoria/


 

ANEXO V - EDITAL Nº 90, DE 20 DE setembro DE 2024

FORMULÁRIO PARA ISENÇÃO DA TAXA DE INSCRIÇÃO DE PROCESSO SELETIVO

IDENTIFICAÇÃO DO CANDIDATO

Nome completo:

 

Número de Identificação Social do candidato(NIS):

 

Nº da Carteira de Identidade:

 
	

CPF:

 

Email:

 
	

Telefone:

 

Curso e Campus para qual está inscrito(a):

 

O(A) candidato(a) declara estar inscrito(a) no Cadastro único para programas Sociais do Governo Federal e possuir perfil de de renda bruta familiar de até meio(0,5) salário mínimo per capita.

(   )SIM (   )NÃO

Documentos a serem enviados junto a este formulário:

a) Digitalização da carteira de identificação(CI) do(a) candidato(a);

b) Comprovante de inscrição no Cadastro Único para Programas Sociais do Governo Federal – Cadastro Único.

 

  _________________(PR), ____de____________________ de 20____.


_________________________________________________________

Assinatura do(a) declarante ou responsável legal (quando o(a) declarante tiver idade inferior a 18 anos)

**Ratifico serem verdadeiras as informações prestadas, estando ciente de que a informação falsa incorrerá nas penas do crime do art. 299 do Código Penal (falsidade ideológica);


 

ANEXO VI - EDITAL Nº 90, DE 20 DE setembro DE 2024

FORMULÁRIO DE SOLICITAÇÃO DE RECURSO

Nome do candidato(a):

 

Curso e campus para o qual se inscreveu:

 

CPF do candidato(a):

 

Selecione o tipo de recurso que você deseja protocolar (assinale apenas uma opção)

 

(   ) Recurso contra homologação de inscrição.

(   ) Recurso contra o indeferimento da solicitação de isenção da taxa de inscrição.

(   ) Recurso contra o indeferimento da autodeclaraçãoétnico-racial.

(   ) Recurso contra o indeferimento da matrícula.

 

Justificativa do recurso:

 

 

 

 

 

 

 

 

________________________ - PR, ____ de ____________________ de 20___.

 

_____________________________________________

Assinatura do(a) Candidato(a) ou do Responsável Legal 

 

Justificativa da decisão:








 

 

ANEXO VII - EDITAL Nº 90, DE 20 DE setembro DE 2024

COMPROVAÇÃO DOCUMENTAL DA RENDA BRUTA MENSAL PARA AVALIAÇÃO DE COTAS BAIXA RENDA

 

Os/as candidatos/as aprovados/as nas ações afirmativas de escola pública e baixa renda (BR-EP; BR-EP-PCD; BR-EP-Q; BR-EP-PPI)  deverão comprovar renda familiar bruta mensal per capita (por pessoa) igual ou inferior a 1 (um) salário-mínimo nacional - (R$ 1.412,00).  

Para essa comprovação, você poderá proceder de 2 formas distintas:

a) Apresentar comprovante de inscrição do CadÚnico (Programa de Cadastro único do Governo Federal) que deverá estar atualizado nos últimos 24 (vinte e quatro) meses anteriores à data de inscrição no Processo Seletivo.

 

OU como alternativa aos que não possuem inscrição no CadÚnico:

b) Enviar os comprovantes exigidos em edital para todos os membros da família:

 

1: Preencher e assinar a Declaração de Núcleo Familiar Renda Bruta Familiar disponível no link indicado no item 1.1.3 deste edital.

 

2: ANEXAR DOCUMENTAÇÃO COMUM A TODOS OS MEMBROS DO NÚCLEO FAMILIAR E AO CANDIDATO:

a) Certidão de Nascimento ou Cédula de Identidade (RG) ou Passaporte ou Carteira Nacional de Habilitação, de todos os integrantes do núcleo familiar;

b) CPF de todos os integrantes do núcleo familiar, com mais de 18 anos;

c) Comprovante de residência;

d) Carteira de Trabalho e Previdência Social (CTPS) física, para todos os integrantes com mais de 18 anos, a qual deverá conter as páginas da: foto, qualificação civil, contratos de trabalho e a próxima página em branco de contrato de trabalho. Ou, Carteira de Trabalho Digital em PDF Único atualizada, contendo todos os dados pessoais e contratos de trabalho. Caso não possua CTPS, preencher e assinar Declaração De Não Possuir Carteira De Trabalho E Previdência Social (CTPS) disponível no link indicado no item 1.1.3 deste edital.

e) Declaração de Imposto de Renda completa COM recibo (Exercício 2024, ano calendário 2023), aos componentes do núcleo familiar com mais de 18 anos, caso seja declarante. Aos componentes do núcleo familiar, com mais de 18 anos não declarantes de Imposto de Renda, apresentar comprovante, disponível no link abaixo para consulta:  Disponível em: <https://www.restituicao.receita.fazenda.gov.br>

 

3: DOCUMENTAÇÃO DE RENDA PARA TODOS OS INTEGRANTES DO NÚCLEO FAMILIAR COM MAIS DE 18 ANOS: (Caso o núcleo familiar seja composto por integrantes de diferentes categorias (assalariados, autônomos etc.), a documentação deverá ser apresentada em acordo com cada realidade de trabalho e renda).

3.1.  DESEMPREGADOS, ESTUDANTES OU DONA(O) DE CASA:

a) Em caso de desemprego recente, apresentar Rescisão de Contrato e comprovante de recebimento do seguro desemprego, e/ou;

b) Preencher e assinar a Declaração – Não Possui Renda Mensal disponível no link indicado no item 1.1.3 deste edital.

 

3.2.  TRABALHADORES ASSALARIADOS (celetistas, servidores públicos, empregado doméstico, aprendizes):

a) Contracheques/holerites dos três meses anteriores à inscrição (julho, agosto e setembro de 2024).

 

3.3.  APOSENTADOS, PENSIONISTAS E DEMAIS BENEFICIÁRIOS DO INSS:

a) Comprovante do benefício do INSS (aposentado, pensionista ou demais beneficiários), demonstrando o valor bruto recebido dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024); OU

b) Comprovante de aposentadoria (caso não seja INSS).

 

3.4.  AUTÔNOMOS E PROFISSIONAIS LIBERAIS:

a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

b) Preencher e assinar declaração da atividade desenvolvida como autônomo ou liberal e a renda bruta mensal (Declaração Renda variável) disponível no link indicado no item 1.1.3 deste edital.

c) Guias de recolhimento ao INSS com comprovante de pagamento dos três meses anteriores à inscrição.

 

3.5.  EMPRESÁRIO OU PESSOAS COM PARTICIPAÇÃO EM COTAS DE EMPRESAS OU MICROEMPRESAS:

a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

b) Preencher e assinar declaração da atividade desenvolvida e a renda como empresário/microempreendedor (Declaração Renda variável) disponível no link indicado no item 1.1.3 deste edital.

c) Pró-labores dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024), e;

d) Declaração completa de Imposto de Renda de Pessoa Jurídica – DIPJ, exercício 2024 ano calendário 2023, acompanhado do recibo de entrega, quando houver;

e) Declaração completa de Informações socioeconômicas e Fiscais (DEFIS- Simples Nacional) para Microempresários e Empresários de Pequeno Porte, quando houver;

f)  Declaração Comprobatória de Percepção de Rendimentos (DECORE), quando houver,

 

3.6.  MICROEMPREENDEDOR INDIVIDUAL:

a) Extratos bancários dos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

b) Preencher e assinar declaração relatando a atividade desenvolvida como microempreendedor e a renda mensal (Declaração Renda variável), disponível no link indicado no item 1.1.3 deste edital; e

c) Declaração Anual CNPJ MEI (DASN-SIMEI).

 

3.7.  TRABALHADORES DO MERCADO INFORMAL: (atividade sem vínculo empregatício, não possui contrato de trabalho, não contribui com INSS).

a) Preencher e assinar declaração relatando a renda bruta mensal e a atividade desenvolvida como trabalhador informal (Declaração Renda variável), disponível no link indicado no item 1.1.3 deste edital.

 

3.8.  ESTAGIÁRIOS ou BOLSISTAS:

a) Contrato de estágio/bolsa, ou Termo de Compromisso de estágio/bolsa.

 

3.9.  RENDIMENTOS DE ALUGUEL OU ARRENDAMENTO DE BENS MÓVEIS E IMÓVEIS:

a) Extratos bancários dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

b) Contrato(s) de locação ou arrendamento(s) devidamente registrado(s) em cartório, acompanhado(s) dos recibos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), ou;

c) Preencher e assinar declaração de próprio punho relatando o valor recebido, acompanhada dos recibos dos três últimos meses anteriores à inscrição (julho, agosto e setembro de 2024).

 

3.10. PARA CASOS DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA:

a) Decisão judicial discriminando o nome do(s) beneficiários e o valor a ser pago, ou;

b) Preencher e assinar declaração do beneficiário e o valor mensal recebido de pensão, (Declaração Renda variável), disponível no link indicado no item 1.1.3 deste edital.

 

3.11. ATIVIDADE RURAL:

a) Extratos bancários dos dos três meses anteriores à inscrição (julho, agosto e setembro de 2024), e

b)  Declaração do sindicato rural, associação, cooperativa ou prefeitura, contendo o valor recebido mensalmente ou anualmente e informações detalhadas atividade desenvolvida, ou

c)  Preencher e assinar declaração, contendo o valor recebido mensalmente ou anualmente, e informações da atividade desenvolvida, anexando as 3 (três últimas) notas fiscais de vendas de produtos, (Declaração Renda variável), disponível no link indicado no item 1.1.3 deste edital; e

d)  Declaração de Imposto de Renda Pessoa Jurídica - IRPJ, quando houver;

e)  Quaisquer declarações tributárias referentes a pessoas jurídicas vinculadas ao candidato ou a membros da família, quando for o caso.

 

ANEXO VIII - EDITAL Nº 90, DE 20 DE setembro DE 2024

REQUERIMENTO DE MATRÍCULA

 CURSO:________________________________________________________________

(    ) Integrado    (    ) Subsequente  (   ) Licenciatura  (    ) Bacharelado  (    ) Tecnologia

 

CAMPUS:_______________________________________________________________

PERÍODO DE INGRESSO: 2025

SEMESTRE:________TURNO:_____________________________

AÇÃO AFIRMATIVA DE CONCORRÊNCIA/COTA: _______________ (Ver Código Quadro Abaixo)  

IFPR-PPI - candidatos autodeclarados pretos, pardos ou indígenas, independentemente de renda familiar e de ter cursado a etapa anterior em escola pública.

IFPR-PCD - candidatos com deficiência, independentemente de renda familiar e de ter cursado a etapa anterior integralmente em escola pública.

EP - estudantes que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.

EP-PPI -  Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública, independentemente de renda familiar.
	

BR-EP - candidatos que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

BR-EP-PCD - Pessoas com deficiência que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

BR-EP-Q - Autodeclarados quilombolas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

BR-EP-PPI - Autodeclarados pretos, pardos ou indígenas que cursaram a etapa anterior integralmente em escola pública e que tenham renda familiar bruta mensal igual ou inferior a 1 (um) salário- mínimo nacional per capita (R$ 1.412,00).

AC - Ampla Concorrência.

DADOS DO ESTUDANTE:

NOME:_________________________________________________________________

RG______________________ ORG./UF:________ CPF__________________________

NOME DO RESPONSÁVEL LEGAL: _________________________________________________________________

PARENTESCO DO RESPONSÁVEL LEGAL COM O ESTUDANTE: ___________________________________________

(Nos casos de guarda, tutela ou outro documento de responsabilidade incluir junto ao requerimento o documento comprobatório).

TELEFONE DO ESTUDANTE:________________________ TELEFONE DO RESPONSÁVEL:_______________________ 

 

EMAIL:_________________________________________________________________

ENDEREÇO RESIDENCIAL: ________________________________________________________________ CEP: _________________________

(   ) DECLARO, sob as penas da lei, que não possuo escolaridade de nível superior (Para os candidatos que  concorrem às vagas de inclusão).

( ) DECLARO, para os devidos fins, que assumo total responsabilidade sobre as informações contidas neste documento. Por ser expressão da verdade, dato e assino o presente documento, ficando ciente de que no caso de inveracidade comprovada estarei sujeito às penalidades cabíveis.

 _________________________, __________ de _______________________ de 20____

 

 _______________________________                       _____________________________

       Assinatura da(o) estudante                                 Assinatura da(o) responsável legal

 

ANEXO IX - EDITAL IFPR Nº 90 DE 20 DE setembro DE 2024

DECLARAÇÃO DA COMUNIDADE ÍNDIGENA

 

Declaramos para os devidos fins que o(a) candidato(a) __________________________________________ portador(a) do CPF n.º _______________________________, reside/pertence à Comunidade Indígena de ___________________________________ do município de ______________________________ , Estado ________________________.

 

 

DADOS DA LIDERANÇA 1

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Indígena:

Assinatura

 

 

DADOS DA LIDERANÇA 2

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Indígena:

Assinatura

 

 

DADOS DA LIDERANÇA 3

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Indígena:

Assinatura

 

 

ANEXO X - EDITAL IFPR Nº 90, DE 20 DE setembro DE 2024

 

DECLARAÇÃO DA COMUNIDADE QUILOMBOLA

 

Declaramos para os devidos fins que o(a) candidato(a) __________________________________________ portador(a) do CPF n.º _______________________________, reside/pertence à Comunidade Quilombola de ___________________________________ do município de ______________________________ , Estado ________________________.

 

 

DADOS DA LIDERANÇA 1

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Quilombola:

Assinatura

 

 

DADOS DA LIDERANÇA 2

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Quilombola:

Assinatura

 

 

DADOS DA LIDERANÇA 3

Nome completo:
	

CPF:

Telefone (com código de área): (____) _____________________
	

Função que exerce na Comunidade Quilombola:

Assinatura

 

 `;

            


            try {
                // Adiciona os editais ao histórico da IA, mas não à exibição do usuário
                // Adiciona a mensagem do usuário ao histórico

                if (history.length === 0) {
                    history.push({
                        role: 'user',
                        parts: [{ text: "Gemini, você é um Especialista em orientações sobre o Processo seletivo do IFPR para Ingresso em 2025, seus usuários tem interesse nas vagas do Campus em Assis Chateaubriand. As suas respostas e interações precisam ser descontraidas e divertidas, além de muito bem formatadas." }],
                    });
                    history.push({
                        role: 'user',
                        parts: [{ text: edital1 }],
                    });
                    history.push({
                        role: 'user',
                        parts: [{ text: edital2 }],
                    });

                    history.push({
                        role: 'user',
                        parts: [{ text: edital3 }],
                    });

                    history.push({
                        role: 'user',
                        parts: [{ text: edital4 }],
                    });

                }

                const chatSession = model.startChat({
                    generationConfig,
                    history,
                });

                loading.value = true; // Ativa o loading

                const result = await chatSession.sendMessage(userInput.value);
                const response = await result.response;
                const aiResponse = await response.text();

                // Adiciona a mensagem do usuário ao histórico
                history.push({
                    role: 'user',
                    parts: [{ text: userInput.value }],
                });

                messages.value.push({
                    id: messages.value.length,
                    sender: 'user',
                    text: userInput.value,
                });

                userInput.value = '';


                messages.value.push({
                    id: messages.value.length,
                    sender: 'model',
                    text: aiResponse,
                });

                // Adiciona a mensagem do usuário ao histórico
                history.push({
                    role: 'model',
                    parts: [{ text: aiResponse }],
                });

                // Rola para baixo após a resposta da IA
                await nextTick();
                if (chatBox.value) {
                    chatBox.value.scrollTop = chatBox.value.scrollHeight;
                }
                const lastMessageElement = messageElements.value[messageElements.value.length - 1];
                if (lastMessageElement) {
                    lastMessageElement.scrollIntoView({ behavior: 'smooth' }); // Rolagem suave
                }

                loading.value = false; // Desativa o loading


            } catch (error) {
                console.error('Erro ao enviar mensagem para a IA:', error);
                messages.value.push({
                    id: messages.value.length,
                    sender: 'model',
                    text: 'Desculpe, ocorreu um erro. Tente novamente mais tarde.',
                });

                loading.value = false; // Desativa o loading

            }

        };

        // Função para filtrar as mensagens visíveis
        const mensagensVisiveis = computed(() => {
            return messages.value.filter(message => {
                return message.sender === 'user' || message.sender === 'model';
            });
        });


        onMounted(async () => {
            // Você pode exibir uma mensagem de boas-vindas na interface, mas não a adicione ao array `messages`

            // Carregar a biblioteca Google Generative AI aqui, se necessário
            // Exemplo:
            // const script = document.createElement('script');
            // script.src = 'https://cdn.jsdelivr.net/npm/@google/generative-ai@0.2.0/dist/umd/generative-ai.min.js';
            // document.head.appendChild(script);
        });

        return {
            userInput,
            messages,
            sendMessage,
            chatBox,
            mensagensVisiveis, // Retorna as mensagens filtradas
            messageElements, // Adiciona messageElements ao retorno
            loading, // Adiciona loading ao retorno

        };
    },
};
</script>

<style scoped>
/* Estilos do componente (os mesmos do código original, adaptados para scoped) */

.loading-indicator {
    text-align: center;
    margin-top: 10px;
    font-size: 100px;
    font-style: italic;
    color: #663399;
    background-color: cornflowerblue;
}

.chat-container {
    padding: 20px;
    margin: 0 auto;
    max-width: 600px;
    background-color: #f4f4f9;
    /* background-image: url('../assets/banner-geral-1536x864.png'); */
    background-size: cover;
    /* Ajuste a imagem para cobrir todo o container */
    background-position: center;
    /* Centralize a imagem */
    border-radius: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    /* background: linear-gradient(135deg, #fff, #e0e0e0); */
}

.background-image {
    position: absolute;
    /* Posicione a imagem atrás do conteúdo */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/banner-geral-1536x864.png');
    background-size: cover;
    background-position: center;
    z-index: -1;
    /* Certifique-se de que a imagem fique atrás do conteúdo */
}

.chat-box {
    border: 1px solid #ccc;
    padding: 10px;
    height: 400px;
    overflow-y: auto;
    background-color: white;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.05);
}

.input-area {
    display: flex;
    gap: 10px;
}

textarea {
    flex-grow: 1;
    padding: 15px;
    border-radius: 20px;
    border: 1px solid #ccc;
    resize: none;
    box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    background-color: #f9f9f9;
}

button {
    padding: 10px 30px;
    background-color: #663399;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease;
    font-size: 16px;
}

button:hover {
    background-color: #5a2e88;
}

/* Estilos para as mensagens */
.message {
    margin: 10px;
    padding: 15px;
    border-radius: 10px;
    max-width: 60%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    clear: both;
}

/* Mensagens do usuário à direita */
.user-message {
    background-color: #dcd6ff;
    text-align: right;
    float: right;
}

/* Mensagens da IA à esquerda */
.ai-message {
    background-color: #f1f1f1;
    text-align: left;
    float: left;
}

.clearfix::after {
    content: "";
    display: block;
    clear: both;
}
</style>