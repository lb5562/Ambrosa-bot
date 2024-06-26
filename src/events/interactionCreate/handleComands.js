const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client,interaction) => {
    if(!interaction.isCommand()) return;
    const localCommands = getLocalCommands();

    try{
         const commandObject = localCommands.find(command => command.name === interaction.commandName);
        if (!commandObject) return;

        if(commandObject.devOnly){
            if(!devs.includes(interaction.user.id)){
                interaction.reply({content:'You cannot use this command',ephemeral:true});
                return;
            }
        }
        if(commandObject.testOnly){
            if(testServer !== interaction.guild.id){
               interaction.reply({content:'This command cannot be used here',ephemeral:true});
                return;
            }
        }
            if(commandObject.permissionsRequired?.length){
                for(const permission of commandObject.permissionsRequired){
                    if(!interaction.member.permissions.has(permission)){
                        interaction.reply({content:'You do not have the required permissions to use this command',ephemeral:true});
                        break;
                    }
                }
            }
            if(commandObject.botPermission?.length){
                for(const permission of commandObject.botPermissions){
                    const bot = interaction.guild.members.me;
                    if(!bot.has(permission)){
                        interaction.reply({content:'I do not have the required permissions to use this command',ephemeral:true});
                        break;
                    }
                }
            }
        
        await commandObject.callback(client,interaction);
        }catch(error){
        console.log(`There was an error: ${error}`);
    }

};