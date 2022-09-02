const { createServer } = require('http');
const next = require('next');
const { join } = require('path')
const { parse } = require('url')

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});


const routes = require('./routes');
const handler = routes.getRequestHandler(app);
const handle = app.getRequestHandler()
// app.prepare().then(()=>{
//     createServer(handler).listen(3000, err=>{
//         if(err) throw err;
//         console.log('app linked with routes');
//     });
// })

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    if (pathname === '/public/sw.js' || /public^\/(workbox|worker|fallback)-\w+\.js$/.test(pathname)) {
      const filePath = join(__dirname, '.next', pathname)
      app.serveStatic(req, res, filePath)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, () => {
    console.log(`> Ready on http://localhost:${3000}`)
  })
})




