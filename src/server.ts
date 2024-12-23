import fastify from 'fastify'
import { connectDatabase } from './database'

const app = fastify()
const port = 3333

connectDatabase()

app.listen({ port }).then(() => {
	console.log(`🔥 Server is running on port ${port}`)
})
