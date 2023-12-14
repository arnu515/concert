import Auth from "$/components/Auth"
import JoinStage from "$/components/JoinStage"
import { AuthContext } from "$/contexts/AuthContext"
import { useContext } from "react"

export default function Index() {
  const auth = useContext(AuthContext)

  return (
    <main className="mx-4 my-4 grid max-w-screen-xl grid-cols-1 gap-6 md:mx-auto md:my-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      <div className="col-span-1 row-start-2 md:col-span-2 md:row-start-auto lg:col-span-3">
        <h1 className="font-heading text-5xl font-bold">
          <span className="text-sky-600 dark:text-blue-600">Concert</span>Meetings{" "}
          <span className="text-3xl text-gray-400 dark:text-gray-700">:</span>{" "}
          <span className="font-normal">Explore</span>
        </h1>
      </div>
      <div className="col-span-1 row-start-1 flex flex-col gap-2 md:row-start-auto">
        {!auth.user ? (
          <Auth />
        ) : (
          <>
            <JoinStage />
          </>
        )}
      </div>
    </main>
  )
}
