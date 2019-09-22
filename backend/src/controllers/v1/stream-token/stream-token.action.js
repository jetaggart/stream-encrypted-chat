import dotenv from 'dotenv';
import { StreamChat } from 'stream-chat';

dotenv.config();

exports.streamToken = async (req, res) => {
	try {
		const data = req.body;

		let apiKey;
		let apiSecret;

		if (process.env.STREAM_URL) {
			[apiKey, apiSecret] = process.env.STREAM_URL.substr(8)
				.split('@')[0]
				.split(':');
		} else {
			apiKey = process.env.STREAM_API_KEY;
			apiSecret = process.env.STREAM_API_SECRET;
		}

		const client = new StreamChat(apiKey, apiSecret);

		const user = Object.assign({}, data, {
			id: `${req.user.identity}`,
			role: 'admin',
			image: `https://robohash.org/${req.user.identity}`,
		});
		const token = client.createToken(user.id);
		await client.updateUsers([user]);

		res.status(200).json({ user, token, apiKey });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};
