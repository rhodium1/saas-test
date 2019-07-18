/// <reference types="Cypress" />
const Mock = require('mockjs');
const R = Mock.Random;
context('发布公告', function() {
  // beforeEach(function() {
  //   cy.visit('');
  //   cy.server();
  //   cy.route('post', /login/).as('loagin');
  //   cy.get("input[placeholder=请输入手机号]").type('13322466923', { force: true });
  //   cy.get("input[placeholder=密码]").type('abcd1234', { force: true });
  //   cy.contains("登录").click();
  //   cy.wait('@login');
  // });

  it("登录", function() {
    cy.visit('');
    cy.server();
    cy.route('post', /login/).as('login');
    cy.get("input[placeholder=请输入手机号]").type('13322466923', { force: true });
    cy.get("input[placeholder=密码]").type('abcd1234', { force: true });
    cy.contains("登录").click();
    cy.wait('@login');
  });

  it("发布公告, 默认选择全部运营商", function() {
    cy.visit('/#/system/bulletin/publish');
    cy.contains('全部运营商');
  });

  it("提交后，返回公告列表", function() {
    cy.server();
    cy.route('post', /notice\/pub/).as('publish');
    cy.visit('/#/system/bulletin/publish');
    //填写公告时长
    cy.contains('公示时长').parent().find('input').first().click();
    // cy.get('div[x-placement]').within(($pane)=> {
    //   $pane.find('td.available').first().click();
    //   $pane.find('td.available').last().click();
    //   cy.contains('确定').click();
    // });
    cy.get('div[x-placement]').find('td.available').first().click();
    cy.get('div[x-placement]').find('td.available').last().click();
    cy.get('div[x-placement]').get('.el-picker-panel__footer').contains('确定').click();
    cy.contains('公告内容').parent().find('input').type('提交后，返回公告列表', { force: true });
    cy.contains('提交').click();
    cy.wait('@publish');
    cy.location().should((loc) => {
      expect(loc.hash).to.match(/bulletin\/list/);
    })
  });

  it("账号id 填写测试", function() {
    cy.server();
    cy.route('post', /notice\/pub/).as('publish');
    cy.visit('/#/system/bulletin/publish');
    cy.contains('发布范围').parent().find('input').click();
    cy.get('div[x-placement]').find('li.el-select-dropdown__item').last().click();
    cy.contains('账号id').parent().find('input').type("123,456,789", { force: true });
    cy.contains('公示时长').parent().find('input').first().click();
    // cy.get('div[x-placement]').within(($pane)=> {
    //   $pane.find('td.available').first().click();
    //   $pane.find('td.available').last().click();
    //   cy.contains('确定').click();
    // });
    cy.get('div[x-placement]').find('td.available').first().click();
    cy.get('div[x-placement]').find('td.available').last().click();
    cy.get('div[x-placement]').get('.el-picker-panel__footer').contains('确定').click();
    cy.contains('公告内容').parent().find('input').type('提交后，返回公告列表', { force: true });
    cy.contains('提交').click();
    cy.wait('@publish');
    cy.location().should((loc) => {
      expect(loc.hash).to.match(/bulletin\/list/);
    });
  })
});

context("公告列表", function() {

  it("搜索", function() {
    cy.server();
    cy.route('get', /notice\/list/).as('search');
    cy.visit('/#/system/bulletin/list');
    cy.get('input[placeholder=请输入公告内容]').type('公告', { force: true });
    cy.contains('搜索').click();
    cy.wait('@search');
  });
  it("删除公告", function() {

  });
  it('编辑公告后, 列表内容发生变化', function() {
    cy.visit('/#/system/bulletin/list');
    cy.server();
    cy.route('get', /notice\/detail/).as('getDetail');
    cy.route('put', /notice\/edit/).as('edit');
    cy.contains('编辑').click();
    cy.wait('@getDetail');
    const title = R.ctitle();
    cy.get('.el-dialog__body').contains('公告内容').parent().find('input').type(title, { force: true });
    cy.get('.el-dialog__body').contains('提交').click({force: true});
    cy.wait('@edit');
    cy.contains(title);
  });
});