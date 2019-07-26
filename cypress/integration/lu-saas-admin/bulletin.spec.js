/// <reference types="Cypress" />
const Mock = require('mockjs');
const R = Mock.Random;
import * as Util from '../utils';
context.skip('登录', function(){
  it("登录", function() {
    cy.visit('');
    cy.server();
    cy.route('post', /login/).as('login');
    cy.get("input[placeholder=请输入手机号]").type('15010601654', { force: true });
    cy.get("input[placeholder=密码]").type('abcd1234', { force: true });
    cy.contains("登录").click();
    cy.wait('@login');
  });
})
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
    cy.wait('@publish').then(xhr => {
      let reqBody = xhr.requestBody;
      expect(reqBody).to.have.property('title', '提交后，返回公告列表');
      expect(reqBody).to.have.property('category', 1);
      expect(reqBody).to.have.property('tenant_id', '123,456,789');
      expect(reqBody).to.have.property('is_stick', 0);
      expect(reqBody).to.have.property('show_start_time');
      expect(reqBody).to.have.property('show_end_time');
    });
    cy.location().should((loc) => {
      expect(loc.hash).to.match(/bulletin\/list/);
    });
  })
  it('检查置顶', function() {
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
    cy.contains('公告内容').parent().find('input').type('检查是否置顶', { force: true });
    cy.contains('是否置顶').click();
    cy.contains('提交').click();
    cy.wait('@publish').then(xhr => {
      let reqBody = xhr.requestBody;
      expect(reqBody).to.have.property('is_stick', 1);
    })
    cy.location().should((loc) => {
      expect(loc.hash).to.match(/bulletin\/list/);
    });
    cy.get('#app > div > div.main-container > section > div > div > div.el-table.el-table--fit.el-table--striped.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody').find('tr').eq(0).contains('检查是否置顶');
  })
});

context("公告列表", function() {

  it.only("搜索", function() {
    cy.server();
    cy.route('get', /notice\/list/).as('search');
    cy.visit('/#/system/bulletin/list');
    cy.wait('@search');
    cy.get('input[placeholder=请输入公告内容]').type('公告', { force: true });
    cy.contains('搜索').click();
    cy.wait('@search').then(xhr => {
      let query = Util.getQuery(xhr.url);
      expect(query).to.have.property('search', '公告');
      expect(query).to.have.property('page', '1');
      expect(query).to.have.property('size', '20');
    });
  });
  it("删除公告", function() {
    cy.server();
    cy.route('get', /notice\/list/).as('search');
    cy.route('delete', /notice\/del/).as('delete');
    cy.visit('/#/system/bulletin/list');
    cy.get('#app > div > div.main-container > section > div > div > div.el-table.el-table--fit.el-table--striped.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(1)').contains('删除').click();
    cy.get('div.el-message-box__btns').contains('确定').click();
    cy.wait('@delete').then(xhr => {
      expect(xhr.requestBody).to.have.property('id');
    });
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