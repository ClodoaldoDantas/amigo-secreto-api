import { verifyJwt } from '@/middlewares/verify-jwt'
import { Group } from '@/models/group'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function deleteGroup(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().delete(
		'/groups/:id',
		{
			onRequest: [verifyJwt],
			schema: {
				tags: ['groups'],
				params: z.object({
					id: z.any(),
				}),
				response: {
					200: z.object({
						message: z.string(),
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

			const group = await Group.findById(id)

			if (!group) {
				return reply.status(404).send({
					message: 'Grupo não encontrado',
				})
			}

			if (group.organizer?.toString() !== request.user.id) {
				return reply.status(401).send({
					message: 'Você não tem permissão para excluir este grupo',
				})
			}

			await Group.deleteOne({ _id: id })

			return reply.send({
				message: 'Grupo excluído com sucesso',
			})
		},
	)
}
