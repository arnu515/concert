import FullPageError from "$/components/FullPageError"
import { useRouteError } from "react-router-dom"

export default function StageStageIdError() {
  const error = useRouteError() as Error

  return (
    <FullPageError
      className="m-4 mt-20"
      message={error.message === "404" ? "404 NOT FOUND" : undefined}
      friendlyMessage={
        error.message === "404"
          ? "The stage with the given ID was not found."
          : error.message
      }
    />
  )
}
