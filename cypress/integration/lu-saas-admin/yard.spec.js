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
  it("登录", function() {
    cy.visit('');
    cy.server();
    cy.route('post', /login/).as('login');
    cy.get("input[placeholder=请输入手机号]").type('15010601654', { force: true });
    cy.get("input[placeholder=密码]").type('abcd1234', { force: true });
    cy.contains("登录").click();
    cy.wait('@login');
  });
  it.skip('新建场地,选单体, 一条分成比例', function() {
    cy.server();
    cy.route('post', /yard\/add/).as('addYard');
    cy.route('get', /yard\/list/).as('getYardList');
    cy.visit('/#/configs/area/list');
    cy.contains(' 新建场地').click({ force: true });
    cy.get("form.el-form").contains('运营商').parent().find('input').click({force: true});
    cy.get('div[x-placement]').within(() => {
      cy.get('li.el-select-dropdown__item').eq(0).click();
    });
    let title = R.ctitle();
    Util.type('场地名称', title);
    Util.radio('类型', '单体');
    Util.address("省市区");
    Util.type('详细地址', R.county());
    Util.type('联系人', R.cname());
    Util.type('联系电话', '13322466923');
    Util.type('商圈', R.ctitle());
    share('分成比例1', '100', '50');
    cy.contains('保存').click();
    cy.wait('@addYard');
    cy.wait('@getYardList');
    cy.contains(title);
  });


  it.skip('新建场地, 选择单体，随机条数比例', function() {
    cy.server();
    cy.route('post', /yard\/add/).as('addYard');
    cy.route('get', /yard\/list/).as('getYardList');
    cy.visit('/#/configs/area/list');
    cy.contains(' 新建场地').click({ force: true });
    cy.get("form.el-form").contains('运营商').parent().find('input').click({force: true});
    cy.get('div[x-placement]').within(() => {
      cy.get('li.el-select-dropdown__item').eq(0).click();
    });
    let title = R.ctitle();
    Util.type('场地名称', title);
    Util.radio('类型', '单体');
    Util.address("省市区");
    Util.type('详细地址', R.county());
    Util.type('联系人', R.cname());
    Util.type('联系电话', '13322466923');
    Util.type('商圈', R.ctitle());
    let len = R.integer(1, 10);
    share('分成比例1', 10, 10);
    for(let i = 0; i < len; i++) {
      cy.get('span.plus-words').first().click();
      share('分成比例' + (i + 2), 100 * (i + 1), (50 + i));
    }
    cy.contains('保存').click();
    cy.wait('@addYard');
    cy.wait('@getYardList');
    cy.contains(title);
  });

  it('新建场地, 选择集团', function() {
    cy.server();
    cy.route('post', /yard\/add/).as('addYard');
    cy.route('get', /yard\/list/).as('getYardList');
    cy.visit('/#/configs/area/list');
  });

});