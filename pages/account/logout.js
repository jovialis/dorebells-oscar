/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

import cookie from 'cookie';

export async function getServerSideProps(context) {
    context.res.setHeader('Set-Cookie', cookie.serialize('auth.id', 'kill', {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: true,
        path: '/',
        expires: new Date(),
        secure: false // Set to True if HTTPS/Production
    }));

    return {
        redirect: {
            destination: '/account/login',
            permanent: false
        }
    };
}

export default function PageLogout() {
    return <div/>
}