import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyJwt } from '../middlewares/verify-jwt'
import { Group } from '../models/group'

export async function revealSecretFriend(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/secret-friend/:participantId',
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ['reveal'],
				params: z.object({
					participantId: z.string(),
				}),
				response: {
					200: z.object({
						secret_friend: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { participantId } = request.params

			const group = await Group.findOne(
				{ 'participants._id': participantId },
				{ 'participants.$': 1 },
			)

			if (!group) {
				return reply.status(400).send({ message: 'Invalid code' })
			}

			const { secret_friend } = group.participants[0]

			return reply.send({ secret_friend })
		},
	)
}
