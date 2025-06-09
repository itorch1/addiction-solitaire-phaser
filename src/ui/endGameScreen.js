export function createEndGameScreen(scene) {
  const { width, height } = scene.scale;

  scene.endScreenGroup = scene.add.container().setDepth(1000);
  const overlay = scene.add.rectangle(0, 0, width, height, 0x000000, 0.5)
    .setOrigin(0)
    .setInteractive();

  const title = scene.add.text(width / 2, height / 2 - 40, "🎉 You Won!", {
    fontSize: "48px",
    fontFamily: "Arial",
    color: "#ffffff",
  }).setOrigin(0.5);

  const buttonBg = scene.add.rectangle(width / 2, height / 2 + 30, 200, 50, 0xffffff, 1)
    .setStrokeStyle(2, 0x000000)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => scene.scene.restart());

  const buttonText = scene.add.text(width / 2, height / 2 + 30, "Play again?", {
    fontSize: "20px",
    fontFamily: "Arial",
    color: "#000000",
  }).setOrigin(0.5);

  scene.endScreenGroup.add([overlay, title, buttonBg, buttonText]);
}

export function hideEndGameScreen(scene) {
  scene.endScreenGroup.setVisible(false);
}

export function showEndGameScreen(scene) {
  scene.endScreenGroup.setVisible(true);
}
