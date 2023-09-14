const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("checkuser")
        .setDescription('Check Ur User!'),
            
        async execute(interaction){
            //FromDB
            const datas = await Datas.findOne({ discordid: { $eq: interaction.user.id }})

            if (!datas) {
                interaction.reply({ content: `Set Growid /setuser <namabot>` ,ephemeral: true});
                return
            }

            let JsonStringfy = await JSON.stringify(datas)
            let JsonRill = await JSON.parse(JsonStringfy)

            //Embed
            const embed = new MessageEmbed()
            .setColor(process.env.EMBEDCOLOR)
            .setTitle(`Info akun di ${interaction.guild.name}:`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .addField(`GrowID`, `**${process.env.ARROW} ${JsonRill.namaplayer.toString()}**`, true)
            .setImage(process.env.GAMBARBANNER)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
            await interaction.user.send({
                embeds: [embed],
                ephemeral: false
            });
            
            const jokomko = new MessageEmbed()
            .setColor(process.env.EMBEDCOLOR)
            .setDescription(`Check Ur Dm!`);
            await interaction.reply({ embeds: [ jokomko ] ,ephemeral: true})
        }
}