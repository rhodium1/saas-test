/// <reference types="Cypress" />
export function type(label, content){
  cy.contains(label).parent().find('input').type(content, { force: true });
};

export function radio(label, choice) {
  cy.contains(label).parent().contains(choice).click();
}

export function selectByName(label, choice) {
  cy.contains(label).parent().find('input').click({force: true});
  cy.get('div[x-placement]').within(() => {
    cy.contains(choice).click();
  });
}

export function selectByIndex(label, index) {
  cy.contains(label).parent().find('input').click({force: true});
  cy.get('div[x-placement]').within(() => {
    cy.get('li.el-select-dropdown__item').eq(index).click();
  })
}
export function date(label) {

}
export function dateRange(label) {

}
export function address(label) {
  cy.contains(label).parent().find('input').click({force: true});
  cy.get('div[x-placement]').within(() => {
    cy.contains('河北省').click();
    cy.contains('石家庄市').click();
    cy.contains('长安区').click();
  })
}

export function getQuery(url) {
  let re = /\?.+/, result = re.exec(url);
  if (result) {
    let text = result[0].slice(1), keyValue = text.split('&'), answer = {};
    keyValue.forEach(item => {
      let cur = item.split('=');
      answer[cur[0]] = cur[1];
    })
    return answer
  } else {
    return {};
  }

}