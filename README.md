# Start

Clone the repository by writing `git clone https://github.com/br0wnD3v/TodoWebApp-Web3.git` in your terminal.

# Adding the packages.

After cloning, go to `frontend` and then `backend` folders and add the dependencies using `yarn add`.

# Running the Web Application

### Add Hardhat network to your metamask wallet along with a new account funded with ETH on Hardhat.

Go to metamask and open the expanded view. Go to settings and under the networks section, add a new network
with the following config :
Network Name:Hardhat
RPC URL:http://127.0.0.1:8545
Chaind ID:31337
Currency Symbol:ETH

After you are done, go to the backend folder.
Run `yarn hardhat node`. This will start a local hardhat network. In the terminal you will get a list of
accounts. Pick the first one and import it to metamask using the private key visible in the terminal.
(Should show about 9999 ETH balance after importing.)

### Start the frontend

Go to the frontend folder and run `yarn dev`. This will start the web app at `localhost:3000`.
Visit the URL.
