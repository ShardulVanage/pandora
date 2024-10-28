import PocketBase from 'pocketbase';

const url = 'https://pandora24.pockethost.io'
export  const client = new PocketBase(url)
client.autoCancellation(false)