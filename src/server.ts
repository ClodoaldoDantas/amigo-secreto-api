import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { connectDatabase } from './database'
import { createGroup } from './routes/create-group'
import { getGroups } from './routes/get-groups'
import { login } from './routes/login'
import { register } from './routes/register'

const app = fastify()
const port = 3333

/** Register plugins */
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET as string,
	sign: {
		expiresIn: '7d',
	},
})

/** Connect to database */
connectDatabase()

/** Register routes */
app.register(register)
app.register(login)
app.register(createGroup)
app.register(getGroups)

/** Start server */
app.listen({ port }).then(() => {
	console.log(`🔥 Server is running on port ${port}`)
})
