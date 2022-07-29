import {ApiPromise, WsProvider, Keyring} from '@polkadot/api'
import {IKeyringPair} from "@polkadot/types/types";
import {metadata} from "@polkadot/types/interfaces/essentials";

const WEB_SOCKET  = 'ws://localhost:9944';

const connectSubstrate = async () => {
    const wsProvider = new WsProvider(WEB_SOCKET);
    const api = await ApiPromise.create({provider: wsProvider, types: {} });
    await api.isReady;
    console.log("connection to substrate is OK.");
    return api;
}

//substrate balance change
const subscribeAliceBalance = async (api: ApiPromise) => {
    const keyring = new Keyring({type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice');
    await api.query.system.account(alice.address, aliceAcct => {
        console.log("Subscribed to Alice account.");
        const aliceFreeSub = aliceAcct.data.free;
        console.log(`Alice Account (sub): ${aliceFreeSub}`);
    });
}


async function sleep(number: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('');
        }, number)
    });
}

const main = async () => {
    const api = await connectSubstrate();
    await subscribeAliceBalance(api);

    await sleep(600000);
    console.log("game over.");
};

main()
    .then(() => {
        console.log("successfully exited.");
        process.exit(0);
    })
    .catch(err => {
        console.log("error occur:", err);
        process.exit(1);
    })