let getNumbers = document.getElementById('getNumbers')

let novaJanela = null;
let checarJanelaFechada = null;

let inputFirstNumber = document.getElementById("inputInicialNumber")
let inputLastNumber = document.getElementById("inputFinalNumber")

let modalDrawnNumbers = document.getElementById('modalDrawnNumbers')

window.arrayListNumbers = []

getNumbers.addEventListener('click', ()=> {

    let min = parseInt(inputFirstNumber.value)
    let max = parseInt(inputLastNumber.value)

    if (isNaN(min) || isNaN(max)) {
        alert("Preencha ambos os números!")
        return
    }

    if (min > max) {
        alert("O número inicial está maior que o número final!")
        return
    }

    if (min == max) {
        alert("Os números estão iguais!")
        return
    }

    window.arrayListNumbers = []
    for (let a = min; a <= max; a++) {
        window.arrayListNumbers.push(a);
    }
    
    let largura = screen.width
    let altura = screen.height

    novaJanela = window.open(
                        '../html/painel.html',
                        'TelaSorteio',
                        `width=${largura},height=${altura},top=0,left=0,fullscreen=yes`
                    )

    console.log("Array gerado:", window.arrayListNumbers);

    modalDrawnNumbers.style.visibility = 'visible'
    modalDrawnNumbers.style.pointerEvents = 'all'

    if (checarJanelaFechada) clearInterval(checarJanelaFechada);

    checarJanelaFechada = setInterval(() => {
        if (novaJanela && novaJanela.closed) {
            clearInterval(checarJanelaFechada);
            resetarTudoPeloFechamento();
        }
    }, 500);

})

function resetarTudoPeloFechamento() {
    let buttonResetNumbers = document.getElementById('buttonResetNumbers');
    if (buttonResetNumbers) {
        
        buttonResetNumbers.click();
    }
}
