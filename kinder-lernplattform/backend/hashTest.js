const bcrypt = require('bcrypt');

bcrypt.hash('password12345', 10, (err, hash) => {
  if (err) console.error(err);
  else console.log('Gehashtes Passwort:', hash);
});
