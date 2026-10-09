// Cadastra no Appwrite os produtos da lista oficial (planilha de fornecedores do proprietário).
//
// Uso:
//   npm run seed:products                      # só mostra o que faria
//   npm run seed:products -- --apply           # grava de verdade
//   npm run seed:products -- --apply --prune   # e remove do banco o que saiu da lista
//
// Requer APPWRITE_API_KEY (chave de servidor) no .env — sem prefixo VITE_, para
// nunca ir parar no bundle do front. Produtos já cadastrados (mesmo nome, marca e
// preço) são pulados, então pode rodar de novo. --prune nunca apaga produto com foto.

// [nome, preço, unidade, peso/porção]
const PRODUCTS = {
  bovino: {
    Minerva: [
      ['Estância Picanha', 149.9, 'kg'],
      ['Estância Chorizo Angus', 89.9, 'kg'],
      ['Estância Chorizo', 79.9, 'kg'],
      ['Estância Fraldinha', 84.9, 'kg'],
      ['Pul Selection Picanha', 99.9, 'kg'],
      ['Pul Contra-filé', 64.9, 'kg'],
      ['Maminha Cabaña Las Lilas', 69.9, 'kg'],
    ],
    'Carolina Black': [
      ['Picanha Valencia', 119.9, 'kg'],
    ],
  },
  ave: {
    'Perdigão / Sadia': [
      ['Tulipa na brasa', 34.9, 'un'],
      ['Coração na brasa', 24.9, 'un'],
    ],
    Aurora: [
      ['Filé de sobrecoxa', 24.9, 'un'],
      ['Coxinha da asa — manjericão', 21.9, 'un'],
      ['Meio da asa — sweet chili', 29.9, 'un'],
    ],
    'Carolina Black': [
      ['Coxa e sobrecoxa', 33.9, 'un'],
    ],
  },
  suino: {
    Aurora: [
      ['Costelinha suína', 69.9, 'un'],
      ['Picanha suína', 21.9, 'un'],
      ['Panceta suína', 21.9, 'un'],
    ],
  },
  espetinho: {
    'Carolina Black': [
      ['Espetinho bovino', 47.9, 'un'],
      ['Espetinho de kafta', 36.9, 'un'],
      ['Espetinho de frango', 29.9, 'un'],
    ],
  },
  paes_linguicas: {
    'Carolina Black': [
      ['Pão de alho', 19.9, 'un'],
      ['Queijo coalho', 25.9, 'un'],
      ['Linguiça toscana', 26.9, 'pacote', 'Pacote de 400 g'],
      ['Linguiça na brasa', 29.9, 'pacote', 'Pacote de 700 g'],
    ],
    Pinho: [
      ['Pão de alho Chef', 14.9, 'un'],
      ['Pão de alho Pimenta', 14.9, 'un'],
      ['Queijo coalho Quatá', 25.9, 'un'],
    ],
    Aurora: [
      ['Choripan', 21.9, 'un'],
    ],
  },
  acompanhamento: {
    Poleto: [
      ['Farofa Tradicional', 14.9, 'un'],
      ['Farofa de Alho', 14.9, 'un'],
      ['Farofa de Bacon', 14.9, 'un'],
      ['Farofa de Banana', 14.9, 'un'],
      ['Farofa de Costelinha com Limão', 14.9, 'un'],
      ['Farofa Picante', 14.9, 'un'],
      ['Farofa de Provolone', 14.9, 'un'],
      ['Farofa de Torresmo', 14.9, 'un'],
    ],
    'Carolina Black': [
      ['Batata Air Fryer', 19.9, 'un'],
    ],
  },
  tempero: {
    Poleto: [
      ['Sal de Parrilla Tradicional', 12.9, 'un'],
      ['Sal de Parrilla com Alho', 12.9, 'un'],
      ['Sal de Parrilla com Bacon', 12.9, 'un'],
      ['Sal de Parrilla com Chimichurri', 12.9, 'un'],
      ['Sal de Parrilla com Lemon Pepper', 12.9, 'un'],
      ['Sal de Parrilla com Mostarda e Hortelã', 12.9, 'un'],
      ['Tempero Steak', 14.9, 'un'],
    ],
  },
  carvao: {
    '': [
      ['Carvão', 14.9, 'un'],
    ],
    Poleto: [
      ['Acendedor', 1.9, 'un'],
      ['Gel acendedor', 12.9, 'un'],
    ],
  },
  bebida: {
    '': [
      ['Coca-Cola', 13.9, 'un'],
      ['Fanta', 10.9, 'un'],
      ['Fanta Uva', 10.9, 'un'],
      ['Guaraná', 10.9, 'un'],
      ['Chá gelado', 13.9, 'un'],
    ],
  },
}

const {
  VITE_APPWRITE_ENDPOINT: endpoint = 'https://cloud.appwrite.io/v1',
  VITE_APPWRITE_PROJECT_ID: projectId,
  VITE_APPWRITE_DB_ID: dbId,
  APPWRITE_API_KEY: apiKey,
} = process.env
const TABLE_ID = 'products'
const apply = process.argv.includes('--apply')
const prune = process.argv.includes('--prune')

const rows = Object.entries(PRODUCTS).flatMap(([category, brands], c) =>
  Object.entries(brands)
    .flatMap(([brand, items]) => items.map(item => [brand, ...item]))
    .map(([brand, name, price, unit, weight = ''], i) => ({
      name, brand, category, weight, description: '',
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
const key = p => `${p.name}|${p.brand ?? ''}|${p.category}|${Number(p.price).toFixed(2)}|${p.weight ?? ''}`
const seen = new Map()
for (const p of existing) seen.set(key(p), (seen.get(key(p)) ?? 0) + 1)

if (prune) {
  const wanted = new Set(rows.map(key))
  for (const p of existing) {
    if (wanted.has(key(p))) continue
    if (p.imageUrl) {
      console.log(`  mantido    ${p.name} (fora da lista, mas tem foto)`)
      continue
    }
    if (apply) await call('DELETE', `${api.url}/${p.$id}`)
    console.log(`  ${apply ? 'removido ' : 'removeria'}  ${p.name}`)
  }
}

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
    console.log(`  criaria    [${row.category}] ${row.name}${row.brand && ` (${row.brand})`} — R$ ${row.price.toFixed(2)}/${row.unit}`)
    continue
  }
  await call('POST', api.url, { [api.idKey]: 'unique()', data: row })
  created++
  console.log(`  criado     ${row.name}`)
}

console.log(apply ? `\n${created} produto(s) criado(s).` : '\nSimulação. Rode com --apply para gravar.')
