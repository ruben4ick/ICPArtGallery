# `icp-art-gallery`

This dApp allows artists to mint, store, and showcase their digital artworks as NFTs directly on-chain, without relying on traditional Web2 infrastructure.

It combines a modern frontend with a powerful backend canister, enabling users to explore, view, and interact with artworks in a fully decentralized environment.

Whether you're a developer, a crypto enthusiast, or a digital artist — you're in the right place.

## Running the project locally

You need to have yarn -v > 3.
```bash
npm install --global yarn
corepack enable
corepack prepare yarn@4.7.0 --activate
```
If you want to start working on your project right away, you might want to try the following commands:

```bash
cd icp-art-gallery/
dfx help
dfx canister --help
```

If you want to test your project locally, you can use the following commands:

```bash
# Installs the dependencies
yarn install

#Generates code from your canister's interface
yarn dfx:generate

# Builds the frontend
yarn build

# Starts the replica, running in the background
yarn dfx:start

# Deploys your canisters to the replica and generates your candid interface
yarn dfx:deploy

# Starts the frontend
yarn start
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor
