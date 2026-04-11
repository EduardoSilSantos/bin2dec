let binaryValue = "";

const notifyUser = () => alert(`Digite somente 0's ou 1's`);

const init = () => {
    const inputField = document.getElementById('binary');
    inputField.addEventListener('input', (event) => {
        const current = event.data;

        if (current == null || current === '0' || current === '1') {
            binaryValue = inputField.value;
        } else {
            notifyUser();
            inputField.value = binaryValue;
        }
    });
    converter();
};
const converter = () => {
    const outputField = document.getElementById('decimal');
    const form = document.getElementById('formConverter');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        outputField.value = toDecimal(binaryValue);
    })

};
const toDecimal = (binary) => {
    let exp = 0;
    let result = 0;
    for (let i = binary.length - 1; i >= 0; i--) {
        if (binary[i] == 1) result += 2 ** exp;
        exp++;
    }
    return result;
}
// 👉 Se estiver no navegador, chama init automaticamente
if (typeof window !== 'undefined') window.addEventListener('DOMContentLoaded', init);
// 👉 Se estiver em Node (Jest), exporta para testes
if (typeof module !== 'undefined' && module.exports) module.exports = { notifyUser, init, toDecimal };