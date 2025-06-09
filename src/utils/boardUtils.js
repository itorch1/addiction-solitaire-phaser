export function isWinningRow(row) {
  const correctOrder = ["ace", "2", "3", "4", "5", "6"];
  const suits = row.map((card) => card?.suit);
  const ranks = row.map((card) => card?.rank);

  const allSameSuit = suits.every((suit) => suit === suits[0]);
  const inCorrectOrder = ranks.every((rank, i) => rank === correctOrder[i]);

  return allSameSuit && inCorrectOrder;
}

export function generateBoard() {
  const suits = ["spades", "hearts", "diamonds", "clubs"];
  const ranks = ["ace", "2", "3", "4", "5", "6"];

  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        id: `${suit}_${rank}`,
        suit,
        rank,
      });
    });
  });

  const board = deck.concat([null, null, null, null]);

  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }

  return board;
}
