import { QueryClient } from "@tanstack/react-query"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { get, put, remove } from "./cache"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 // 24h
    }
  }
})

export const persister = createAsyncStoragePersister({
  storage: {
    getItem: get,
    setItem: put,
    removeItem: remove
  }
})
