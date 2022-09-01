const routes = require('next-routes')();

// only add dynamic routes here

// new -> new added because slug is redirecting to show always
routes
    .add('/teams/new', '/teams/new')
    .add('/','/index')
    .add('/teams/:address', '/teams/show')
    .add('/teams/:address/members','/teams/members/members')
    .add('/campaigns/:address/requests/new','/campaigns/requests/new');

module.exports = routes;



