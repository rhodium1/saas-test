import Mock from 'mockjs';
import * as Util from '../utils';
const R = Mock.Random;
const $ = Cypress.$;
function RandomMachineCode() {
  return `M${R.integer(100000, 999999)}`;
}
function createMachineList() {
  const list = [], statis = {
    total_num: R.integer(0, 100),
    offline_num: R.integer(0, 100),
    online_num: R.integer(0, 100)
  }, len = R.integer(1, 20);
  for(let i = 0; i < len; i++) {
    list.push({
      machine_code: RandomMachineCode(),
      machine_title: R.ctitle(),
      yard_name: R.ctitle(),
      online_state: R.integer(1, 2),
      machine_state: R.integer(1, 3),
      surplus_paper: R.integer(0, 100),
      tenant_id: R.integer(0, 1000)
    })
  }
  return {
    list,
    statis
  };
}
context('设备管理', function() {
  it("登录", function() {
    cy.visit('');
    cy.server();
    cy.route('post', /login/).as('login');
    cy.get("input[placeholder=请输入手机号]").type('15010601654', { force: true });
    cy.get("input[placeholder=密码]").type('abcd1234', { force: true });
    cy.contains("登录").click();
    cy.wait('@login');
  });
  context('设备列表', function(){
    it('设备列表显示正确', function() {
      cy.server();
      const data = createMachineList();
      cy.route('get', /device\/list/, {
        code: 200,
        success: true,
        // data
      }).as('getList');
      cy.visit('/#/device/list/list');
      cy.wait('@getList');

    });
    it('点击未使用，展示未使用的机器', function() {
      cy.server();
      cy.route({
        method: "GET",
        url: /device\/list/,
        // response: {
        //   code: 200,
        //   success: true,
        //   data: createMachineList()
        // }
      }).as('getList');
      cy.visit('/#/device/list/list');
      cy.wait('@getList');
      cy.contains('未使用').click();
      cy.wait('@getList').then((xhr) => {
        console.log(xhr);
        expect(/machine_status=2/.test(xhr.url)).to.be.true;
      })
    });

    it('点击待验收，请求待验收的接口', function() {
      cy.server();
      cy.route({
        method: "GET",
        url: /device\/list/,
        response: {
          code: 200,
          success: true,
          data: createMachineList()
        }
      }).as('getList');
      cy.visit('/#/device/list/list');
      cy.wait('@getList');
      cy.contains('待验收').click();
      cy.wait('@getList').then((xhr) => {
        console.log(xhr);
        expect(/machine_status=3/.test(xhr.url)).to.be.true;
      })
    });

    it('待验收，点击验收，检查传递的参数', function() {
      cy.server();
      cy.route({
        method: "GET",
        url: /device\/list/,
        response: {
          code: 200,
          success: true,
          data: createMachineList()
        }
      }).as('getList');
      cy.route('get', /machine\/acceptance/).as('验收');
      cy.visit('/#/device/list/list');
      cy.wait('@getList');
      cy.contains('待验收').click();
      cy.wait('@getList');
      cy.get('table tr').eq(1).as('firstRow');
      let tenant_id, machine_code;
      cy.get('@firstRow').find('td').eq(1).find('div').then(($div) => {
        tenant_id = $div.text();
      });
      cy.get('@firstRow').find('td').eq(2).find('div').then(($div) => {
        machine_code = $div.text();
      });
      cy.get('td.el-table_3_column_27').contains('验收').click({force: true});
      cy.get('div.el-message-box').contains('确定').click();
      cy.wait('@验收').then(xhr => {
        let query = Util.getQuery(xhr.url);
        console.log(query);
        expect(query.machine_code).to.eq(machine_code);
        expect(query.tenant_id).to.eq(tenant_id);
        expect(query.type).to.eq('1');
      });
    });
  });
  context('机器状态', function() {
    it('显示正确', function() {
      cy.server();
      let statis = {
        total_num: R.integer(0, 100),
        online_num: R.integer(0, 100),
        offline_num: R.integer(0, 100),
        network_better_num: R.integer(0, 100),
        network_normal_num: R.integer(0, 100),
        network_weak_num: R.integer(0, 100)
      }, list = [], len = R.integer(1, 20);
      let networkStatus = ['信号正常', '信号弱', '信号差'];
      for(let i = 0; i < len; i++) {
        list.push({
          machine_code: RandomMachineCode(),
          machine_title: R.ctitle(),
          yard_title: R.ctitle(),
          online_state: R.integer(1, 2),
          network_type: R.ctitle(),
          network_status: networkStatus[R.integer(0, 2)],
          print_state: R.ctitle(),
          disk_state: R.integer(100,1000),
          tenant_id: R.integer(1, 1000)
        })
      }
      cy.route('get', /state\/list/).as('getList');
      cy.visit('/#/device/state');
      cy.wait('@getList')
    });
  });
})