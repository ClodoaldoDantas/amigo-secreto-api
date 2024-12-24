import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyJwt } from '../middlewares/verify-jwt'
import { Group } from '../models/group'

export async function getGroup(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/groups/:id',
		{
			onRequest: [verifyJwt],
			schema: {
				params: z.object({
					id: z.string(),
				}),
				response: {
					200: z.object({
						group: z.object({
							_id: z.any(),
							name: z.string(),
							participants: z.array(
								z.object({
									_id: z.any(),
									name: z.string(),
								}),
							),
						}),
					}),
					404: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params

			const group = await Group.findById(id).select('-organizer').exec()

			if (!group) {
				return reply.status(404).send({
					message: 'Group not found',
				})
			}

			return reply.send({ group })
		},
	)
}
