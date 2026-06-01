const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

let html = fs.readFileSync('/home/leif/.openclaw/workspace/dashboard-vanilla/index.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (...args) => {
  console.error("DOM ERROR:", ...args);
});
virtualConsole.on("log", (...args) => {
  console.log("DOM LOG:", ...args);
});

const dom = new JSDOM(html, { 
    runScripts: "dangerously",
    resources: "usable",
    virtualConsole,
    url: "http://localhost:8081/"
});

dom.window.fetch = async (url) => {
    console.log("Mock fetching:", url);
    if(url === 'data.json') {
        return {
            json: async () => JSON.parse(fs.readFileSync('/home/leif/.openclaw/workspace/dashboard-vanilla/data.json', 'utf8'))
        }
    }
    return { json: async () => ({}) };
};

setTimeout(() => {
    console.log(dom.window.document.body.innerHTML);
}, 2000);
