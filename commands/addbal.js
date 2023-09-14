const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Datas = require('../model/playerSchema')

module.exports={
    data: new SlashCommandBuilder()
        .setName("give")
        .setDescription('give balance')
        .addStringOption(option => 
            option.setName('user')
                    .setDescription('discordID orang yang mau di tambah saldonya')
                    .setRequired(true))
                    .addStringOption(option => option
                        .setName("jumlah")
                        .setDescription('jumlah saldo yang mau ditambah')
                        .setRequired(true)
                        ),
            
        async execute(interaction){
            
            if (interaction.member.roles.cache.has(process.env.OWNERID) === false ){
                await interaction.reply({ content: "No Admin Role" ,ephemeral: true});
                return;
            }else{
                const IsHave = await Datas.findOne({
                  discordid: { $eq: interaction.options.getString("user") },
                });
                if (!IsHave) {
                  interaction.reply({
                    content: `Maaf Orang Itu Belum Setuser Growid /setuser (GrowID)`,
                    ephemeral: true,
                  });
                  return;
                }
                if(interaction.options.getString("jumlah") < 0) {
                  interaction.reply({ content: `You can't use negative number!` ,ephemeral: true});
                  return
              }
                await Datas.findOneAndUpdate(
                  { discordid: interaction.options.getString("user") },
                  { $inc: { jumlah: +interaction.options.getString("jumlah") } }
                );
                const embed = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setDescription(`Telah menambah saldo ke <@${interaction.options.getString('user') }> sebanyak ${interaction.options.getString('jumlah')} ${process.env.WL}`)
                .setTimestamp()
        
                await interaction.reply({ embeds: [ embed ] ,ephemeral: false});
            }
        }}