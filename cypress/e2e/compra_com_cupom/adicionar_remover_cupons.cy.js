/// <reference types="cypress" />

describe('Adicionar / remover um cupom de desconto no carrinho', () => {

    const cupomFrete = "FRETEGRATIS";

    const cupomValorFixo = "30REAIS";

    beforeEach(() => {
        cy.visit('https://qastoredesafio.lojaintegrada.com.br/carrinho/produto/118475035/adicionar');
    });

    it('Exibir o campo "Cupom de desconto"', () => {
        // Verifica se o campo de cupom de desconto é exibido no carrinho
        cy.validaCampoCupom();
    });

    it('Adicionar um cupom válido', () => {
        // Testa se é possível adicionar um cupom válido

        cy.adicionaCupom(cupomFrete);

        cy.validaTagCupom(cupomFrete, "Frete Grátis");
        // Valida se o cupom foi aplicado corretamente
    });

    it('Adicionar um cupom que NÃO existe', () => {

        cy.adicionaCupom("GRATIS");
        // Tenta adicionar um cupom que não existe

        cy.get(".cupom-sucesso b")
            .should("not.exist");

        cy.get(".cupom-sucesso span")
            .should("not.exist");
        // Confirma que a mensagem de sucesso não aparece

        cy.get(".alert")
            .should("exist")
            .should("contain", "Cupom não encontrado.");
        // Confirma a mensagem "Cupom não encontrado"

        cy.get('#usarCupom')
            .should("exist")
            .should("have.value", "");
        // Verifica que o campo do cupom existe mas está vazio
    });

    it('Adicionar um cupom vencido', () => {

        cy.adicionaCupom("CUPOMVENCIDO");
        // Tenta adicionar um cupom vencido

        cy.get(".cupom-sucesso b")
            .should("not.exist");

        cy.get(".cupom-sucesso span")
            .should("not.exist");
        // Confirma que a mensagem de sucesso não aparece

        cy.get(".alert")
            .should("exist")
            .should("contain", "O cupom não é válido.");
        // Valida a mensagem de erro

        cy.get('#usarCupom')
            .should("exist")
            .should("have.value", "");
        // Garante que o campo do cupom está vazio
    });

    it('Adicionar cupom de valor fixo', () => {

        cy.adicionaCupom(cupomValorFixo);
        // Adiciona o cupom de desconto com valor fixo

        cy.validaTagCupom(cupomValorFixo, "R$ 30,00");
        // Valida se o cupom foi aplicado corretamente

        let valorSubtotal;
        let valorTotal;

        cy.get(".subtotal strong").should("have.attr", "data-subtotal-valor");

        cy.get(".subtotal strong").invoke("attr", "data-subtotal-valor").then(value => { 
            valorSubtotal = Number(value.replace(",", "."))
        });
        // Armazena o valor do subtotal como número

        cy.get(".total strong").should("have.attr", "data-total-valor");

        cy.get(".total strong").invoke("attr", "data-total-valor").then(value => { 
            valorTotal = Number(value.replace(",", "."));
            expect(valorTotal).to.be.equal(valorSubtotal - 30);
            // Verifica se o total é igual ao subtotal menos o valor do cupom
        });     
    });

    it('Remover o cupom do carrinho', () => {
        // Testa a funcionalidade de remover um cupom do carrinho

        cy.adicionaCupom(cupomValorFixo);
        // Adiciona o cupom de desconto

        cy.get("[title='Remover cupom']").click();
        // Clica no botão para remover o cupom

        cy.get(".cupom-sucesso b")
            .should("not.exist");
        // Verifica que a tag de sucesso do cupom foi removida

        cy.get(".cupom-sucesso span")
            .should("not.exist");

        cy.get(".cupom-valor")
            .should("not.exist");
        // Verifica que o valor do cupom não é mais exibido

        cy.validaCampoCupom();
        // Valida que o campo de cupom está novamente disponível

        let valorSubtotal;
        let valorTotal;

        cy.get(".subtotal strong").should("have.attr", "data-subtotal-valor");
        cy.get(".subtotal strong").invoke("attr", "data-subtotal-valor").then(value => { 
            valorSubtotal = Number(value.replace(",", "."))
        });
        // Armazena o valor do subtotal como número

        cy.get(".total strong").should("have.attr", "data-total-valor");
        cy.get(".total strong").invoke("attr", "data-total-valor").then(value => {
            valorTotal = Number(value.replace(",", "."));
            expect(valorTotal).to.be.equal(valorSubtotal);
            // Verifica que o total voltou a ser igual ao subtotal
        });    
    });

});
