// src/scenes/GameScene.js
import Phaser from "phaser";
import { CARD_CONFIG } from "../config/constants";
import {
  createEndGameScreen,
  hideEndGameScreen,
  showEndGameScreen,
} from "../ui/endGameScreen";
import { startTimerEvent, updateHeaderText } from "../ui/headerUI";
import { generateBoard, isWinningRow } from "../utils/boardUtils";
import { getSlotPosition } from "../utils/positionUtils";
import { createCardSprite } from "../utils/spriteFactory";
import { isValidMove } from "../utils/rules";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.SCALE = CARD_CONFIG.SCALE;
    this.CARD_WIDTH = CARD_CONFIG.CARD_WIDTH * this.SCALE;
    this.CARD_HEIGHT = CARD_CONFIG.CARD_HEIGHT * this.SCALE;
    this.GAP = CARD_CONFIG.GAP;
  }

  preload() {
    const suits = ["spades", "hearts", "clubs", "diamonds"];
    const values = ["ace", "2", "3", "4", "5", "6"];

    for (const suit of suits)
      for (const value of values)
        this.load.image(
          `${value}_of_${suit}`,
          new URL(`../assets/cards/${value}_of_${suit}.png`, import.meta.url)
            .href
        );

    this.load.image("empty_slot", "src/assets/cards/empty_slot.png");
  }

  create() {
    this.initState();

    createEndGameScreen(this);
    hideEndGameScreen(this);

    this.setupHeaderUI();
    this.handleResize(this.scale.gameSize);
    this.scale.on("resize", this.handleResize, this);

    this.renderBoard();
    this.setupDragHandlers();
  }

  initState() {
    this.board = generateBoard();
    this.cardSprites = [];
    this.slotPositions = [];
    this.winGlows = [];
    this.moves = 0;
    this.timerSeconds = 0;
    this.score = 0;
    this.winTriggered = false;
  }

  setupHeaderUI() {
    const styles = {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#fff",
      
    };

    this.headerText = this.add
      .text(this.scale.width / 2, 20, "", styles)
      .setOrigin(0.5, 0)
      .setLineSpacing(10);

    this.timerEvent = startTimerEvent(this);
  }

  renderBoard() {
    this.board.forEach((card, i) => {
      const { x, y } = getSlotPosition(i, this);
      this.slotPositions[i] = { x, y };

      if (!card) return;

      const sprite = createCardSprite(this, card, x, y, i);
      this.cardSprites.push(sprite);
    });
  }

  setupDragHandlers() {
    this.input.on("dragstart", (_, gameObject) => {
      this.children.bringToTop(gameObject);
      gameObject.setAlpha(0.8);
    });

    this.input.on("drag", (_, gameObject, dragX, dragY) => {
      gameObject.setPosition(dragX, dragY);
    });

    this.input.on("dragend", (pointer, gameObject) => {
      const fromIndex = gameObject.getData("index");
      const toIndex = this.findEmptySlotIndex(pointer.x, pointer.y);

      const [rank, _, suit] = gameObject.texture.key.split("_");
      const card = { rank, suit };
      const isValid = toIndex !== -1 && isValidMove(card, toIndex, this);
      const targetPos = isValid
        ? this.slotPositions[toIndex]
        : this.slotPositions[fromIndex];

      this.tweens.add({
        targets: gameObject,
        x: targetPos.x,
        y: targetPos.y,
        duration: isValid ? 150 : 400,
        ease: "Power2",
      });

      if (isValid) {
        this.moves++;
        this.board[toIndex] = this.board[fromIndex];
        this.board[fromIndex] = null;
        gameObject.setData("index", toIndex);
        this.checkWinningRows();
      }

      gameObject.setAlpha(1);
      updateHeaderText(this);
    });
  }

  findEmptySlotIndex(x, y) {
    const threshold = Math.max(this.CARD_WIDTH, this.CARD_HEIGHT) * 0.4;

    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] !== null) continue;
      const { x: sx, y: sy } = this.slotPositions[i];
      if (Phaser.Math.Distance.Between(x, y, sx, sy) < threshold) return i;
    }
    return -1;
  }

  checkWinningRows() {
    let winCount = 0;
    this.winGlows.forEach((g) => g.destroy());
    this.winGlows = [];

    for (let row = 0; row < 4; row++) {
      const start = row * 7;
      const rowCards = this.board.slice(start, start + 6);

      if (isWinningRow(rowCards)) {
        winCount++;
        const { x, y } = getSlotPosition(start, this);

        const glow = this.add.graphics();
        glow.lineStyle(6, 0xffd700, 0.8);
        glow.strokeRoundedRect(
          x - this.CARD_WIDTH / 2 - 6,
          y - this.CARD_HEIGHT / 2 - 6,
          (this.CARD_WIDTH + this.GAP) * 7 - this.GAP + 12,
          this.CARD_HEIGHT + 12,
          12
        );
        glow.setDepth(0);
        this.winGlows.push(glow);
      }
    }

    this.calculateLiveScore();

    if (winCount === 4 && !this.winTriggered) {
      this.winTriggered = true;

      const timeBonus =
        this.timerSeconds < 60
          ? 3000
          : this.timerSeconds < 120
          ? 2000
          : this.timerSeconds < 180
          ? 1000
          : 0;
      const moveBonus =
        this.moves < 30
          ? 3000
          : this.moves < 50
          ? 2000
          : this.moves < 70
          ? 1000
          : 0;

      this.score += timeBonus + moveBonus;
      updateHeaderText(this);
      this.time.removeAllEvents();
      showEndGameScreen(this);
    }
  }

  calculateLiveScore() {
    let liveScore = 0;
    const expectedRanks = ["ace", "2", "3", "4", "5", "6"];

    for (let row = 0; row < 4; row++) {
      const start = row * 7;
      let suit = null;
      let sequenceValid = true;

      for (let i = 0; i < 6; i++) {
        const card = this.board[start + i];
        if (
          !card ||
          card.rank !== expectedRanks[i] ||
          (i > 0 && card.suit !== suit)
        ) {
          sequenceValid = false;
          break;
        }
        suit = card.suit;
        liveScore += 100;
      }

      if (sequenceValid) liveScore += [1000, 2000, 3000, 5000][row];
    }

    this.score = liveScore;
    updateHeaderText(this);
  }

  handleResize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    // Reposition header
    const isViewportSmall = height < 700;
    if (isViewportSmall) this.headerText.setPosition(80, height / 2 - 50);
    else this.headerText.setPosition(width / 2, 20);

    updateHeaderText(this)

    // Recalculate and store new slot positions
    this.slotPositions = this.board.map((_, i) => getSlotPosition(i, this));

    // Move all cards to their new positions
    this.cardSprites.forEach((sprite) => {
      const index = sprite.getData("index");
      const { x, y } = this.slotPositions[index];
      sprite.setPosition(x, y);
    });

    // Recalculate end screen layout if visible
    if (this.endScreenGroup?.visible) {
      this.endScreenGroup.setSize(width, height);
      this.endScreenGroup.list.forEach((child) => {
        if (child.setPosition) {
          // Example: you may want to reposition each text/button manually here
        }
      });
    }

    // Re-render win glow outlines
    this.checkWinningRows();
  }
}
