const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')
const History = require('../model/HistorySchema');

module.exports={
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription('Send someone a product!')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Kode Produk')
            .setRequired(true)
            ).addStringOption(option => option
                .setName("jumlah")
                .setDescription('Jumlah mau diberi')
                .setRequired(true)
                ).addMentionableOption(option => option
                    .setName("user")
                    .setDescription('User yang mau diberi')
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
                const datas = await Rdp.findOne(
                {type: interaction.options.getString("kode").toUpperCase()}
                )
                const datas2 = await Rdp.findOne(
                    {type: interaction.options.getString("kode").toUpperCase()},{data:1 ,_id:0}
                )
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
                const stinkypoopoo = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()})
                .setDescription(`**Berhasil memberi **${interaction.options.getString("jumlah")} ${JsonRill.nama} ke ${interaction.options.getMentionable('user')}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n**Please check your DM!**`)
                .setImage(process.env.GAMBARBANNER)

                await interaction.reply({ embeds: [ stinkypoopoo ] ,ephemeral: false});
                for (let i = 1; i <= interaction.options.getString("jumlah"); i++) {
                    await Rdp.updateOne(
                        { type: interaction.options.getString("kode").toUpperCase() },
                        { $pop: { data: -1 } }
                    )};
                const embed = new MessageEmbed()
                .setColor(process.env.EMBEDCOLOR)
                .setTimestamp()
                .setFooter({ text: `From ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()})
                .addField(`Berhasil diberi **${interaction.options.getString("jumlah")} ${JsonRill.nama}** oleh ${interaction.user.tag}`, `\u200b`, false)
                for (let i = 0; i < interaction.options.getString("jumlah"); i++) {
                    for (var key in JsonRill1.data[i]) {
                        
                        embed.addField(`**${key}** : ||${JsonRill1.data[i][key]}||`,`\u200b`, false)
                    }}
                embed.setImage(process.env.GAMBARBANNER)

                await interaction.options.getMentionable('user').send({ embeds: [ embed ] ,ephemeral: true});
                }
    }
}