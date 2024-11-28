const createGeoGuessrChallenge = require("./challenge");
const { saveData, deleteData, readData } = require("./db");

async function handleDailyChallenge(client) {
  let day =
    (
      await readData(
        `SELECT key, value FROM integer_key_value_store WHERE key=? LIMIT 1`,
        ["day"]
      )
    )?.[0]?.value || 18;
  day++;
  await saveData(
    `INSERT INTO integer_key_value_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ["day", day]
  );
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  const data = await readData(`SELECT * FROM maps`);
  if (data.length === 0) return;
  let lines = [[`__**KRCA GeoGuessr Dailies: Day ${day}**__`]];
  for (const map of data) {
    const parameters = {
      forbidMoving: map.forbidMoving === 1,
      forbidRotating: map.forbidRotating === 1,
      forbidZooming: map.forbidZooming === 1,
      map: map.map,
      rounds: 5,
      timeLimit: map.timeLimit,
    };
    const challengeLink = await createGeoGuessrChallenge(parameters);
    const type =
      map.forbidMoving && map.forbidRotating && map.forbidZooming
        ? "NMPZ"
        : map.forbidMoving
        ? "No Moving"
        : "Moving";
    lines.push(
      `${map.mapName} __${type}, ${formatTime(
        map.timeLimit
      )}__ ${challengeLink}`
    );
  }
  lines.push(`<@&${process.env.ROLE_ID}>`);
  await channel.send(lines.join("\n"));
}

async function handleAddMap(int) {
  const map = int.options.getString("map-id");
  const name = int.options.getString("map-name");
  const seconds = int.options.getInteger("seconds-per-round");
  const moving = int.options.getBoolean("moving");
  const panning = int.options.getBoolean("panning");
  const zooming = int.options.getBoolean("zooming");
  await saveData(
    `INSERT INTO maps (forbidMoving, forbidRotating, forbidZooming, map, mapName, timeLimit) VALUES (?, ?, ?, ?, ?, ?)`,
    [!moving, !panning, !zooming, map, name, seconds]
  );
  await int.reply({ ephemeral: true, content: "Added" });
}

async function handleRemoveMap(int) {
  const id = int.options.getInteger("id");
  await deleteData(`DELETE FROM maps WHERE id=?`, [id]);
  await int.reply({ ephemeral: true, content: "Deleted" });
}

async function handleListMaps(int) {
  const data = await readData(`SELECT * FROM maps`, []);
  await int.reply({ content: JSON.stringify(data, null, 2), ephemeral: true });
}

function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} sec`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  } else {
    return `${minutes} min ${remainingSeconds} sec`;
  }
}

module.exports = {
  handleAddMap,
  handleRemoveMap,
  handleListMaps,
  handleDailyChallenge,
};
