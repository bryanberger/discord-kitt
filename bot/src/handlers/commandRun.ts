import { Command } from 'discord.js-commando'
import { commands } from '../lib/database'


export default async (command: Command) => {
    // parse out the command name
    const name = command.name
    // increment it and add it as a key to the commands table
    const count: number = (await commands.get(name)) || 0
    await commands.set(name, count + 1)
}
