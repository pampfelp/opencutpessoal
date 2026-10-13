import { cp, lstat, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = path.join(root, "apps", "pages", "out");
const destination = path.join(root, "site-out");

if (!destination.startsWith(`${root}${path.sep}`)) {
	throw new Error("Invalid Pages output directory");
}

const index = await readFile(path.join(source, "index.html"));
if (!index.length) throw new Error("Pages build is empty");

try {
	if ((await lstat(destination)).isSymbolicLink()) {
		throw new Error("Pages output cannot be a symlink");
	}
	await rm(destination, { recursive: true });
} catch (error) {
	if (error?.code !== "ENOENT") throw error;
}

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
for (const route of ["editor", "projects", "privacy", "terms"]) {
	await cp(
		path.join(destination, route, `__next.${route}`, "__PAGE__.txt"),
		path.join(destination, route, `__next.${route}.__PAGE__.txt`),
	);
}
for (const name of ["sobre.html", "privacidade.html", "termos.html", "styles.css"]) {
	await cp(path.join(root, "public-pages", name), path.join(destination, name));
}
await writeFile(path.join(destination, ".nojekyll"), "");
