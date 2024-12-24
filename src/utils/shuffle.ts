/**
 * Shuffles the elements of the provided array in-place.
 * @param array - The array to be shuffled.
 * @returns The shuffled array.
 */
export function shuffle(array: string[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

/**
 * Draws a list of participants and their secret friends.
 * @param participants - An array of participant names.
 * @returns An array of objects containing the participant name and their secret friend.
 */
export function drawParticipants(participants: string[]) {
	const shuffledParticipants = shuffle(participants)
	const result = []

	for (let i = 0; i < participants.length; i++) {
		const participant = participants[i]
		const secretFriend = shuffledParticipants[(i + 1) % participants.length]

		result.push({
			name: participant,
			secret_friend: secretFriend,
		})
	}

	return result
}
