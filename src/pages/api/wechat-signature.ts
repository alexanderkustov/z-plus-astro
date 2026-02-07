import type { APIRoute } from "astro";
import { createHash, randomBytes } from "crypto";

const appId = import.meta.env.WECHAT_APP_ID ?? process.env.WECHAT_APP_ID;
const appSecret =
  import.meta.env.WECHAT_APP_SECRET ?? process.env.WECHAT_APP_SECRET;

let cachedAccessToken: { value: string; expiresAt: number } | null = null;
let cachedJsapiTicket: { value: string; expiresAt: number } | null = null;

const ensureCredentials = () => {
  if (!appId || !appSecret) {
    throw new Error("Missing WeChat app credentials.");
  }
};

const getAccessToken = async () => {
  ensureCredentials();
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.value;
  }

  const response = await fetch(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
  );
  const data = await response.json();
  if (!response.ok || data.errcode) {
    throw new Error(
      data.errmsg || "Unable to retrieve WeChat access token.",
    );
  }

  const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  cachedAccessToken = { value: data.access_token, expiresAt };
  return cachedAccessToken.value;
};

const getJsapiTicket = async () => {
  if (cachedJsapiTicket && cachedJsapiTicket.expiresAt > Date.now()) {
    return cachedJsapiTicket.value;
  }

  const accessToken = await getAccessToken();
  const response = await fetch(
    `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`,
  );
  const data = await response.json();
  if (!response.ok || data.errcode) {
    throw new Error(data.errmsg || "Unable to retrieve WeChat JSAPI ticket.");
  }

  const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  cachedJsapiTicket = { value: data.ticket, expiresAt };
  return cachedJsapiTicket.value;
};

const buildSignature = (ticket: string, url: string) => {
  const nonceStr = randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000);
  const raw = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  const signature = createHash("sha1").update(raw).digest("hex");

  return { nonceStr, timestamp, signature };
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const targetUrl = url.searchParams.get("url");
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: "Missing url query parameter." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const ticket = await getJsapiTicket();
    const { nonceStr, timestamp, signature } = buildSignature(
      ticket,
      targetUrl,
    );

    return new Response(
      JSON.stringify({
        appId,
        nonceStr,
        timestamp,
        signature,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const prerender = false;
