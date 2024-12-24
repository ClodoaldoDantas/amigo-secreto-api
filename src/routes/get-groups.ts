import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyJwt } from '../middlewares/verify-jwt'
import { Group } from '../models/group'

export async function getGroups(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/groups',
		{
			onRequest: [verifyJwt],
			schema: {
				response: {
					200: z.object({
						groups: z.array(
							z.object({
								_id: z.any(),
								name: z.string(),
								createdAt: z.date(),
							}),
						),
					}),
				},
			},
		},
		async (request, reply) => {
			const user = request.user
			const groups = await Group.find({ organizer: user.id })
				.select('-participants -organizer')
				.exec()

			return reply.send({ groups })
		},
	)
}
