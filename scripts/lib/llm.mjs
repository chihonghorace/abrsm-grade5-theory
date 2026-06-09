// One structured-JSON call that runs on EITHER Anthropic Claude OR Google
// Gemini, so the question pipeline can use whichever API key (token) you have.
//
// Choose the provider with `--provider`, the LLM_PROVIDER env var, or just by
// which key is present:
//   Anthropic: ANTHROPIC_API_KEY              (default model claude-opus-4-8)
//   Google:    GEMINI_API_KEY / GOOGLE_API_KEY (default model gemini-3.5-flash)
//
// The Google provider has two auth modes:
//   - AI Studio key: set GEMINI_API_KEY.
//   - Vertex AI (service account / your GCP credit): set
//       GOOGLE_GENAI_USE_VERTEXAI=true, GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION
//     and authenticate via ADC (GOOGLE_APPLICATION_CREDENTIALS → SA JSON key).
//
// Both SDKs are imported lazily, so you only need the one for the provider you
// actually use. Google support needs:  npm i -D @google/genai

export const DEFAULT_MODEL = {
  anthropic: 'claude-opus-4-8',
  google: 'gemini-3.5-flash',
}

/** Resolve provider from an explicit flag, env, or whichever key is set. */
export function resolveProvider(flag) {
  const p = (flag || process.env.LLM_PROVIDER || '').toLowerCase()
  if (p === 'anthropic' || p === 'google') return p
  if (p) throw new Error(`Unknown --provider "${p}". Use "anthropic" or "google".`)
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic'
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true')
    return 'google'
  return 'anthropic'
}

const useVertex = () => process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true'

/** Throws a friendly error if the chosen provider's credentials are missing. */
export function requireKey(provider) {
  if (provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set. Create a .env file (see .env.example) — it is gitignored.')
  }
  if (provider === 'google') {
    if (useVertex()) {
      if (!process.env.GOOGLE_CLOUD_PROJECT) {
        throw new Error('Vertex mode needs GOOGLE_CLOUD_PROJECT (+ GOOGLE_APPLICATION_CREDENTIALS) — see .env.example.')
      }
    } else if (!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
      throw new Error('GEMINI_API_KEY not set (or set GOOGLE_GENAI_USE_VERTEXAI=true for Vertex) — see .env.example.')
    }
  }
}

function stripFences(t) {
  const m = /```(?:json)?\s*([\s\S]*?)```/.exec(t)
  return (m ? m[1] : t).trim()
}

/**
 * Ask the model for a JSON object matching `schema`.
 * @param {object}   o
 * @param {string}   o.provider  'anthropic' | 'google'
 * @param {string}   o.model
 * @param {string}   o.system    system instruction
 * @param {Array<{text?:string, imageBase64?:string, mediaType?:string}>} o.parts
 * @param {object}   o.schema    JSON Schema for the expected object
 * @param {number}   [o.maxTokens=16000]
 * @returns {Promise<{data:any, usage:{input:number, output:number}}>}
 */
export async function generateJSON({ provider, model, system, parts, schema, maxTokens = 16000 }) {
  return provider === 'google'
    ? google({ model, system, parts, schema, maxTokens })
    : anthropic({ model, system, parts, schema, maxTokens })
}

async function anthropic({ model, system, parts, schema, maxTokens }) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const content = parts.map((p) =>
    p.text != null
      ? { type: 'text', text: p.text }
      : { type: 'image', source: { type: 'base64', media_type: p.mediaType, data: p.imageBase64 } },
  )
  const client = new Anthropic() // reads ANTHROPIC_API_KEY from env
  const res = await client.messages.create({
    model,
    max_tokens: maxTokens,
    thinking: { type: 'adaptive' },
    system,
    output_config: { format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content }],
  })
  if (res.stop_reason === 'refusal') throw new Error('Model refused the request.')
  if (res.stop_reason === 'max_tokens') throw new Error('Output hit max_tokens — try a smaller request.')
  const text = res.content.find((b) => b.type === 'text')?.text
  if (!text) throw new Error('No text block in response.')
  return {
    data: JSON.parse(text),
    usage: { input: res.usage.input_tokens, output: res.usage.output_tokens },
  }
}

async function google({ model, system, parts, schema, maxTokens }) {
  let genai
  try {
    genai = await import('@google/genai')
  } catch {
    throw new Error('Google provider needs the SDK. Install it:  npm i -D @google/genai')
  }
  const ai = useVertex()
    ? new genai.GoogleGenAI({
        vertexai: true,
        project: process.env.GOOGLE_CLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
      })
    : new genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY })
  const contents = [
    {
      role: 'user',
      parts: parts.map((p) =>
        p.text != null ? { text: p.text } : { inlineData: { mimeType: p.mediaType, data: p.imageBase64 } },
      ),
    },
  ]
  // Gemini's responseSchema is a stricter OpenAPI subset (no additionalProperties,
  // no const). For portability we ask for JSON via responseMimeType and pin the
  // exact shape in the system instruction from the same schema.
  const systemInstruction =
    system +
    '\n\nRespond with ONLY a JSON object conforming to this JSON Schema — no prose, no code fence:\n' +
    JSON.stringify(schema)
  const res = await ai.models.generateContent({
    model,
    contents,
    config: { systemInstruction, responseMimeType: 'application/json', maxOutputTokens: maxTokens },
  })
  const text = res.text
  if (!text) throw new Error('Empty response from Gemini (possibly blocked or truncated).')
  return {
    data: JSON.parse(stripFences(text)),
    usage: {
      input: res.usageMetadata?.promptTokenCount ?? 0,
      output: res.usageMetadata?.candidatesTokenCount ?? 0,
    },
  }
}
