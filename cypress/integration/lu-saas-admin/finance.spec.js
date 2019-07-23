import Mock from 'mockjs';
import * as Util from '../utils';
const R = Mock.Random;
const $ = Cypress.$;
context.skip('登录', function() {
  it('登录', function() {
    cy.visit('');
    cy.server();
    cy.route('post', /login/).as('login');
    cy.get("input[placeholder=请输入手机号]").type('15010601654', { force: true });
    cy.get("input[placeholder=密码]").type('abcd1234', { force: true });
    cy.contains("登录").click();
    cy.wait('@login');
  });
});
context('资金对账', function() {
  context.skip('账户总览', function() {
    it('显示正确', function() {
      cy.server();
      cy.route('get', /account\/pandect/).as('getPandect');
      cy.visit('/#/finance/checking/overview');
      let money, share;
      cy.wait('@getPandect').then(xhr => {
        console.log(xhr);
        expect(/account\/pandect/.test(xhr.url)).to.be.true;
        let query = Util.getQuery(xhr.url), resData = xhr.responseBody.data;
        expect(query.page).to.eq('1');
        expect(query.size).to.eq('20');
        money = resData.statis['account_balance'];
        share = resData.statis['divide_summary'];
      });
      cy.get('div.blue-data-container').eq(0).find('p').eq(0).then((el) => {
        let text = $(el).text();
        expect(`￥${money.toFixed(2)}`).to.eq(text);
      })
      cy.get('div.blue-data-container').eq(1).find('p').eq(0).then(el => {
        let text = $(el).text();
        expect(`￥${share.toFixed(2)}`).to.eq(text);
      });

    });
  })
  context('支付代收', function(){
    it.skip('页面正常显示', function() {
      cy.server();
      cy.route('get', /payment\/collection/).as('getList');
      cy.visit('/#/finance/checking/payment');
      cy.wait('@getList');
    });
    it('检查请求的参数', function() {
      cy.server();
      cy.route('get', /payment\/collection/).as('getList');
      cy.visit('/#/finance/checking/payment');
      cy.wait('@getList');
      //选择订单类型
      cy.get('input[placeholder=请选择订单类型]').click();
      let payTypes = ['全部', '尬舞', '2元店', '', '现场拍照', '手机照片'], payTypeIndex = R.integer(-1, 4);
      if(payTypeIndex === 2) payTypeIndex = 3;
      cy.get('div[x-placement]').find('li').contains(payTypes[payTypeIndex + 1]).click();

      //选择支付方式
      let pays = ['WxAppletPay', 'AliAppPay'], index = R.integer(0, 1);
      cy.get('input[placeholder=请选择支付方式]').click();
      cy.get('div[x-placement]').eq(1).find('li').eq(index).click();
    
      //输入订单号
      const title = R.ctitle();
      cy.get('input[placeholder=请输入订单号]').type(title, { force: true });
      cy.contains('搜索').click();

      cy.wait('@getList').then(xhr => {
        console.log(xhr);
        let query = Util.getQuery(xhr.url);  
        expect(query['order_type']).to.eq(`${payTypeIndex}`);
        expect(query['pay_type']).to.eq(`${pays[index]}`);
        expect(query['search']).to.eq(title);
      });
    });
  });
})