/**
 * 敵アイコン（asset/images の SVG）の HTML を生成する
 * @param {{ iconUrl?: string, emoji?: string, name?: string } | null} source - 敵タイプまたは Enemy インスタンス
 * @param {string} sizeClass - gi-icon のサイズ用クラス名
 * @returns {string}
 */
export function renderEnemyIconHtml(source, sizeClass = "gi-icon-sm") {
  if (!source) return "";

  const { iconUrl, emoji = "?", name = "" } = source;
  const alt = name || emoji;

  if (iconUrl) {
    return `<img src="${iconUrl}" class="gi-icon ${sizeClass}" alt="${alt}" aria-hidden="true">`;
  }

  return `<span aria-hidden="true" style="font-size:16px">${emoji}</span>`;
}
