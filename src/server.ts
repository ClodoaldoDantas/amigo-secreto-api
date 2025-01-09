import { connectDatabase } from '@/database'
import { login } from '@/routes/auth/login'
import { register } from '@/routes/auth/register'
import { createGroup } from '@/routes/groups/create-group'
import { deleteGroup } from '@/routes/groups/delete-group'
import { getGroup } from '@/routes/groups/get-group'
import { getGroups } from '@/routes/groups/get-groups'
import { revealSecretFriend } from '@/routes/secret-friend/reveal-secret-friend'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'

const app = fastify()
const port = 3333

/** Register plugins */
app.register(fastifyCors, {
	origin: '*',
})

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
