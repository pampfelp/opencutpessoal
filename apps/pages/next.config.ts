import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	basePath: "/opencutpessoal",
	trailingSlash: true,
	images: { unoptimized: true },
};

export default nextConfig;
