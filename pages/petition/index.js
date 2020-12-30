/**
 * Created on 12/30/20 by jovialis (Dylan Hanson)
 **/

export function getServerSideProps() {
    return {
        redirect: {
            destination: '/',
            permanent: true
        }
    };
}

export default function BlankPetitionPage() {
    return <div/>
}