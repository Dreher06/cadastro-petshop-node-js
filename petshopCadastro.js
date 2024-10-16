const readline = require("node:readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Inicializção das variáveis
let idinicial = 0;
const petsCadastro = []; // Array para armazenar os pets cadastrados(id, nome, tipo, data)

// Função para exibir o menu
function abrirMenu() {
    console.log("\nMenu Principal:");
    rl.question(`O que você deseja fazer?\n\n a- Cadastrar pet\n b- Visualizar os pets\n c- Excluir pet\n d- Sair\nEscolha uma opção: `, (opcao) => {
        switch (opcao.toLowerCase()) {
            case "a":
                abrirCadastro();
                break;
            case "b":
                visualizarPet();
                break;
            case "c":
                menuDeExclusao();
                break;
            case "d":
                rl.close();
                break;
            default:
                console.log("Opção inválida! Tente novamente.");
                abrirMenu();
        }
    });
}

// Função para cadastrar um novo pet
function abrirCadastro() {
    // Validação do pet

    rl.question("Insira o nome do seu pet: ", (nomepet) => {
        if (nomepet.trim() === "") {
            console.log("Nome do pet não pode estar vazio!");
            return abrirCadastro();
        }

        const nomeExistente = petsCadastro.some(pet => pet.nome.toLowerCase() === nomepet.toLowerCase());
        if (nomeExistente) {
            console.log(`Já existe um pet com o nome "${nomepet}". Tente outro nome.`);
            return abrirMenu();
        }
        // É realizada a verificação da data usando a função(validaData)
        rl.question("Insira o tipo do seu pet: ", (tipopet) => {
            rl.question('Insira a data de nascimento do seu pet (aaaa-mm-dd): ', (datapet) => {
                if (!validarData(datapet)) {
                    console.log("Data inválida! Use o formato 'aaaa-mm-dd'.");
                    return abrirCadastro();
                }

                idinicial++;
                const pet = {
                    id: idinicial,
                    nome: nomepet,
                    tipo: tipopet,
                    data: datapet
                };

                petsCadastro.push(pet);
                console.log(`Pet ${nomepet} cadastrado com sucesso!\n`);
                abrirMenu();
            });
        });
    });
}

// Função para validar a data de nascimento
function validarData(data) {
    const regexData = /^\d{4}-\d{2}-\d{2}$/; 
    if (!data.match(regexData)) return false; 

    const [ano, mes, dia] = data.split('-').map(Number);
    if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return false;  // Simplifica a validação

    return true;
}

// Função para visualizar pets
function visualizarPet() {
    rl.question(`Você deseja filtrar por:\n 1- Todos os pets\n 2- Pets específicos\nEscolha uma opção: `, (filtro) => {
        switch (filtro) {
            case "1":
                exibirPet(petsCadastro);
                abrirMenu();
                break;
            case "2":
                rl.question("Qual tipo específico de pet você deseja filtrar? ", (tipo) => {
                    const filtroPet = petsCadastro.filter(pet => pet.tipo.toLowerCase() === tipo.toLowerCase());
                    if (filtroPet.length > 0) {
                        exibirPet(filtroPet);
                    } else {
                        console.log(`Nenhum pet do tipo "${tipo}" encontrado.`);
                    }
                    abrirMenu();
                });
                break;
            default:
                console.log("Opção inválida! Tente novamente.");
                visualizarPet();
        }
    });
}

// Função para exibir pets
function exibirPet(listaDePets) {
    if (listaDePets.length === 0) {
        console.log("Nenhum pet cadastrado.");
    } else {
        listaDePets.forEach(pet => {
            const idade = calcularIdade(pet.data);
            console.log(`ID: ${pet.id}, Nome: ${pet.nome}, Tipo: ${pet.tipo}, Idade: ${idade} anos`);
        });
    }
}

// Função para calcular a idade do pet
function calcularIdade(dataNascimento) {
    const [anoNasc, mesNasc, diaNasc] = dataNascimento.split('-').map(Number);
    const hoje = new Date();
    let idade = hoje.getFullYear() - anoNasc;

    // Verifica se ainda não fez aniversário no ano atual
    if (hoje.getMonth() + 1 < mesNasc || (hoje.getMonth() + 1 === mesNasc && hoje.getDate() < diaNasc)) {
        idade--;
    }

    return idade;
}

// Função para excluir pet por ID
function excluirPetId(id) {
    const index = petsCadastro.findIndex(pet => pet.id === id);
    if (index !== -1) {
        const nomePetExcluido = petsCadastro[index].nome;
        petsCadastro.splice(index, 1);
        console.log(`Pet ${nomePetExcluido} excluído com sucesso.`);
    } else {
        console.log(`Não foi encontrado um pet com o ID ${id}.`);
    }
}

// Função de exclusão com validação
function menuDeExclusao() {
    if (petsCadastro.length === 0) {
        console.log("Nenhum pet cadastrado para excluir.");
        return abrirMenu();
    }

    rl.question("Digite o ID do pet que você deseja excluir ou digite 'd' para voltar: ", (resposta) => {
        if (resposta.toLowerCase() === "d") {
            abrirMenu();
        } else {
            const id = parseInt(resposta);
            if (!isNaN(id)) {
                excluirPetId(id);
            } else {
                console.log("ID inválido! Digite um ID válido.");
            }
            abrirMenu();
        }
    });
}

// Inicia o programa
abrirMenu();