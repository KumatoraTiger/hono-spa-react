import Google from "@auth/core/providers/google"
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js"
import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'

type Env = {
  Bindings: {
    MY_VAR: string
    AUTH_SECRET: string
    AUTH_URL: string
    GOOGLE_ID: string
    GOOGLE_SECRET: string
  }
}

const app = new Hono<Env>()

app.use("*", initAuthConfig(c=>({
  secret: c.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: c.env.GOOGLE_ID,
      clientSecret: c.env.GOOGLE_SECRET
    }),
  ],
})))

app.use("/api/auth/*", authHandler())

app.use("/management/*", verifyAuth())

app.get('/api/clock', (c) => {
  return c.json({
    var: c.env.MY_VAR, // Cloudflare Bindings
    time: new Date().toLocaleTimeString()
  })
})

app.get('/management/*', (c) => {
  return c.html(
    renderToString(
      <html lang='ja'>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/management.js" />
          ) : (
            <script type="module" src="/src/management.tsx" />
          )}
        </head>
        <body>
          <div id="root" />
        </body>
      </html>
    )
  )
})

app.get('*', (c) => {
  return c.html(
    renderToString(
      <html lang='ja'>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js" />
          ) : (
            <script type="module" src="/src/client.tsx" />
          )}
        </head>
        <body>
          <div id="root" />
        </body>
      </html>
    )
  )
})

export default app