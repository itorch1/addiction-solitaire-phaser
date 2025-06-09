import { getCardTextureName } from "./positionUtils";

export function createCardSprite(scene, card, x, y, index) {
  const sprite = scene.add
    .image(x, y, getCardTextureName(card))
    .setOrigin(0.5)
    .setScale(scene.SCALE)
    .setInteractive({ useHandCursor: true });

  sprite.setData("index", index);
  scene.input.setDraggable(sprite);

  sprite.on("pointerover", () => {
    scene.tweens.add({
      targets: sprite,
      scale: scene.SCALE * 1.1,
      duration: 200,
      ease: "Power1",
    });
  });

  sprite.on("pointerout", () => {
    scene.tweens.add({
      targets: sprite,
      scale: scene.SCALE,
      duration: 200,
      ease: "Power1",
    });
  });

  return sprite;
}
