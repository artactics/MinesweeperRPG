/**
 * SVG アイコンの HTML を生成（iconColor 指定時はマスクで着色）
 * @param {{ iconUrl?: string, iconColor?: string, color?: string, name?: string } | null} source
 * @param {string} sizeClass
 * @returns {string}
 */
export function renderIconHtml(source, sizeClass = "gi-icon-sm") {
  if (!source?.iconUrl) return "";

  const { iconUrl, name = "" } = source;
  const color = source.iconColor ?? source.color;

  if (color) {
    return (
      `<span class="icon-tint gi-icon ${sizeClass}" ` +
      `style="--icon-color:${color};--icon-url:url('${iconUrl}')" ` +
      `role="img" aria-label="${name}"></span>`
    );
  }

  return `<img src="${iconUrl}" class="gi-icon ${sizeClass}" alt="${name}" aria-hidden="true">`;
}

/** @deprecated renderIconHtml を使用 */
export const renderEnemyIconHtml = renderIconHtml;
