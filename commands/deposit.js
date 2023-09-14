const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription('See Deposit Info Here!'),
        
        async execute(interaction){
            const embed = new MessageEmbed()
            .setColor(process.config.EMBEDCOLOR)
            .setTitle(`Help Command`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .addField('World Depo', `${process.config.ARROW} World : **${process.config.DEPOWORLD}**\n${process.config.ARROW} Owner : **${process.config.DEPOOWNER}**`, true)
            .setTimestamp()
            .setImage(process.config.GAMBARBANNER)
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
            await interaction.user.send({
                embeds: [embed],
                ephemeral: false
            });
            interaction.reply({ content: `Check Ur Dms` ,ephemeral: true})
        }
}