const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("account")
        .setDescription('Tambah Data Akun')
        .addStringOption(option => option
                .setName("kode")
                .setDescription('Tambah Kode Akun')
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
                ),
            
            
        async execute(interaction){
            if (interaction.member.roles.cache.has(process.env.OWNERID) === false ){
                await interaction.reply({ content: "No Admin Role" ,ephemeral: true});
		        console.log(interaction.user.username + " : Role Owner :" +interaction.member.roles.cache.has(process.env.OWNERID))
		        console.log(interaction.user.username + " : Role CO Owner :" +interaction.member.roles.cache.has(process.env.OWNERID))
                return;
            }else{
                const TambahBarangCid = await Rdp.updateOne(
                    { 'type': interaction.options.getString("kode").toUpperCase()},
                        { $push: { 'data': {$each:[
                    {Email:`${interaction.options.getString("email")}`,Password:`${interaction.options.getString("emailpw")}`},
                ],$slice: -100} } },
                );

                const embed = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setTitle(`Account Added\n`)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .addField('\u200b',`Kode : **${interaction.options.getString("kode").toUpperCase()}**\nEmail : **${interaction.options.getString("email")}**\nPassword : **${interaction.options.getString("emailpw")}**`, true)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
                
                TambahBarangCid;
                await interaction.reply({ 
                    embeds: [embed],
                    ephemeral: true
                });
            }
    }
}