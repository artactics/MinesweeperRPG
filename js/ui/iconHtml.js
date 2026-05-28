/**
 * アセット URL をドキュメント基準の絶対パスに変換
 * @param {string} iconUrl
 * @returns {string}
 */
export function resolveAssetUrl(iconUrl) {
  if (!iconUrl) return "";
  if (/^(https?:|data:|blob:)/i.test(iconUrl)) return iconUrl;
  const path = iconUrl.replace(/^\.\//, "");
  try {
    return new URL(path, document.baseURI).href;
  } catch {
    return iconUrl;
  }
}

/**
 * SVG アイコンの HTML を生成（白シルエット SVG をマスクで着色）
 * @param {{ iconUrl?: string, iconColor?: string, color?: string, name?: string } | null} source
 * @param {string} sizeClass
 * @returns {string}
 */
export function renderIconHtml(source, sizeClass = "gi-icon-sm") {
  if (!source?.iconUrl) return "";

  const url = resolveAssetUrl(source.iconUrl);
  const name = (source.name || "").replace(/"/g, "&quot;");
  const color = source.iconColor ?? source.color;

  if (color) {
    return (
      `<span class="icon-tint gi-icon ${sizeClass}" ` +
      `style="background-color:${color};` +
      `-webkit-mask-image:url(&quot;${url}&quot;);mask-image:url(&quot;${url}&quot;);` +
      `-webkit-mask-mode:luminance;mask-mode:luminance;` +
      `-webkit-mask-size:contain;mask-size:contain;` +
      `-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;` +
      `-webkit-mask-position:center;mask-position:center;" ` +
      `role="img" aria-label="${name}"></span>`
    );
  }

  return `<img src="${url}" class="gi-icon ${sizeClass}" alt="${name}" aria-hidden="true">`;
}

/** @deprecated renderIconHtml を使用 */
export const renderEnemyIconHtml = renderIconHtml;
