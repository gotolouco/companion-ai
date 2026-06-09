import { readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const MODELS_DIR = join(process.cwd(), "public", "models")
const OUT = join(process.cwd(), "src", "lib", "models.js")


function toLabel(file) {
  return file.replace(/\.vrm$/i, "").replace(/[_-]+/g, " ").trim()
}

const files = readdirSync(MODELS_DIR).filter((f) => f.toLowerCase().endsWith(".vrm"))
const entries = files.map((f) => `  { file: ${JSON.stringify(f)}, label: ${JSON.stringify(toLabel(f))} },`)

const content = `// GERADO por scripts/gen-models.mjs — rode \`npm run models\` para atualizar.
// Lista de avatares VRM disponíveis na pasta public/models/.
export const MODELOS = [
${entries.join("\n")}
]
`

writeFileSync(OUT, content)
console.log(`Gerado ${OUT} com ${files.length} modelo(s):`, files.join(", "))
