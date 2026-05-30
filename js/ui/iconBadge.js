import { renderIconHtml } from "./iconHtml.js";

/**
 * 着色 SVG を背景付きバッジで表示（メニュー UI 向け）
 * @param {{ iconUrl?: string, iconColor?: string, color?: string, name?: string } | null} source
 * @param {"sm"|"md"|"lg"|"xl"} size
 */
export function renderIconBadge(source, size = "md") {
  if (!source?.iconUrl) return "";

  const color = source.iconColor ?? source.color ?? "#888888";
  const icon = renderIconHtml(source, `gi-icon-badge gi-icon-badge--${size}`);

  return (
    `<span class="ui-icon-badge ui-icon-badge--${size}" ` +
    `style="--badge-color:${color};--badge-bg:${color}22;--badge-border:${color}66">` +
    icon +
    `</span>`
  );
}

/**
 * アイコンバッジ付きボタン HTML
 * @param {object} source - アイコン定義
 * @param {string} label
 * @param {"toolbar"|"primary"|"ghost"|"enter"} variant
 * @param {"sm"|"md"|"lg"} [badgeSize]
 */
export function renderIconButtonContent(source, label, variant = "toolbar", badgeSize = "sm") {
  const badge = renderIconBadge(source, badgeSize);
  if (variant === "enter") {
    return `${badge}<span class="ui-btn__label">${label}</span>`;
  }
  return `${badge}<span class="ui-btn__label">${label}</span>`;
}

/**
 * 見出し行（バッジ + タイトル）
 */
export function renderIconHeading(source, title, badgeSize = "md") {
  return (
    `<span class="ui-heading">` +
    `${renderIconBadge(source, badgeSize)}` +
    `<span class="ui-heading__text">${title}</span>` +
    `</span>`
  );
}

/**
 * 機能紹介・リスト行
 */
export function renderIconFeatureRow(source, text) {
  return (
    `<div class="ui-feature-row">` +
    `${renderIconBadge(source, "md")}` +
    `<span class="ui-feature-row__text">${text}</span>` +
    `</div>`
  );
}

/**
 * ステータス pill（任意でアイコン付き）
 */
export function renderStatPill(content, modifier = "") {
  const cls = modifier ? `stat-pill stat-pill--${modifier}` : "stat-pill";
  return `<span class="${cls}">${content}</span>`;
}

/** リスト行用のアイテム／敵アイコン */
export function renderItemIcon(source) {
  return renderIconBadge(source, "sm");
}
