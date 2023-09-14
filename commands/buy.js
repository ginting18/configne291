const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')
const History = require('../model/HistorySchema');

module.exports={
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription('Buy Here!')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Tipe Produk')
            .setRequired(true)
            ).addStringOption(option => option
                .setName("jumlah")
                .setDescription('Howmuch To Buy')
                .setRequired(true)
                ),
            
        async execute(interaction){
            const IsHave = await Datas.findOne({ discordid: { $eq: interaction.user.id }})

            if(!IsHave){
                interaction.reply({ content: `Maaf Kamu Belum Setuser Growid /setuser (GrowID)` ,ephemeral: true});
                return
            }
            const datas = await Rdp.findOne(
            {type: interaction.options.getString("kode").toUpperCase()}
            )
            const datas2 = await Rdp.findOne(
                {type: interaction.options.getString("kode").toUpperCase()},{data:1 ,_id:0}
            )

            const bal = await Datas.findOne({ discordid: { $eq: interaction.user.id }})
            if (!datas) {
                interaction.reply({ content: `Kode Tidak ditemukan cari di /stock` ,ephemeral: true});
                return
            }
            let JsonStringfy = await JSON.stringify(datas)
            let JsonRill = await JSON.parse(JsonStringfy)

            let JsonStringfy1 = await JSON.stringify(datas2)
            let JsonRill1 = await JSON.parse(JsonStringfy1)
            if(interaction.options.getString("jumlah") < 0) {
                interaction.reply({ content: `You can't use negative number!` ,ephemeral: true});
                return
            }
            if(JsonRill.data.length === 0 ){
                interaction.reply({ content: `Stock **${JsonRill.nama}** Habis` ,ephemeral: true});
                return
            }
            else if(JsonRill.data.length < interaction.options.getString("jumlah") ){
                interaction.reply({ content: `Stock **${JsonRill.nama}** Tidak cukup!` ,ephemeral: true});
                return
            }
            let JsonBalance = await JSON.stringify(bal)
            let JsonRill2 = await JSON.parse(JsonBalance)
            const totalwl = await JsonRill2.jumlah.toString()
            
            if(totalwl < JsonRill.harga*interaction.options.getString("jumlah")){
                interaction.reply({ content: `${process.env.WL} Kurang ${totalwl-JsonRill.harga} ` ,ephemeral: true});
                return
            }
            const stinkypoopoo = new MessageEmbed()
            .setColor(process.env.EMBEDCOLOR)
            .setTitle(`${process.env.WL}World Lock Now : ${totalwl-JsonRill.harga}`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()})
            .setDescription(`**Please check your DM!\nThank you for buying!\nDon't forget to reps at**\n<#1026075992067932190> **And** <#1083724542373003334>`)
            .setImage(process.env.GAMBARBANNER)

            await interaction.reply({ embeds: [ stinkypoopoo ] ,ephemeral: false});
            for (let i = 1; i <= interaction.options.getString("jumlah"); i++) {
                await Rdp.updateOne(
                    { type: interaction.options.getString("kode").toUpperCase() },
                    { $pop: { data: -1 } }
                )};
            
            await Datas.findOneAndUpdate({discordid: interaction.user.id},{ $inc: { jumlah: -JsonRill.harga*interaction.options.getString("jumlah")} })
            const embed = new MessageEmbed()
            .setColor(process.env.EMBEDCOLOR)
            .setTitle(`${process.env.WL} World Lock Now : ${totalwl-JsonRill.harga}`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()})
            .addField(`Berhasil Membeli **${interaction.options.getString("jumlah")} ${JsonRill.nama}**\nDengan Harga : **${JsonRill.harga*interaction.options.getString("jumlah")}** ${process.env.WL}\n`, `\u200b`, false)
            for (let i = 0; i < interaction.options.getString("jumlah"); i++) {
                for (var key in JsonRill1.data[i]) {
                    
                    embed.addField(`**${key}** : ||${JsonRill1.data[i][key]}||`,`\u200b`, false)
                }}
            embed.setImage(process.env.GAMBARBANNER)

            
            
            await interaction.user.send({ embeds: [ embed ] ,ephemeral: true});
            if (interaction.member.roles.cache.has(process.env.NAME_ROLE_TOBUYER) === false ){
            await interaction.member.roles.add(process.env.NAME_ROLE_TOBUYER);
            }
        
              IsCount = await History.findOne({ no: { $eq: 0 }})
              if (!IsCount){
                await History.create({
                    no: 0,
                    discordid: 1,
                    namaplayer: "null",
                    typebarang: "null",
                    namabarang: "null",
                    hargabarang: 1,
                    data: "null",
                    jumlah: 1
                })
              }
            countsz = await History.aggregate([
                {
                  $group : 
                  {
                    _id : "",
                    last : 
                    {
                      $max : "$no"
                    }
                  }
                }]
            )
            const dogshit = new MessageEmbed()
            .setColor(process.env.EMBEDCOLOR)
            .setTitle(`${process.env.ARROW} **#Order Number** : ${countsz[0].last+1}`)
            .setTimestamp()
            .setFooter({text: "Time"})
            .addField('\u200b', `${process.env.ARROW} Member : **${"<@" + interaction.user.id + ">"}**\n${process.env.ARROW} Kode Produk : **${interaction.options.getString("kode").toUpperCase()}** \n${process.env.ARROW} Berhasil Membeli : **${JsonRill.nama}**\n${process.env.ARROW} Jumlah : **${interaction.options.getString("jumlah")}**\n${process.env.ARROW} Dengan Harga : **${JsonRill.harga*interaction.options.getString("jumlah")}** ${process.env.WL}\n`, true)
            .setImage(process.env.GAMBARBANNER)
            await interaction.guild.channels.cache.get(process.env.HISTORY_CHANNEL).send({embeds: [dogshit],ephemeral: false})
            dataz = await Datas.findOne({ discordid: { $eq: interaction.user.id }});
            
            for (let i = 0; i < interaction.options.getString("jumlah"); i++) {
                const ToHistory = JSON.stringify(JsonRill1.data[i]);
                await History.create({
                    no: countsz[0].last+1,
                    discordid: interaction.user.id,
                    namaplayer: dataz.namaplayer,
                    typebarang: interaction.options.getString("kode").toUpperCase(),
                    namabarang: JsonRill.nama,
                    hargabarang: JsonRill.harga*interaction.options.getString("jumlah"),
                    data: ToHistory,
                    jumlah: interaction.options.getString("jumlah")
                })};

    }
}