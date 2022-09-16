import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// não esquecer de voltar a config padrão
async function conectionData (): Promise<Connection>{
    const defaultOptions = await getConnectionOptions()
    return createConnection(defaultOptions);
} 

export {conectionData};