import { execSync } from "child_process";

export default () => {
	// Get the abbreviated commit hash
	const vcs_revision = execSync("git rev-parse --short HEAD").toString().trim();
	const vcs_time = execSync("git show -q --format=%cI HEAD").toString().trim();

	return {
		revision: vcs_revision,
		time: vcs_time,
	};
};
