import { streamToken } from "../controllers/v1/stream-token";

import { wrapAsync } from "../utils/controllers";
import { requireAuthHeader } from "../controllers/v1/authenticate/authenticate.action";

module.exports = api => {
	api.route("/v1/stream-token").post(requireAuthHeader, wrapAsync(streamToken));
};
