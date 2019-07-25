import Mock from 'mockjs';
import * as Util from '../utils';
import moment from 'moment';
const R = Mock.Random;
const $ = Cypress.$;
context('登录', function() {
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
context('结算管理', function() {
  context.skip('结算账号列表', function() {
    beforeEach(function() {
      cy.server();
      cy.route('get', /settlement\/account\/list/).as('getList');
      cy.visit('/#/finance/manage/list');
    });
    it.skip('初次加载时传递参数正确，并且显示正确', function() {
      cy.wait('@getList').then(xhr => {
        let query = Util.getQuery(xhr.url);
        expect(query.page).to.eq('1');
        expect(query.size).to.eq('15');
        expect(query.type).to.eq('0');
        expect(query.search).eq('');
      });
    }); 
    it.skip('搜索参数传递正确', function() {
      cy.wait('@getList');
      cy.get('div.el-select').find('input').click();
      let typeIndex = R.integer(0, 2), text = R.ctitle();
      cy.get('div[x-placement]').find('li').eq(typeIndex).click();
      cy.get('input[placeholder=请输入主体名称]').type(text, {force: true});
      cy.contains('搜索').click();
      cy.wait('@getList').then(xhr => {
        let query = Util.getQuery(xhr.url);
        expect(query.page).to.eq('1');
        expect(query.size).to.eq('15');
        expect(query.type).to.eq(`${typeIndex}`);
        expect(query.search).eq(text);
      })
    });
    it.skip('分页正确', function() {
      
    });
    it('点击结算账户详情，请求接口正确，显示正确', function() {
      cy.wait('@getList');
      cy.route('get', /account\/detail/).as('getAccount');
      cy.contains('结算账户详情').click({force: true});
      let kvMap = {
        开户名称: '',
        开户银行: '',
        开户银行城市: '',
        开户支行: '',
        银行账号: ''
      }
      cy.wait('@getAccount').then(xhr => {
        console.log(xhr);
        let res = xhr.responseBody.data;
        kvMap['开户名称'] = res['open_account_name'];
        kvMap['开户银行'] = res['open_account_bank'];
        kvMap['开户银行城市'] = res['open_account_city'];
        kvMap['开户支行'] = res['open_account_subbranch'];
        kvMap['银行账号'] = res['bank_account'];
      });
      Object.keys(kvMap).forEach(key => {
        if(kvMap[key])
          cy.contains(key).parent().contains(kvMap[key]);
      })
    });
  });
  context('费用结算', function() {
    it('费用结算, 显示正确', function() {
      cy.server();
      let mockData = {
        success: true,
        code: 200,
        data: {
          statis: {
            machine_total: R.integer(0, 1000),
            order_total: R.integer(0, 100),
            refund_money: R.integer(0, 100),
            net_income: R.integer(0, 100),
            place_net_income: R.integer(0, 100),
            place_service_fee: R.integer(0, 100)
          },
          list: []
        }
      };
      let listMock = {
        success: true,
        code: 200,
        data: {
          num: 10,
          list: []
        }
      };
      let types = ['租赁', '购买'], states = ['待结算', '已结算'];
      for(let i = 0; i < 5; i++) {
        listMock.data.list.push({
          tenant_name: R.cname(),
          type: R.cname(),
          model: types[R.integer(0, 1)],
          sign_time: R.date('yyyy-MM-dd'),
          order_money: R.integer(0, 1000),
          refund_money: R.integer(0, 1000),
          settlement_state: R.integer(1,2),
          tenant_net_income: R.integer(0, 1000),
          tenant_service_fee: R.integer(0, 1000),
          machine_total: R.integer(0, 1000)
        })
      }
      cy.route('get', /settlement\/list/, mockData).as('getStatis');
      cy.route('get', /general\/v1\/settlement\/tenant_summary/).as('getList');
      cy.visit('/#/finance/manage/fee');
      cy.wait('@getStatis').then(xhr => {
        let query = Util.getQuery(xhr.url);
        expect(query.month).eq(moment().format('YYYYMM'));
      })
      cy.wait('@getList').then(xhr => {
        let query = Util.getQuery(xhr.url);
        expect(query.settlement_state).to.eq('0');
        expect(query.tenant_name).to.eq('');
        expect(query.month).to.eq(moment().format('YYYYMM'))
      });
    });
    it('', function() {

    });
  });
  it.skip('显示正确', function() {
    cy.server();
    cy.route('get', /settlement\/account\/list/).as('getList');
    cy.visit('/#/finance/manage/list');
    cy.wait('@getList');
  });
  it.skip('账户详情，字段带入正确', function() {
    cy.server();
    cy.route('get', /settlement\/account\/list/).as('getList');
    let bank_account = R.ctitle(), open_account_bank = R.ctitle(), open_account_city = R.ctitle(), open_account_name = R.ctitle(), open_account_subbranch = R.ctitle();
    let mockData = {
      success: true,
      code: 200,
      data: {
        bank_account,
        open_account_bank,
        open_account_city,
        open_account_name,
        open_account_subbranch 
      }
    };
    cy.route('get', /settlement\/account\/detail/, mockData).as('getDetail');
    cy.visit('/#/finance/manage/list');
    cy.wait('@getList');
    cy.contains('结算账户详情').click({force: true});
    cy.wait('@getDetail');
    cy.contains('开户名称').parent().find('input').then(el => {
      expect($(el).val()).to.eq(open_account_name);
    });
    cy.contains('开户银行').parent().find('input').then(el => {
      expect($(el).val()).to.eq(open_account_bank);
    });
    cy.contains('开户银行城市').parent().find('input').then(el => {
      expect($(el).val()).to.eq(open_account_city);
    });
    cy.contains('开户支行').parent().find('input').then(el => {
      expect($(el).val()).to.eq(open_account_subbranch);
    });
    cy.contains('银行账号').parent().find('input').then(el => {
      expect($(el).val()).to.eq(bank_account);
    });
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
  context.skip('支付代收', function(){
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
  context('运营商结算', function() {
    it.skip('初次加载时接口请求正确', function() {
      cy.server();
      cy.route('get', /tenant\/settle/).as('getList');
      cy.visit('/#/finance/checking/balance');
      cy.wait('@getList').then(xhr => {
        console.log(xhr);
        let query = Util.getQuery(xhr.url);
        expect(query.type).to.eq('0');
        expect(query.page).to.eq('1');
        expect(query.size).to.eq('15');
      });
    });
    it.skip('进行搜索时，检查参数是否正确', function() {
      cy.server();
      cy.route('get', /tenant\/settle/).as('getList');
      cy.get('div.el-select').find('input').click();
      let index = R.integer(0, 2), name = R.cname();
      cy.get('div[x-placement]').find('li').eq(index).click();
      cy.get('input[placeholder=请输入主体名称]').type(name, { force: true });
      cy.contains('搜索').click();
      cy.wait('@getList').then(xhr => {
        console.log(xhr);
        let query = Util.getQuery(xhr.url);
        expect(query.type).to.eq(`${index}`);
        expect(query.search).to.eq(name);
        expect(query.page).to.eq('1');
        expect(query.size).to.eq('15');
      });
    });
    it.skip('导出excel', function() {
      cy.server();
      cy.route('get', /tenant\/settle/).as('getList');
      cy.route('get',/export\/tenant_excel/).as('exportExcel')
      cy.visit('/#/finance/checking/balance');
      cy.wait('@getList');
      cy.contains('导出excel').click();
      cy.wait('@exportExcel');
    });
  });
  context.skip('运营商结算记录', function() {
    it('显示正确', function() {
      cy.server();
      let mockData = {
        success: true,
        code: 200,
        data: {
          num: R.integer(1, 1000),
          list: []
        }
      };
      for(let i = 0; i < 15; i++) {
        mockData.data.list.push({
          settlement_time: R.date('yyyy-mm-dd'),
          settlement_money: R.float(0, 1000, 2, 2),
          gathering_account: {
            bank: R.ctitle(),
            bank_account: R.increment(1000, 10000),
            payee: R.cname()
          },
          settlement_state: R.cname()
        });
      }
      cy.route('get', /tenant\/settle\?/).as('getList')
      cy.route('get', /tenant\/settle\/log/, mockData).as('getLogList');
      cy.visit('/#/finance/checking/balance');
      cy.wait('@getList')
      cy.contains('结算记录').click({force: true});
      cy.wait('@getLogList');
    })
  });
})