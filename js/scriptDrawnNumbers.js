let buttonDrawnNumbers = document.getElementById('buttonDrawnNumbers');
let inputViewNumber = document.getElementById('viewNumber');
let drawnNumbers = [];
let p_numerosSoteados = document.getElementById('p_numerosSoteados');
const checkboxRepeatNumber = document.getElementById('checkboxRepeatNumber');
let allowRepeat = false;

// Canal de comunicação entre a aba do Admin e o Painel
const canalSorteio = new BroadcastChannel('canal_sorteio');

if (checkboxRepeatNumber) {
    checkboxRepeatNumber.addEventListener('change', function() {
        allowRepeat = this.checked;
    });
}

// Se estiver no Painel (segunda tela), escuta os comandos do Admin
canalSorteio.onmessage = (event) => {
    const dados = event.data;
    if (dados.acao === 'atualizar_tela') {
        if (inputViewNumber) inputViewNumber.value = dados.numeroAtual;
        if (p_numerosSoteados) p_numerosSoteados.innerHTML = dados.historicoText;
    } else if (dados.acao === 'resetar') {
        if (inputViewNumber) inputViewNumber.value = '';
        if (p_numerosSoteados) p_numerosSoteados.innerHTML = '';
        drawnNumbers = [];
    }
};

if (buttonDrawnNumbers) {
    buttonDrawnNumbers.addEventListener('click', () => {
        let currentArray = window.arrayListNumbers || (window.opener && window.opener.arrayListNumbers);

        if (!currentArray || currentArray.length === 0) {
            alert("O array de números está vazio! Defina o intervalo primeiro.");
            return;
        }

        if (!allowRepeat && drawnNumbers.length >= currentArray.length) {
            alert("Todos os números do intervalo já foram sorteados!");
            return;
        }

        let randomIndex;
        let currentNumber;

        if (!allowRepeat) {
            do {
                randomIndex = Math.floor(Math.random() * currentArray.length);
                currentNumber = currentArray[randomIndex];
            } while (drawnNumbers.includes(currentNumber));
        } else {
            randomIndex = Math.floor(Math.random() * currentArray.length);
            currentNumber = currentArray[randomIndex];
        }

        buttonDrawnNumbers.disabled = true;
        let buttonResetNumbers = document.getElementById('buttonResetNumbers');
        if (buttonResetNumbers) buttonResetNumbers.disabled = true;

        let tempoTotal = 1500;
        let intervaloTroca = 80;
        let tempoDecorrido = 0;

        const animacao = setInterval(() => {
            let numeroAleatorio;
            if (!allowRepeat) {
                let disponiveis = currentArray.filter(n => !drawnNumbers.includes(n));
                numeroAleatorio = disponiveis[Math.floor(Math.random() * disponiveis.length)];
            } else {
                numeroAleatorio = currentArray[Math.floor(Math.random() * currentArray.length)];
            }

            if (inputViewNumber) inputViewNumber.value = numeroAleatorio;

            // Envia animação para a segunda tela
            canalSorteio.postMessage({
                acao: 'atualizar_tela',
                numeroAtual: numeroAleatorio,
                historicoText: p_numerosSoteados ? p_numerosSoteados.innerHTML : ''
            });

            tempoDecorrido += intervaloTroca;

            if (tempoDecorrido >= tempoTotal) {
                clearInterval(animacao);
                
                if (inputViewNumber) inputViewNumber.value = currentNumber;
                drawnNumbers.push(currentNumber);

                if (p_numerosSoteados) {
                    if (p_numerosSoteados.innerHTML === "") {
                        p_numerosSoteados.innerHTML = currentNumber;
                    } else {
                        p_numerosSoteados.innerHTML += ", " + currentNumber;
                    }
                }

                // Envia o resultado final para a segunda tela
                canalSorteio.postMessage({
                    acao: 'atualizar_tela',
                    numeroAtual: currentNumber,
                    historicoText: p_numerosSoteados ? p_numerosSoteados.innerHTML : ''
                });

                buttonDrawnNumbers.disabled = false;
                if (buttonResetNumbers) buttonResetNumbers.disabled = false;
            }

        }, intervaloTroca);
    });
}

let buttonResetNumbers = document.getElementById('buttonResetNumbers');
if (buttonResetNumbers) {
    buttonResetNumbers.addEventListener('click', () => {
        if (inputViewNumber) inputViewNumber.value = '';
        let inputFirstNumber = document.getElementById('inputInicialNumber');
        let inputLastNumber = document.getElementById('inputFinalNumber');
        if (inputFirstNumber) inputFirstNumber.value = '';
        if (inputLastNumber) inputLastNumber.value = '';
        
        drawnNumbers = [];
        if (p_numerosSoteados) p_numerosSoteados.innerHTML = '';

        let modalAdmin = document.getElementById('modalDrawnNumbers');
        if (modalAdmin) {
            modalAdmin.style.visibility = 'hidden';
            modalAdmin.style.pointerEvents = 'none';
        }

        canalSorteio.postMessage({ acao: 'resetar' });
    });
}