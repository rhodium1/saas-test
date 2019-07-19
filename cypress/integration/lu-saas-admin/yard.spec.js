const Mock = require('mockjs');
const R = Mock.Random;
import * as Util from '../utils';
/**
 * @description: 分成比例填写
 * @param {string} label 
 * @param {string} money 
 * @param {string} percent 
 * @return: 
 */
function share(label, money, percent) {
  let inputs = cy.contains(label).parent().find('input').as('inputs');
  cy.get('@inputs').eq(1).type(money, {force: true});
  cy.get('@inputs').eq(2).type(percent, {force: true});
}
context("场地管理", function() {

  it.skip("登录", function() {
    cy.visit('');
    cy.server();
    cy.route('post', /login/).as('login');
    cy.get("input[placeholder=请输入手机号]").type('13322466923', { force: true });
    cy.get("input[placeholder=密码]").type('abcd1234', { force: true });
    cy.contains("登录").click();
    cy.wait('@login');
  });
  it('新建场地,选单体, 一条分成比例', function() {
    cy.server();
    cy.route('post', /yard\/add/).as('addYard');
    cy.visit('/#/configs/area/list');
    cy.contains(' 新建场地').click({ force: true });
    let title = R.ctitle();
    Util.type('场地名称', title);
    Util.radio('类型', '单体');
    Util.address("省市区");
    Util.type('详细地址', R.county());
    Util.type('联系人', R.cname());
    Util.type('联系电话', '13322466923');
    share('分成比例1', '100', '50%');
    cy.contains('保存').click();
  });
  it('新建场地, 选择单体，随机比例', function() {
    cy.get('div');
  });

  it('新建场地, 选择集团', function() {

  });

});