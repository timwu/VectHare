/**
 * ============================================================================
 * VECTHARE EMBEDDING PROVIDERS
 * ============================================================================
 * Single source of truth for embedding providers and their configurations.
 * Import this anywhere you need provider information.
 *
 * @author VectHare
 * @version 2.0.0
 * ============================================================================
 */

import { SECRET_KEYS } from '../../../../secrets.js';
import { extension_settings } from '../../../../extensions.js';
import { textgen_types, textgenerationwebui_settings } from '../../../../textgen-settings.js';
import { oai_settings } from '../../../../openai.js';
import { secret_state } from '../../../../secrets.js';

/**
 * All supported embedding providers
 * This is the canonical list - update here and it applies everywhere
 */
export const EMBEDDING_PROVIDERS = {
    // Local providers (no API key needed)
    transformers: {
        name: 'Local (Transformers)',
        local: true,
        requiresModel: false,
        requiresApiKey: false,
        requiresUrl: false,
    },
    webllm: {
        name: 'WebLLM Extension',
        local: true,
        requiresModel: true,
        modelField: 'webllm_model',
        requiresApiKey: false,
        requiresUrl: false,
    },

    // Local server providers (need URL)
    bananabread: {
        name: 'BananaBread',
        local: true,
        requiresModel: false,
        requiresApiKey: true,
        secretKey: 'bananabread_api_key',
        requiresUrl: true,
        defaultUrl: 'http://localhost:8008',
    },
    ollama: {
        name: 'Ollama',
        local: true,
        requiresModel: true,
        modelField: 'ollama_model',
        requiresApiKey: false,
        requiresUrl: true,
    },
    llamacpp: {
        name: 'llama.cpp',
        local: true,
        requiresModel: false,
        requiresApiKey: false,
        requiresUrl: true,
    },
    koboldcpp: {
        name: 'KoboldCpp',
        local: true,
        requiresModel: false,
        requiresApiKey: false,
        requiresUrl: true,
    },
    vllm: {
        name: 'vLLM',
        local: true,
        requiresModel: true,
        modelField: 'vllm_model',
        requiresApiKey: false,
        requiresUrl: true,
    },

    // Cloud providers (need API key)
    openai: {
        name: 'OpenAI',
        local: false,
        requiresModel: true,
        modelField: 'openai_model',
        requiresApiKey: true,
        secretKey: SECRET_KEYS.OPENAI,
        requiresUrl: false,
    },
    cohere: {
        name: 'Cohere',
        local: false,
        requiresModel: true,
        modelField: 'cohere_model',
        requiresApiKey: true,
        secretKey: SECRET_KEYS.COHERE,
        requiresUrl: false,
    },
    togetherai: {
        name: 'TogetherAI',
        local: false,
        requiresModel: true,
        modelField: 'togetherai_model',
        requiresApiKey: true,
        secretKey: SECRET_KEYS.TOGETHERAI,
        requiresUrl: false,
    },
    openrouter: {
        name: 'OpenRouter',
        local: false,
        requiresModel: true,
        modelField: 'openrouter_model',
        requiresApiKey: true,
        secretKey: SECRET_KEYS.OPENROUTER,
        requiresUrl: false,
    },
    mistral: {
        name: 'MistralAI',
        local: false,
        requiresModel: true,
        modelField: 'mistral_model',
        requiresApiKey: true,
        secretKey: SECRET_KEYS.MISTRALAI,
        requiresUrl: false,
    },
    nomicai: {
        name: 'NomicAI',
        local: false,
        requiresModel: false,
        requiresApiKey: true,
        secretKey: SECRET_KEYS.NOMICAI,
        requiresUrl: false,
    },

    // Google providers
    palm: {
        name: 'Google AI Studio',
        local: false,
        requiresModel: true,
        modelField: 'google_model',
        requiresApiKey: true,
        secretKey: SECRET_KEYS.MAKERSUITE,
        requiresUrl: false,
    },
    vertexai: {
        name: 'Google Vertex AI',
        local: false,
        requiresModel: true,
        modelField: 'google_model',
        requiresApiKey: true,
        secretKey: SECRET_KEYS.VERTEXAI,
        requiresUrl: false,
    },

    // Other
    electronhub: {
        name: 'Electron Hub',
        local: false,
        requiresModel: true,
        modelField: 'electronhub_model',
        requiresApiKey: true,
        secretKey: SECRET_KEYS.ELECTRONHUB,
        requiresUrl: false,
    },
    extras: {
        name: 'Extras (deprecated)',
        local: false,
        requiresModel: false,
        requiresApiKey: false,
        requiresUrl: true,
        deprecated: true,
    },
};

