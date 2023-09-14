const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Rdp = require('../model/rdpSchema');

module.exports= {
    data: new SlashCommandBuilder()
        .setName("changeprice")
        .setDescription('Change product price from database!')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Kode Produk yang mau diganti')
            .setRequired(true)
            )
        .addStringOption(option => option
            .setName("harga")
            .setDescription('Harga Produk')
            .setRequired(true)
            ),
        async execute(interaction){
            if (interaction.member.roles.cache.has(process.env.OWNERID) === false ) {
                await interaction.reply({ content: "No Admin Role" ,ephemeral: true});
		        console.log(interaction.user.username + " : Role Owner :" +interaction.member.roles.cache.has(process.env.OWNERID))
		        console.log(interaction.user.username + " : Role CO Owner :" +interaction.member.roles.cache.has(process.env.ADMINID))
                return;
            }
            else{
                //FromDB
                const rdps = await Rdp.findOne({ type: { $eq: interaction.options.getString('kode').toUpperCase() }})
                //CreateDB
                if (rdps) {
                    await Rdp.updateOne(
                        { type: interaction.options.getString("kode").toUpperCase() },
                        { harga: interaction.options.getString('harga') }
                    );
                    const embede = new MessageEmbed()
                    .setColor(process.env.EMBEDCOLOR)
                    .setDescription(`Changed product price!`)
                    interaction.reply({ embeds: [ embede ] ,ephemeral: false});
                    return
                }
                //Embed
                else {
                    const embed = new MessageEmbed()
                    .setColor(process.env.EMBEDCOLOR)
                    .setDescription(`Try different product code!`)
            
                    await interaction.reply({ embeds: [ embed ] ,ephemeral: false});
                }
            }
        }
}