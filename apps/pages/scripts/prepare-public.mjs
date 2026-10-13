import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const pagesDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = path.resolve(pagesDir, "../web/public");
const destination = path.resolve(pagesDir, "public");

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });

const manifestPath = path.join(destination, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
manifest.name = "OpenCut Pessoal";
manifest.id = "/opencutpessoal/";
manifest.start_url = "/opencutpessoal/";
manifest.scope = "/opencutpessoal/";
manifest.icons = manifest.icons.map((icon) => ({
	...icon,
	src: `/opencutpessoal${icon.src}`,
}));
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
