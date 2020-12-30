/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

import ApolloClient from 'apollo-boost';
import axios from 'axios';
import createError from 'http-errors'
import cookie from 'cookie';

export default async function handler(req, res) {
    const queryParams = req.query;

    const authRes = await axios.get('http://localhost:5000/auth/login/google', {
        params: queryParams
    });

    const {token} = authRes.data;
    if (!token) {
        throw createError(500, "Token not received. Please try again.");
    }

    res.setHeader('Set-Cookie', cookie.serialize('auth.id', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: true,
        path: '/',
        secure: false // Set to True if HTTPS/Production
    }));

    res.statusCode = 200;
    res.end();
}