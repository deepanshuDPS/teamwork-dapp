
let currentWindow;


if (typeof window!== "undefined" 
        && typeof window.ethereum !== "undefined"){
            // we are in the browser and metamask is running
            currentWindow = window;
}

export default currentWindow;