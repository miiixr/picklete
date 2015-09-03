import crypto from 'crypto';

module.exports = {
  generateHashCode: async () => {
    var token = await new Promise((resolve) =>
      crypto.randomBytes(20, (error, buf) => resolve(buf.toString("hex")))
    );
    return token;
  }
}
