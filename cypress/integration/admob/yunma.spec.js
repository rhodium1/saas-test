/// <reference types="Cypress" />
const Mock = require('mockjs');
const R = Mock.Random;
describe.skip('登录', function() {
  it('登录', function() {
    cy.visit('https://api-dev.icjl.net/s/home/#/login')
    cy.get('input[placeholder=用户名或者手机号]').type('admin')
    cy.get('input[placeholder=登录密码]').type('Abba1234!')
    cy.get('button')
      .contains('登录')
      .click()
  })
})

describe('黑名单配置', function() {
  it('初始化', function() {
    cy.visit('https://admob-dev.icjl.net/admin/#/yunma')
    cy.server();
    cy.route('get', /getBlackList/)
    cy.contains('黑名单管理').click()
    
  })
})
