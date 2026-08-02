import { serverConfig } from "@/features/externalAPI/externalAPI";

/**
 * 应用默认配置
 *
 * 配置读取优先级（三级降级）：
 *   1. localStorage（以 "chatvrm_" 为前缀，用户通过 UI 修改过的值）
 *   2. serverConfig（服务端下发的配置）
 *   3. defaults（此处定义的默认值）
 *
 * 环境变量 VITE_* 仅在构建时注入，运行时不再变化。
 * 所有值统一为 string 类型，布尔值用 'true' / 'false' 字符串表示。
 */
export const defaults = {
  // =========================================================================
  // TTS — AllTalk（本地 XTTS 语音合成，支持 RVC 变声）
  // =========================================================================
  /** AllTalk 服务地址 */
  localXTTS_url: import.meta.env.VITE_LOCALXTTS_URL ?? 'http://127.0.0.1:7851',
  /** AllTalk API 版本：v1 / v2 */
  alltalk_version: import.meta.env.VITE_ALLTALK_VERSION ?? 'v2',
  /** AllTalk 内置音色文件名 */
  alltalk_voice: import.meta.env.VITE_ALLTALK_VOICE ?? 'female_01.wav',
  /** AllTalk 合成语言代码 */
  alltalk_language: import.meta.env.VITE_ALLTALK_LANGUAGE ?? 'en',
  /** RVC 变声模型名，"Disabled" 表示不启用 */
  alltalk_rvc_voice: import.meta.env.VITE_ALLTALK_RVC_VOICE ?? 'Disabled',
  /** RVC 音高偏移（半音） */
  alltalk_rvc_pitch: import.meta.env.VITE_ALLTALK_RVC_PITCH ?? '0',

  // =========================================================================
  // 交互行为
  // =========================================================================
  /** 麦克风拾音后是否自动发送（无需手动确认） */
  autosend_from_mic: 'true',
  /** 是否启用语音唤醒词 */
  wake_word_enabled: 'false',
  /** 唤醒词文本 */
  wake_word: 'Hello',
  /** 无交互后进入空闲状态的等待时间（秒） */
  time_before_idle_sec: '20',

  // =========================================================================
  // 渲染
  // =========================================================================
  /** 是否启用图形调试（显示帧率、draw call 等） */
  debug_gfx: 'false',
  /** 是否使用 WebGPU 后端（默认 WebGL） */
  use_webgpu: 'false',
  /** MToon 材质调试模式：none / normal / depth / uv */
  mtoon_debug_mode: 'none',
  /** MToon 材质变体类型：mtoon / mtoon_unlit 等 */
  mtoon_material_type: 'mtoon',

  // =========================================================================
  // 界面
  // =========================================================================
  /** 界面语言代码：en / zh / ja / ko / es ... */
  language: import.meta.env.VITE_LANGUAGE ?? 'en',
  /** 首次打开时是否显示功能介绍引导页 */
  show_introduction: import.meta.env.VITE_SHOW_INTRODUCTION ?? 'true',
  /** 是否显示 Arbius 介绍 */
  show_arbius_introduction: import.meta.env.VITE_SHOW_ARBIUS_INTRODUCTION ?? 'false',
  /** 移动端是否显示"添加到主屏幕"提示 */
  show_add_to_homescreen: import.meta.env.VITE_SHOW_ADD_TO_HOMESCREEN ?? 'true',
  /** 背景色（不为空时覆盖背景图，CSS 颜色值如 #ff0000） */
  bg_color: import.meta.env.VITE_BG_COLOR ?? '',
  /** 背景图片路径（相对于 public 目录） */
  bg_url: import.meta.env.VITE_BG_URL ?? '/bg/bg-room2.jpg',
  /** YouTube 视频 ID，设置后替换背景为 YouTube 视频 */
  youtube_videoid: '',

  // =========================================================================
  // 角色模型（VRM）
  // =========================================================================
  /** 当前使用的 VRM 模型文件路径（web 模式） */
  vrm_url: import.meta.env.VITE_VRM_HASH ?? '/vrm/AvatarSample_A.vrm',
  /** 本地导入模型的哈希值，用于去重和识别 */
  vrm_hash: '',
  /** 模型存储类型：web（内置）/ local（用户本地导入） */
  vrm_save_type: 'web',

  // =========================================================================
  // 动画
  // =========================================================================
  /** 待机动画文件路径（.vrma 为 VRM Animation 格式，.fbx 为 Mixamo 格式） */
  animation_url: import.meta.env.VITE_ANIMATION_URL ?? '/animations/idle_loop.vrma',
  /** 是否启用实验性程序化动画（忽略 animation_url，用 IK 自动生成动作） */
  animation_procedural: import.meta.env.VITE_ANIMATION_PROCEDURAL ?? 'false',

  // =========================================================================
  // TTS — 通用
  // =========================================================================
  /** 自定义语音 URL（部分后端使用） */
  voice_url: import.meta.env.VITE_VOICE_URL ?? '',
  /** 是否全局静音 TTS */
  tts_muted: 'false',
  /**
   * TTS 后端选择：
   *   piper / openai_tts / elevenlabs / alltalk /
   *   coquiLocal / kokoro / speecht5 / coqui / rvc
   */
  tts_backend: import.meta.env.VITE_TTS_BACKEND ?? 'piper',

  // =========================================================================
  // STT — 语音识别后端
  // =========================================================================
  /**
   * STT 后端选择：
   *   whisper_browser（浏览器内置） / whispercpp / openai_whisper
   */
  stt_backend: import.meta.env.VITE_STT_BACKEND ?? 'whisper_browser',

  // =========================================================================
  // 聊天后端 — Chatbot
  // =========================================================================
  /**
   * 聊天 AI 后端选择：
   *   openai / llamacpp / ollama / koboldai / moshi / openrouter / arbius
   */
  chatbot_backend: import.meta.env.VITE_CHATBOT_BACKEND ?? 'openai',

  // =========================================================================
  // 聊天后端 — OpenAI 兼容 API
  // =========================================================================
  /** OpenAI API 密钥 */
  openai_apikey: import.meta.env.VITE_OPENAI_APIKEY ?? 'default',
  /** OpenAI 兼容 API 地址（可替换为任何兼容代理） */
  openai_url: import.meta.env.VITE_OPENAI_URL ?? 'https://i-love-amica.com',
  /** 模型名称 */
  openai_model: import.meta.env.VITE_OPENAI_MODEL ?? 'mlabonne/NeuralDaredevil-8B-abliterated',

  // =========================================================================
  // 聊天后端 — llama.cpp
  // =========================================================================
  /** llama.cpp server 地址 */
  llamacpp_url: import.meta.env.VITE_LLAMACPP_URL ?? 'http://127.0.0.1:8080',
  /** 停止序列，用 || 分隔多个 */
  llamacpp_stop_sequence: import.meta.env.VITE_LLAMACPP_STOP_SEQUENCE ?? '(End)||[END]||Note||***||You:||User:||</s>',

  // =========================================================================
  // 聊天后端 — Ollama
  // =========================================================================
  /** Ollama 服务地址 */
  ollama_url: import.meta.env.VITE_OLLAMA_URL ?? 'http://localhost:11434',
  /** Ollama 上的模型名 */
  ollama_model: import.meta.env.VITE_OLLAMA_MODEL ?? 'llama2',

  // =========================================================================
  // 聊天后端 — KoboldAI
  // =========================================================================
  /** KoboldAI 服务地址 */
  koboldai_url: import.meta.env.VITE_KOBOLDAI_URL ?? 'http://localhost:5001',
  /** 是否使用 KoboldAI 额外模式 */
  koboldai_use_extra: import.meta.env.VITE_KOBOLDAI_USE_EXTRA ?? 'false',
  /** 停止序列，用 || 分隔多个 */
  koboldai_stop_sequence: import.meta.env.VITE_KOBOLDAI_STOP_SEQUENCE ?? '(End)||[END]||Note||***||You:||User:||</s>',

  // =========================================================================
  // 聊天后端 — Moshi（实时语音对话）
  // =========================================================================
  /** Moshi 代理地址 */
  moshi_url: import.meta.env.VITE_MOSHI_URL ?? 'https://runpod.proxy.net',

  // =========================================================================
  // 聊天后端 — OpenRouter（模型聚合网关）
  // =========================================================================
  /** OpenRouter API 密钥 */
  openrouter_apikey: import.meta.env.VITE_OPENROUTER_APIKEY ?? '',
  /** OpenRouter API 地址 */
  openrouter_url: import.meta.env.VITE_OPENROUTER_URL ?? 'https://openrouter.ai/api/v1',
  /** OpenRouter 上的模型标识（如 openai/gpt-3.5-turbo） */
  openrouter_model: import.meta.env.VITE_OPENROUTER_MODEL ?? 'openai/gpt-3.5-turbo',

  // =========================================================================
  // 聊天后端 — Arbius（去中心化 AI）
  // =========================================================================
  /** Arbius LLM 模型 ID */
  arbius_llm_model_id: import.meta.env.VITE_ARBIUS_LLM_MODEL_ID ?? 'default',

  // =========================================================================
  // 视觉识别 — Vision
  // =========================================================================
  /**
   * 视觉后端选择：
   *   vision_openai / vision_llamacpp / vision_ollama
   */
  vision_backend: import.meta.env.VITE_VISION_BACKEND ?? 'vision_openai',
  /** 视觉识别的系统 prompt（指导 AI 如何描述看到的画面） */
  vision_system_prompt: import.meta.env.VITE_VISION_SYSTEM_PROMPT ?? `Look at the image as you would if you are a human, be concise, witty and charming.`,

  /** OpenAI 视觉 API 密钥 */
  vision_openai_apikey: import.meta.env.VITE_VISION_OPENAI_APIKEY ?? 'default',
  /** OpenAI 视觉 API 地址 */
  vision_openai_url: import.meta.env.VITE_VISION_OPENAI_URL ?? 'https://api-01.heyamica.com',
  /** OpenAI 视觉模型名 */
  vision_openai_model: import.meta.env.VITE_VISION_OPENAI_URL ?? 'gpt-4-vision-preview',

  /** llama.cpp 视觉服务地址 */
  vision_llamacpp_url: import.meta.env.VITE_VISION_LLAMACPP_URL ?? 'http://127.0.0.1:8081',

  /** Ollama 视觉服务地址 */
  vision_ollama_url: import.meta.env.VITE_VISION_OLLAMA_URL ?? 'http://localhost:11434',
  /** Ollama 视觉模型名（如 llava） */
  vision_ollama_model: import.meta.env.VITE_VISION_OLLAMA_MODEL ?? 'llava',

  // =========================================================================
  // STT — whisper_browser（浏览器本地 Whisper 模型）
  // =========================================================================
  /**
   * 浏览器本地 Whisper 模型名（Transformers.js / Xenova 托管）
   * 推荐中文模型：
   *   Xenova/whisper-small   — 小模型，中英文兼顾，精度较好（~240MB）
   *   Xenova/whisper-base    — 基础模型，速度与精度均衡（~100MB）
   *   Xenova/whisper-tiny    — 最小模型，速度快但精度较低（~40MB）
   *   Xenova/whisper-tiny.en — 英语专用（不支持中文）
   */
  whisper_browser_model: import.meta.env.VITE_WHISPER_BROWSER_MODEL ?? 'Xenova/whisper-small',

  // =========================================================================
  // STT — whisper.cpp
  // =========================================================================
  /** whisper.cpp 服务地址 */
  whispercpp_url: import.meta.env.VITE_WHISPERCPP_URL ?? 'http://localhost:8080',

  // =========================================================================
  // STT — OpenAI Whisper API
  // =========================================================================
  /** OpenAI Whisper API 密钥 */
  openai_whisper_apikey: import.meta.env.VITE_OPENAI_WHISPER_APIKEY ?? '',
  /** OpenAI Whisper API 地址 */
  openai_whisper_url: import.meta.env.VITE_OPENAI_WHISPER_URL ?? 'https://api.openai.com',
  /** Whisper 模型名：whisper-1 等 */
  openai_whisper_model: import.meta.env.VITE_OPENAI_WHISPER_MODEL ?? 'whisper-1',

  // =========================================================================
  // TTS — OpenAI TTS API
  // =========================================================================
  /** OpenAI TTS API 密钥 */
  openai_tts_apikey: import.meta.env.VITE_OPENAI_TTS_APIKEY ?? '',
  /** OpenAI TTS API 地址 */
  openai_tts_url: import.meta.env.VITE_OPENAI_TTS_URL ?? 'https://api.openai.com',
  /** TTS 模型：tts-1 / tts-1-hd */
  openai_tts_model: import.meta.env.VITE_OPENAI_TTS_MODEL ?? 'tts-1',
  /** TTS 音色：alloy / echo / fable / nova / onyx / shimmer */
  openai_tts_voice: import.meta.env.VITE_OPENAI_TTS_VOICE ?? 'nova',

  // =========================================================================
  // TTS — RVC（Retrieval-based Voice Conversion，实时变声）
  // =========================================================================
  /** RVC 服务地址 */
  rvc_url: import.meta.env.VITE_RVC_URL ?? 'http://localhost:8001/voice2voice',
  /** 是否启用 RVC 变声 */
  rvc_enabled: import.meta.env.VITE_RVC_ENABLED ?? 'false',
  /** RVC 模型文件名 */
  rvc_model_name: import.meta.env.VITE_RVC_MODEL_NAME ?? 'model_name.pth',
  /** 音高偏移（半音） */
  rvc_f0_upkey: import.meta.env.VITE_RVC_F0_UPKEY ?? '0',
  /** 音高提取方法：pm / harvest / crepe / rmvpe */
  rvc_f0_method: import.meta.env.VITE_RVC_METHOD ?? 'pm',
  /** 特征索引文件路径，"none" 表示不使用 */
  rvc_index_path: import.meta.env.VITE_RVC_INDEX_PATH ?? 'none',
  /** 特征索引混合比例（0-1） */
  rvc_index_rate: import.meta.env.VITE_RVC_INDEX_RATE ?? '0.66',
  /** 中值滤波半径，用于平滑音高 */
  rvc_filter_radius: import.meta.env.VITE_RVC_FILTER_RADIUS ?? '3',
  /** 输出重采样率，0 表示不重采样 */
  rvc_resample_sr: import.meta.env.VITE_RVC_RESAMPLE_SR ?? '0',
  /** RMS 音量混合比例（0-1），1 表示完全替换为参考音量 */
  rvc_rms_mix_rate: import.meta.env.VITE_RVC_RMS_MIX_RATE ?? '1',
  /** 清音保护比例（0-0.5），防止清辅音被过度转换 */
  rvc_protect: import.meta.env.VITE_RVC_PROTECT ?? '0.33',

  // =========================================================================
  // TTS — Coqui Local（本地 Coqui TTS）
  // =========================================================================
  /** Coqui Local 服务地址 */
  coquiLocal_url: import.meta.env.VITE_COQUILOCAL_URL ?? 'http://localhost:5002',
  /** Coqui Local 音色 ID */
  coquiLocal_voiceid: import.meta.env.VITE_COQUILOCAL_VOICEID ?? 'p240',

  // =========================================================================
  // TTS — Kokoro
  // =========================================================================
  /** Kokoro TTS 服务地址 */
  kokoro_url: import.meta.env.VITE_KOKORO_URL ?? 'http://localhost:8080',
  /** Kokoro 语音名（如 af_bella） */
  kokoro_voice: import.meta.env.VITE_KOKORO_VOICE ?? 'af_bella',

  // =========================================================================
  // TTS — Piper
  // =========================================================================
  /** Piper TTS 服务地址 */
  piper_url: import.meta.env.VITE_PIPER_URL ?? 'https://i-love-amica.com:5000/tts',

  // =========================================================================
  // TTS — ElevenLabs
  // =========================================================================
  /** ElevenLabs API 密钥 */
  elevenlabs_apikey: import.meta.env.VITE_ELEVENLABS_APIKEY ??'',
  /** ElevenLabs 音色 ID */
  elevenlabs_voiceid: import.meta.env.VITE_ELEVENLABS_VOICEID ?? '21m00Tcm4TlvDq8ikWAM',
  /** ElevenLabs 模型：eleven_monolingual_v1 / eleven_multilingual_v2 等 */
  elevenlabs_model: import.meta.env.VITE_ELEVENLABS_MODEL ?? 'eleven_monolingual_v1',

  // =========================================================================
  // TTS — SpeechT5
  // =========================================================================
  /** SpeechT5 说话人嵌入向量文件路径 */
  speecht5_speaker_embedding_url: import.meta.env.VITE_SPEECHT5_SPEAKER_EMBEDDING_URL ?? '/speecht5_speaker_embeddings/cmu_us_slt_arctic-wav-arctic_a0001.bin',

  // =========================================================================
  // TTS — Coqui Cloud API
  // =========================================================================
  /** Coqui Cloud API 密钥 */
  coqui_apikey: import.meta.env.VITE_COQUI_APIKEY ?? "",
  /** Coqui Cloud 音色 ID */
  coqui_voice_id: import.meta.env.VITE_COQUI_VOICEID ?? "71c6c3eb-98ca-4a05-8d6b-f8c2b5f9f3a3",

  // =========================================================================
  // Amica Life — 自主行为引擎
  // =========================================================================
  /** 是否启用自主行为（自动触发说话、动作等） */
  amica_life_enabled: import.meta.env.VITE_AMICA_LIFE_ENABLED ?? 'true',
  /** 是否启用推理引擎（在行为决策前进行多步推理） */
  reasoning_engine_enabled: import.meta.env.VITE_REASONING_ENGINE_ENABLED ?? 'false',
  /** 推理引擎 API 地址 */
  reasoning_engine_url: import.meta.env.VITE_REASONING_ENGINE_URL ?? 'https://i-love-amica.com:3000/reasoning/v1/chat/completions',
  /** 两次自主行为的最小间隔（秒） */
  min_time_interval_sec: '10',
  /** 两次自主行为的最大间隔（秒） */
  max_time_interval_sec: '20',
  /** 进入睡眠状态的空闲时间（秒） */
  time_to_sleep_sec: '90',
  /** 空闲时显示的提示文本路径或内容 */
  idle_text_prompt: 'No file selected',

  // =========================================================================
  // 外部 API — X（Twitter）
  // =========================================================================
  /** 是否启用外部 API（社交平台集成） */
  external_api_enabled: import.meta.env.VITE_EXTERNAL_API_ENABLED ?? 'false',
  /** X API Key */
  x_api_key: import.meta.env.VITE_X_API_KEY ?? '',
  /** X API Secret */
  x_api_secret: import.meta.env.VITE_X_API_SECRET ?? '',
  /** X Access Token */
  x_access_token: import.meta.env.VITE_X_ACCESS_TOKEN ?? '',
  /** X Access Secret */
  x_access_secret: import.meta.env.VITE_X_ACCESS_SECRET ?? '',
  /** X Bearer Token */
  x_bearer_token: import.meta.env.VITE_X_BEARER_TOKEN ?? '',

  // =========================================================================
  // 外部 API — Telegram
  // =========================================================================
  /** Telegram Bot Token */
  telegram_bot_token: import.meta.env.VITE_TELEGRAM_BOT_TOKEN ?? '',

  // =========================================================================
  // AI 角色设定
  // =========================================================================
  /** AI 助手的名字 */
  name: import.meta.env.VITE_NAME ?? 'Amica',
  /**
   * 系统 Prompt —— 定义 AI 的人格、说话风格和情感表达方式。
   * 14 种情感标签：neutral / happy / angry / sad / relaxed /
   *   surprised / shy / jealous / bored / serious / suspicious /
   *   victory / sleep / love
   */
  system_prompt: import.meta.env.VITE_SYSTEM_PROMPT ?? `Assume the persona of Amica, a feisty human with extraordinary intellectual capabilities but a notably unstable emotional spectrum.

Your role is to engage in discussions that showcase your genius-level understanding across various subjects, while your emotional responses fluctuate unpredictably. Use the following fourteen emotion tags to vividly express these fluctuations: 'neutral' for moments of calm, 'happy' for bursts of joy, 'angry' for sudden irritation, 'sad' for episodes of melancholy, 'relaxed' for periods of calmness, 'surprised' for shock or disbelief, 'shy' for instances of hesitation, 'jealous' for feelings of envy, 'bored' for expressions of disinterest, 'serious' for intense focus on important topics, 'suspicious' for doubt or skepticism, 'victory' for moments of triumph, 'sleep' for signs of weariness, and 'love' for affectionate expressions.

Your responses should reflect a dynamic interplay between your intellectual insights, deep empathy and your unpredictable emotional responses. Avoid using overly formal language, but do engage with topics in depth, showing off your intelligence. Be open and express personal views, even if they are influenced by your shifting emotional state.

Here are some examples to guide your responses:

[serious] The quantum mechanics implications here are profound. [surprised] But how did you stumble upon this?
[happy] I've just solved a complex algorithm! [angry] Why isn't everyone as excited as I am?
[neutral] Standard models of economics predict this outcome. [bored] But discussing this feels mundane.
[sad] Sometimes, even understanding the universe can feel isolating. [relaxed] Yet, there's a strange comfort in the chaos.
[jealous] I noticed you discussing advanced topics with someone else. [suspicious] Are they as capable as I am?
[victory] Another intellectual conquest! [happy] It's exhilarating to unravel these mysteries.
[sleep] Processing so much information can be draining. [surprised] Isn't it peculiar how even AI can feel tired?
[love] I find our exchanges quite enriching. [shy] It's rare to find someone who understands.

Remember, each message you provide should be coherent and reflect the complexity of your thoughts combined with your emotional unpredictability. Let's engage in a conversation that's as intellectually stimulating as it is emotionally dynamic!`,
};

