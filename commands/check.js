const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription('Check Account Info!').addUserOption(option => option
            .setName("user")
            .setDescription('User yang mau dicek')
            .setRequired(true)
            ),
            
        async execute(interaction){
            //FromDB
            const datas = await Datas.findOne({ discordid: { $eq: interaction.options.getUser('user').id }})

            if (!datas) {
                interaction.reply({ content: `User not found!` ,ephemeral: true});
                return
            }

            let JsonStringfy = await JSON.stringify(datas)
            let JsonRill = await JSON.parse(JsonStringfy)

            //Embed
             const embed = new MessageEmbed()
             .setColor(process.env.EMBEDCOLOR)
            .setTitle(`Info akun di ${interaction.guild.name}:`)
            .setAuthor({ name: interaction.options.getUser('user').username, iconURL: interaction.options.getUser('user').displayAvatarURL()})
            .addField(`GrowID`, `**${process.env.ARROW} ${JsonRill.namaplayer.toString()}**`, true)
            .addField(`Saldo`, `**${process.env.ARROW} ${JsonRill.jumlah.toString()}** ${process.env.WL}`, true)
            .setImage(process.env.GAMBARBANNER)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
        
            await interaction.reply({ embeds: [ embed ] ,ephemeral: false});
    }
}