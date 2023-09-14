const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("license")
        .setDescription('Tambah Stock License')
        .addStringOption(option => option
                .setName("license")
                .setDescription('Tambah License')
                .setRequired(true)
                ),
            
            
        async execute(interaction){
            if (interaction.member.roles.cache.has(process.env.OWNERID) === false ){
                await interaction.reply({ content: "No Admin Role" ,ephemeral: true});
		        console.log(interaction.user.username + " : Role Owner :" +interaction.member.roles.cache.has(process.env.OWNERID))
		        console.log(interaction.user.username + " : Role CO Owner :" +interaction.member.roles.cache.has(process.env.ADMINID))
                return;
            }else{
                const TambahLicense = await Rdp.updateOne(
                    { 'type': "LICENSE"},
                        { $push: { 'data': {$each:[
                    {License:`${interaction.options.getString("license")}`},
                ],$slice: -100} } },
                );

                const embed = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setTitle(`Added 1 License`)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .addField('\u200b',`License : **${interaction.options.getString("license")}**`, true)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
                
                TambahLicense;
                await interaction.reply({ 
                    embeds: [embed],
                    ephemeral: true
                });
            }
    }
}