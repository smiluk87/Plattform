const bcrypt = require('bcrypt');
const db = require('./models'); // Sequelize-Modelle importieren

(async () => {
  try {
    // Alle Benutzer aus der Datenbank abrufen
    const users = await db.User.findAll();

    for (let user of users) {
      // Prüfen, ob das Passwort bereits gehasht ist
      if (!user.password.startsWith('$2b$')) {
        console.log(`Passwort für Benutzer ${user.email} wird gehasht...`);
        
        // Passwort hashen
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Gehashtes Passwort speichern
        user.password = hashedPassword;
        await user.save();

        console.log(`Passwort für Benutzer ${user.email} erfolgreich gehasht.`);
      } else {
        console.log(`Passwort für Benutzer ${user.email} ist bereits gehasht.`);
      }
    }

    console.log('Migration abgeschlossen.');
  } catch (error) {
    console.error('Fehler bei der Passwort-Migration:', error);
  }
})();
