const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Rdp = require('../model/rdpSchema');

module.exports= {
    data: new SlashCommandBuilder()
        .setName("addproduct")
        .setDescription('Add product to database!')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Kode Produk')
            .setRequired(true)
            )
        .addStringOption(option => option
            .setName("desc")
            .setDescription('Deskripsi Produk')
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
                if (!rdps) {
                        await Rdp.create({
                        typebarang: "PRODUCTS",
                        type: interaction.options.getString('kode').toUpperCase(),
                        nama: interaction.options.getString('desc'),
                        harga: interaction.options.getString('harga')
                    })
                    const embede = new MessageEmbed()
                    .setColor(process.env.EMBEDCOLOR)
                    .setTitle(`Added new product!`)
                    embede.addField('\u200b', `${process.env.ARROW} Kode : **${interaction.options.getString('kode').toUpperCase()}**\n${process.env.ARROW} Deskripsi : **${interaction.options.getString('desc')}**\n${process.env.ARROW} Harga : **${interaction.options.getString('harga')}** ${process.env.WL}`, false)
                    .setImage(process.env.GAMBARBANNER)
                    interaction.reply({ embeds: [ embede ] ,ephemeral: false});
                    return
                }
                //Embed
                const embed = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setDescription(`Try different product code!`)
        
                await interaction.reply({ embeds: [ embed ] ,ephemeral: false});
            }
        }
}

