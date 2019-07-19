/// <reference types="Cypress" />
export function type(label, content){
  cy.contains(label).parent().find('input').type(content, { force: true });
};

export function radio(label, choice) {
  cy.contains(label).parent().contains(choice).click();
}

export function select(label, choice) {

}
export function date(label) {

}
export function dateRange(label) {

}
export function address(label) {
  cy.contains(label).parent().find('input').click({force: true});
  cy.get('div[x-placement]').within(() => {
    cy.contains('北京市').click();
    cy.contains('市辖区').click();
    cy.contains('东城区').click();
  })
}