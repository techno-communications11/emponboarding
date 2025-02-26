import crypto from'crypto'

function generateSecurityKey() {
    return crypto.randomBytes(64).toString('hex');
}

const securityKey = generateSecurityKey();
console.log(`Generated Security Key: ${securityKey}`);