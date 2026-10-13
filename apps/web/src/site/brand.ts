export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_INFO = {
	title: "OpenCut Pessoal",
	description:
		"Editor de vídeo pessoal no navegador.",
	url: SITE_URL,
	openGraphImage: `${publicBasePath}/open-graph/default.jpg`,
	twitterImage: `${publicBasePath}/open-graph/default.jpg`,
	favicon: `${publicBasePath}/favicon.ico`,
};

export const DEFAULT_LOGO_URL = `${publicBasePath}/logos/opencut/svg/logo.svg`;
