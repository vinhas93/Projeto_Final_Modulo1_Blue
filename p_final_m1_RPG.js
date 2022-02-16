const prompt = require('prompt-sync')();

// ---------------------- DEV NOTES:
// EXECUTAR O PROGRAMA COM O TERMINAL EM TELA CHEIA PARA NÃO PERDER INFORMAÇÕES IMPORTANTES
// -----------------------------------------------------------------------------------------

// Variáveis definidas
do {
    let timeNow = 7; // max 22 start 7 sempre => Hora do Dia
    let day = 1; // max 7
    let MODE = ''; // Dificuldade
    let mode = 0; // Coeficiente por dificuldade
    let death = false; // if true = penalidades
    let warning = 0; // Dias com < 4 horas de trabalho
    let vit = 0; // Guardar o valor de player.Vitalidade na última execução pra não resetar
    var replay; // Recomeça o Game
    let action; // Escolha de ações
    let resp; // Resposta ao convite na função dailyEvent
    let recurrency; // Checa se o dailyEvent ja aconteceu no dia

    // Funções de sleep e arredondar (utilizada caso algum status passe de 100)
    function sleep(milliseconds) {
        let start = new Date().getTime();
        for (let i = 0; i < 1e7; i++) {
            if (new Date().getTime() - start > milliseconds) {
                break;
            }
        }
    }

    function arredondar(n) {
        if (n > 99) {
            n = 100;
            return n;
        } else {
            return n;
        }
    }

    // Status do personagem
    const player = {
        Name: '',
        Saciedade: 100,
        Vitalidade: 100,
        Felicidade: 100,
        Higiene: 100,
        Projeto: 0,
        'Horas Trabalhadas:': 0,
    };
    // Objeto contendo todas as ações
    const Actions = {
        comer: function () {
            // Ação de comer
            player.Saciedade += 60 / mode + 60;
            arredondar(player.Saciedade);
            player.Higiene += 45 / mode + 15;
            player.Felicidade += 5;
            console.log(`Você faz a sua comida. 
Levou 3h para fazer e comer, mas ela é muito mais Saudável.
            Saciedade + ${60 / mode + 30}
            Higiene + ${45 / mode}
            Felicidade - 10
            Vitalidade - 15
                            `);
            this.getTime(3);
        },
        fastfood: function () {
            // Ação de comer fastfood
            player.Saciedade += 60 / mode + 30;
            player.Higiene -= 10 * mode - 5;
            player.Felicidade += 25;
            console.log(`Você pediu para entregarem a comida. 
Levou só 1h para chegar e comer, não é tão saudável quanto a comida caseira.
            
Pelo menos foi mais rápido.
            Saciedade + ${60 / mode + 20}
            Higiene - ${10 * mode}
            Felicidade + 20
            Vitalidade - 5
                            `);
            this.getTime(1);
        },
        estudar: function () {
            // Ação de estudar
            player.Felicidade -= 10 * mode - 5;
            player.Vitalidade -= 5 * mode - 5;
            player.Projeto += 10;
            console.log(`Você tirou um tempo para se dedicar ao projeto. 
Foram 2h intensas de estudo. 
Sua cabeça estava latejando ao final mas houve algum progresso.
            
            Projeto + 10%
            Felicidade - ${10 * mode + 5}
            Vitalidade - ${5 * mode + 5}
            Saciedade - 20
            Higiene - 20
                            `);
            this.getTime(2);
        },
        jokenpo: function () {
            // Ação de jogar jokenpo
            player.Felicidade += 45 / mode + 5;
            player.Vitalidade -= 5 * mode;
            do {
                var playU = prompt(`Pedra, papel ou tesoura?: `).toLowerCase();
                sleep(500);
                while (
                    playU !== 'pedra' &&
                    playU !== 'papel' &&
                    playU !== 'tesoura'
                ) {
                    console.log('Jogada inválida');
                    sleep(500);
                    break;
                }

                var playP = Math.floor(Math.random() * 3) + 1;
                if (playU == 'pedra' && playP == 3) {
                    console.log('Computador escolheu: tesoura');
                    sleep(500);
                    console.log(`${player.Name} venceu!`);
                    sleep(500);
                } else if (playU == 'pedra' && playP == 2) {
                    console.log('Computador escolheu: papel');
                    sleep(500);
                    console.log(`${player.Name} perdeu!`);
                    sleep(500);
                } else if (playU == 'pedra' && playP == 1) {
                    console.log('Computador escolheu: pedra');
                    sleep(500);
                    console.log('EMPATOU!');
                    sleep(500);
                }
                if (playU == 'papel' && playP == 1) {
                    console.log('Computador escolheu: pedra');
                    sleep(500);
                    console.log(`${player.Name} venceu!`);
                    sleep(500);
                } else if (playU == 'papel' && playP == 3) {
                    console.log('Computador escolheu: tesoura');
                    sleep(500);
                    console.log(`${player.Name} perdeu!`);
                    sleep(500);
                } else if (playU == 'papel' && playP == 2) {
                    console.log('Computador escolheu: papel');
                    sleep(500);
                    console.log('EMPATOU!');
                    sleep(500);
                }

                if (playU == 'tesoura' && playP == 2) {
                    console.log('Computador escolheu: papel');
                    sleep(500);
                    console.log(`${player.Name} venceu!`);
                    sleep(500);
                } else if (playU == 'tesoura' && playP == 1) {
                    console.log('Computador escolheu: pedra');
                    sleep(500);
                    console.log(`${player.Name} perdeu!`);
                    sleep(500);
                } else if (playU == 'tesoura' && playP == 3) {
                    console.log('Computador escolheu: tesoura');
                    sleep(500);
                    console.log('EMPATOU!');
                    sleep(500);
                }
            } while (
                playU !== 'pedra' &&
                playU !== 'papel' &&
                playU !== 'tesoura'
            );
            console.log(`
            Felicidade + ${45 / mode}
            Vitalidade - ${5 * mode}
            Saciedade - 20
            Higiene - 20
    `);
            this.getTime(1);
        },
        trabalhar: function () {
            // Ação de trabalhar
            player.Felicidade -= 10 * mode - 5;
            player.Vitalidade -= 8 * mode - 10;
            player['Horas Trabalhadas:'] += 2;
            console.log(`Você se empenha no seu trablaho. 
    
Foram 2 Horas de produtividade máxima. 
    
            Felicidade - ${10 * mode + 5}
            Vitalidade - ${8 * mode}
            Saciedade - 20
            Higiene - 20
    `);
            this.getTime(2);
        },
        passear: function () {
            // Ação de passear
            player.Felicidade += 45 / mode + 10;
            player.Vitalidade -= 5 * mode - 10;
            console.log(`Você vai dar uma volta no parque perto de sua casa. 
    
Foram 2 Horas de um belo passeio. 
            
            Felicidade + ${45 / mode}
            Vitalidade - ${5 * mode}
            Saciedade - 20
            Higiene - 20
    `);
            this.getTime(2);
        },
        exercicio: function () {
            // Ação de se exercitar
            player.Felicidade += 45 / mode + 10;
            player.Vitalidade -= 5 * mode - 10;
            player.Higiene += 30 / mode + 10;
            console.log(`Você vai para a academia.
    
Foram 2 Horas com o trajeto, mas você se sente muito bem.
    
            Felicidade + ${45 / mode}
            Vitalidade - ${5 * mode}
            Higiene + ${30 / mode}
            Saciedade - 20
    `);
            this.getTime(2);
        },
        banho: function () {
            // Ação de tomar banho
            player.Felicidade += 30 / mode + 5;
            player.Higiene += 60 / mode + 5;
            player.Vitalidade += 60 / mode + 5;
            console.log(`Você Toma AQUELE banho de Banheira.
    
1 Hora depois, você se sente novo.
            Felicidade + ${30 / mode}
            Vitalidade + ${60 / mode}
            Higiene + ${60 / mode}
            Saciedade - 10
`);
            this.getTime(1);
        },
        getTime: function (horas) {
            // Passagem de tempo por função

            for (let x = horas; x > 0; x--) {
                if (timeNow < 22) {
                    timeNow++;
                    {
                        player.Saciedade -= 10;
                        player.Felicidade -= 5;
                        player.Higiene -= 5;
                        player.Vitalidade -= 5;
                    }
                }
            }
        },
    };
    // Objeto com todas as funções de eventos randômicos diários
    const Testes = {
        dailyEvent: function () {
            let dailyEvent = Math.ceil(Math.random() * 10);
            if (dailyEvent == 1) {
                console.log(`Está muito frio la fora. Sua coberta ficou muito mais atrativa hoje.
Você acorda 1h mais tarde.
                Saciedade - 10
                 `);
                timeNow++;
                player.Saciedade -= 10;
            } else if (dailyEvent == 2) {
                console.log(`O dia estava muito quente e seu ar condicionado quebrou durante a noite. 
Você acorda mais cedo suando.
                Higiene - ${20 * (mode / 2)}
                Vitalidade - ${30 * (mode / 2)}
                 `);
                timeNow--;
                player.Vitalidade -= 30 * (mode / 2);
                player.Higiene -= 20 * (mode / 2);
            } else if (dailyEvent == 3) {
                console.log(`Choveu muito e acabou a luz na sua casa! Seu celular estava carregando
mas acabou desligando!
Você acordou 2 horas depois sem despertador
                Felicidade - ${10 * (mode / 2)}
                Saciedade - 20
                 `);
                timeNow += 2;
                player.Felicidade -= 10 * (mode / 2);
                player.Saciedade -= 20;
            } else if (dailyEvent == 4) {
                console.log(`Seu vizinho resolveu fazer um reparo em casa antes de ir pro trabalho,
você acabou acordando mais cedo com o barulho da furadeira.
                Felicidade - ${10 * (mode / 2)} 
                `);
                timeNow--;
                player.Felicidade -= 10 * (mode / 2);
            } else if (dailyEvent == 5) {
                console.log(`Seu chefe te acorda pedindo um relatório urgente. 
Será que ele percebeu que ainda eram 5h da manhã?
                 
Você não conseguiu voltar a dormir.
                Felicidade - ${20 * (mode / 2)}
                `);
                timeNow -= 2;
                player.Felicidade -= 20 * (mode / 2);
            } else if (dailyEvent == 6) {
                console.log(`Os resultados da sua empresa foram excelentes! Você acorda com o e-mail
que sua PLR virá praticamente dobrada.
                Felicidade + ${Math.ceil(20 / (mode / 2))}
                `);
                player.Felicidade += Math.ceil(20 / (mode / 2));
            } else if (dailyEvent == 7) {
                console.log(`Lembra aquele projeto que você enviou para o seu chefe? O diretor gostou bastante
e te enviou um convite para uma reunião. 
Será que vem a promoção?
                Felicidade + ${Math.ceil(20 / (mode / 2))}
                 `);
                player.Felicidade += Math.ceil(20 / (mode / 2));
            } else if (dailyEvent == 8) {
                console.log(`Você recebeu uma cesta de café da manhã da sua empresa.
Por acaso hoje é alguma data especial?
         
                Felicidade + ${Math.ceil(10 / (mode / 2))}
                Saciedade + ${Math.ceil(30 / (mode / 2))}
                `);
                player.Felicidade += Math.ceil(10 / (mode / 2));
                player.Saciedade += Math.ceil(30 / (mode / 2));
            } else if (dailyEvent == 9) {
                console.log(`O tempo estava muito bonito e você acordou mais cedo para tomar um banho de mar antes de trabalhar.
Você se sente revigorado.
                Felicidade + ${Math.ceil(10 / (mode / 2))}
                Higiene + ${Math.ceil(10 / (mode / 2))}
                `);
                player.Felicidade += Math.ceil(10 / (mode / 2));
                player.Higiene += Math.ceil(10 / (mode / 2));
            } else if (dailyEvent == 10) {
                console.log(`Sua mãe ganhou na loto. Ela te ofereceu uma diária em um hotal 5 estrelas.
                 
Você aceita o convite?
        1)Sim                 2)Não
                 `);

                do {
                    resp = prompt(`R:`).toLowerCase();
                    if (
                        resp != 1 &&
                        resp != 2 &&
                        resp != 'sim' &&
                        resp != 'nao'
                    ) {
                        console.log(`Não entendi.`);
                    }
                } while (
                    resp != 1 &&
                    resp != 2 &&
                    resp != 'sim' &&
                    resp != 'nao'
                );

                if (resp == 1 || resp == 'sim') {
                    day++;
                    player.Felicidade = 100;
                    player.Vitalidade = 100;
                    player.Higiene = 100;
                    console.log(`Você passou um dia maravilhoso no hotel!
         
                     Será que o seu chefe acreditou naquele atestado?
         
                     Felicidade = 100
                     Vitalidade = 100
                     Higiene = 100`);
                } else {
                    player.Felicidade -= 10 * (mode / 2);
                    console.log(`Você até fica tentado...`);
                    sleep(500);
                    console.log(`Mas você leembra de suas obrigações e recusa o convite com certo arrependimento.
                     
                     Felicidade - ${10 * (mode / 2)}`);
                }
            }
        },
        dayTime: function () {
            if (timeNow >= 5 && timeNow <= 12) {
                return `
                Bom dia`;
            } else if (timeNow > 12 && timeNow < 18) {
                return `
                Boa tarde`;
            } else if (timeNow > 17 && timeNow < 22) {
                return `
                Boa noite`;
            }
        },
        showStatus: function () {
            // Checagem com o 0.

            // Saciedade
            if (player.Saciedade < 25) {
                console.log(
                    `Sua Saciedade está em ${player.Saciedade}. Você está morrendo de Fome.`,
                );
            } else if (player.Saciedade < 50) {
                console.log(
                    `Sua Saciedade está em ${player.Saciedade}. Você está com muita Fome.`,
                );
            } else if (player.Saciedade < 75) {
                console.log(
                    `Sua Saciedade está em ${player.Saciedade}. Você está sentindo Fome.`,
                );
            } else if (player.Saciedade < 100) {
                console.log(
                    `Sua Saciedade está em ${player.Saciedade}. Você está satisfeito.`,
                );
            } else if (player.Saciedade > 99) {
                console.log(
                    `Sua Saciedade está em ${player.Saciedade}. Você está entupido`,
                );
            }

            // Vitalidade
            if (player.Vitalidade < 25) {
                console.log(
                    `Sua Vitalidade está em ${player.Vitalidade}. Você está exausto.`,
                );
            } else if (player.Vitalidade < 50) {
                console.log(
                    `Sua Vitalidade está em ${player.Vitalidade}. Você está muito cansado.`,
                );
            } else if (player.Vitalidade < 75) {
                console.log(
                    `Sua Vitalidade está em ${player.Vitalidade}. Você começa a se sentir cansado.`,
                );
            } else if (player.Vitalidade < 100) {
                console.log(
                    `Sua Vitalidade está em ${player.Vitalidade}. Você está descansado.`,
                );
            } else if (player.Vitalidade > 99) {
                console.log(
                    `Sua Vitalidade está em ${player.Vitalidade}. Você está tremendo de tanta Energia.`,
                );
            }

            // Felicidade
            if (player.Felicidade < 25) {
                console.log(
                    `Sua Felicidade está em ${player.Felicidade}. Você está a ponto de Desistir da vida.`,
                );
            } else if (player.Felicidade < 50) {
                console.log(
                    `Sua Felicidade está em ${player.Felicidade}. Você só quer ficar trancado no seu quarto.`,
                );
            } else if (player.Felicidade < 75) {
                console.log(
                    `Sua Felicidade está em ${player.Felicidade}. Você está desanimado.`,
                );
            } else if (player.Felicidade < 100) {
                console.log(
                    `Sua Felicidade está em ${player.Felicidade}. Você está feliz.`,
                );
            } else if (player.Felicidade > 99) {
                console.log(
                    `Sua Felicidade está em ${player.Felicidade}. Você está Radiante de Alegria.`,
                );
            }

            // Higiene
            if (player.Higiene < 25) {
                console.log(
                    `Sua Higiene está em ${player.Higiene}. Você está com irritações e pequenas feridas na pele.`,
                );
            } else if (player.Higiene < 50) {
                console.log(
                    `Sua Higiene está em ${player.Higiene}. Isso começa a afetar a sua saúde.`,
                );
            } else if (player.Higiene < 75) {
                console.log(
                    `Sua Higiene está em ${player.Higiene}. Você começa a se sentir sujo.`,
                );
            } else if (player.Higiene < 100) {
                console.log(
                    `Sua Higiene está em ${player.Higiene}. Você se sente Limpo e saudável.`,
                );
            } else if (player.Higiene > 99) {
                console.log(
                    `Sua Higiene está em ${player.Higiene}. Você está Extremamente limpo e Saudável.`,
                );
            }
        },
        checkStatus: function () {
            death = false;
            //Teste Fome
            if (player.Saciedade < 1) {
                player.Saciedade = 0;
                console.log(`Você não levou a sério os limites do seu corpo...
Sua Saciedade chegou a ${player.Saciedade}. Você desmaiou de Fome!
              `);
                return (death = true);
            }

            // Teste Cansaço
            if (player.Vitalidade < 1) {
                player.Vitalidade = 0;
                console.log(`Você não levou a sério os limites do seu corpo...              
Sua Vitalidade chegou a ${player.Vitalidade}. Você desmaia pelo Cansaço!
              `);
                return (death = true);
            }

            // Teste Felicidade
            if (player.Felicidade < 1) {
                player.Felicidade = 0;
                console.log(`Você não levou a sério os limites da sua Mente...                  
Sua Felicidade chegou a ${player.Felicidade}. Você atenta contra a sua própria vida!
                  `);
                return (death = true);
            }

            // Teste Higine
            if (player.Higiene < 1) {
                player.Higiene = 0;
                console.log(`Você não levou a sério os limites do seu corpo...
Sua Higiene chegou a ${player.Higiene}. Você foi consumido pela Doença.
              `);
                return (death = true);
            }
            if (player.Projeto > 99) {
                player.Projeto = 100;
            }
            if (warning > 2) {
                console.log(`Você tem fugido do trabalho, seu chefe já tinha lhe avisado.
Você foi Demitido!
                `);
                death = true;
            }
        },
        relatorio: function () {
            // Conclusão do seu chefe.

            let media =
                (player.Saciedade + player.Felicidade + player.Higiene + vit) /
                4;

            if (media < 20) {
                console.log(`Você estava com um aspecto terrivel, você tem um teto para viver?.
                `);
            } else if (media < 40) {
                console.log(`Você estava Sujo e com roupas desleixadas. Parece que isso não era tão importante para você
                `);
            } else if (media < 60) {
                console.log(`Você estava um pouco abatido. Entendo que talvez esse projeto tenha exigido demais de você
                    `);
            } else if (media < 80) {
                console.log(`Você estava bem apresentável, mas faltou um pouco de confiança na apresentação.
                `);
            } else if (media > 79) {
                console.log(`Você foi uma fera! Extremamente carismático e muito bem apresentável.
                    `);
            }
            if (player.Projeto < 20) {
                console.log(`Você pagou ao meu filho de 8 anos para fazer o projeto no seu lugar?.
                    `);
            } else if (player.Projeto < 40) {
                console.log(`Seu projeto está longe do que eu esperava. Talvez tenha colocado muita exectativa no seu trabalho.
                `);
            } else if (player.Projeto < 60) {
                console.log(`Infelizmente, não poderemos aproveitar esse projeto.
                `);
            } else if (player.Projeto < 80) {
                console.log(`Seu projeto está bom. Parabéns
                `);
            } else if (player.Projeto > 79) {
                console.log(`Seu projeto é inovador!! Todos ficarão impressionados com esse resultado.
                    `);
            }
        },
        promocao: function () {
            let media =
                (player.Saciedade + player.Felicidade + player.Higiene + vit) /
                4;
            if (media > 69 && player.Projeto > 79) {
                console.log(`Sua apresentação e o conteúdo do seu projeto foram excelentes!
        Parabéns ${player.Name}, você agora será meu sócio!
        A cerveja hoje é por minha conta!!!
                    🍺🍺🍺🍺🍺 🍻 
                    🍺🍺🍺🍺🍺   🍻 
                    🍺🍺🍺🍺🍺    🍻
                    🍺🍺🍺🍺🍺   🍻
                    🍺🍺🍺🍺🍺🍻
                    🍺🍺🍺🍺🍺         
        `);
            } else if (media > 49 && player.Projeto > 79) {
                console.log(`Sua apresentação foi boa e o conteúdo do seu projeto foi excelente.
        
        Parabéns ${player.Name}, você foi promovido!
              `);
            } else if (media > 69 && player.Projeto > 59) {
                console.log(`Sua apresentação foi excelente e o conteúdo do seu projeto foi bom.
        
        Parabéns ${player.Name}, você foi promovido!
              `);
            } else if (media > 49 && player.Projeto > 59) {
                console.log(`Sua apresentação e o conteúdo do seu projeto foram bons.
        
        Você está no caminho certo ${player.Name}! Mas ainda não foi o suficiente para lhe promover.
              `);
            } else {
                console.log(`${player.Name}, percebo que seu desempenho está a quem de nossos objetivos...
              
        Você está Demitido!
            `);
            }
        },
        descanso: function () {
            if (day == 7) {
                vit = player.Vitalidade;
            }
            timeNow = 7;
            player.Saciedade -= 10 * mode;
            console.log(`Você Dormiu.
        Saciedade - ${10 * mode};
        Vitalidade está no máximo
              `);
            console.log(`Você trabalhou um total de ${player['Horas Trabalhadas:']} horas.
`);

            if (player['Horas Trabalhadas:'] < 4) {
                warning++;
                console.log(`Você trabalhou menos que 4 horas! Seu chefe não está nada satisfeito.
                  
        É o seu ${warning}° aviso.
                  `);
            }
        },
        Replay: function () {
            do {
                replay = prompt('Deseja jogar novamente? ').toLowerCase();
                sleep(250);
                while (replay !== 'sim' && replay !== 'nao') {
                    console.log('Resposta inválida');
                    sleep(250);
                    break;
                }
            } while (replay !== 'sim' && replay !== 'nao');
            return replay;
        },
    };
    // Início do código
    console.log(`
                                ╔++++++++++++++++++++++++╗
                                    Project: Life!                
                                ╚++++++++++++++++++++++++╝
`);
    sleep(500);
    console.log(
        ` v 1.0          -- Desenvolvido por Leonardo Tinoco & Daniel Vinhas
    `,
    );
    sleep(1500);
    player.Name = prompt(`Digite seu nome: `);
    console.log();
    do {
        var play = +prompt(
            `Digite 1 para começar a jogar ou 0 e eu lhe explicarei as regras: `,
        );

        if (play !== 0 && play !== 1) {
            console.log(`
        Resposta inválida!`);
        }
    } while (play !== 0 && play !== 1);

    if (play == 0) {
        console.log(
            `
    Seu objetivo nesse jogo é entregar um projeto para 
a sua empresa no prazo de 7 dias. Porém, existem obstáculos
no caminho.`,
        );

        sleep(1500);

        console.log(`
    Você terá que conciliar suas necessidades diárias
com o seu trabalho e com o desenvolvimento do projeto. 
Você sofrerá penalidades caso qualquer um dos status
(Saciedade, Felicidade, Vitalidade, Higiene) chegue a 0.
    No Fácil: Você perderá 1 dia.
    No Médio: Você perderá 2 dias.
    No Difícil: Você perderá o jogo.
`);

        sleep(1500);

        console.log(`
    Você terá que trabalhar um minímo de 4 horas por dia 
para evitar demissão. A cada dia que você nao trabalhar
pelo menos 4 horas, irá ganhar uma advertência.
    Ao chegar a 3, você perderá o jogo.
`);
        sleep(1500);

        console.log(`
    Todo dia ao acordar, um evento aleatório irá acontecer no seu jogo,
ele pode ser positivo ou negativo para o seu personagem!
`);
        sleep(1500);

        console.log(`
    Fique atento(a) na sua tabela de Status. Você pode
acessá-la digitando 0 na escolha de ações.
    Seu chefe avaliará seu projeto e sua aresentação ao final.
        Boa sorte!!
`);
        sleep(2000);
    }

    console.log(`Selecione o modo de dificuldade (1 a 3):
`);

    do {
        MODE = prompt(
            `1) Fácil      2) Médio       3) Difícil: `,
        ).toLowerCase();
        sleep(500);
        if (
            MODE != 1 &&
            MODE != 2 &&
            MODE != 3 &&
            MODE != 'facil' &&
            MODE != 'medio' &&
            MODE != 'dificil'
        ) {
            console.log(`
        Modo inválido, digite uma das opções acima.
        `);
        }
    } while (
        MODE != 1 &&
        MODE != 2 &&
        MODE != 3 &&
        MODE != 'facil' &&
        MODE != 'medio' &&
        MODE != 'dificil'
    );
    if (MODE == 1 || MODE == 'facil') {
        mode = 1;
    } else if (MODE == 2 || MODE == 'medio') {
        mode = 2;
    } else if (MODE == 3 || MODE == 'dificil') {
        mode = 3;
    }
    // Loop de ações

    for (day = 1; day < 8; day++) {
        // Contador de Dias
        if (day < 7) {
            console.log(
                `
    ---------------------------------------------------------------------------------
                Dia ${day}. Faltam ${
                    7 - day
                } dias para a apresentação do seu Projeto.`,
            );
        } else if (day == 7) {
            console.log(`
    ---------------------------------------------------------------------------------
            Dia ${day}. Hoje é o Grande Dia!`);
        }
        sleep(1000);
        recurrency = true;
        for (timeNow = 7; timeNow < 22; ) {
            // Contador de Horas
            if (recurrency == true) {
                console.log(``);
                Testes.dailyEvent();
            }
            player.Felicidade = arredondar(player.Felicidade);
            player.Vitalidade = arredondar(player.Vitalidade);
            player.Saciedade = arredondar(player.Saciedade);
            player.Higiene = arredondar(player.Higiene);
            player.Projeto = arredondar(player.Projeto);
            sleep(3000);
            console.log(
                `
    ---------------------------------------------------------------------------------
                ${Testes.dayTime()}, ${
                    player.Name
                } são ${timeNow} horas do ${day}° dia na sua jornada!
                                • Seus status são:
                Saciedade: ${
                    player.Saciedade
                }                       Vitalidade: ${player.Vitalidade}
                Felicidade: ${
                    player.Felicidade
                }                      Higiene: ${player.Higiene}
                Seu projeto está ${
                    player.Projeto
                }% concluído        Você trabalhou ${
                    player['Horas Trabalhadas:']
                } horas hoje.   
                `,
            );
            sleep(1000);
            console.log(`O que você deseja fazer?
            `);
            sleep(500);
            console.log(`Digite 0 a qualquer momento e veja a tabela de status do seu personagem.
            `);
            sleep(500);
            console.log(
                `Ações disponíveis:          Você perde 5 de Felicidade, Higiene e Vitalidade além de 10 de Saciedade por HORA`,
            );
            sleep(500);
            console.log(`
    1)Fazer comida:         3 horas         (Saciedade + ${arredondar(
        60 / mode + 30,
    )} / Higiene + ${45 / mode})    
    2)Comer Fastfood:       1 hora          (Saciedade + ${
        60 / mode + 20
    } / Higiene - ${10 * mode} / Felicidade + 20)     
    3)Estudar:              2 horas         (Felicidade - ${
        10 * mode + 5
    } / Vitalidade - ${5 * mode + 5} / Projeto + 10%)              
    4)Jogar jokenpô:       1 horas         (Felicidade + ${
        45 / mode
    } / Vitalidade - ${5 * mode})
    5)Trabalhar:            2 horas         (Felicidade - ${
        10 * mode + 5
    } / Vitalidade - ${8 * mode} / Horas Trabalhadas + 2)
    6)Passear:              2 horas         (Felicidade + ${
        45 / mode
    } / Vitalidade - ${5 * mode})
    7)Fazer exercicio:      2 horas         (Felicidade + ${
        45 / mode
    } / Vitalidade - ${5 * mode} / Higiene + ${30 / mode})
    8)Tomar banho:          1 hora          (Felicidade + ${
        30 / mode
    } / Higiene + ${60 / mode} / Vitalidade + ${60 / mode}) 
    `);
            do {
                action = prompt(`Digite a sua ação: `).toLowerCase();
                // console.clear();
                sleep(1500);
                if (action == 0) {
                    Testes.showStatus();
                    console.table(player);
                } else if (action == 1 || action.indexOf('comida') != -1) {
                    Actions.comer();
                } else if (action == 2 || action.indexOf('fastfood') != -1) {
                    Actions.fastfood();
                } else if (action == 3 || action.indexOf('estudar') != -1) {
                    Actions.estudar();
                } else if (
                    action == 4 ||
                    (action.indexOf('jokenpo') != -1 &&
                        action.indexOf('jogar') != -1)
                ) {
                    Actions.jokenpo();
                } else if (action == 5 || action.indexOf('trabalhar') != -1) {
                    Actions.trabalhar();
                } else if (action == 6 || action.indexOf('passear') != -1) {
                    Actions.passear();
                } else if (action == 7 || action.indexOf('exercicio') != -1) {
                    Actions.exercicio();
                } else if (
                    action == 8 ||
                    (action.indexOf('tomar') != -1 &&
                        action.indexOf('banho') != -1)
                ) {
                    Actions.banho();
                } else {
                    console.log(`
            >>>>> ESSA AÇÃO NÃO FAZ SENTIDO. <<<<<
                    `);
                }
                Testes.checkStatus();
                if (death == true) {
                    if (mode == 2 || mode == 1) {
                        console.log(`Pra sua sorte, seu vizinho percebeu o que estava acontecendo e chamou uma ambulância.
Você foi levado ao Hospital mais próximo, tomou medicamentos e foi liberado após ${
                            mode * 24
                        } H.
                        `);
                        sleep(3000);
                        day += 1 * mode;
                        death = false;
                    } else if (mode == 3) {
                        console.log(`Você cai sozinho e bate sua cabeça... 
Não havia ninguém por perto para lhe socorrer.
                        `);
                        sleep(3000);
                        day = 8;
                    }
                    player.Saciedade = 100;
                    player.Vitalidade = 100;
                    player.Felicidade = 100;
                    player.Higiene = 100;
                }
                break;
            } while (true);
            if (day > 7) {
                break;
            }
            recurrency = false;
        }

        Testes.descanso();
        sleep(5000);
        player.Vitalidade = 100;
        player['Horas Trabalhadas:'] = 0;
    }
    if (death == false) {
        Testes.relatorio();
        Testes.promocao();
    } else {
        console.log(`Você morreu!`);
        sleep(2000);
    }
    // end game
    Testes.Replay();
} while (replay == 'sim');
{
    console.log(`Encerrando Project: Life!
  `);
    sleep(500);
    console.log(`Obrigado por jogar.
  `);
    sleep(500);
    console.log(`Dúvidas e sugestões:
  `);
    sleep(500);
    console.log(`Leonardo Tinoco - https://linktr.ee/leotinoco7
  `);
    sleep(500);
    console.log(`Daniel Vinhas - https://github.com/vinhas93`);
}