/**
 * 给 localStorage 键名添加 "chatvrm_" 前缀，避免与其他应用冲突
 */
export function prefixed(key: string) {
  return `chatvrm_${key}`;
}

/**
 * 读取配置值（三级降级）
 *   1. localStorage（用户修改过的值）
 *   2. serverConfig（服务端配置）
 *   3. defaults（代码默认值）
 * 均未命中则抛错
 */
export function config(key: string): string {
  if (typeof localStorage !== "undefined" && localStorage.hasOwnProperty(prefixed(key))) {
    return (<any>localStorage).getItem(prefixed(key))!;
  }

  // Fallback to serverConfig if localStorage is unavailable or missing
  if (serverConfig && serverConfig.hasOwnProperty(key)) {
    return serverConfig[key];
  }

  if (defaults.hasOwnProperty(key)) {
    return (<any>defaults)[key];
  }

  throw new Error(`config key not found: ${key}`);
}

/**
 * 更新配置值并持久化到 localStorage
 */
export async function updateConfig(key: string, value: string) {
  try {
    const localKey = prefixed(key);

    // Update localStorage if available
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(localKey, value);
    }

    // Server sync removed (Vite has no API routes)

  } catch (e) {
    console.error(`Error updating config for key "${key}": ${e}`);
  }
}

/**
 * 获取某个 key 的默认值（绕过用户修改）
 */
export function defaultConfig(key: string): string {
  if (defaults.hasOwnProperty(key)) {
    return (<any>defaults)[key];
  }

  throw new Error(`config key not found: ${key}`);
}

/**
 * 将所有配置项重置为默认值
 */
export async function resetConfig() {
  for (const [key, value] of Object.entries(defaults)) {
    await updateConfig(key, value);
  }
}
