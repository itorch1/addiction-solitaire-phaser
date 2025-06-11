export function updateHeaderText(scene) {
  const isViewportSmall = scene.scale.height < 700;

  const minutes = Math.floor(scene.timerSeconds / 60);
  const seconds = scene.timerSeconds % 60;
  const time = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  if (!isViewportSmall)
    scene.headerText.setText(
      `Score: ${scene.score}   Time: ${time}   Moves: ${scene.moves}`
    );
  else
    scene.headerText.setText(
      `Score: ${scene.score}\nTime: ${time}\nMoves: ${scene.moves}`
    );
}

export function startTimerEvent(scene) {
  return scene.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      scene.timerSeconds++;
      updateHeaderText(scene);
    },
  });
}
