const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("accdf")
        .setDescription('Tambah Akun 20 DF')
        .addStringOption(option => option
                .setName("username")
                .setDescription('Tambah Username')
                .setRequired(true)
                )
        .addStringOption(option => option
                .setName("password")
                .setDescription('Tambah Username')
                .setRequired(true)
                )
        .addStringOption(option => option
                .setName("email")
                .setDescription('Tambah Email')
                .setRequired(true)
                )
        .addStringOption(option => option
                .setName("emailpw")
                .setDescription('Tambah Password Email')
                .setRequired(true)
                )
        .addStringOption(option => option
                .setName("list")
                .setDescription('Tambah List World (pastebin raw)')
                .setRequired(true)
                )
        .addStringOption(option => option
                .setName("doorid")
                .setDescription('Tambah DoorID World')
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
                    { 'type': "SDF"},
                        { $push: { 'data': {$each:[
                    {Username:`${interaction.options.getString("username")}`,Password:`${interaction.options.getString("password")}`,Email:`${interaction.options.getString("email")}`,EmailPassword:`${interaction.options.getString("emailpw")}`,List:`${interaction.options.getString("list")}`,DoorID:`${interaction.options.getString("doorid")}`},
                ],$slice: -100} } },
                );

                const embed = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setTitle(`Added DF Account with 20 World`)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .addField('\u200b',`Username : **${interaction.options.getString("username")}**\nPassword : **${interaction.options.getString("password")}**\nEmail : **${interaction.options.getString("email")}**\nPassword Email : **${interaction.options.getString("emailpw")}**\nList : **${interaction.options.getString("list")}**\nDoorID : **${interaction.options.getString("doorid")}**\n`, true)
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