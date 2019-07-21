context('dmeo', function() {
  it('and', function() {
    cy.visit('/#/configs/area/list');
    cy.contains('登录').should('have.css', 'display').and('match', /inline/)
  })
})