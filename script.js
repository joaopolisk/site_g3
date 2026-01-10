const testimonials = [
    { name: "Érica", text: "O desafio foi controlar corretamente as jogadas do usuário e do computador sem quebrar o fluxo do jogo. Resolvi isso organizando bem a ordem das chamadas dos métodos e garantindo que cada turno fosse executado corretamente.", img: "./user1.jpg" },
    { name: "Ana Carolina", text: "Trabalhei na base do tabuleiro e em parte da lógica principal. A maior dificuldade foi garantir que as jogadas fossem válidas e que o estado do jogo estivesse sempre correto. Resolvi isso testando muitos cenários diferentes e ajustando a lógica passo a passo.", img: "./user2.jpg" },
    { name: "Carlos Pablo", text: "Trabalhar em equipe no Git foi um aprendizado real.", img: "./user7.jpg" },
    { name: "Isadora", text: "A parte mais difícil foi tratar as entradas do usuário e converter os dados para o formato que o jogo precisava. Superei isso criando validações e testando vários tipos de entrada até o sistema ficar robusto e sem erros.", img: "./user4.jpg" },
    { name: "Lucas Cardoso", text: "Minha maior dificuldade foi deixar a exibição no console organizada e clara para o usuário. Com testes e ajustes na formatação, consegui deixar o jogo mais bonito, compreensível e com mensagens bem apresentadas.", img: "./user5.jpg" },
    { name: "Thalia", text: "A maior dificuldade foi organizar o fluxo completo do jogo, controlando turnos, verificações de vitória e empate. No começo parecia confuso, mas separando o problema em pequenas funções e testando cada parte, consegui estruturar toda a lógica principal e fazer tudo funcionar em conjunto.", img: "./user6.jpg" },
    { name: "Abner Chaves", text: "Fiquei responsável por parte da lógica que verifica as condições de vitória. O maior desafio foi pensar em todas as possibilidades de linha, coluna e diagonal. Resolvi isso separando cada verificação em métodos pequenos e testando cada um individualmente.", img: "./user3.jpg" }
];

const track = document.getElementById('carouselTrack');

