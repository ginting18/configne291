const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("cid")
        .setDescription('Tambah List CID')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Tambah Kode CID')
            .setRequired(true)
            )
        .addStringOption(option => option
                .setName("cidlist")
                .setDescription('Tambah List CID (pastebin raw)')
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
                    { 'type': interaction.options.getString("kode").toUpperCase()},
                        { $push: { 'data': {$each:[
                    {CIDList:`${interaction.options.getString("cidlist")}`},
                ],$slice: -100} } },
                );

                const embed = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setTitle(`Added CID List`)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .addField('\u200b',`Kode : **${interaction.options.getString("kode").toUpperCase()}**\nCIDList : **${interaction.options.getString("cidlist")}**`, true)
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