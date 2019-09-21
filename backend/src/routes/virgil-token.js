import { virgilToken } from "../controllers/v1/virgil-token";
import { requireAuthHeader } from "../controllers/v1/authenticate/authenticate.action"

import { wrapAsync } from "../utils/controllers";

module.exports = api => {
	api.route("/v1/virgil-token").post(requireAuthHeader, wrapAsync(virgilToken));
};
