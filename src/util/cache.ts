import z, { ZodSchema } from "zod"

type MaybePromise<T> = T | Promise<T>

/*
Generate a new key by running:
  ```js
  crypto.subtle.generateKey({
    name: "HMAC",
    hash: "SHA-256"
  }, true, ["sign", "verify"]).then(key => crypto.subtle.exportKey("jwk", key)).then(({k}) => console.log(k))
  ```
in your browser's JS console, and set the value of `k` in the below object to the value logged in the console.
*/
const CACHE_KEY = {
  key_ops: ["sign", "verify"],
  ext: true,
  kty: "oct",
  k: "sa5M9ZpQo0kMAVW6u8dRliniGlfMDIAkx9nKJhX7rupaECAnYVsBjSdscponC95_bYHAmMh4l95XxD3lbyM3WQ",
  alg: "HS256"
}

export interface StorageBackend {
  getItem(_key: string): MaybePromise<string | null>
  setItem(_key: string, _value: string): MaybePromise<void>
  removeItem(_key: string): MaybePromise<void>
}

export const LocalStorageBackend: StorageBackend = {
  getItem: key => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: key => localStorage.removeItem(key)
}

export const SessionStorageBackend: StorageBackend = {
  getItem: key => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
  removeItem: key => sessionStorage.removeItem(key)
}

export async function put(
  name: string,
  value: any,
  backend: StorageBackend = LocalStorageBackend,
  k?: string
) {
  const cacheTimestamp = Date.now()

  // get signing key
  const keyData = { ...CACHE_KEY, k: k || CACHE_KEY.k }
  const key = await crypto.subtle.importKey(
    "jwk",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )

  // sign the value
  const signature = await window.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(
      JSON.stringify({ name, value: JSON.stringify(value), timestamp: cacheTimestamp })
    )
  )
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))

  return backend.setItem(
    `cache-${name}`,
    JSON.stringify({
      value: JSON.stringify(value),
      timestamp: cacheTimestamp,
      signature: signatureB64
    })
  )
}

export async function get(
  name: string,
  zodSchema?: ZodSchema,
  expires?: number, // in ms
  backend: StorageBackend = LocalStorageBackend,
  k?: string
) {
  // get signing key
  const keyData = { ...CACHE_KEY, k: k || CACHE_KEY.k }
  const key = await crypto.subtle.importKey(
    "jwk",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )

  // get cached value
  try {
    const cachedValue = await backend.getItem(`cache-${name}`)
    if (!cachedValue) return null
    const cached = z
      .object({
        value: z.string(),
        timestamp: z.number(),
        signature: z.string()
      })
      .parse(JSON.parse(cachedValue || ""))

    // validate value
    let data = JSON.parse(cached.value)
    if (zodSchema) data = zodSchema.parse(data)

    // check exp
    if (expires && Date.now() - cached.timestamp > expires) throw new Error("Expired.")

    // check signature
    const signatureFromB64 = atob(cached.signature)
    const signatureBuffer = new Uint8Array(signatureFromB64.length)
    for (let i = 0; i < signatureFromB64.length; i++) {
      signatureBuffer[i] = signatureFromB64.charCodeAt(i)
    }
    const valid = await window.crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      new TextEncoder().encode(
        JSON.stringify({ name, value: cached.value, timestamp: cached.timestamp })
      )
    )
    if (!valid) throw new Error("Signature invalid.")

    return data
  } catch (e) {
    console.error(e)
    // Invalid cache entry
    await backend.removeItem(`cache-${name}`)
    return null
  }
}

export function remove(name: string, backend: StorageBackend = LocalStorageBackend) {
  return backend.removeItem(`cache-${name}`)
}
