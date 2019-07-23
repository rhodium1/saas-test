// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const env = config.env.env, urlMap = {
    saaslocal: 'http://localhost:1314',
    adminlocal: 'http://localhost:1315',
    adminqa: 'http://general-qa.icjl.net',
    saasqa: 'http://agent-qa.icjl.net'
  };
  config.baseUrl = urlMap[env];
  return config;
}
