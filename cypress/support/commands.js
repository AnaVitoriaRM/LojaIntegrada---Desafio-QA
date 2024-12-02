Cypress.Commands.add('validaCampoCupom', () => {
    cy.get('[for=usarCupom]')
        .should("exist")
        .should("contain", "Cupom de desconto:");

    cy.get('#usarCupom')
        .should("exist")
        .should("contain", "");

    cy.get('#usarCupom').siblings('button')
        .should("exist")
        .should("contain", "Usar cupom");
});

Cypress.Commands.add('adicionaCupom', (codigoCupom) => {
    cy.get('#usarCupom').type(codigoCupom);
    cy.get('#usarCupom').siblings('button').click().wait(1000);    
});

Cypress.Commands.add('validaTagCupom', (codigoCupom, valorCupom) => {
    cy.get('[for=usarCupom]')
        .should("not.exist");

    cy.get('#usarCupom')
        .should("not.exist");

    cy.get(".cupom-sucesso b")
        .should("exist")
        .should("contain", "Cupom de desconto:");

    cy.get(".cupom-sucesso span")
        .should("exist")
        .should("contain", codigoCupom);

    cy.get("[title='Remover cupom']")
        .should("exist");

    cy.get(".cupom-valor")
        .should("exist")
        .should("contain", valorCupom);
});

Cypress.Commands.add('adicionaFrete', (cep) => {
    cy.get('#calcularFrete').type(cep);
    cy.get('#calcularFrete').siblings('button').click().wait(3000);
});

Cypress.Commands.add('irParaCheckout', () => {
    cy.get('.botao.principal.grande').click().wait(1000);

    cy.get('#id_email_login').type("teste@gmail.com");
    cy.get('.submit-email.botao.principal.grande').click();

    cy.get('#id_senha_login').type("penguino");
    cy.get('#id_botao_login').click();
});