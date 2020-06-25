import axios from 'axios';

const LandingPage = ({ currentUser }) => {
    console.log('CUrrent user => ', currentUser)
    return <h1>Landing page</h1>;
};

// Function called during ssr.. takes the props from this func & push it into the component 
LandingPage.getInitialProps = async () => {

    if (typeof window === 'undefined') {
        // We are on the server!
        // http://NAME_OF_SERVICE_IN_WORKSPACE.NAMESPACE.svc.cluster.local
        // req should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
        const { data } = await axios.get(
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
            headers: {
                Host: 'tickethub.dev'
            }
        }
        );
        return { data };
    } else {
        // We are on the browser!
        // req should be made with base url ''
        const { data } = await axios.get('/api/users/currentuser');
        return data;
    }
}

export default LandingPage;