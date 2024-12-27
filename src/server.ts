import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { connectDatabase } from './database'
import { createGroup } from './routes/create-group'
import { deleteGroup } from './routes/delete-group'
import { getGroup } from './routes/get-group'
import { getGroups } from './routes/get-groups'
import { login } from './routes/login'
import { register } from './routes/register'
import { revealSecretFriend } from './routes/reveal-secret-friend'

const app = fastify()
const port = 3333

/** Register plugins */
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Secret Friend API',
			description: 'API for the Secret Friend application',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

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
app.register(getGroup)
app.register(deleteGroup)
app.register(revealSecretFriend)

/** Start server */
app.listen({ port }).then(() => {
	console.log(`🔥 Server is running on port ${port}`)
})