testimonials.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
        <img src="${t.img}" class="user-photo" alt="${t.name}">
        <div class="testimonial-text">
            <p>"${t.text}"</p>
            <strong>- ${t.name}</strong>
        </div>
    `;
    track.appendChild(card);
});

let index = 0;

function nextSlide() {
    index++;
    if (index >= testimonials.length) {
        index = 0;
    }
    track.style.transform = `translateX(-${index * 100}%)`;
}

setInterval(nextSlide, 5000);

const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

let state = {
    cloned: false,
    inProject: false,
    compiled: false,
    running: false
};

function printLine(text = "") {
    const div = document.createElement("div");
    div.innerHTML = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

// ================= TERMINAL =================

input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const command = input.value.trim();
        if (state.running) {
            handleGameInput(command);
        } else {
            printLine(`<span style="color:#58a6ff">$</span> ${command}`);
            handleCommand(command);
        }
        input.value = "";
    }
});

function handleCommand(cmd) {

    if (cmd.startsWith("git clone")) {
        printLine("Clonando repositório...");
        printLine("✔ Repositório clonado com sucesso.");
        state.cloned = true;
        return;
    }

    if (cmd === "cd g3") {
        if (!state.cloned) {
            printLine("❌ Você precisa clonar o repositório primeiro.");
        } else {
            state.inProject = true;
            printLine("Entrando na pasta g3...");
        }
        return;
    }

    if (cmd.startsWith("javac")) {
        if (!state.inProject) {
            printLine("❌ Você não está no projeto.");
        } else {
            printLine("Compilando App.java...");
            printLine("✔ Compilação concluída com sucesso.");
            state.compiled = true;
        }
        return;
    }

    if (cmd === "java App" || cmd === "java Main") {
        if (!state.compiled) {
            printLine("❌ Você precisa compilar antes.");
        } else {
            printLine("Executando App...");
            startGame();
        }
        return;
    }

    printLine("Comando não reconhecido.");
}

// ================= JOGO =================

let board;
let currentPlayer;

function startGame() {
    state.running = true;
    board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];
    currentPlayer = "X";
    printLine("");
    printLine("=== JOGO DA VELHA ===");
    printLine("Digite: linha coluna (ex: 1 1)");
    drawBoard();
    printLine("Vez do jogador X");
}

function drawBoard() {
    printLine("");
    printLine("  1   2   3");
    for (let i = 0; i < 3; i++) {
        let line = (i + 1) + " ";
        for (let j = 0; j < 3; j++) {
            line += " " + board[i][j] + " ";
            if (j < 2) line += "|";
        }
        printLine(line);
        if (i < 2) printLine("  ---+---+---");
    }
    printLine("");
}

function handleGameInput(cmd) {
    const parts = cmd.split(" ");
    if (parts.length !== 2) {
        printLine("Entrada inválida. Use: linha coluna");
        return;
    }

    let l = parseInt(parts[0]) - 1;
    let c = parseInt(parts[1]) - 1;

    if (isNaN(l) || isNaN(c) || l < 0 || l > 2 || c < 0 || c > 2) {
        printLine("Posição inválida.");
        return;
    }

    if (board[l][c] !== " ") {
        printLine("Essa posição já está ocupada.");
        return;
    }

    board[l][c] = currentPlayer;

    drawBoard();

    if (checkWin(currentPlayer)) {
        printLine(`🎉 Jogador ${currentPlayer} venceu!`);
        endGame();
        return;
    }

    if (checkDraw()) {
        printLine("🤝 Deu empate!");
        endGame();
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    printLine(`Vez do jogador ${currentPlayer}`);
}

function checkWin(p) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === p && board[i][1] === p && board[i][2] === p) return true;
        if (board[0][i] === p && board[1][i] === p && board[2][i] === p) return true;
    }
    if (board[0][0] === p && board[1][1] === p && board[2][2] === p) return true;
    if (board[0][2] === p && board[1][1] === p && board[2][0] === p) return true;
    return false;
}

function checkDraw() {
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[i][j] === " ") return false;
    return true;
}

function endGame() {
    state.running = false;
    printLine("");
    printLine("Fim de jogo.");
    printLine("Você pode rodar novamente com: java App");
}

const memberScripts = {

    thalia: [
        "$ cat main.java",
        "Thalia implementou o fluxo principal do jogo.",
        "",
        "Funções:",
        "- obterCaractereUsuario()",
        "- sortearValorBooleano()",
        "- processarVezUsuario()",
        "- processarVezComputador()",
        "- verificações de vitória e empate",
        "- alternância de turnos",
        "",
        "✔ Parte: Controle principal do jogo"
    ],

    carol: [
        "$ cat Tabuleiro.java",
        "Ana Carolina cuidou da base do jogo:",
        "",
        "- inicializarTabuleiro()",
        "- jogadaValida()",
        "- obterJogadaUsuario()",
        "- teveGanhador()",
        "- atualizaTabuleiro()",
        "",
        "✔ Parte: Estrutura e validações do tabuleiro"
    ],

    isadora: [
        "$ cat Entrada.java",
        "Isadora implementou:",
        "",
        "- obterCaractereUsuario()",
        "- obterCaractereComputador()",
        "- obterJogadaComputador()",
        "- converterJogadaStringParaVetorInt()",
        "- retornarPosicoesLivres()",
        "- exibirTabuleiro()",
        "",
        "✔ Parte: Entrada de dados e IA simples"
    ],

    carlos: [
        "$ cat Verificador.java",
        "Carlos Pablo ficou responsável por TODA a lógica de vitória:",
        "",
        "- teveGanhadorLinha()",
        "- teveGanhadorColuna()",
        "- teveGanhadorDiagonalPrincipal()",
        "- teveGanhadorDiagonalSecundaria()",
        "",
        "✔ Parte: Motor de verificação de vitória"
    ],

    lucas: [
        "$ cat Interface.java",
        "Lucas implementou a parte visual e finalização:",
        "",
        "- limparTela()",
        "- exibirVitoriaComputador()",
        "- exibirVitoriaUsuario()",
        "- exibirEmpate()",
        "- teveEmpate()",
        "- sortearValorBooleano()",
        "",
        "✔ Parte: Interface e finalização do jogo"
    ],

    erica: [
        "$ cat Turnos.java",
        "Érica controlou a execução das jogadas:",
        "",
        "- processarVezUsuario()",
        "- processarVezComputador()",
        "",
        "✔ Parte: Controle de turnos e execução de jogadas"
    ],

    abner: [
        "$ cat JogoDaVelha.java",
        "Abner implementou a lógica de jogo e implmentação de classes:",
        "",
        "- JogoDaVelha.java",
        "",
        "✔ Parte: Implementação parcial do jogo"
    ]
};


const members = document.querySelectorAll(".team-member");
const terminalOutput = document.getElementById("terminalOutput_2");
const terminalTitle = document.getElementById("terminalTitle");

// Localize os members no script.js
members.forEach(member => {
    member.addEventListener("click", () => {

        members.forEach(m => m.classList.remove("active"));
        member.classList.add("active");

        member.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });

        const id = member.dataset.member;
        terminalTitle.innerText = "1000Devs - " + member.querySelector('.name').innerText;
        loadMember(id);
    });
});

function loadMember(id) {
    terminalOutput.innerHTML = "";
    const script = memberScripts[id];

    let i = 0;
    const interval = setInterval(() => {
        if (i >= script.length) {
            clearInterval(interval);
            return;
        }
        const line = document.createElement("div");
        line.textContent = script[i];
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        i++;
    }, 300);
}


