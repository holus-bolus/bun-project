import { serve } from "bun"

let dataStore: { [key: string]: any } = {}

serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url)
    const method = req.method
    const id = url.pathname.split("/")[2]

    switch (method) {
      case "GET":
        if (id) {
          return new Response(JSON.stringify(dataStore[id] || {}), { status: 200 })
        }
        return new Response(JSON.stringify(dataStore), { status: 200 })

      case "POST":
        return req.json().then((body) => {
          const newId = crypto.randomUUID()
          dataStore[newId] = body
          return new Response(JSON.stringify({ id: newId }), { status: 201 })
        })

      case "PUT":
        return req.json().then((body) => {
          if (!dataStore[id]) {
            return new Response("Not found", { status: 404 })
          }
          dataStore[id] = body
          return new Response("Updated", { status: 200 })
        })

      case "DELETE":
        if (dataStore[id]) {
          delete dataStore[id]
          return new Response("Deleted", { status: 200 })
        }
        return new Response("Not found", { status: 404 })

      default:
        return new Response("Method not allowed", { status: 405 })
    }
  },
})
