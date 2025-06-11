const rankOrder = ["ace", "2", "3", "4", "5", "6"];

export function isValidMove(card, targetIndex, board) {
  if (targetIndex === -1) return false;

  const col = targetIndex % 7;
  if (col === 0) return card.rank === "ace";

  const leftCard = board[targetIndex - 1];
  if (!leftCard) return false;

  return (
    leftCard.suit === card.suit &&
    rankOrder.indexOf(card.rank) === rankOrder.indexOf(leftCard.rank) + 1
  );
}
