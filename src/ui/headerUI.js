export function updateHeaderText(scene) {
  const minutes = Math.floor(scene.timerSeconds / 60);
  const seconds = scene.timerSeconds % 60;
  const time = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  scene.headerText.setText(`Score: ${scene.score}   Time: ${time}   Moves: ${scene.moves}`);
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
