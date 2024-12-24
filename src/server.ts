import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { connectDatabase } from './database'
import { createUser } from './routes/create-user'

const app = fastify()
const port = 3333

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

/** Connect to database */
connectDatabase()

/** Register routes */
app.register(createUser)

/** Start server */
app.listen({ port }).then(() => {
	console.log(`🔥 Server is running on port ${port}`)
})
