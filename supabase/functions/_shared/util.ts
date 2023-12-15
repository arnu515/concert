export function res(
  {
    message,
    status,
    data = {},
    headers = {},
    statusText,
    corsHeaders: _corsH = true,
  }:
    & {
      message?: string;
      data?: Record<string, any>;
      corsHeaders?: Record<string, string> | boolean;
    }
    & ResponseInit = {},
) {
  const corsHeaders = typeof _corsH !== "object"
    ? _corsH ? cors() : {}
    : { ..._corsH };

  return new Response(
    JSON.stringify({
      message,
      ...data,
    }),
    {
      status: status || 200,
      headers: {
        ...headers,
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      statusText,
    },
  );
}

export function cors(
  {
    origin = "*",
    methods = "*",
    headers = "authorization, x-client-info, apikey, content-type, useragent",
  }: { origin?: string; methods?: string; headers?: string } = {},
) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": headers,
  };
}
