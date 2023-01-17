// Usage: node postinstall.js

const writeTo = './wwwroot/lib'
const files = {
  js: {
      'htmx.js':                 'https://unpkg.com/htmx.org@1/dist/htmx.js',
      'htmxclasses.js':          'https://unpkg.com/htmx.org@1/dist/ext/class-tools.js',
  },
  mjs: {
      'vue.mjs':                 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
      'servicestack-client.mjs': 'https://unpkg.com/@servicestack/client/dist/servicestack-client.mjs',
      'servicestack-vue.mjs':    'https://unpkg.com/@servicestack/vue@3/dist/servicestack-vue.mjs',
  },
  typings: {
      'vue/index.d.ts':                    'https://unpkg.com/vue@3/dist/vue.d.ts',
      '@vue/compiler-core.d.ts':           'https://unpkg.com/@vue/compiler-core@3/dist/compiler-core.d.ts',
      '@vue/compiler-dom.d.ts':            'https://unpkg.com/@vue/compiler-dom@3/dist/compiler-dom.d.ts',
      '@vue/runtime-dom.d.ts':             'https://unpkg.com/@vue/runtime-dom@3/dist/runtime-dom.d.ts',
      '@vue/runtime-core.d.ts':            'https://unpkg.com/@vue/runtime-core@3/dist/runtime-core.d.ts',
      '@vue/reactivity.d.ts':              'https://unpkg.com/@vue/reactivity@3/dist/reactivity.d.ts',
      '@vue/shared.d.ts':                  'https://unpkg.com/@vue/shared@3/dist/shared.d.ts',
      '@servicestack/client/index.d.ts':   'https://unpkg.com/@servicestack/client/dist/index.d.ts',  
      '@servicestack/vue/index.d.ts':      'https://unpkg.com/@servicestack/vue@3/dist/index.d.ts',
      '@servicestack/vue/components.d.ts': 'https://unpkg.com/@servicestack/vue@3/dist/components/index.d.ts',
      '@servicestack/ui/index.d.ts':       'https://unpkg.com/@servicestack/ui/shared.d.ts',
  }
}

const path = require('path')
const fs = require('fs')
const http = require('http')
const https = require('https')

Object.keys(files).forEach(dir => {
    const dirFiles = files[dir]
    Object.keys(dirFiles).forEach(name => {
        const url = dirFiles[name]
        const toFile = path.join(writeTo, dir, name)
        const toDir = path.dirname(toFile)
        if (!fs.existsSync(toDir)) {
            fs.mkdirSync(toDir, { recursive: true })
        }
        httpDownload(url, toFile, 5)
    })
})

function httpDownload(url, toFile, retries) {
    const client = url.startsWith('https') ? https : http
    const retry = (e) => {
        console.log(`get ${url} failed: ${e}${retries > 0 ? `, ${retries-1} retries remaining...` : ''}`)
        if (retries > 0) httpDownload(url, toFile, retries-1)
    }

    client.get(url, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
            let redirectTo = res.headers.location;
            if (redirectTo.startsWith('/'))
                redirectTo = new URL(res.headers.location, new URL(url).origin).href
            return httpDownload(redirectTo, toFile, retries)
        } else if (res.statusCode >= 400) {
            retry(`${res.statusCode} ${res.statusText || ''}`.trimEnd())
        }
        else {
            console.log(`writing ${url} to ${toFile}`)
            const file = fs.createWriteStream(toFile)
            res.pipe(file);
            file.on('finish', () => file.close())
        }
    }).on('error', retry)
}

/** Alternative implementation using fetch (requires node 18+) */
function fetchDownload(url, toFile, retries) {
    (async () => {
        for (let i=retries; i>=0; --i) {
            try {
                let r = await fetch(url)
                if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
                let txt = await r.text()
                console.log(`writing ${url} to ${toFile}`)
                fs.writeFileSync(toFile, txt)
                return
            } catch (e) {
                console.log(`get ${url} failed: ${e}${i > 0 ? `, ${i} retries remaining...` : ''}`)
            }
        }
    })()
}