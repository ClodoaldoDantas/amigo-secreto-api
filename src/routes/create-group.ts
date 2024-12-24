import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { verifyJwt } from '../middlewares/verify-jwt'
import { Group } from '../models/group'
import { drawParticipants } from '../utils/shuffle'

export async function createGroup(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/groups',
		{
			onRequest: [verifyJwt],
			schema: {
				body: z.object({
					name: z.string(),
					participants: z.array(z.string()),
				}),
				response: {
					201: z.object({
						message: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { name, participants } = request.body
			const user = request.user

			if (participants.length < 3) {
				return reply.status(400).send({
					message: 'You need at least 3 participants',
				})
			}

			const drawnParticipants = drawParticipants(participants)

			await Group.create({
				name,
				participants: drawnParticipants,
				organizer: user.id,
			})

			return reply.status(201).send({
				message: 'Group created successfully',
			})
		},
	)
}
