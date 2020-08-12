import dotenv from 'dotenv';

const { JwtGenerator } = require('virgil-sdk');
const { initCrypto, VirgilCrypto, VirgilAccessTokenSigner } = require('virgil-crypto');

dotenv.config();

async function getJwtGenerator() {
	await initCrypto();

	const virgilCrypto = new VirgilCrypto();
	// initialize JWT generator with your App ID and App Key ID you got in
	// Virgil Dashboard.
	return new JwtGenerator({
		appId: process.env.VIRGIL_APP_ID,
		apiKeyId: process.env.VIRGIL_KEY_ID,
		// import your App Key that you got in Virgil Dashboard from string.
		apiKey: virgilCrypto.importPrivateKey(process.env.VIRGIL_PRIVATE_KEY),
		// initialize accessTokenSigner that signs users JWTs
		accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto),
		// JWT lifetime - 20 minutes (default)
		millisecondsToLive:  20 * 60 * 1000
	});
}

const generatorPromise = getJwtGenerator();

exports.virgilCredentials = async (req, res) => {
  const generator = await generatorPromise;
  // Get the identity of the user making the request (this assumes the request
  // is authenticated and there is middleware in place that populates the
  // `req.user` property with the user record).
  const virgilJwtToken = generator.generateToken(req.user.sender);
  // Send it to the authorized user
  res.json({ token: virgilJwtToken.toString() });
};
