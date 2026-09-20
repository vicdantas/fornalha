import { Client, Databases, Account, ID, Query } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '')

export const databases = new Databases(client)
export const account = new Account(client)
export { ID, Query }

export const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID || ''
export const TABLE_ID = 'products' // Table ID no Appwrite novo

// ── Products (nova API TablesDB) ──
export async function getProducts(category) {
  const q = [Query.orderAsc('order'), Query.limit(200), Query.equal('active', true)]
  if (category && category !== 'all') q.push(Query.equal('category', category))

  try {
    // Tenta nova API (listRows)
    const res = await databases.listRows(DB_ID, TABLE_ID, q)
    return res.rows ?? res.documents ?? []
  } catch {
    // Fallback para API legada (listDocuments)
    const res = await databases.listDocuments(DB_ID, TABLE_ID, q)
    return res.documents ?? []
  }
}

export async function createProduct(data) {
  try {
    return await databases.createRow(DB_ID, TABLE_ID, ID.unique(), data)
  } catch {
    return databases.createDocument(DB_ID, TABLE_ID, ID.unique(), data)
  }
}

export async function updateProduct(id, data) {
  try {
    return await databases.updateRow(DB_ID, TABLE_ID, id, data)
  } catch {
    return databases.updateDocument(DB_ID, TABLE_ID, id, data)
  }
}

export async function deleteProduct(id) {
  try {
    return await databases.deleteRow(DB_ID, TABLE_ID, id)
  } catch {
    return databases.deleteDocument(DB_ID, TABLE_ID, id)
  }
}

// ── Auth ──
export async function loginAdmin(email, password) {
  return account.createEmailPasswordSession(email, password)
}

export async function logoutAdmin() {
  return account.deleteSession('current')
}

export async function getSession() {
  try { return await account.get() } catch { return null }
}
