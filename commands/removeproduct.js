const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Rdp = require('../model/rdpSchema');

module.exports= {
    data: new SlashCommandBuilder()
        .setName("removeproduct")
        .setDescription('Remove product from database!')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Kode Produk')
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
                //RemoveDB
                if (rdps) {
                        await Rdp.findOneAndDelete({
                        type: interaction.options.getString('kode').toUpperCase()
                    })
                    const embede = new MessageEmbed()
                    .setColor(process.env.EMBEDCOLOR)
                    .setDescription(`Deleted the product!`)
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