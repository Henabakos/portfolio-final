import hljs from "highlight.js";

export const LANGUAGE_NAMES: Record<string, string> = {
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  python: "Python",
  py: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  cs: "C#",
  php: "PHP",
  ruby: "Ruby",
  rb: "Ruby",
  go: "Go",
  rust: "Rust",
  rs: "Rust",
  swift: "Swift",
  kotlin: "Kotlin",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  less: "Less",
  json: "JSON",
  xml: "XML",
  markdown: "Markdown",
  md: "Markdown",
  bash: "Bash",
  shell: "Shell",
  sh: "Shell",
  zsh: "Zsh",
  powershell: "PowerShell",
  ps1: "PowerShell",
  yaml: "YAML",
  yml: "YAML",
  toml: "TOML",
  graphql: "GraphQL",
  gql: "GraphQL",
  dockerfile: "Dockerfile",
  makefile: "Makefile",
  nginx: "Nginx",
  apache: "Apache",
  diff: "Diff",
  patch: "Patch",
  regex: "Regex",
  vim: "Vim",
  plaintext: "Plain Text",
  text: "Plain Text",
};

/**
 * Get supported language aliases
 */
export function getSupportedLanguages(): string[] {
  return hljs.listLanguages();
}

/**
 * Normalize language name to hljs identifier
 */
export function normalizeLanguage(lang: string): string {
  const normalized = lang.toLowerCase().trim();

  // Check direct match first
  if (getSupportedLanguages().includes(normalized)) {
    return normalized;
  }

  // Check aliases
  const aliases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    rb: "ruby",
    rs: "rust",
    cs: "csharp",
    cpp: "cpp",
    sh: "bash",
    yaml: "yml",
    ps1: "powershell",
    dockerfile: "dockerfile",
  };

  return aliases[normalized] || "plaintext";
}

/**
 * Highlight code block
 */
export function highlightCode(code: string, language: string = "plaintext"): string {
  const lang = normalizeLanguage(language);

  try {
    if (lang === "plaintext" || lang === "text") {
      return escapeHtml(code);
    }

    const highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true });
    return highlighted.value;
  } catch (error) {
    console.error(`Error highlighting ${lang}:`, error);
    return escapeHtml(code);
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Get language display name
 */
export function getLanguageName(lang: string): string {
  const normalized = normalizeLanguage(lang);
  return LANGUAGE_NAMES[normalized] || LANGUAGE_NAMES[lang] || "Code";
}

/**
 * Auto-detect language from code snippet
 */
export function detectLanguage(code: string): string {
  // For now, return plaintext by default
  // Could implement more sophisticated detection if needed
  return "plaintext";
}
