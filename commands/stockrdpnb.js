const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("addrdpnb")
        .setDescription('Restocking RDP')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Tambah Kode CID')
            .setRequired(true)
            )
        .addStringOption(option => option
                .setName("ip")
                .setDescription('Add IP')
                .setRequired(true)
                )
        .addStringOption(option => option
                .setName("username")
                .setDescription('Add Username')
                .setRequired(true)
                )
        .addStringOption(option => option
                .setName("password")
                .setDescription('Add Password')
                .setRequired(true)
                ),
            
            
        async execute(interaction){
            if (interaction.member.roles.cache.has(process.env.OWNERID) === false ){
                await interaction.reply({ content: "No Admin Role" ,ephemeral: true});
		        console.log(interaction.user.username + " : Role Owner :" +interaction.member.roles.cache.has(process.env.OWNERID))
		        console.log(interaction.user.username + " : Role CO Owner :" +interaction.member.roles.cache.has(process.env.OWNERID))
                return;
            }else{
                const TambahLicense = await Rdp.updateOne(
                    { 'type': interaction.options.getString("kode").toUpperCase()},
                        { $push: { 'data': {$each:[
                    {IP:`${interaction.options.getString("ip")}`,Username:`${interaction.options.getString("username")}`,Password:`${interaction.options.getString("password")}`},
                ],$slice: -100} } },
                );

                const embed = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setTitle(`Added RDP`)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .addField('\u200b',`Kode : **${interaction.options.getString("kode").toUpperCase()}**\nIP : **${interaction.options.getString("ip")}**\nUsername : **${interaction.options.getString("username")}**\nPassword : **${interaction.options.getString("password")}**\n`, true)
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