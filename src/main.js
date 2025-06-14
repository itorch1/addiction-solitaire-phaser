import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import './style.css'

const config = {
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  backgroundColor: "#0a5e20",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [GameScene]
};

new Phaser.Game(config);
