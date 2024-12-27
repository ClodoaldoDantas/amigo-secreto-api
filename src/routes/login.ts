import bcrypt from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { Organizer } from '../models/organizer'

export async function login(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/login',
		{
			schema: {
				tags: ['auth'],
				body: z.object({
					email: z.string().email(),
					password: z.string().min(6),
				}),
				response: {
					200: z.object({
						user: z.object({
							id: z.string(),
							email: z.string(),
						}),
						token: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body

			const user = await Organizer.findOne({ email })

			if (!user) {
				return reply.status(400).send({ message: 'Invalid credentials' })
			}

			const passwordMatch = await bcrypt.compare(password, user.password)

			if (!passwordMatch) {
				return reply.status(400).send({ message: 'Invalid credentials' })
			}

			const token = app.jwt.sign({ id: user._id })

			return reply.status(200).send({
				user: {
					id: user._id.toString(),
					email: user.email,
				},
				token,
			})
		},
	)
}
