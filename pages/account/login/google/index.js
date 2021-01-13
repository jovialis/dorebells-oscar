/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

import passport from 'passport';
import {Strategy} from 'passport-google-oauth20';

// Configure Passport for client authentication
passport.use(new Strategy({
    clientID: '50093773335-hloobkd9o2i768oru4dpe5du2r652jsa.apps.googleusercontent.com',
    clientSecret: 'ovhnpPTAWujyuD9OJ6zA0sFz',
    callbackURL: '/account/login/google/redirect'
},  function () {
    // Null
}));

// This gets called on every request
export async function getServerSideProps(context) {
    const middleware = passport.authenticate('google', {
        hd: 'vanderbilt.edu',
        prompt: 'select_account',
        scope: ['email', 'profile', 'openid'],
        session: false,
        state: context.query.callback
    });

    middleware(context.req, context.res);

    return { props: {} };
}

export default function GoogleLoginPage() {
    return <div/>
}