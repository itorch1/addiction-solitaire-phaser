export function getCardTextureName(card) {
  return `${card.rank}_of_${card.suit}`;
}

export function getSlotPosition(index, scene) {
  const row = Math.floor(index / 7);
  const col = index % 7;
  const { CARD_WIDTH, CARD_HEIGHT, GAP } = scene;
  const offsetX = (scene.scale.width - (7 * CARD_WIDTH + 6 * GAP)) / 2;
  const offsetY = (scene.scale.height - (4 * CARD_HEIGHT + 3 * GAP)) / 2;

  const x = offsetX + col * (CARD_WIDTH + GAP) + CARD_WIDTH / 2;
  const y = offsetY + row * (CARD_HEIGHT + GAP) + CARD_HEIGHT / 2;
  return { x, y };
}
