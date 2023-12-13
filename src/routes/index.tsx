import Auth from "$/components/Auth"

export default function Index() {
  return (
    <main class="mx-auto my-4 grid max-w-screen-xl grid-cols-1 md:my-6 md:grid-cols-3 lg:grid-cols-4">
      <div class="col-span-1 row-start-2 md:col-span-2 md:row-start-auto lg:col-span-3">
        <h1 class="font-heading text-5xl font-bold">
          <span class="text-sky-600 dark:text-blue-600">Concert</span>Meetings{" "}
          <span className="text-3xl text-gray-400 dark:text-gray-700">:</span>{" "}
          <span className="font-normal">Explore</span>
        </h1>
      </div>
      <div class="col-span-1 row-start-1 md:row-start-auto">
        <Auth />
      </div>
    </main>
  )
}
