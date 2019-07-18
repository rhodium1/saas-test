/// <reference types="Cypress" />
context("test", () => {
  // before(function() {
  //   cy.visit('');
  //   cy.server();
  //   cy.get("input[placeholder=请输入手机号]").type("13922222224", {
  //     force: true
  //   });
  //   cy.get("input[placeholder=密码]").type("123456", {force: true});
  //   cy.route('post', /login/).as('login');
  //   cy.contains('登录').click();
  //   cy.wait('@login');

  // });
  it('overview', () => {
    // cy.visit();
    cy.visit('');
    cy.server();
    cy.get("input[placeholder=请输入手机号]").type("13922222224", {
      force: true
    });
    cy.get("input[placeholder=密码]").type("abcd1234", {force: true});
    cy.route('post', /login/).as('login');
    cy.contains('登录').click();
    cy.wait('@login');
    cy.contains('查看更多');
  });

  it('goto overview', () => {
    cy.visit('/#/operation/device/board');
    cy.contains('123');
  })
})