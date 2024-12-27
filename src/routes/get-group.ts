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
				tags: ['groups'],
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
					401: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params

			const group = await Group.findById(id).exec()

			if (!group) {
				return reply.status(404).send({
					message: 'Group not found',
				})
			}

			if (group.organizer?.toString() !== request.user.id) {
				return reply.status(401).send({
					message: 'You are not the organizer of this group',
				})
			}

			return reply.send({ group })
		},
	)
}
