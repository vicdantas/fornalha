// Cadastra no Appwrite os produtos do catálogo oficial (PDF do proprietário).
//
// Uso:
//   node --env-file=.env scripts/seed-products.mjs           # só mostra o que faria
//   node --env-file=.env scripts/seed-products.mjs --apply   # grava de verdade
//
// Requer APPWRITE_API_KEY (chave de servidor com escopo rows.write / documents.write)
// no .env — sem prefixo VITE_, para nunca ir parar no bundle do front.
// Produtos já cadastrados (mesmo nome + preço) são pulados, então pode rodar de novo.

const PRODUCTS = {
  bovino: [
    // Picanha e Chorizo aparecem duas vezes no PDF com preços diferentes:
    // confirmar com o dono a diferença (marca/padrão) e renomear.
    ['Picanha', 119.9, 'kg'],
    ['Chorizo', 79.9, 'kg'],
    ['Fraldinha', 84.9, 'kg'],
    ['Picanha', 109.9, 'kg'],
    ['Chorizo', 89.9, 'kg'],
    ['Contra-filé', 69.9, 'kg'],
    ['Maminha', 69.9, 'peca'],
    ['Shoulder', 99.9, 'peca'],
    ['Peixinho', 69.9, 'peca'],
  ],
  acompanhamento: [
    ['Carvão', 14.9, 'un'],
    ['Batata Air Fryer', 19.9, 'un'],
    ['Farofa Tradicional', 14.9, 'un'],
    ['Farofa de Alho', 14.9, 'un'],
    ['Farofa de Bacon', 14.9, 'un'],
    ['Farofa de Banana', 14.9, 'un'],
    ['Farofa de Costelinha com Limão', 14.9, 'un'],
    ['Farofa Picante', 14.9, 'un'],
    ['Farofa de Provolone', 14.9, 'un'],
    ['Farofa de Torresmo', 14.9, 'un'],
  ],
  tempero: [
    ['Sal de Parrilla Tradicional', 12.9, 'un'],
    ['Sal de Parrilla com Alho', 12.9, 'un'],
    ['Sal de Parrilla com Bacon', 12.9, 'un'],
    ['Sal de Parrilla com Chimichurri', 12.9, 'un'],
    ['Sal de Parrilla com Lemon Pepper', 12.9, 'un'],
    ['Sal de Parrilla com Mostarda e Hortelã', 12.9, 'un'],
  ],
  paes_linguicas: [
    ['Pão de Alho Tradicional', 14.9, 'un'],
    ['Pão de Alho Picante', 14.9, 'un'],
    ['Pão de Alho Tradicional Black', 19.9, 'un'],
    ['Linguiça', 26.9, 'pacote', 'Pacote de 400 g'],
    ['Linguiça', 29.9, 'pacote', 'Pacote de 700 g'],
    ['Choripan', 21.9, 'un'],
    // Queijo Coalho aparece duas vezes no PDF: provavelmente sabores diferentes.
    ['Queijo Coalho', 24.9, 'un'],
    ['Queijo Coalho', 24.9, 'un'],
  ],
  suino: [
    ['Costelinha suína com barbecue', 69.9, 'un'],
    ['Panceta suína', 21.9, 'un'],
    ['Picanha suína', 21.9, 'un'],
  ],
  ave: [
    ['Coxinha da asa — manjericão e especiarias', 21.9, 'un'],
    ['Meio da asa — sweet chili', 29.9, 'un'],
    ['Tulipa na brasa', 34.9, 'un'],
    ['Filé de sobrecoxa — chimichurri', 33.9, 'un'],
    ['Coração na brasa', 24.9, 'un'],
  ],
  espetinho: [
    ['Espetinho de carne', 47.9, 'un'],
    ['Espetinho de kafta', 36.9, 'un'],
    ['Espetinho de frango', 29.9, 'un'],
  ],
}

const {
  VITE_APPWRITE_ENDPOINT: endpoint = 'https://cloud.appwrite.io/v1',
  VITE_APPWRITE_PROJECT_ID: projectId,
  VITE_APPWRITE_DB_ID: dbId,
  APPWRITE_API_KEY: apiKey,
} = process.env
const TABLE_ID = 'products'
const apply = process.argv.includes('--apply')

const rows = Object.entries(PRODUCTS).flatMap(([category, items], c) =>
  items.map(([name, price, unit, weight = ''], i) => ({
    name, category, weight, description: '',
    price, unit, badge: '', stock: null, imageUrl: '',
    order: (c + 1) * 100 + i, active: true,
  })),
)

// Mesma estratégia do src/lib/appwrite.js: API TablesDB, com fallback para a legada.
const paths = {
  tables: { url: `/tablesdb/${dbId}/tables/${TABLE_ID}/rows`, idKey: 'rowId', listKey: 'rows' },
  legacy: { url: `/databases/${dbId}/collections/${TABLE_ID}/documents`, idKey: 'documentId', listKey: 'documents' },
}

async function call(method, path, body) {
  const res = await fetch(endpoint + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': projectId,
      'X-Appwrite-Key': apiKey,
    },
    body: body && JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${res.status} ${json.message ?? res.statusText}`)
  return json
}

async function listExisting() {
  const limit = encodeURIComponent(JSON.stringify({ method: 'limit', values: [500] }))
  for (const api of [paths.tables, paths.legacy]) {
    try {
      const res = await call('GET', `${api.url}?queries[]=${limit}`)
      return { api, existing: res[api.listKey] ?? [] }
    } catch (err) {
      if (api === paths.legacy) throw err
    }
  }
}

if (!projectId || !dbId || !apiKey) {
  console.error('Defina VITE_APPWRITE_PROJECT_ID, VITE_APPWRITE_DB_ID e APPWRITE_API_KEY no .env')
  process.exit(1)
}

const { api, existing } = await listExisting()
const key = p => `${p.name}|${Number(p.price).toFixed(2)}|${p.weight ?? ''}`
const seen = new Map()
for (const p of existing) seen.set(key(p), (seen.get(key(p)) ?? 0) + 1)

let created = 0
for (const row of rows) {
  // Conta duplicatas legítimas (ex.: os dois Queijo Coalho) em vez de pular as duas.
  const left = seen.get(key(row)) ?? 0
  if (left > 0) {
    seen.set(key(row), left - 1)
    console.log(`  já existe  ${row.name}`)
    continue
  }
  if (!apply) {
    console.log(`  criaria    [${row.category}] ${row.name} — R$ ${row.price.toFixed(2)}/${row.unit}`)
    continue
  }
  await call('POST', api.url, { [api.idKey]: 'unique()', data: row })
  created++
  console.log(`  criado     ${row.name}`)
}

console.log(apply ? `\n${created} produto(s) criado(s).` : '\nSimulação. Rode com --apply para gravar.')
