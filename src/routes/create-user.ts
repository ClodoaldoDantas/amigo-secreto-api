import bcrypt from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { User } from '../models/user'

export async function createUser(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/users',
		{
			schema: {
				body: z.object({
					email: z.string().email(),
					password: z.string().min(6),
				}),
				response: {
					201: z.object({
						message: z.string(),
					}),
					409: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body

			const userAlreadyExists = await User.findOne({ email }).exec()

			if (userAlreadyExists) {
				return reply.status(409).send({
					message: 'User already exists',
				})
			}

			const hashedPassword = await bcrypt.hash(password, 10)

			await User.create({
				email,
				password: hashedPassword,
			})

			return reply.status(201).send({
				message: 'User created successfully',
			})
		},
	)
}