/**
 * Get list of all valid provider IDs
 */
export function getValidProviderIds() {
    return Object.keys(EMBEDDING_PROVIDERS);
}

/**
 * Check if a provider ID is valid
 */
export function isValidProvider(providerId) {
    return providerId in EMBEDDING_PROVIDERS;
}

/**
 * Get provider config by ID
 */
export function getProviderConfig(providerId) {
    return EMBEDDING_PROVIDERS[providerId] || null;
}

/**
 * Get the model field name for a provider
 */
export function getModelField(providerId) {
    return EMBEDDING_PROVIDERS[providerId]?.modelField || null;
}

/**
 * Get the secret key constant for a provider
 */
export function getSecretKey(providerId) {
    return EMBEDDING_PROVIDERS[providerId]?.secretKey || null;
}

/**
 * Check if provider requires an API key
 */
export function requiresApiKey(providerId) {
    return EMBEDDING_PROVIDERS[providerId]?.requiresApiKey || false;
}

/**
 * Check if provider requires a custom URL
 */
export function requiresUrl(providerId) {
    return EMBEDDING_PROVIDERS[providerId]?.requiresUrl || false;
}

/**
 * Get providers that require API keys
 */
export function getCloudProviders() {
    return Object.entries(EMBEDDING_PROVIDERS)
        .filter(([_, config]) => config.requiresApiKey)
        .map(([id]) => id);
}

/**
 * Get providers that require custom URLs
 */
export function getUrlProviders() {
    return Object.entries(EMBEDDING_PROVIDERS)
        .filter(([_, config]) => config.requiresUrl)
        .map(([id]) => id);
}

/**
 * Build provider-specific parameters for API requests.
 * @param {object} settings - VectHare settings
 * @param {boolean} isQuery - Whether this is a query operation
 * @returns {object} Provider-specific parameters
 */
export function getProviderSpecificParams(settings, isQuery = false) {
    const params = {};
    const source = settings.source;

    switch (source) {
        case 'extras':
            params.extrasUrl = extension_settings.apiUrl;
            params.extrasKey = extension_settings.apiKey;
            break;

        case 'cohere':
            params.input_type = isQuery ? 'search_query' : 'search_document';
            break;

        case 'ollama':
            params.apiUrl = settings.use_alt_endpoint
                ? settings.alt_endpoint_url
                : textgenerationwebui_settings.server_urls[textgen_types.OLLAMA];
            params.keep = !!settings.ollama_keep;
            break;

        case 'llamacpp':
            params.apiUrl = settings.use_alt_endpoint
                ? settings.alt_endpoint_url
                : textgenerationwebui_settings.server_urls[textgen_types.LLAMACPP];
            break;

        case 'vllm':
            params.apiUrl = settings.use_alt_endpoint
                ? settings.alt_endpoint_url
                : textgenerationwebui_settings.server_urls[textgen_types.VLLM];
            break;

        case 'bananabread':
            params.apiUrl = settings.use_alt_endpoint
                ? settings.alt_endpoint_url
                : 'http://localhost:8008';
            if (secret_state['bananabread_api_key']) {
                const secrets = secret_state['bananabread_api_key'];
                const activeSecret = Array.isArray(secrets) ? (secrets.find(s => s.active) || secrets[0]) : null;
                if (activeSecret) {
                    params.apiKey = activeSecret.value;
                }
            }
            break;

        case 'palm':
            params.api = 'makersuite';
            break;

        case 'vertexai':
            params.api = 'vertexai';
            params.vertexai_auth_mode = oai_settings.vertexai_auth_mode;
            params.vertexai_region = oai_settings.vertexai_region;
            params.vertexai_express_project_id = oai_settings.vertexai_express_project_id;
            break;

        default:
            break;
    }

    return params;
}
