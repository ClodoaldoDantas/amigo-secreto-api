import { Organizer } from '@/models/organizer'
import bcrypt from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function register(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/register',
		{
			schema: {
				tags: ['auth'],
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

			const userAlreadyExists = await Organizer.findOne({ email }).exec()

			if (userAlreadyExists) {
				return reply.status(409).send({
					message: 'User already exists',
				})
			}

			const hashedPassword = await bcrypt.hash(password, 10)

			await Organizer.create({
				email,
				password: hashedPassword,
			})

			return reply.status(201).send({
				message: 'User created successfully',
			})
		},
	)
}
