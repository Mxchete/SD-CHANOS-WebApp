const pool = require("../config");

async function handlePotNotifications(uuid, battery_level, water_level_is_low, total_sunlight) {
  console.log("handlePotNotifications called with:", {
    uuid,
    battery_level,
    water_level_is_low,
    total_sunlight,
  });

  const { rows: pots } = await pool.query(
    `SELECT pots.id, pots.user_id, pots.name, plants.maximum_sunlight
     FROM pots
     JOIN plants ON pots.plant_id = plants.id
     WHERE pots.id = $1`,
    [uuid]
  );

  if (pots.length === 0) {
    console.warn(`Pot ${uuid} not found for notifications`);
    return;
  }

  const pot = pots[0];
  console.log(pot);

  const notificationsToCreate = [];

  if (water_level_is_low) {
    notificationsToCreate.push({
      header: "Water Level Low",
      message: `Your pot ${pot.name} is running low on water, please refill it now!`,
    });
  }

  if (battery_level < 3) {
    notificationsToCreate.push({
      header: "Battery Level Low",
      message: `Your pot ${pot.name} has a low battery, please recharge it!`,
    });
  }

  if (total_sunlight > pot.maximum_sunlight) {
    notificationsToCreate.push({
      header: "Pot Sunlight Exceeded",
      message: `Your pot ${pot.name} has received more sunlight than recommended (${total_sunlight} > ${pot.maximum_sunlight}). Please move it to a shaded area!`,
    });
  }

  for (const notif of notificationsToCreate) {
    await pool.query(
      `INSERT INTO notifications (user_id, pot_id, header, message)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, pot_id, header)
       DO NOTHING;`,
      [pot.user_id, pot.id, notif.header, notif.message]
    );
  }

  if (!water_level_is_low) {
    await pool.query(
      `DELETE FROM notifications WHERE pot_id = $1 AND header = $2;`,
      [pot.id, "Water Level Low"]
    );
  }

  if (battery_level >= 3) {
    await pool.query(
      `DELETE FROM notifications WHERE pot_id = $1 AND header = $2;`,
      [pot.id, "Battery Level Low"]
    );
  }

  if (total_sunlight <= pot.maximum_sunlight) {
    await pool.query(
      `DELETE FROM notifications WHERE pot_id = $1 AND header = $2;`,
      [pot.id, "Pot Sunlight Exceeded"]
    );
  }
}

module.exports = {
  handlePotNotifications,
};

