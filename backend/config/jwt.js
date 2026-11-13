/**
 * JWT Authentication Configuration & Utilities
 * Supports jsonwebtoken package with built-in crypto HMAC-SHA256 fallback.
 */
const crypto = require('crypto');

let jwtPackage;
try {
    jwtPackage = require('jsonwebtoken');
} catch (e) {
    // Fallback active
}

const JWT_SECRET = process.env.JWT_SECRET || 'ucu_study_group_finder_super_secret_jwt_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString('utf8');
}

function generateToken(payload) {
    if (jwtPackage) {
        return jwtPackage.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    // Native JWT implementation
    const header = { alg: 'HS256', typ: 'JWT' };
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + (7 * 24 * 60 * 60); // 7 days

    const tokenPayload = {
        ...payload,
        iat: issuedAt,
        exp: expiresAt
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(data)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${data}.${signature}`;
}

function verifyToken(token) {
    if (jwtPackage) {
        return jwtPackage.verify(token, JWT_SECRET);
    }

    // Native verification
    if (!token || typeof token !== 'string') {
        throw new Error('Token is missing or invalid');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Malformed token structure');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(data)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    if (signature !== expectedSignature) {
        throw new Error('Invalid token signature');
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
        throw new Error('Token has expired');
    }

    return payload;
}

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    generateToken,
    verifyToken
};
