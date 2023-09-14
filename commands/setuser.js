const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("setuser")
        .setDescription('Set Your GrowID in Growtopia')
        .addStringOption(option => 
            option.setName('player')
                    .setDescription('Register Player To Database')
                    .setRequired(true)),
            
        async execute(interaction){
            //FromDB
            const datas = await Datas.findOne({ discordid: { $eq: interaction.user.id }})
            const usernames = await Datas.findOne({ namaplayer: { $eq: interaction.options.getString('player').toUpperCase() }})
            //CreateDB
            if (usernames){
                interaction.reply({ content: `${interaction.options.getString('player').toUpperCase()} The user already used! ` ,ephemeral: true});
                return
            }

            if (!datas) {
                    await Datas.create({
                    discordid: interaction.user.id,
                    namaplayer: interaction.options.getString('player').toUpperCase(),
                    namabarang: 'World Lock',
                    jumlah: 0
                })
                interaction.reply({ content: `Growid set to ${interaction.options.getString('player').toUpperCase()}` ,ephemeral: false});
                return
            }
            //Embed
            await Datas.findOneAndUpdate({discordid: interaction.user.id },{ namaplayer: interaction.options.getString('player').toUpperCase()})
             const embed = new MessageEmbed()
             .setColor(process.env.EMBEDCOLOR)
            .setDescription(`GrowID set to ${interaction.options.getString('player').toUpperCase()}`)
        
            await interaction.reply({ embeds: [ embed ] ,ephemeral: false});
    }
}